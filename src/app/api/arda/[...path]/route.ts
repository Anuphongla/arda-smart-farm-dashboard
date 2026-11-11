import { NextRequest, NextResponse } from "next/server";

const ARDA_BASE_URL = "https://weather-api.arda365days.com/api/public/v1";
const DEFAULT_ARDA_KEY = "wt_05398cdb96604828400240ff2c5914e6";

// Server-side in-memory cache to prevent ARDA API 429 Too Many Requests (RateLimit: 2 req / 60s)
const globalForCache = globalThis as unknown as {
  ardaCache?: Map<string, { data: any; timestamp: number }>;
};

if (!globalForCache.ardaCache) {
  globalForCache.ardaCache = new Map();
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const pathJoined = params.path.join("/");
    const searchParams = req.nextUrl.searchParams.toString();
    const targetUrl = `${ARDA_BASE_URL}/${pathJoined}${
      searchParams ? `?${searchParams}` : ""
    }`;

    // Get API key from client header, environment variable, or configured default key
    const clientApiKey = req.headers.get("x-api-key");
    const apiKey =
      clientApiKey && clientApiKey !== "demo" && clientApiKey !== "undefined"
        ? clientApiKey
        : process.env.ARDA_API_KEY || DEFAULT_ARDA_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API Key Required",
          message: "กรุณาระบุ x-api-key หรือเปิดใช้งานโหมดจำลอง (Demo Mode)",
          isMockAllowed: true,
        },
        { status: 401 }
      );
    }

    const cacheKey = `${apiKey}:${targetUrl}`;
    const cached = globalForCache.ardaCache?.get(cacheKey);
    const now = Date.now();

    // Serve fresh cache immediately to avoid hitting ARDA's strict 2 req/min rate limit
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data, {
        headers: { "x-arda-cache": "HIT" },
      });
    }

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (response.ok && data) {
      globalForCache.ardaCache?.set(cacheKey, { data, timestamp: now });
      return NextResponse.json(data, {
        headers: { "x-arda-cache": "MISS" },
      });
    }

    // If ARDA API rate limits (429), return stale cache if available, or 429 status so client can handle gracefully
    if (response.status === 429 && cached) {
      return NextResponse.json(cached.data, {
        headers: { "x-arda-cache": "STALE-429" },
      });
    }

    return NextResponse.json(
      {
        error: `ARDA API Error: ${response.status}`,
        status: response.status,
        message:
          data?.message ||
          "ไม่สามารถดึงข้อมูลจาก ARDA API ได้ กรุณาตรวจสอบ x-api-key",
        data,
      },
      { status: response.status }
    );
  } catch (error: any) {
    console.error("ARDA Proxy Fetch Error:", error);
    return NextResponse.json(
      {
        error: "Internal Proxy Error",
        message: error?.message || "ไม่สามารถติดต่อเซิร์ฟเวอร์ ARDA ได้",
      },
      { status: 500 }
    );
  }
}
