"use client";

import React from "react";
import { SoilData } from "@/types/arda";
import {
  Layers,
  Droplets,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Cpu,
} from "lucide-react";

interface SoilHealthCardsProps {
  soil: SoilData;
}

export function SoilHealthCards({ soil }: SoilHealthCardsProps) {
  // 1. Soil Moisture Logic: if < 30% -> Critical irrigation needed
  const isMoistureLow = soil.soil_moisture < 30;
  const isMoistureOptimal = soil.soil_moisture >= 30 && soil.soil_moisture <= 70;

  // 2. pH Logic:
  // < 5.5: Acidic
  // > 7.5: Alkaline
  // 5.5 - 7.5: Optimal
  const isPhAcidic = soil.ph < 5.5;
  const isPhAlkaline = soil.ph > 7.5;
  const isPhOptimal = !isPhAcidic && !isPhAlkaline;

  // Calculate pointer position on pH spectrum bar (Scale 4.0 to 9.0)
  const phClamped = Math.max(4.0, Math.min(9.0, soil.ph));
  const phPercent = ((phClamped - 4.0) / (9.0 - 4.0)) * 100;

  return (
    <div className="space-y-3.5">
      {/* Responsive Section Header: never collides or breaks Sensor ID on narrow mobile */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 truncate">
            สถานะความอุดมสมบูรณ์ของดิน{" "}
            <span className="hidden md:inline font-semibold text-slate-400">
              (Edaphic & Soil IoT Telemetry)
            </span>
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/80 bg-white px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-800 shadow-2xs shrink-0">
          <Cpu className="h-3 w-3 text-emerald-600" />
          Sensor: {soil.device_id}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: N-P-K Macro-nutrients Laboratory Profile */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-100/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />

          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  Primary Macronutrients
                </span>
                <h3 className="mt-0.5 text-base font-extrabold text-slate-900 truncate">
                  แร่ธาตุอาหารหลัก (N - P - K)
                </h3>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
                <Layers className="h-5 w-5" />
              </div>
            </div>

            {/* Calibrated N-P-K Meters */}
            <div className="mt-4 space-y-3">
              {/* Nitrogen */}
              <div>
                <div className="flex justify-between items-baseline gap-2 text-xs">
                  <span className="font-semibold text-slate-700 truncate">
                    ไนโตรเจน{" "}
                    <span className="font-mono text-[11px] text-slate-400 font-normal">
                      (N • บำรุงใบ/ลำต้น)
                    </span>
                  </span>
                  <span className="font-mono font-bold text-emerald-700 shrink-0">
                    {soil.nitrogen}{" "}
                    <span className="text-[10px] text-slate-400 font-normal">mg/kg</span>
                  </span>
                </div>
                <div className="relative mt-1.5 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
                    style={{ width: `${Math.min(100, (soil.nitrogen / 80) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Phosphorus */}
              <div>
                <div className="flex justify-between items-baseline gap-2 text-xs">
                  <span className="font-semibold text-slate-700 truncate">
                    ฟอสฟอรัส{" "}
                    <span className="font-mono text-[11px] text-slate-400 font-normal">
                      (P • เร่งราก/ออกดอก)
                    </span>
                  </span>
                  <span className="font-mono font-bold text-teal-700 shrink-0">
                    {soil.phosphorus}{" "}
                    <span className="text-[10px] text-slate-400 font-normal">mg/kg</span>
                  </span>
                </div>
                <div className="relative mt-1.5 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-700"
                    style={{ width: `${Math.min(100, (soil.phosphorus / 50) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Potassium */}
              <div>
                <div className="flex justify-between items-baseline gap-2 text-xs">
                  <span className="font-semibold text-slate-700 truncate">
                    โพแทสเซียม{" "}
                    <span className="font-mono text-[11px] text-slate-400 font-normal">
                      (K • ขยายผล/ต้านโรค)
                    </span>
                  </span>
                  <span className="font-mono font-bold text-sky-700 shrink-0">
                    {soil.potassium}{" "}
                    <span className="text-[10px] text-slate-400 font-normal">mg/kg</span>
                  </span>
                </div>
                <div className="relative mt-1.5 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-700"
                    style={{ width: `${Math.min(100, (soil.potassium / 250) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-emerald-50/70 px-3 py-2 text-[11px] font-semibold text-emerald-800 border border-emerald-200/70 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">สัดส่วนแร่ธาตุหลักพร้อมต่อการดูดซึมของราก</span>
          </div>
        </div>

        {/* Card 2: Soil pH Spectrum Gauge & Electrical Conductivity (EC) */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-100/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md hover:shadow-teal-500/5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-emerald-500 to-indigo-500" />

          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  กรด-ด่างและค่าการนำไฟฟ้า (pH & EC)
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-extrabold tracking-tight text-slate-900">
                    {soil.ph.toFixed(2)}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                    pH Index
                  </span>
                </div>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-2xs ${
                  isPhOptimal
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                    : "bg-rose-50 text-rose-600 border-rose-200"
                }`}
              >
                <Activity className="h-5 w-5" />
              </div>
            </div>

            {/* Calibrated pH Spectrum Gauge Bar with Pin Pointer */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[10px] font-mono font-semibold text-slate-400">
                <span className="text-rose-500">4.0 (กรด)</span>
                <span className="text-emerald-600">6.5 (สมดุล)</span>
                <span className="text-indigo-600">9.0 (ด่าง)</span>
              </div>

              <div className="relative py-1">
                <div className="h-3 w-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-500 via-teal-400 to-indigo-600 shadow-inner" />
                <div
                  className="absolute top-0 transition-all duration-700"
                  style={{ left: `calc(${phPercent}% - 6px)` }}
                >
                  <div className="h-5 w-3 rounded-xs border-2 border-slate-900 bg-white shadow-md" />
                </div>
              </div>

              <div className="flex justify-between items-center rounded-xl bg-slate-50/90 border border-slate-100 px-3 py-2 text-xs mt-2">
                <span className="text-slate-500 font-medium text-[11px]">
                  การนำไฟฟ้าในดิน (EC):
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {soil.ec.toFixed(2)}{" "}
                  <span className="text-[10px] font-normal text-slate-400">mS/cm</span>
                </span>
              </div>
            </div>
          </div>

          {/* Actionable Diagnostic Guidance */}
          <div className="mt-3.5">
            {isPhAcidic ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-2.5 text-[11px] text-rose-800 space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span className="truncate">ดินเปรี้ยวจัด (pH &lt; 5.5)</span>
                </div>
                <p className="text-rose-700 text-[10px] leading-snug">
                  แนะนำเติมปูนโดโลไมท์ 100-200 กก./ไร่ เพื่อปรับโครงสร้างดิน
                </p>
              </div>
            ) : isPhAlkaline ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-2.5 text-[11px] text-rose-800 space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span className="truncate">ดินด่าง (pH &gt; 7.5)</span>
                </div>
                <p className="text-rose-700 text-[10px] leading-snug">
                  แนะนำใส่ปุ๋ยหมักอินทรีย์วัตถุเพื่อปรับสมดุลจุลินทรีย์ดิน
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-2 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">ค่า pH สมดุล รากดูดซึมธาตุอาหารได้เต็มที่</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Volumetric Soil Moisture & Soil Temperature */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-100/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/5 md:col-span-2 lg:col-span-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-teal-500 to-emerald-500" />

          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  ความชื้นและอุณหภูมิใต้ผิวดิน (VWC)
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-extrabold tracking-tight text-slate-900">
                    {soil.soil_moisture.toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-sky-600">% VWC</span>
                </div>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-2xs ${
                  isMoistureLow
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : "bg-sky-50 text-sky-700 border-sky-200/80"
                }`}
              >
                <Droplets className="h-5 w-5" />
              </div>
            </div>

            {/* Moisture Tank Column Visualizer with 30% Critical Threshold Marker */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[10px] font-mono font-semibold text-slate-400">
                <span className="text-rose-500">วิกฤต (&lt;30%)</span>
                <span className="text-emerald-600">เหมาะสม (30-70%)</span>
                <span className="text-sky-600">อิ่มตัว (100%)</span>
              </div>

              <div className="relative h-3 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                {/* 30% critical threshold tick line */}
                <div
                  className="absolute inset-y-0 z-10 w-0.5 bg-rose-400/80"
                  style={{ left: "30%" }}
                  title="เกณฑ์ขั้นต่ำ 30%"
                />
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isMoistureLow
                      ? "bg-gradient-to-r from-rose-500 to-amber-500"
                      : isMoistureOptimal
                      ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                      : "bg-gradient-to-r from-sky-400 to-blue-600"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, soil.soil_moisture))}%` }}
                />
              </div>

              <div className="flex justify-between items-center rounded-xl bg-slate-50/90 border border-slate-100 px-3 py-2 text-xs mt-2">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                  <Thermometer className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>อุณหภูมิชั้นรากพืช:</span>
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {soil.soil_temp.toFixed(1)}°C
                </span>
              </div>
            </div>
          </div>

          {/* Actionable Moisture State Alert */}
          <div className="mt-3.5">
            {isMoistureLow ? (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-2.5 text-[11px] text-rose-900 space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span className="truncate">ความชื้นต่ำกว่า 30% • ควรเปิดระบบน้ำ</span>
                </div>
                <p className="text-rose-700 text-[10px] leading-snug">
                  แนะนำเปิดวาล์วน้ำหยดเพื่อป้องกันรากขาดน้ำและใบเหี่ยว
                </p>
              </div>
            ) : isMoistureOptimal ? (
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-2 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">ความชื้นในดินสมบูรณ์ ไม่ต้องให้น้ำเพิ่ม</span>
              </div>
            ) : (
              <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3 py-2 text-[11px] font-semibold text-sky-800 flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="truncate">ดินชุ่มน้ำสูง การระบายน้ำอยู่ในเกณฑ์ปกติ</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
