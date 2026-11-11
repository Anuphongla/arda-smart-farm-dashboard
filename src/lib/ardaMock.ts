import { Station, WeatherData, HandyDevice, SoilData } from "@/types/arda";

// Real station list snapshot from https://weather-api.arda365days.com/api/public/v1/stations
export const mockStations: Station[] = [
  {
    id: "ST0007",
    name: "อบต. หนองไผ่",
    station_code: "ST0007",
    province: "มหาสารคาม",
    amphoe: "กุดรัง",
    tambon: "หนองไผ่",
    lat: 16.12753,
    lng: 102.2787,
    status: "online",
    last_seen: new Date().toISOString(),
  },
  {
    id: "ST0017",
    name: "อบต. กำพี้",
    station_code: "ST0017",
    province: "มหาสารคาม",
    amphoe: "บรบือ",
    tambon: "กำพี้",
    lat: 15.963985,
    lng: 103.156137,
    status: "online",
    last_seen: new Date().toISOString(),
  },
  {
    id: "ST0014",
    name: "SC3 คณะวิทยาศาสตร์ มมส.",
    station_code: "ST0014",
    province: "มหาสารคาม",
    amphoe: "กันทรวิชัย",
    tambon: "ขามเรียง",
    lat: 16.249118,
    lng: 103.250281,
    status: "online",
    last_seen: new Date().toISOString(),
  },
  {
    id: "ST0010",
    name: "ฟาร์มมหาลัยมหาสารคาม ต.นาสีนวล",
    station_code: "ST0010",
    province: "มหาสารคาม",
    amphoe: "กันทรวิชัย",
    tambon: "นาสีนวล",
    lat: 16.3462,
    lng: 103.2059,
    status: "online",
    last_seen: new Date().toISOString(),
  },
  {
    id: "ST0018",
    name: "อบต.เขวาไร่ อ.นาเชือก",
    station_code: "ST0018",
    province: "มหาสารคาม",
    amphoe: "นาเชือก",
    tambon: "เขวาไร่",
    lat: 15.833409,
    lng: 103.049777,
    status: "online",
    last_seen: new Date().toISOString(),
  },
  {
    id: "ST0019",
    name: "อบต.นาภู",
    station_code: "ST0019",
    province: "มหาสารคาม",
    amphoe: "ยางสีสุราช",
    tambon: "นาภู",
    lat: 15.677759,
    lng: 103.047124,
    status: "online",
    last_seen: new Date().toISOString(),
  },
  {
    id: "ST0012",
    name: "อบต.แห่ใต้",
    station_code: "ST0012",
    province: "มหาสารคาม",
    amphoe: "โกสุมพิสัย",
    tambon: "แห่ใต้",
    lat: 16.294949,
    lng: 103.124278,
    status: "online",
    last_seen: new Date().toISOString(),
  },
  {
    id: "ST0013",
    name: "อบต.ดอนเงิน",
    station_code: "ST0013",
    province: "มหาสารคาม",
    amphoe: "เชียงยืน",
    tambon: "ดอนเงิน",
    lat: 16.421971,
    lng: 103.16106,
    status: "online",
    last_seen: new Date().toISOString(),
  },
  {
    id: "ST0020",
    name: "อบต.เสือโก้ก",
    station_code: "ST0020",
    province: "มหาสารคาม",
    amphoe: "วาปีปทุม",
    tambon: "เสือโก้ก",
    lat: 15.939527,
    lng: 103.444875,
    status: "online",
    last_seen: new Date().toISOString(),
  },
  {
    id: "ST0009",
    name: "กลุ่มปลูกข้าวบ้านเก่าน้อย ต.หนองบัวแก้ว อ.พยัคฆฯ",
    station_code: "ST0009",
    province: "มหาสารคาม",
    amphoe: "พยัคฆภูมิพิสัย",
    tambon: "หนองบัวแก้ว",
    lat: 15.5227,
    lng: 103.343,
    status: "online",
    last_seen: new Date().toISOString(),
  },
];

// Real Handy Soil IoT devices snapshot from https://weather-api.arda365days.com/api/public/v1/handy/devices
export const mockHandyDevices: HandyDevice[] = [
  {
    id: "H0003",
    name: "Handy 3",
    device_code: "H0003",
    location: "แปลงตรวจวัดดิน มหาสารคาม",
    crop_type: "Handy Soil v1",
    status: "online",
    battery: 92,
    last_seen: "2026-11-03T09:08:17.112Z",
  },
  {
    id: "H0001",
    name: "Handy 1",
    device_code: "H0001",
    location: "ศูนย์วิจัยคณะวิทยาศาสตร์ มมส.",
    crop_type: "HS-Pro v2",
    status: "online",
    battery: 88,
    last_seen: "2026-07-24T07:19:52.951Z",
  },
  {
    id: "H0002",
    name: "Handy 2",
    device_code: "H0002",
    location: "แปลงนาสาธิต ต.นาสีนวล",
    crop_type: "Handy Soil v1",
    status: "online",
    battery: 85,
    last_seen: "2026-11-04T06:16:44.810Z",
  },
  {
    id: "H0004",
    name: "Handy 4",
    device_code: "H0004",
    location: "แปลงเกษตรอินทรีย์ อ.บรบือ",
    crop_type: "Handy Soil v1",
    status: "online",
    battery: 90,
    last_seen: "2026-10-28T08:56:12.117Z",
  },
  {
    id: "H0005",
    name: "Handy 5",
    device_code: "H0005",
    location: "แปลงวิจัยพืชไร่ อ.โกสุมพิสัย",
    crop_type: "Handy Soil v1",
    status: "online",
    battery: 79,
    last_seen: "2026-11-02T05:24:33.880Z",
  },
];

export function getMockLatestWeather(stationId: string): WeatherData {
  const now = new Date().toISOString();
  const presets: Record<string, WeatherData> = {
    ST0007: {
      station_id: "ST0007",
      temp: 26.9,
      humi: 55.3,
      hic: 27.65,
      pm25: 6.0,
      co2: 500,
      vpd: 1.58,
      lux: 20366,
      pressure: 989,
      rain: 0.0,
      windDir: 75,
      windSpeed: 8.0,
      timestamp: now,
    },
    ST0017: {
      station_id: "ST0017",
      temp: 31.4,
      humi: 62.0,
      hic: 35.2,
      pm25: 14.5,
      co2: 460,
      vpd: 1.72,
      lux: 44200,
      pressure: 1006,
      rain: 0.4,
      windDir: 120,
      windSpeed: 4.5,
      timestamp: now,
    },
    ST0014: {
      station_id: "ST0014",
      temp: 29.8,
      humi: 58.4,
      hic: 32.1,
      pm25: 11.2,
      co2: 485,
      vpd: 1.65,
      lux: 38900,
      pressure: 1004,
      rain: 0.0,
      windDir: 95,
      windSpeed: 5.2,
      timestamp: now,
    },
    ST0010: {
      station_id: "ST0010",
      temp: 35.8,
      humi: 49.5,
      hic: 40.6,
      pm25: 39.2,
      co2: 430,
      vpd: 2.15,
      lux: 64500,
      pressure: 1002,
      rain: 0.0,
      windDir: 210,
      windSpeed: 3.8,
      timestamp: now,
    },
  };

  return (
    presets[stationId] || {
      ...presets["ST0007"],
      station_id: stationId || "ST0007",
    }
  );
}

export function getMockLatestSoil(deviceId: string): SoilData {
  const now = new Date().toISOString();
  const presets: Record<string, SoilData> = {
    H0003: {
      device_id: "H0003",
      nitrogen: 45,
      phosphorus: 28,
      potassium: 165,
      ph: 6.4,
      ec: 1.15,
      soil_moisture: 45.0,
      soil_temp: 29.0,
      timestamp: "2026-11-03T09:08:17.143Z",
    },
    H0001: {
      device_id: "H0001",
      nitrogen: 52,
      phosphorus: 34,
      potassium: 190,
      ph: 6.6,
      ec: 1.42,
      soil_moisture: 54.5,
      soil_temp: 27.8,
      timestamp: now,
    },
    H0002: {
      device_id: "H0002",
      nitrogen: 38,
      phosphorus: 22,
      potassium: 145,
      ph: 5.2,
      ec: 0.95,
      soil_moisture: 26.5,
      soil_temp: 30.4,
      timestamp: now,
    },
    H0004: {
      device_id: "H0004",
      nitrogen: 48,
      phosphorus: 30,
      potassium: 175,
      ph: 6.8,
      ec: 1.28,
      soil_moisture: 49.0,
      soil_temp: 28.5,
      timestamp: now,
    },
    H0005: {
      device_id: "H0005",
      nitrogen: 41,
      phosphorus: 25,
      potassium: 158,
      ph: 6.2,
      ec: 1.1,
      soil_moisture: 42.0,
      soil_temp: 29.2,
      timestamp: now,
    },
  };

  return (
    presets[deviceId] || {
      ...presets["H0003"],
      device_id: deviceId || "H0003",
    }
  );
}

export function generateMockWeatherHistory(
  stationId: string,
  startDate: string,
  endDate: string
): WeatherData[] {
  const base = getMockLatestWeather(stationId);
  const start = startDate
    ? new Date(startDate)
    : new Date(Date.now() - 7 * 86400000);
  const end = endDate ? new Date(endDate) : new Date();

  const diffDays = Math.max(
    1,
    Math.min(
      60,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    )
  );

  const history: WeatherData[] = [];
  for (let i = 0; i < diffDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    d.setHours(12, 0, 0, 0);

    const wave = Math.sin(i * 0.9);
    const cosWave = Math.cos(i * 0.7);

    const temp = Number((base.temp + wave * 2.4).toFixed(1));
    const humi = Number(
      Math.min(98, Math.max(35, base.humi - wave * 8)).toFixed(1)
    );
    const rain =
      i % 3 === 0 ? Number(Math.max(0, 4.2 + cosWave * 6.5).toFixed(1)) : 0;
    const pm25 = Number(Math.max(5, base.pm25 + cosWave * 6.5).toFixed(1));

    history.push({
      id: `WH-${stationId}-${i}`,
      station_id: stationId,
      temp,
      humi,
      hic: Number((temp + (humi > 65 ? 3.8 : 1.9)).toFixed(1)),
      pm25,
      co2: Math.round((base.co2 || 480) + wave * 15),
      vpd: Number(Math.max(0.4, (base.vpd || 1.4) + wave * 0.25).toFixed(2)),
      lux: Math.round(Math.max(8500, (base.lux || 25000) + cosWave * 9500)),
      pressure: Number((base.pressure + cosWave * 2).toFixed(1)),
      rain,
      windDir: (base.windDir! + i * 25) % 360,
      windSpeed: Number(
        Math.max(0.8, base.windSpeed + cosWave * 2.1).toFixed(1)
      ),
      timestamp: d.toISOString(),
    });
  }

  return history;
}

export function generateMockSoilHistory(
  deviceId: string,
  startDate: string,
  endDate: string
): SoilData[] {
  const base = getMockLatestSoil(deviceId);
  const start = startDate
    ? new Date(startDate)
    : new Date(Date.now() - 7 * 86400000);
  const end = endDate ? new Date(endDate) : new Date();

  const diffDays = Math.max(
    1,
    Math.min(
      60,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    )
  );

  const history: SoilData[] = [];
  for (let i = 0; i < diffDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    d.setHours(9, 30, 0, 0);

    const wave = Math.sin(i * 0.8);
    const cosWave = Math.cos(i * 0.6);

    history.push({
      id: `SH-${deviceId}-${i}`,
      device_id: deviceId,
      nitrogen: Math.max(5, Math.round(base.nitrogen + wave * 5)),
      phosphorus: Math.max(5, Math.round(base.phosphorus + cosWave * 4)),
      potassium: Math.max(10, Math.round(base.potassium + wave * 12)),
      ph: Number(Math.max(4.2, Math.min(8.5, base.ph + wave * 0.18)).toFixed(2)),
      ec: Number(Math.max(0.2, base.ec + cosWave * 0.15).toFixed(2)),
      soil_moisture: Number(
        Math.min(92, Math.max(18, base.soil_moisture + cosWave * 9.5)).toFixed(1)
      ),
      soil_temp: Number((base.soil_temp + wave * 1.4).toFixed(1)),
      timestamp: d.toISOString(),
    });
  }

  return history;
}
