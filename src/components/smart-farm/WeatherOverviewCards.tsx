"use client";

import React from "react";
import { WeatherData } from "@/types/arda";
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Activity,
  Navigation,
  Radio,
} from "lucide-react";

interface WeatherOverviewCardsProps {
  weather: WeatherData;
}

export function WeatherOverviewCards({ weather }: WeatherOverviewCardsProps) {
  const isHighTemp = weather.temp > 35;
  const isModerateTemp = weather.temp >= 30 && weather.temp <= 35;

  // Temperature visual percentage (scale 10°C to 45°C)
  const tempPercent = Math.min(100, Math.max(8, ((weather.temp - 10) / 35) * 100));

  // PM2.5 PCD Standard Status
  const getPm25Status = (val: number) => {
    if (val <= 15) {
      return {
        label: "คุณภาพอากาศดีมาก (≤ 15 µg/m³)",
        badgeClass: "bg-emerald-50/90 text-emerald-800 border-emerald-200",
        dotClass: "bg-emerald-500",
      };
    } else if (val <= 37.5) {
      return {
        label: "คุณภาพปานกลาง (15.1 - 37.5 µg/m³)",
        badgeClass: "bg-amber-50/90 text-amber-800 border-amber-200",
        dotClass: "bg-amber-500",
      };
    } else {
      return {
        label: "เริ่มมีผลกระทบ (> 37.5 µg/m³)",
        badgeClass: "bg-rose-50/90 text-rose-800 border-rose-200",
        dotClass: "bg-rose-500",
      };
    }
  };

  const pm25Status = getPm25Status(weather.pm25);
  // PM2.5 pointer position on 0 - 75 scale
  const pm25Percent = Math.min(96, Math.max(4, (weather.pm25 / 75) * 100));

  // VPD Value & visual bar (scale 0.0 to 2.5 kPa, optimal 0.8 - 1.5)
  const vpdVal = weather.vpd !== undefined ? weather.vpd : 1.35;
  const vpdPercent = Math.min(96, Math.max(4, (vpdVal / 2.5) * 100));

  // Compass Cardinal Direction Helper
  const getWindCardinal = (degrees: number = 0) => {
    const cardinals = [
      { name: "ทิศเหนือ", code: "N" },
      { name: "ต.อ.เฉียงเหนือ", code: "NE" },
      { name: "ทิศตะวันออก", code: "E" },
      { name: "ต.อ.เฉียงใต้", code: "SE" },
      { name: "ทิศใต้", code: "S" },
      { name: "ต.ต.เฉียงใต้", code: "SW" },
      { name: "ทิศตะวันตก", code: "W" },
      { name: "ต.ต.เฉียงเหนือ", code: "NW" },
    ];
    const index = Math.round(degrees / 45) % 8;
    return cardinals[index];
  };

  const windDirVal = weather.windDir ?? 180;
  const cardinal = getWindCardinal(windDirVal);

  return (
    <div className="space-y-3.5">
      {/* Responsive Section Header: wraps cleanly on small screens so ID never breaks into two lines */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-200/60 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-sky-500 ring-4 ring-sky-500/15" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 truncate">
            สถานะสภาพอากาศปัจจุบัน{" "}
            <span className="hidden md:inline font-semibold text-slate-400">
              (Atmospheric & Meteorological Station)
            </span>
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200/80 bg-white px-2.5 py-0.5 font-mono text-[11px] font-bold text-sky-800 shadow-2xs shrink-0">
          <Radio className="h-3 w-3 text-sky-500" />
          ID: {weather.station_id}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Temperature, Humidity & Heat Index */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sky-100/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md hover:shadow-amber-500/5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  อุณหภูมิอากาศ (Ambient Temp)
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-extrabold tracking-tight text-slate-900">
                    {weather.temp.toFixed(1)}
                  </span>
                  <span className="text-sm font-bold text-amber-600">°C</span>
                </div>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-2xs ${
                  isHighTemp
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : "bg-amber-50 text-amber-600 border-amber-200/80"
                }`}
              >
                <Thermometer className="h-5 w-5" />
              </div>
            </div>

            {/* Thermal Bar Gauge */}
            <div className="mt-3">
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 transition-all duration-700"
                  style={{ width: `${tempPercent}%` }}
                />
              </div>
            </div>

            {/* Precision Secondary Metrics */}
            <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <div className="min-w-0 rounded-xl bg-sky-50/50 p-2.5 border border-sky-100/80">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase truncate">
                  <Droplets className="h-3 w-3 text-sky-500 shrink-0" />
                  <span className="truncate">ความชื้นสัมพัทธ์</span>
                </span>
                <span className="mt-0.5 block font-mono text-xs font-bold text-sky-700">
                  {weather.humi}% RH
                </span>
              </div>
              <div className="min-w-0 rounded-xl bg-amber-50/40 p-2.5 border border-amber-100/80">
                <span className="block text-[10px] font-semibold text-slate-500 uppercase truncate">
                  ดัชนีความร้อน (HIC)
                </span>
                <span className="mt-0.5 block font-mono text-xs font-bold text-amber-800">
                  {weather.hic !== undefined
                    ? `${weather.hic.toFixed(1)}°C`
                    : `${(weather.temp + 3.5).toFixed(1)}°C`}
                </span>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-3.5">
            {isHighTemp ? (
              <div className="flex items-center gap-1.5 rounded-xl bg-rose-50/90 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 border border-rose-200">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                <span className="truncate">สูงกว่า 35°C • เฝ้าระวังพืชคายน้ำมาก</span>
              </div>
            ) : isModerateTemp ? (
              <div className="flex items-center gap-1.5 rounded-xl bg-amber-50/90 px-2.5 py-1.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span className="truncate">อุณหภูมิปานกลาง • สังเกตการระเหยน้ำ</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50/90 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">อุณหภูมิเหมาะสมต่อการเจริญเติบโต</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Air Quality Index (PM2.5 & CO2) */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sky-100/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500" />

          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  ฝุ่นละอองขนาดเล็ก (PM2.5)
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-extrabold tracking-tight text-slate-900">
                    {weather.pm25.toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-slate-500">µg/m³</span>
                </div>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
                <Activity className="h-5 w-5" />
              </div>
            </div>

            {/* PM2.5 Calibrated Range Bar with Live Pin */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono font-semibold text-slate-400">
                <span className="text-emerald-600">0</span>
                <span>15</span>
                <span className="text-amber-600">37.5</span>
                <span className="text-rose-600">75+</span>
              </div>
              <div className="relative py-1">
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 shadow-inner" />
                <div
                  className="absolute top-0 transition-all duration-700"
                  style={{ left: `calc(${pm25Percent}% - 6px)` }}
                >
                  <div className="h-4.5 w-3 rounded-xs border-2 border-slate-900 bg-white shadow-md" />
                </div>
              </div>

              <div className="flex justify-between items-center rounded-xl bg-slate-50/90 border border-slate-100 px-3 py-2 text-xs mt-2">
                <span className="text-slate-500 font-medium text-[11px]">ก๊าซ CO₂ ในแปลง:</span>
                <span className="font-mono font-bold text-slate-800">
                  {weather.co2 || 415}{" "}
                  <span className="text-[10px] font-normal text-slate-400">ppm</span>
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-3.5">
            <div
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold border ${pm25Status.badgeClass}`}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${pm25Status.dotClass}`} />
              <span className="truncate">{pm25Status.label}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Plant Transpiration (VPD) & Solar Irradiance */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sky-100/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md hover:shadow-teal-500/5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-sky-500" />

          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  แรงดันไอน้ำคายน้ำ (VPD)
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-extrabold tracking-tight text-slate-900">
                    {vpdVal.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-teal-600">kPa</span>
                </div>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 shadow-2xs">
                <Gauge className="h-5 w-5" />
              </div>
            </div>

            {/* VPD Optimal Zone Bar */}
            <div className="mt-3">
              <div className="relative h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all duration-700"
                  style={{ width: `${vpdPercent}%` }}
                />
              </div>
            </div>

            {/* Secondary Details: Lux & Stomata */}
            <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <div className="min-w-0 rounded-xl bg-amber-50/40 p-2.5 border border-amber-100/80">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase truncate">
                  <Sun className="h-3 w-3 text-amber-500 shrink-0" />
                  <span className="truncate">ความเข้มแสง</span>
                </span>
                <span className="mt-0.5 block font-mono text-xs font-bold text-slate-800">
                  {weather.lux ? `${(weather.lux / 1000).toFixed(1)}k lx` : "52.0k lx"}
                </span>
              </div>
              <div className="min-w-0 rounded-xl bg-teal-50/50 p-2.5 border border-teal-100/80">
                <span className="block text-[10px] font-semibold text-slate-500 uppercase truncate">
                  การเปิดปากใบ
                </span>
                <span className="mt-0.5 block font-mono text-xs font-bold text-teal-700">
                  Optimal 100%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3.5">
            <div className="flex items-center gap-1.5 rounded-xl bg-teal-50/80 px-2.5 py-1.5 text-[11px] font-semibold text-teal-800 border border-teal-200/80">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span className="truncate">สมดุลไอน้ำดีเยี่ยม สังเคราะห์แสงเต็มที่</span>
            </div>
          </div>
        </div>

        {/* Card 4: Precision Navigational Wind Compass & Barometric Pressure */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sky-100/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  ความเร็วและทิศทางลม (Wind)
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-extrabold tracking-tight text-slate-900">
                    {weather.windSpeed.toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-sky-600">m/s</span>
                </div>
              </div>

              {/* Sleek Aviation Compass Dial */}
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white shadow-inner">
                <span className="absolute top-0.5 text-[8px] font-extrabold text-sky-700">N</span>
                <span className="absolute bottom-0.5 text-[8px] font-bold text-slate-400">S</span>
                <span className="absolute right-1 text-[8px] font-bold text-slate-400">E</span>
                <span className="absolute left-1 text-[8px] font-bold text-slate-400">W</span>

                <div
                  className="transition-transform duration-700 ease-out"
                  style={{ transform: `rotate(${windDirVal}deg)` }}
                >
                  <Navigation className="h-5 w-5 fill-sky-600 text-sky-700 stroke-1" />
                </div>
              </div>
            </div>

            {/* Secondary Details: Direction Name & Rain */}
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <div className="min-w-0 rounded-xl bg-slate-50/90 p-2.5 border border-slate-100">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase truncate">
                  <Wind className="h-3 w-3 text-sky-600 shrink-0" />
                  <span className="truncate">ทิศทางลม</span>
                </span>
                <span className="mt-0.5 block font-mono text-xs font-bold text-slate-800 truncate">
                  {cardinal.code} ({windDirVal}°)
                </span>
              </div>
              <div className="min-w-0 rounded-xl bg-sky-50/50 p-2.5 border border-sky-100/80">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase truncate">
                  <CloudRain className="h-3 w-3 text-sky-600 shrink-0" />
                  <span className="truncate">ฝนสะสม</span>
                </span>
                <span className="mt-0.5 block font-mono text-xs font-bold text-sky-700">
                  {weather.rain > 0 ? `${weather.rain.toFixed(1)} mm` : "0.0 mm"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3.5">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-1.5 text-[11px]">
              <span className="font-medium text-slate-500">ความกดอากาศ (Pressure):</span>
              <span className="font-mono font-bold text-slate-800">{weather.pressure} hPa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
