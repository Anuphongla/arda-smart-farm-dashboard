"use client";

import React from "react";
import { WeatherData, SoilData } from "@/types/arda";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { TrendingUp, Sprout, Calendar } from "lucide-react";

interface InteractiveChartsProps {
  weatherHistory: WeatherData[];
  soilHistory: SoilData[];
  dateRangeText: string;
}

export function InteractiveCharts({
  weatherHistory,
  soilHistory,
  dateRangeText,
}: InteractiveChartsProps) {
  const formatDateLabel = (isoDate: string, includeTime: boolean = false) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const day = d.getDate().toString().padStart(2, "0");
    const months = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    if (includeTime) {
      const hh = d.getHours().toString().padStart(2, "0");
      const mm = d.getMinutes().toString().padStart(2, "0");
      return `${day} ${months[d.getMonth()]} ${hh}:${mm}`;
    }
    return `${day} ${months[d.getMonth()]}`;
  };

  // Sort chronologically (oldest -> newest) and downsample to max 20 points so 15-min API logs render cleanly
  const prepareSeries = <T extends { timestamp: string }>(
    list: T[],
    maxPoints = 18
  ) => {
    const sorted = [...list].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const isHighFreq = sorted.length > 24;
    if (sorted.length <= maxPoints) {
      return sorted.map((item) => ({
        ...item,
        formattedDate: formatDateLabel(item.timestamp, isHighFreq),
      }));
    }
    const step = (sorted.length - 1) / (maxPoints - 1);
    const sampled: (T & { formattedDate: string })[] = [];
    for (let i = 0; i < maxPoints; i++) {
      const idx = Math.round(i * step);
      const item = sorted[idx];
      sampled.push({
        ...item,
        formattedDate: formatDateLabel(item.timestamp, isHighFreq),
      });
    }
    return sampled;
  };

  const weatherChartData = prepareSeries(weatherHistory, 18);
  const soilChartData = prepareSeries(soilHistory, 18);

  // Clean Professional Dark Tooltip
  const CustomDarkTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-44 text-white">
          <p className="font-mono text-[11px] text-slate-400 border-b border-slate-800 pb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-sky-400" />
              <span>{label}</span>
            </span>
          </p>
          <div className="space-y-1 pt-0.5">
            {payload.map((entry: any, index: number) => (
              <div
                key={`tip-${index}`}
                className="flex items-center justify-between gap-3 text-[11px]"
              >
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}:
                </span>
                <span className="font-mono font-bold text-white">
                  {entry.value}{" "}
                  <span className="text-[10px] text-slate-400 font-normal">
                    {entry.unit || ""}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {/* Chart 1: Weather Telemetry Trend */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-100/90 bg-white p-4 shadow-xs sm:p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-amber-400 to-sky-600" />

        <div className="flex flex-col gap-2.5 border-b border-slate-100 pb-3.5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 border border-sky-200/70">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                แนวโน้มสภาพอากาศย้อนหลัง (Weather Trend)
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                อุณหภูมิ (°C) • ความชื้นสัมพัทธ์ (% RH) • ปริมาณฝน (mm)
              </p>
            </div>
          </div>
          <span className="self-start font-mono rounded-lg bg-sky-50/80 px-2.5 py-1 text-[10px] font-bold text-sky-800 border border-sky-200/60 shrink-0">
            {dateRangeText}
          </span>
        </div>

        {/* Custom Responsive HTML Legend Badges (Never overlaps chart bars on mobile) */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50/80 border border-amber-200/60 px-2 py-0.5 text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            อุณหภูมิ (°C)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50/80 border border-sky-200/60 px-2 py-0.5 text-sky-800">
            <span className="h-2 w-2 rounded-full bg-sky-600" />
            ความชื้น (% RH)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-100/60 border border-sky-200/60 px-2 py-0.5 text-sky-700">
            <span className="h-2 w-2 rounded-xs bg-sky-400" />
            ปริมาณฝน (mm)
          </span>
        </div>

        <div className="mt-3 h-64 sm:h-76 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={weatherChartData}
              margin={{ top: 8, right: 4, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="rainBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#bae6fd" stopOpacity={0.25} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="formattedDate"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                minTickGap={12}
              />
              <YAxis
                yAxisId="left"
                width={34}
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                width={38}
                stroke="#38bdf8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 30]}
                tickFormatter={(val) => `${val}m`}
              />
              <Tooltip content={<CustomDarkTooltip />} />
              <Bar
                yAxisId="right"
                dataKey="rain"
                name="ปริมาณฝน (Rain)"
                fill="url(#rainBarGradient)"
                radius={[4, 4, 0, 0]}
                unit="mm"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                name="อุณหภูมิ (Temp)"
                stroke="#f59e0b"
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: "#f59e0b" }}
                activeDot={{ r: 4.5 }}
                unit="°C"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="humi"
                name="ความชื้น (Humidity)"
                stroke="#0284c7"
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: "#0284c7" }}
                activeDot={{ r: 4.5 }}
                unit="%"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Soil Nutrients & Volumetric Moisture */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100/90 bg-white p-4 shadow-xs sm:p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />

        <div className="flex flex-col gap-2.5 border-b border-slate-100 pb-3.5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <Sprout className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                แนวโน้มธาตุอาหาร & ความชื้นดิน (Soil Dynamics)
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                แร่ธาตุ N-P-K (mg/kg) ควบคู่กับความชื้นใต้ผิวดิน (% VWC)
              </p>
            </div>
          </div>
          <span className="self-start font-mono rounded-lg bg-emerald-50/80 px-2.5 py-1 text-[10px] font-bold text-emerald-800 border border-emerald-200/60 shrink-0">
            {dateRangeText}
          </span>
        </div>

        {/* Custom Responsive HTML Legend Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/60 px-2 py-0.5 text-emerald-800">
            <span className="h-2 w-2 rounded-xs bg-emerald-500" />N (ไนโตรเจน)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50/80 border border-teal-200/60 px-2 py-0.5 text-teal-800">
            <span className="h-2 w-2 rounded-xs bg-teal-500" />P (ฟอสฟอรัส)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50/80 border border-sky-200/60 px-2 py-0.5 text-sky-800">
            <span className="h-2 w-2 rounded-xs bg-sky-600" />K (โพแทสเซียม)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100/60 border border-emerald-300/60 px-2 py-0.5 text-emerald-900">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            ความชื้นดิน (% VWC)
          </span>
        </div>

        <div className="mt-3 h-64 sm:h-76 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={soilChartData}
              margin={{ top: 8, right: 4, left: -12, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="formattedDate"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                minTickGap={12}
              />
              <YAxis
                yAxisId="nutrients"
                width={34}
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 220]}
              />
              <YAxis
                yAxisId="moisture"
                orientation="right"
                width={38}
                stroke="#059669"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<CustomDarkTooltip />} />
              <Bar
                yAxisId="nutrients"
                dataKey="nitrogen"
                name="ไนโตรเจน (N)"
                fill="#10b981"
                radius={[3, 3, 0, 0]}
                unit="mg/kg"
              />
              <Bar
                yAxisId="nutrients"
                dataKey="phosphorus"
                name="ฟอสฟอรัส (P)"
                fill="#14b8a6"
                radius={[3, 3, 0, 0]}
                unit="mg/kg"
              />
              <Bar
                yAxisId="nutrients"
                dataKey="potassium"
                name="โพแทสเซียม (K)"
                fill="#0284c7"
                radius={[3, 3, 0, 0]}
                unit="mg/kg"
              />
              <Line
                yAxisId="moisture"
                type="monotone"
                dataKey="soil_moisture"
                name="ความชื้นดิน (Moisture)"
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: "#059669" }}
                activeDot={{ r: 4.5 }}
                unit="%"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
