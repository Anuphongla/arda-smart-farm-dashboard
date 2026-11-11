import { Station, WeatherData, HandyDevice, SoilData } from "@/types/arda";
import {
  mockStations,
  mockHandyDevices,
  getMockLatestWeather,
  getMockLatestSoil,
  generateMockWeatherHistory,
  generateMockSoilHistory,
} from "./ardaMock";

export interface FetchResult<T> {
  data: T;
  isMock: boolean;
  error?: string;
}

export async function fetchStations(apiKey: string): Promise<FetchResult<Station[]>> {
  if (!apiKey || apiKey === "demo") {
    return { data: mockStations, isMock: true };
  }

  try {
    const res = await fetch("/api/arda/stations", {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) {
      return {
        data: mockStations,
        isMock: true,
        error: `สถานะ ${res.status}: ใช้งานโหมดจำลองชั่วคราว`,
      };
    }
    const json = await res.json();
    const stations = Array.isArray(json) ? json : json?.data || mockStations;
    return { data: stations, isMock: false };
  } catch (err: any) {
    return { data: mockStations, isMock: true, error: err?.message };
  }
}

export async function fetchLatestWeather(
  stationId: string,
  apiKey: string
): Promise<FetchResult<WeatherData>> {
  if (!apiKey || apiKey === "demo" || !stationId) {
    return { data: getMockLatestWeather(stationId || "ST-CM01"), isMock: true };
  }

  try {
    const res = await fetch(`/api/arda/stations/${stationId}/latest`, {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) {
      return {
        data: getMockLatestWeather(stationId),
        isMock: true,
        error: `สถานะ ${res.status}: ไม่พบข้อมูลล่าสุด`,
      };
    }
    const json = await res.json();
    const weather = json?.data || json;
    return { data: weather, isMock: false };
  } catch (err: any) {
    return { data: getMockLatestWeather(stationId), isMock: true, error: err?.message };
  }
}

export async function fetchWeatherHistory(
  stationId: string,
  startDate: string,
  endDate: string,
  apiKey: string
): Promise<FetchResult<WeatherData[]>> {
  if (!apiKey || apiKey === "demo" || !stationId) {
    return {
      data: generateMockWeatherHistory(stationId || "ST-CM01", startDate, endDate),
      isMock: true,
    };
  }

  try {
    const res = await fetch(
      `/api/arda/stations/${stationId}/history?start=${startDate}&end=${endDate}`,
      { headers: { "x-api-key": apiKey } }
    );
    if (!res.ok) {
      return {
        data: generateMockWeatherHistory(stationId, startDate, endDate),
        isMock: true,
        error: `สถานะ ${res.status}: โหลดประวัติจำลองแทน`,
      };
    }
    const json = await res.json();
    const history = Array.isArray(json) ? json : json?.data || [];
    return { data: history.length > 0 ? history : generateMockWeatherHistory(stationId, startDate, endDate), isMock: false };
  } catch (err: any) {
    return {
      data: generateMockWeatherHistory(stationId, startDate, endDate),
      isMock: true,
      error: err?.message,
    };
  }
}

export async function fetchHandyDevices(apiKey: string): Promise<FetchResult<HandyDevice[]>> {
  if (!apiKey || apiKey === "demo") {
    return { data: mockHandyDevices, isMock: true };
  }

  try {
    const res = await fetch("/api/arda/handy/devices", {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) {
      return {
        data: mockHandyDevices,
        isMock: true,
        error: `สถานะ ${res.status}: โหลดอุปกรณ์จำลอง`,
      };
    }
    const json = await res.json();
    const devices = Array.isArray(json) ? json : json?.data || mockHandyDevices;
    return { data: devices, isMock: false };
  } catch (err: any) {
    return { data: mockHandyDevices, isMock: true, error: err?.message };
  }
}

export async function fetchLatestSoil(
  deviceId: string,
  apiKey: string
): Promise<FetchResult<SoilData>> {
  if (!apiKey || apiKey === "demo" || !deviceId) {
    return { data: getMockLatestSoil(deviceId || "HD-SOIL-01"), isMock: true };
  }

  try {
    const res = await fetch(`/api/arda/handy/devices/${deviceId}/latest`, {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) {
      return {
        data: getMockLatestSoil(deviceId),
        isMock: true,
        error: `สถานะ ${res.status}: ไม่พบข้อมูลดินล่าสุด`,
      };
    }
    const json = await res.json();
    const soil = json?.data || json;
    return { data: soil, isMock: false };
  } catch (err: any) {
    return { data: getMockLatestSoil(deviceId), isMock: true, error: err?.message };
  }
}

export async function fetchSoilHistory(
  deviceId: string,
  startDate: string,
  endDate: string,
  apiKey: string
): Promise<FetchResult<SoilData[]>> {
  if (!apiKey || apiKey === "demo" || !deviceId) {
    return {
      data: generateMockSoilHistory(deviceId || "HD-SOIL-01", startDate, endDate),
      isMock: true,
    };
  }

  try {
    const res = await fetch(
      `/api/arda/handy/devices/${deviceId}/history?start=${startDate}&end=${endDate}`,
      { headers: { "x-api-key": apiKey } }
    );
    if (!res.ok) {
      return {
        data: generateMockSoilHistory(deviceId, startDate, endDate),
        isMock: true,
        error: `สถานะ ${res.status}: โหลดประวัติดินจำลองแทน`,
      };
    }
    const json = await res.json();
    const history = Array.isArray(json) ? json : json?.data || [];
    return { data: history.length > 0 ? history : generateMockSoilHistory(deviceId, startDate, endDate), isMock: false };
  } catch (err: any) {
    return {
      data: generateMockSoilHistory(deviceId, startDate, endDate),
      isMock: true,
      error: err?.message,
    };
  }
}
