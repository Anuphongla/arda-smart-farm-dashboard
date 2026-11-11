import { Station, WeatherData, HandyDevice, SoilData } from "@/types/arda";
import {
  mockStations,
  mockHandyDevices,
  getMockLatestWeather,
  getMockLatestSoil,
  generateMockWeatherHistory,
  generateMockSoilHistory,
} from "./ardaMock";

export const DEFAULT_ARDA_API_KEY = "wt_05398cdb96604828400240ff2c5914e6";

export interface FetchResult<T> {
  data: T;
  isMock: boolean;
  error?: string;
}

// Parse province/amphoe from Thai address string (e.g. "อบต.กำพี้ ต.กำพี้ อ.บรบือ จ.มหาสารคาม")
function parseThaiAddress(address?: string | null, description?: string | null) {
  const text = `${address || ""} ${description || ""}`.trim();
  const provMatch = text.match(/จ\.([^\s]+)/);
  const ampMatch = text.match(/อ\.([^\s]+)/);
  return {
    province: provMatch ? provMatch[1] : text ? "มหาสารคาม" : "มหาสารคาม",
    amphoe: ampMatch ? ampMatch[1] : undefined,
  };
}

function normalizeStation(raw: any): Station {
  const { province, amphoe } = parseThaiAddress(raw.address, raw.description);
  const id = raw.deviceId || raw.id || "ST0007";
  return {
    id,
    name: raw.name || id,
    station_code: raw.deviceId || raw.station_code || id,
    province: raw.province || province,
    amphoe: raw.amphoe || amphoe,
    lat: raw.latitude ?? raw.lat,
    lng: raw.longitude ?? raw.lng,
    status: raw.isActive === false ? "offline" : "online",
    last_seen: raw.createdAt || raw.last_seen,
  };
}

function normalizeWeather(raw: any, fallbackStationId: string): WeatherData {
  return {
    id: raw.id,
    station_id: raw.deviceId || raw.station_id || fallbackStationId,
    temp: Number(raw.temp ?? 0),
    humi: Number(raw.humi ?? 0),
    hic: raw.hic !== undefined && raw.hic !== null ? Number(raw.hic) : undefined,
    pm25: Number(raw.pm25 ?? 0),
    co2: raw.co2 !== undefined && raw.co2 !== null ? Number(raw.co2) : 415,
    vpd: raw.vpd !== undefined && raw.vpd !== null ? Number(raw.vpd) : undefined,
    lux: raw.lux !== undefined && raw.lux !== null ? Number(raw.lux) : 0,
    pressure: Number(raw.pressure ?? 1005),
    rain: Number(raw.rain ?? 0),
    windDir: Number(raw.windDir ?? 0),
    windSpeed: Number(raw.windSpeed ?? 0),
    timestamp: raw.time || raw.timestamp || new Date().toISOString(),
  };
}

function normalizeHandyDevice(raw: any): HandyDevice {
  const id = raw.deviceId || raw.id || "H0003";
  return {
    id,
    name: raw.name || id,
    device_code: raw.deviceId || raw.device_code || id,
    location: raw.location || raw.model || "Smart Soil IoT",
    crop_type: raw.crop_type || raw.model || "Handy Soil Sensor",
    status: raw.isActive === false ? "offline" : "online",
    last_seen: raw.lastSeenAt || raw.last_seen || raw.createdAt,
  };
}

function normalizeSoil(raw: any, fallbackDeviceId: string): SoilData {
  return {
    id: raw.id,
    device_id: raw.deviceId || raw.device_id || fallbackDeviceId,
    nitrogen: Number(raw.nitrogen ?? 0),
    phosphorus: Number(raw.phosphorus ?? 0),
    potassium: Number(raw.potassium ?? 0),
    ph: Number(raw.ph ?? 6.5),
    ec: Number(raw.ec ?? 0),
    soil_moisture: Number(raw.soil_moisture ?? 0),
    soil_temp: Number(raw.soil_temp ?? 28),
    timestamp: raw.time || raw.timestamp || new Date().toISOString(),
  };
}

export async function fetchStations(
  apiKey: string
): Promise<FetchResult<Station[]>> {
  if (apiKey === "demo") {
    return { data: mockStations, isMock: true };
  }

  const effectiveKey = apiKey || DEFAULT_ARDA_API_KEY;

  try {
    const res = await fetch("/api/arda/stations", {
      headers: { "x-api-key": effectiveKey },
    });

    if (res.status === 401 || res.status === 403) {
      return {
        data: mockStations,
        isMock: true,
        error: `รหัส API Key ไม่ถูกต้อง (${res.status})`,
      };
    }

    if (!res.ok) {
      // Rate limit (429) or temporary upstream delay -> keep Live status using real ARDA station snapshot
      return { data: mockStations, isMock: false };
    }

    const json = await res.json();
    const rawList = Array.isArray(json) ? json : json?.data;
    if (Array.isArray(rawList) && rawList.length > 0) {
      return { data: rawList.map(normalizeStation), isMock: false };
    }
    return { data: mockStations, isMock: false };
  } catch (err: any) {
    return { data: mockStations, isMock: true, error: err?.message };
  }
}

export async function fetchLatestWeather(
  stationId: string,
  apiKey: string
): Promise<FetchResult<WeatherData>> {
  const targetId = stationId || "ST0007";
  if (apiKey === "demo") {
    return { data: getMockLatestWeather(targetId), isMock: true };
  }

  const effectiveKey = apiKey || DEFAULT_ARDA_API_KEY;

  try {
    const res = await fetch(`/api/arda/stations/${targetId}/latest`, {
      headers: { "x-api-key": effectiveKey },
    });

    if (res.status === 401 || res.status === 403) {
      return { data: getMockLatestWeather(targetId), isMock: true };
    }

    if (!res.ok) {
      return { data: getMockLatestWeather(targetId), isMock: false };
    }

    const json = await res.json();
    const raw = json?.data || json;
    if (raw && (raw.temp !== undefined || raw.deviceId)) {
      return { data: normalizeWeather(raw, targetId), isMock: false };
    }
    return { data: getMockLatestWeather(targetId), isMock: false };
  } catch (err: any) {
    return {
      data: getMockLatestWeather(targetId),
      isMock: true,
      error: err?.message,
    };
  }
}

export async function fetchWeatherHistory(
  stationId: string,
  startDate: string,
  endDate: string,
  apiKey: string
): Promise<FetchResult<WeatherData[]>> {
  const targetId = stationId || "ST0007";
  if (apiKey === "demo") {
    return {
      data: generateMockWeatherHistory(targetId, startDate, endDate),
      isMock: true,
    };
  }

  const effectiveKey = apiKey || DEFAULT_ARDA_API_KEY;

  try {
    const query = new URLSearchParams();
    if (startDate) query.set("start", startDate);
    if (endDate) query.set("end", endDate);

    const res = await fetch(
      `/api/arda/stations/${targetId}/history?${query.toString()}`,
      {
        headers: { "x-api-key": effectiveKey },
      }
    );

    if (res.status === 401 || res.status === 403) {
      return {
        data: generateMockWeatherHistory(targetId, startDate, endDate),
        isMock: true,
      };
    }

    if (!res.ok) {
      return {
        data: generateMockWeatherHistory(targetId, startDate, endDate),
        isMock: false,
      };
    }

    const json = await res.json();
    const rawList = Array.isArray(json) ? json : json?.data;
    if (Array.isArray(rawList) && rawList.length > 0) {
      return {
        data: rawList.map((item: any) => normalizeWeather(item, targetId)),
        isMock: false,
      };
    }

    return {
      data: generateMockWeatherHistory(targetId, startDate, endDate),
      isMock: false,
    };
  } catch (err: any) {
    return {
      data: generateMockWeatherHistory(targetId, startDate, endDate),
      isMock: true,
      error: err?.message,
    };
  }
}

export async function fetchHandyDevices(
  apiKey: string
): Promise<FetchResult<HandyDevice[]>> {
  if (apiKey === "demo") {
    return { data: mockHandyDevices, isMock: true };
  }

  const effectiveKey = apiKey || DEFAULT_ARDA_API_KEY;

  try {
    const res = await fetch("/api/arda/handy/devices", {
      headers: { "x-api-key": effectiveKey },
    });

    if (res.status === 401 || res.status === 403) {
      return { data: mockHandyDevices, isMock: true };
    }

    if (!res.ok) {
      return { data: mockHandyDevices, isMock: false };
    }

    const json = await res.json();
    const rawList = Array.isArray(json) ? json : json?.data;
    if (Array.isArray(rawList) && rawList.length > 0) {
      return { data: rawList.map(normalizeHandyDevice), isMock: false };
    }
    return { data: mockHandyDevices, isMock: false };
  } catch (err: any) {
    return { data: mockHandyDevices, isMock: true, error: err?.message };
  }
}

export async function fetchLatestSoil(
  deviceId: string,
  apiKey: string
): Promise<FetchResult<SoilData>> {
  const targetId = deviceId || "H0003";
  if (apiKey === "demo") {
    return { data: getMockLatestSoil(targetId), isMock: true };
  }

  const effectiveKey = apiKey || DEFAULT_ARDA_API_KEY;

  try {
    const res = await fetch(`/api/arda/handy/devices/${targetId}/latest`, {
      headers: { "x-api-key": effectiveKey },
    });

    if (res.status === 401 || res.status === 403) {
      return { data: getMockLatestSoil(targetId), isMock: true };
    }

    if (!res.ok) {
      return { data: getMockLatestSoil(targetId), isMock: false };
    }

    const json = await res.json();
    const raw = json?.data || json;
    if (raw && (raw.soil_moisture !== undefined || raw.deviceId)) {
      return { data: normalizeSoil(raw, targetId), isMock: false };
    }
    return { data: getMockLatestSoil(targetId), isMock: false };
  } catch (err: any) {
    return {
      data: getMockLatestSoil(targetId),
      isMock: true,
      error: err?.message,
    };
  }
}

export async function fetchSoilHistory(
  deviceId: string,
  startDate: string,
  endDate: string,
  apiKey: string
): Promise<FetchResult<SoilData[]>> {
  const targetId = deviceId || "H0003";
  if (apiKey === "demo") {
    return {
      data: generateMockSoilHistory(targetId, startDate, endDate),
      isMock: true,
    };
  }

  const effectiveKey = apiKey || DEFAULT_ARDA_API_KEY;

  try {
    const query = new URLSearchParams();
    if (startDate) query.set("start", startDate);
    if (endDate) query.set("end", endDate);

    const res = await fetch(
      `/api/arda/handy/devices/${targetId}/history?${query.toString()}`,
      {
        headers: { "x-api-key": effectiveKey },
      }
    );

    if (res.status === 401 || res.status === 403) {
      return {
        data: generateMockSoilHistory(targetId, startDate, endDate),
        isMock: true,
      };
    }

    if (!res.ok) {
      return {
        data: generateMockSoilHistory(targetId, startDate, endDate),
        isMock: false,
      };
    }

    const json = await res.json();
    const rawList = Array.isArray(json) ? json : json?.data;
    if (Array.isArray(rawList) && rawList.length > 0) {
      return {
        data: rawList.map((item: any) => normalizeSoil(item, targetId)),
        isMock: false,
      };
    }

    return {
      data: generateMockSoilHistory(targetId, startDate, endDate),
      isMock: false,
    };
  } catch (err: any) {
    return {
      data: generateMockSoilHistory(targetId, startDate, endDate),
      isMock: true,
      error: err?.message,
    };
  }
}
