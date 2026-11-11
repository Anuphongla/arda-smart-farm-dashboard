export interface Station {
  id: string;
  name: string;
  station_code?: string;
  province?: string;
  amphoe?: string;
  tambon?: string;
  lat?: number;
  lng?: number;
  status?: "online" | "offline";
  last_seen?: string;
}

export interface WeatherData {
  id?: string;
  station_id: string;
  temp: number;        // อุณหภูมิ (°C)
  humi: number;        // ความชื้นสัมพัทธ์ (%)
  hic?: number;        // ดัชนีความร้อน Heat Index (°C)
  pm25: number;        // ฝุ่น PM2.5 (µg/m³)
  co2?: number;        // ก๊าซคาร์บอนไดออกไซด์ (ppm)
  vpd?: number;        // สภาวะการคายน้ำพืช Vapor Pressure Deficit (kPa)
  lux?: number;        // ความเข้มแสง (lux)
  pressure: number;    // ความกดอากาศ (hPa)
  rain: number;        // ปริมาณน้ำฝน (mm)
  windDir?: number;    // ทิศทางลม (องศา 0-360)
  windSpeed: number;   // ความเร็วลม (m/s หรือ km/h)
  timestamp: string;   // ISO Date / Timestamp
}

export interface HandyDevice {
  id: string;
  name: string;
  device_code?: string;
  location?: string;
  crop_type?: string;
  status?: "online" | "offline";
  battery?: number;
  last_seen?: string;
}

export interface SoilData {
  id?: string;
  device_id: string;
  nitrogen: number;      // ไนโตรเจน N (mg/kg)
  phosphorus: number;    // ฟอสฟอรัส P (mg/kg)
  potassium: number;     // โพแทสเซียม K (mg/kg)
  ph: number;            // ค่าความเป็นกรด-ด่าง (pH)
  ec: number;            // ค่าการนำไฟฟ้า/ความเค็ม (µS/cm หรือ dS/m)
  soil_moisture: number; // ความชื้นในดิน (%)
  soil_temp: number;     // อุณหภูมิในดิน (°C)
  timestamp: string;     // ISO Date / Timestamp
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}
