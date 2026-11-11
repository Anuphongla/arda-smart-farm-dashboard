import { NextRequest, NextResponse } from "next/server";

const ARDA_BASE_URL = "https://weather-api.arda365days.com/api/public/v1";

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const pathJoined = params.path.join("/");
    const searchParams = req.nextUrl.searchParams.toString();
    const targetUrl = `${ARDA_BASE_URL}/${pathJoined}${searchParams ? `?${searchParams}` : ""}`;

    // Get API key from client header, query param, or server environment
    const clientApiKey = req.headers.get("x-api-key");
    const apiKey =
      clientApiKey && clientApiKey !== "demo" && clientApiKey !== "undefined"
        ? clientApiKey
        : process.env.ARDA_API_KEY || "";

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

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Accept": "application/json",
      },
      next: { revalidate: 60 }, // Cache 60s
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `ARDA API Error: ${response.status}`,
          status: response.status,
          message: data?.message || "ไม่สามารถดึงข้อมูลจาก ARDA API ได้ กรุณาตรวจสอบ x-api-key",
          data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("ARDA Proxy Fetch Error:", error);
    return NextResponse.json(
      {
        error: "Internal Proxy Error",
        message: error?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ ARDA",
      },
      { status: 500 }
    );
  }
}
