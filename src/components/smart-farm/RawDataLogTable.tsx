"use client";

import React, { useState } from "react";
import { WeatherData, SoilData } from "@/types/arda";
import {
  Download,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  CloudSun,
  Sprout,
  ChevronDown,
} from "lucide-react";

interface RawDataLogTableProps {
  weatherHistory: WeatherData[];
  soilHistory: SoilData[];
}

export function RawDataLogTable({
  weatherHistory,
  soilHistory,
}: RawDataLogTableProps) {
  const [activeTab, setActiveTab] = useState<"weather" | "soil">("weather");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting function
  const sortData = <T extends { timestamp: string }>(data: T[]): T[] => {
    return [...data].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });
  };

  // Weather Table Filter & Pagination
  const filteredWeather = sortData(weatherHistory).filter((item) => {
    return (
      item.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.station_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.temp.toString().includes(searchTerm)
    );
  });

  // Soil Table Filter & Pagination
  const filteredSoil = sortData(soilHistory).filter((item) => {
    return (
      item.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.soil_moisture.toString().includes(searchTerm)
    );
  });

  const currentDataset = activeTab === "weather" ? filteredWeather : filteredSoil;
  const totalPages = Math.max(1, Math.ceil(currentDataset.length / pageSize));
  const paginatedData = currentDataset.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDateTime = (isoDate: string) => {
    if (!isoDate) return "-";
    const d = new Date(isoDate);
    return `${d.toLocaleDateString("th-TH")} ${d.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    })} น.`;
  };

  // CSV Export Function (with UTF-8 BOM so Excel opens Thai correctly)
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = "";

    if (activeTab === "weather") {
      filename = `ARDA_Weather_History_${new Date().toISOString().split("T")[0]}.csv`;
      headers = [
        "วันเวลา (Timestamp)",
        "รหัสสถานี (Station ID)",
        "อุณหภูมิ (°C)",
        "ความชื้น (%)",
        "ดัชนีความร้อน (°C)",
        "PM2.5 (µg/m³)",
        "CO2 (ppm)",
        "VPD (kPa)",
        "ความเข้มแสง (Lux)",
        "ความกดอากาศ (hPa)",
        "ปริมาณฝน (mm)",
        "ความเร็วลม (m/s)",
      ];

      rows = (filteredWeather as WeatherData[]).map((w) => [
        `"${formatDateTime(w.timestamp)}"`,
        `"${w.station_id}"`,
        w.temp.toString(),
        w.humi.toString(),
        (w.hic ?? "").toString(),
        w.pm25.toString(),
        (w.co2 ?? "").toString(),
        (w.vpd ?? "").toString(),
        (w.lux ?? "").toString(),
        w.pressure.toString(),
        w.rain.toString(),
        w.windSpeed.toString(),
      ]);
    } else {
      filename = `ARDA_Soil_History_${new Date().toISOString().split("T")[0]}.csv`;
      headers = [
        "วันเวลา (Timestamp)",
        "รหัสอุปกรณ์ (Device ID)",
        "ไนโตรเจน N (mg/kg)",
        "ฟอสฟอรัส P (mg/kg)",
        "โพแทสเซียม K (mg/kg)",
        "กรด-ด่าง (pH)",
        "ความเค็ม EC (mS/cm)",
        "ความชื้นดิน (%)",
        "อุณหภูมิดิน (°C)",
      ];

      rows = (filteredSoil as SoilData[]).map((s) => [
        `"${formatDateTime(s.timestamp)}"`,
        `"${s.device_id}"`,
        s.nitrogen.toString(),
        s.phosphorus.toString(),
        s.potassium.toString(),
        s.ph.toString(),
        s.ec.toString(),
        s.soil_moisture.toString(),
        s.soil_temp.toString(),
      ]);
    }

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-100/90 bg-white p-4 shadow-xs sm:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500" />

      {/* Header with Tabs & Title */}
      <div className="flex flex-col gap-3.5 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 border border-sky-200/70 shrink-0">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 sm:text-base truncate">
              ตารางบันทึกข้อมูลดิบย้อนหลัง (Historical Telemetry Logs)
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
              ค้นหา จัดเรียงลำดับเวลา และส่งออกไฟล์ตาราง CSV รองรับภาษาไทย
            </p>
          </div>
        </div>

        {/* Tab switchers (Responsive 2-col on phone, flex on tablet/desktop) */}
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200/90 bg-slate-100/70 p-1 w-full sm:w-auto sm:flex sm:items-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab("weather");
              setCurrentPage(1);
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "weather"
                ? "bg-white text-sky-800 shadow-2xs border border-sky-200/70"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <CloudSun className="h-3.5 w-3.5 shrink-0" />
            <span>สภาพอากาศ ({weatherHistory.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("soil");
              setCurrentPage(1);
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "soil"
                ? "bg-white text-emerald-800 shadow-2xs border border-emerald-200/70"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Sprout className="h-3.5 w-3.5 shrink-0" />
            <span>เซนเซอร์ดิน ({soilHistory.length})</span>
          </button>
        </div>
      </div>

      {/* Action Bar: Search, Sort & Export */}
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64 min-w-0">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ค้นหาวันที่, รหัสสถานี/อุปกรณ์..."
              className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 text-xs text-slate-700 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/15"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            {/* Sort order toggle */}
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="flex h-9.5 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:bg-sky-50/40 transition-colors shadow-2xs shrink-0"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span className="truncate">
                {sortOrder === "desc" ? "ใหม่สุดก่อน" : "เก่าสุดก่อน"}
              </span>
            </button>

            {/* Export CSV button (Mobile paired in 2-col grid, Desktop on right) */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex sm:hidden h-9.5 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 text-xs font-semibold text-white shadow-xs hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95 shrink-0"
            >
              <Download className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Export CSV button (Desktop/Tablet) */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="hidden sm:flex h-9.5 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 text-xs font-semibold text-white shadow-xs hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95 shrink-0"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export CSV (Excel ภาษาไทย)</span>
        </button>
      </div>

      {/* Horizontal Scroll Indicator on Mobile */}
      <div className="sm:hidden mt-3 flex items-center justify-between rounded-lg bg-sky-50/70 px-2.5 py-1 text-[10px] font-medium text-sky-700">
        <span>ตารางข้อมูลละเอียด</span>
        <span>เลื่อนซ้าย-ขวาเพื่อดูคอลัมน์ทั้งหมด →</span>
      </div>

      {/* Table Container (Full horizontal scroll on mobile) */}
      <div className="mt-2.5 overflow-x-auto rounded-xl border border-slate-200/90">
        <table className="w-full text-left text-xs whitespace-nowrap">
          {activeTab === "weather" ? (
            <>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/95 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-3.5">วันและเวลา (Timestamp)</th>
                  <th className="py-3 px-3">สถานี (Station)</th>
                  <th className="py-3 px-3 text-amber-700">อุณหภูมิ (°C)</th>
                  <th className="py-3 px-3 text-sky-700">ความชื้น (% RH)</th>
                  <th className="py-3 px-3">PM2.5 (µg/m³)</th>
                  <th className="py-3 px-3 text-teal-700">VPD (kPa)</th>
                  <th className="py-3 px-3">ความเข้มแสง (lx)</th>
                  <th className="py-3 px-3 text-right">ฝนสะสม (mm)</th>
                  <th className="py-3 px-3.5 text-right">ความเร็วลม (m/s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {(paginatedData as WeatherData[]).length > 0 ? (
                  (paginatedData as WeatherData[]).map((w, index) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-sky-50/40"
                    >
                      <td className="py-2.5 px-3.5 font-mono font-medium text-slate-700">
                        {formatDateTime(w.timestamp)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="rounded-md bg-sky-50 border border-sky-200/60 px-1.5 py-0.5 font-mono text-[11px] font-bold text-sky-800">
                          {w.station_id}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-600">
                        {w.temp.toFixed(1)}°C
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-sky-600">
                        {w.humi}%
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block font-mono rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                            w.pm25 <= 15
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                              : w.pm25 <= 37.5
                              ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                              : "bg-rose-50 text-rose-800 border border-rose-200/60"
                          }`}
                        >
                          {w.pm25.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-teal-700">
                        {w.vpd ?? "-"}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {w.lux ? w.lux.toLocaleString() : "-"}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right font-semibold text-sky-700">
                        {w.rain > 0 ? `${w.rain.toFixed(1)} mm` : "0.0"}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-right text-slate-600">
                        {w.windSpeed.toFixed(1)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      ไม่พบข้อมูลสภาพอากาศในช่วงเวลาหรือคำค้นหาที่ระบุ
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/95 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-3.5">วันและเวลา (Timestamp)</th>
                  <th className="py-3 px-3">เซนเซอร์ (Device)</th>
                  <th className="py-3 px-3 text-emerald-700">ไนโตรเจน N</th>
                  <th className="py-3 px-3 text-teal-700">ฟอสฟอรัส P</th>
                  <th className="py-3 px-3 text-sky-700">โพแทสเซียม K</th>
                  <th className="py-3 px-3">กรด-ด่าง (pH)</th>
                  <th className="py-3 px-3">ความเค็ม (EC)</th>
                  <th className="py-3 px-3 font-bold text-emerald-700">ความชื้นดิน (% VWC)</th>
                  <th className="py-3 px-3.5 text-right">อุณหภูมิดิน (°C)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {(paginatedData as SoilData[]).length > 0 ? (
                  (paginatedData as SoilData[]).map((s, index) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-emerald-50/40"
                    >
                      <td className="py-2.5 px-3.5 font-mono font-medium text-slate-700">
                        {formatDateTime(s.timestamp)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="rounded-md bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 font-mono text-[11px] font-bold text-emerald-800">
                          {s.device_id}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-emerald-700">
                        {s.nitrogen} mg/kg
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-teal-700">
                        {s.phosphorus} mg/kg
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-sky-700">
                        {s.potassium} mg/kg
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block font-mono rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                            s.ph >= 5.5 && s.ph <= 7.5
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                              : "bg-rose-50 text-rose-800 border border-rose-200/60"
                          }`}
                        >
                          {s.ph.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {s.ec.toFixed(2)} mS/cm
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                        {s.soil_moisture}%
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-right font-medium text-slate-800">
                        {s.soil_temp.toFixed(1)}°C
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      ไม่พบข้อมูลตรวจวัดดินในช่วงเวลาหรือคำค้นหาที่ระบุ
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          )}
        </table>
      </div>

      {/* Responsive Pagination Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>แสดงต่อหน้า:</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 appearance-none rounded-lg border border-slate-200 bg-white pl-2.5 pr-7 text-xs font-semibold text-slate-700 focus:border-sky-400 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
          <span className="text-[11px] text-slate-400">
            ({currentDataset.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
            {Math.min(currentPage * pageSize, currentDataset.length)} จาก{" "}
            {currentDataset.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>ก่อนหน้า</span>
          </button>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono font-bold text-slate-700 text-xs">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>ถัดไป</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
