"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  chartData7Days,
  chartData30Days,
  chartData12Months,
  trafficSourceData,
} from "@/lib/mockData";
import { BarChart2, TrendingUp, PieChart as PieIcon, Layers } from "lucide-react";

interface AnalyticsChartsProps {
  selectedRange: string;
}

export function AnalyticsCharts({ selectedRange }: AnalyticsChartsProps) {
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  // Select dataset based on range
  const currentData =
    selectedRange === "7 วันล่าสุด"
      ? chartData7Days
      : selectedRange === "30 วัน"
      ? chartData30Days
      : chartData12Months;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-sky-100 bg-white/95 p-3 shadow-lg shadow-sky-100/50 backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-800">{label}</p>
          <div className="mt-1 space-y-1">
            <p className="text-xs font-medium text-sky-600">
              รายรับ: ฿{payload[0]?.value?.toLocaleString()}
            </p>
            {payload[1] && (
              <p className="text-xs font-medium text-slate-500">
                ผู้เข้าชม: {payload[1]?.value?.toLocaleString()} ครั้ง
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main Revenue & Traffic Chart (Takes 2 Columns on large screens) */}
      <div className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm shadow-sky-100/40 lg:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-sky-50 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                แนวโน้มรายรับและการเข้าชม (Revenue & Traffic Trends)
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              วิเคราะห์เปรียบเทียบข้อมูลช่วงเวลา ({selectedRange})
            </p>
          </div>

          {/* Toggle between Area Chart and Bar Chart */}
          <div className="flex items-center gap-1 rounded-xl border border-sky-100 bg-sky-50/50 p-1">
            <button
              onClick={() => setChartType("area")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                chartType === "area"
                  ? "bg-white text-sky-700 shadow-sm border border-sky-100 font-semibold"
                  : "text-slate-500 hover:text-sky-600"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              พื้นที่ (Area)
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                chartType === "bar"
                  ? "bg-white text-sky-700 shadow-sm border border-sky-100 font-semibold"
                  : "text-slate-500 hover:text-sky-600"
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              แท่ง (Bar)
            </button>
          </div>
        </div>

        {/* Chart View */}
        <div className="mt-6 h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="skyRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#bae6fd" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="slateVisitsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#skyRevenueGradient)"
                />
              </AreaChart>
            ) : (
              <BarChart data={currentData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic Sources Donut Chart (Takes 1 Column) */}
      <div className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm shadow-sky-100/40">
        <div className="flex items-center gap-2 border-b border-sky-50 pb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
            <PieIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">ที่มาของทราฟฟิก (Traffic Sources)</h3>
            <p className="text-xs text-slate-400">สัดส่วนช่องทางผู้เข้าชมเว็บไซต์</p>
          </div>
        </div>

        <div className="mt-4 flex h-56 items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trafficSourceData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {trafficSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value}%`, "สัดส่วน"]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "12px",
                  borderColor: "#e0effe",
                  boxShadow: "0 4px 12px rgba(186, 224, 253, 0.3)",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend list */}
        <div className="mt-2 space-y-2">
          {trafficSourceData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
              <span className="font-semibold text-slate-800">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
