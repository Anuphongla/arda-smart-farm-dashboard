import { Station, WeatherData, HandyDevice, SoilData } from "@/types/arda";

export const mockStations: Station[] = [
  {
    id: "ST-CM01",
    name: "สถานีวิจัยเกษตรหลวงเชียงใหม่ (ดอยอ่างขาง)",
    station_code: "AGRI-CM-01",
    province: "เชียงใหม่",
    amphoe: "ฝาง",
    tambon: "แม่งอน",
    lat: 19.9012,
    lng: 99.0435,
    status: "online",
    last_seen: new Date().toISOString(),
  },
  {
    id: "ST-SP02",
    name: "สถานีแปลงนาทดลองสุพรรณบุรี (นาข้าวอินทรีย์)",
    station_code: "AGRI-SP-02",
    province: "สุพรรณบุรี",
    amphoe: "ดอนเจดีย์",
    tambon: "สระกระโจม",
    lat: 14.6543,
    lng: 100.0211,
    status: "online",
    last_seen: new Date().toISOString(),
  },
  {
    id: "ST-RY03",
    name: "สถานีวิจัยไม้ผลภาคตะวันออก ระยอง",
    station_code: "AGRI-RY-03",
    province: "ระยอง",
    amphoe: "แกลง",
    tambon: "ทางเกวียน",
    lat: 12.7821,
    lng: 101.6542,
    status: "online",
    last_seen: new Date().toISOString(),
  },
  {
    id: "ST-KR04",
    name: "สถานีเกษตรพืชไร่แปลงใหญ่ นครราชสีมา",
    station_code: "AGRI-KR-04",
    province: "นครราชสีมา",
    amphoe: "ปากช่อง",
    tambon: "หมูสี",
    lat: 14.5821,
    lng: 101.4231,
    status: "online",
    last_seen: new Date().toISOString(),
  },
];

export const mockHandyDevices: HandyDevice[] = [
  {
    id: "HD-SOIL-01",
    name: "Handy Soil IoT #01 - แปลงข้าวโพดหวาน A1",
    device_code: "HND-001",
    location: "แปลงทดสอบกลางแจ้ง แปลง A1",
    crop_type: "ข้าวโพดหวานไฮบริด",
    status: "online",
    battery: 92,
    last_seen: new Date().toISOString(),
  },
  {
    id: "HD-SOIL-02",
    name: "Handy Soil IoT #02 - โรงเรือนเมล่อนปิด Smart Greenhouse B2",
    device_code: "HND-002",
    location: "โรงเรือนปิดควบคุมความชื้น B2",
    crop_type: "เมล่อนญี่ปุ่น คราวน์เมล่อน",
    status: "online",
    battery: 88,
    last_seen: new Date().toISOString(),
  },
  {
    id: "HD-SOIL-03",
    name: "Handy Soil IoT #03 - สวนทุเรียนหมอนทอง แปลง C3",
    device_code: "HND-003",
    location: "สวนผลไม้เชิงลาดเนิน C3",
    crop_type: "ทุเรียนหมอนทอง 5 ปี",
    status: "online",
    battery: 79,
    last_seen: new Date().toISOString(),
  },
];

export function getMockLatestWeather(stationId: string): WeatherData {
  return {
    station_id: stationId,
    temp: 34.2,           // °C
    humi: 68.5,           // %
    hic: 39.8,            // °C Heat Index
    pm25: 28.4,           // µg/m³
    co2: 418,             // ppm
    vpd: 1.45,            // kPa
    lux: 54200,           // lux
    pressure: 1012.8,     // hPa
    rain: 2.4,            // mm
    windDir: 165,         // degrees (SSE)
    windSpeed: 3.8,       // m/s
    timestamp: new Date().toISOString(),
  };
}

export function getMockLatestSoil(deviceId: string): SoilData {
  return {
    device_id: deviceId,
    nitrogen: 48,          // mg/kg
    phosphorus: 26,        // mg/kg
    potassium: 175,        // mg/kg
    ph: 6.35,              // pH
    ec: 1.28,              // mS/cm
    soil_moisture: 38.5,   // %
    soil_temp: 28.2,       // °C
    timestamp: new Date().toISOString(),
  };
}

export function generateMockWeatherHistory(
  stationId: string,
  startDateStr: string,
  endDateStr: string
): WeatherData[] {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const results: WeatherData[] = [];

  // Calculate day difference
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const pointsCount = Math.min(Math.max(diffDays, 7), 30);

  for (let i = 0; i <= pointsCount; i++) {
    const currentPoint = new Date(start.getTime() + (diffTime / pointsCount) * i);
    const dayFactor = Math.sin((i / pointsCount) * Math.PI * 2);
    const noise = (Math.sin(i * 1.7) * 0.5 + 0.5);

    const temp = Number((31.5 + dayFactor * 4.5 + noise * 1.5).toFixed(1));
    const humi = Number((78 - dayFactor * 15 + noise * 5).toFixed(1));
    const hic = Number((temp + (humi / 100) * 8.5).toFixed(1));
    const pm25 = Number((22 + Math.abs(Math.sin(i * 0.8)) * 25).toFixed(1));
    const co2 = Math.round(410 + Math.sin(i * 0.5) * 35);
    const vpd = Number((1.1 + dayFactor * 0.6).toFixed(2));
    const lux = Math.round(Math.max(0, 35000 + dayFactor * 28000 + noise * 5000));
    const pressure = Number((1010 + Math.cos(i * 0.4) * 4).toFixed(1));
    const rain = i % 5 === 2 ? Number((noise * 16.5).toFixed(1)) : 0;
    const windSpeed = Number((2.0 + noise * 3.5).toFixed(1));
    const windDir = Math.round((140 + noise * 90) % 360);

    results.push({
      station_id: stationId,
      temp,
      humi,
      hic,
      pm25,
      co2,
      vpd,
      lux,
      pressure,
      rain,
      windDir,
      windSpeed,
      timestamp: currentPoint.toISOString(),
    });
  }

  return results;
}

export function generateMockSoilHistory(
  deviceId: string,
  startDateStr: string,
  endDateStr: string
): SoilData[] {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const results: SoilData[] = [];

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const pointsCount = Math.min(Math.max(diffDays, 7), 30);

  let currentMoisture = 45.0;

  for (let i = 0; i <= pointsCount; i++) {
    const currentPoint = new Date(start.getTime() + (diffTime / pointsCount) * i);
    const noise = Math.sin(i * 1.3) * 0.5 + 0.5;

    // Simulate moisture dropping naturally, then jumping when irrigated
    if (i % 6 === 0) {
      currentMoisture = 62.0; // Irrigated
    } else {
      currentMoisture = Math.max(22.0, currentMoisture - (3.5 + noise * 1.5));
    }

    const nitrogen = Math.round(40 + Math.sin(i * 0.3) * 12 + noise * 5);
    const phosphorus = Math.round(22 + Math.cos(i * 0.4) * 6 + noise * 3);
    const potassium = Math.round(160 + Math.sin(i * 0.2) * 25 + noise * 10);
    const ph = Number((6.3 + Math.sin(i * 0.5) * 0.35).toFixed(2));
    const ec = Number((1.1 + noise * 0.3).toFixed(2));
    const soil_temp = Number((26.5 + Math.sin(i * 0.7) * 2.8).toFixed(1));

    results.push({
      device_id: deviceId,
      nitrogen,
      phosphorus,
      potassium,
      ph,
      ec,
      soil_moisture: Number(currentMoisture.toFixed(1)),
      soil_temp,
      timestamp: currentPoint.toISOString(),
    });
  }

  return results;
}
