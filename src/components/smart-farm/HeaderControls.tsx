"use client";

import React, { useState, useRef, useEffect } from "react";
import { Station, HandyDevice } from "@/types/arda";
import {
  CloudSun,
  Sprout,
  Calendar,
  RefreshCw,
  Key,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  X,
  Loader2,
  Check,
  MapPin,
  Cpu,
  Clock,
} from "lucide-react";

interface HeaderControlsProps {
  stations: Station[];
  handyDevices: HandyDevice[];
  selectedStationId: string;
  onSelectStation: (id: string) => void;
  selectedDeviceId: string;
  onSelectDevice: (id: string) => void;
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  isMockMode: boolean;
}

export function HeaderControls({
  stations,
  handyDevices,
  selectedStationId,
  onSelectStation,
  selectedDeviceId,
  onSelectDevice,
  startDate,
  endDate,
  onDateChange,
  lastUpdated,
  isRefreshing,
  onRefresh,
  apiKey,
  onSaveApiKey,
  isMockMode,
}: HeaderControlsProps) {
  // Custom non-overflowing React dropdowns & centered Date Modal
  const [stationOpen, setStationOpen] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);

  // API Key modal
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Temporary date state for date modal
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  // Refs for click outside
  const stationRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stationRef.current && !stationRef.current.contains(event.target as Node)) {
        setStationOpen(false);
      }
      if (deviceRef.current && !deviceRef.current.contains(event.target as Node)) {
        setDeviceOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update temp dates when props change
  useEffect(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [startDate, endDate]);

  const handleApplyPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    onDateChange(startStr, endStr);
  };

  const handleApplyCustomDate = (e: React.FormEvent) => {
    e.preventDefault();
    onDateChange(tempStart, tempEnd);
    setDateModalOpen(false);
  };

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedKey = tempKey.trim();

    if (!cleanedKey) {
      onSaveApiKey("");
      setShowKeyModal(false);
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const res = await fetch("/api/arda/stations", {
        headers: { "x-api-key": cleanedKey },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setVerificationError("API Key นี้ไม่ถูกต้อง หรือหมดอายุ (Server ตอบกลับ 401 Unauthorized)");
        } else {
          setVerificationError(`เซิร์ฟเวอร์ ARDA ตอบกลับรหัสข้อผิดพลาด (${res.status})`);
        }
        setIsVerifying(false);
        return;
      }

      onSaveApiKey(cleanedKey);
      setShowKeyModal(false);
    } catch {
      setVerificationError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ ARDA ได้ กรุณาตรวจสอบอินเทอร์เน็ต");
    } finally {
      setIsVerifying(false);
    }
  };

  const currentStation = stations.find((s) => s.id === selectedStationId) || stations[0];
  const currentDevice = handyDevices.find((d) => d.id === selectedDeviceId) || handyDevices[0];

  return (
    <>
      <div className="relative z-30 rounded-2xl border border-sky-100/90 bg-white p-4 shadow-sm shadow-sky-900/5 sm:p-5">
        {/* Top Accent Line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500" />

        {/* Top Control Bar: Status, Mode, Key & Refresh */}
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live API vs Mock Pill */}
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border shadow-2xs ${
                isMockMode
                  ? "bg-amber-50/90 text-amber-800 border-amber-200/80"
                  : "bg-emerald-50/90 text-emerald-800 border-emerald-200/80"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                    isMockMode ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                />
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    isMockMode ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                />
              </span>
              <span>{isMockMode ? "โหมดจำลอง (Simulation Telemetry)" : "เชื่อมต่อ ARDA API สด"}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 text-[11px] font-medium text-slate-600">
              <Clock className="h-3 w-3 text-sky-600 shrink-0" />
              <span>อัปเดตล่าสุด: {lastUpdated || "กำลังซิงค์ข้อมูล..."}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <button
              type="button"
              onClick={() => {
                setTempKey(apiKey);
                setVerificationError(null);
                setShowKeyModal(true);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:bg-sky-50/50 hover:text-sky-800 transition-all shadow-2xs"
            >
              <Key className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span className="truncate">{apiKey ? "ตั้งค่า API Key" : "ใส่ ARDA API Key"}</span>
            </button>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs shadow-sky-600/20 hover:from-sky-700 hover:to-teal-700 transition-all active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 shrink-0 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>ซิงค์ข้อมูลใหม่</span>
            </button>
          </div>
        </div>

        {/* Responsive Custom Dropdowns & Date Filter Grid */}
        {/* Breakpoints: 1 col on mobile, 2 cols on tablet (with Date spanning 2 cols), 3 cols on XL desktop */}
        <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-12">
          {/* 1. Custom Station Dropdown */}
          <div
            ref={stationRef}
            className={`relative md:col-span-1 xl:col-span-4 min-w-0 ${
              stationOpen ? "z-40" : "z-20"
            }`}
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <CloudSun className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span>สถานีตรวจอากาศ (Weather Station)</span>
              </label>
              {currentStation?.province && (
                <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700 border border-sky-100 shrink-0">
                  <MapPin className="h-2.5 w-2.5" />
                  จ.{currentStation.province}
                </span>
              )}
            </div>

            {/* Custom Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setStationOpen(!stationOpen);
                setDeviceOpen(false);
              }}
              className={`flex h-11 w-full items-center justify-between rounded-xl border px-3 text-left text-xs font-medium transition-all ${
                stationOpen
                  ? "border-sky-500 bg-white ring-2 ring-sky-500/15 text-slate-900"
                  : "border-slate-200/90 bg-slate-50/70 text-slate-800 hover:border-sky-300 hover:bg-white"
              }`}
            >
              <span className="truncate pr-2 flex items-center gap-1.5">
                <span className="rounded-md bg-sky-100/80 px-1.5 py-0.5 font-mono text-[11px] font-bold text-sky-800 shrink-0">
                  {currentStation?.id || "ST"}
                </span>
                <span className="truncate font-semibold text-slate-800">
                  {currentStation?.name || "เลือกสถานีตรวจอากาศ..."}
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                  stationOpen ? "rotate-180 text-sky-600" : ""
                }`}
              />
            </button>

            {/* Custom Dropdown Menu List (Constrained strictly to card width) */}
            {stationOpen && (
              <div className="absolute left-0 top-full z-50 mt-1.5 w-full max-h-64 overflow-y-auto rounded-xl border border-slate-300 bg-white p-1.5 shadow-2xl ring-1 ring-slate-900/10 animate-in fade-in slide-in-from-top-1">
                {stations.map((st) => {
                  const isSelected = st.id === selectedStationId;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        onSelectStation(st.id);
                        setStationOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-sky-50 text-sky-950 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-sky-100/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-sky-800 shrink-0">
                            {st.id}
                          </span>
                          <span className="truncate font-medium">{st.name}</span>
                        </div>
                        {st.province && (
                          <p className="mt-0.5 text-[10px] text-slate-400 pl-0.5 truncate">
                            จ.{st.province} {st.amphoe ? `• อ.${st.amphoe}` : ""}
                          </p>
                        )}
                      </div>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-sky-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Custom Handy Soil Device Dropdown */}
          <div
            ref={deviceRef}
            className={`relative md:col-span-1 xl:col-span-4 min-w-0 ${
              deviceOpen ? "z-40" : "z-10"
            }`}
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <Sprout className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>เซนเซอร์วัดดิน IoT (Handy Soil)</span>
              </label>
              {currentDevice?.crop_type && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-100 truncate max-w-36">
                  <Cpu className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate">{currentDevice.crop_type}</span>
                </span>
              )}
            </div>

            {/* Custom Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setDeviceOpen(!deviceOpen);
                setStationOpen(false);
              }}
              className={`flex h-11 w-full items-center justify-between rounded-xl border px-3 text-left text-xs font-medium transition-all ${
                deviceOpen
                  ? "border-emerald-500 bg-white ring-2 ring-emerald-500/15 text-slate-900"
                  : "border-slate-200/90 bg-slate-50/70 text-slate-800 hover:border-emerald-300 hover:bg-white"
              }`}
            >
              <span className="truncate pr-2 flex items-center gap-1.5">
                <span className="rounded-md bg-emerald-100/80 px-1.5 py-0.5 font-mono text-[11px] font-bold text-emerald-800 shrink-0">
                  {currentDevice?.id || "HD"}
                </span>
                <span className="truncate font-semibold text-slate-800">
                  {currentDevice?.name || "เลือกอุปกรณ์วัดดิน..."}
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                  deviceOpen ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>

            {/* Custom Dropdown Menu List */}
            {deviceOpen && (
              <div className="absolute left-0 top-full z-50 mt-1.5 w-full max-h-64 overflow-y-auto rounded-xl border border-slate-300 bg-white p-1.5 shadow-2xl ring-1 ring-slate-900/10 animate-in fade-in slide-in-from-top-1">
                {handyDevices.map((dev) => {
                  const isSelected = dev.id === selectedDeviceId;
                  return (
                    <button
                      key={dev.id}
                      type="button"
                      onClick={() => {
                        onSelectDevice(dev.id);
                        setDeviceOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-emerald-50/90 text-emerald-950 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-emerald-100/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 shrink-0">
                            {dev.id}
                          </span>
                          <span className="truncate font-medium">{dev.name}</span>
                        </div>
                        {dev.crop_type && (
                          <p className="mt-0.5 text-[10px] text-slate-400 pl-0.5 truncate">
                            พืชที่ปลูก: {dev.crop_type}
                          </p>
                        )}
                      </div>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Date Range Selector (Spans 2 cols on tablet so it never feels cramped) */}
          <div className="md:col-span-2 xl:col-span-4 min-w-0">
            <div className="mb-1.5 flex items-center justify-between gap-1 flex-wrap">
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <Calendar className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>ช่วงเวลาวิเคราะห์ข้อมูล</span>
              </label>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1">
                {[7, 14, 30].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleApplyPreset(d)}
                    className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 transition-colors"
                  >
                    {d} วัน
                  </button>
                ))}
              </div>
            </div>

            {/* Clickable Date Range Pill */}
            <button
              type="button"
              onClick={() => {
                setTempStart(startDate);
                setTempEnd(endDate);
                setDateModalOpen(true);
              }}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 px-3 text-left text-xs font-medium text-slate-800 hover:border-teal-300 hover:bg-white focus:border-teal-500 focus:bg-white focus:outline-none transition-all"
            >
              <div className="flex items-center gap-2 min-w-0 truncate">
                <Calendar className="h-4 w-4 text-teal-600 shrink-0" />
                <span className="font-mono font-semibold text-slate-800">{startDate}</span>
                <span className="text-slate-400 text-[11px]">ถึง</span>
                <span className="font-mono font-semibold text-slate-800">{endDate}</span>
              </div>
              <span className="ml-2 rounded-lg bg-teal-50 border border-teal-200/70 px-2 py-0.5 text-[10px] font-bold text-teal-800 shrink-0">
                เลือกวันที่
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Modal (Centered, Viewport-Safe) */}
      {dateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-sky-100 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm">กำหนดช่วงวันที่ดึงข้อมูลย้อนหลัง</h3>
              </div>
              <button
                type="button"
                onClick={() => setDateModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleApplyCustomDate} className="mt-4 space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1.5">
                  เลือกด่วน (Quick Select)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 14, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(end.getDate() - d);
                        setTempStart(start.toISOString().split("T")[0]);
                        setTempEnd(end.toISOString().split("T")[0]);
                      }}
                      className="rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 transition-colors"
                    >
                      {d} วันล่าสุด
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  วันที่เริ่มต้น (Start Date)
                </label>
                <input
                  type="date"
                  required
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-xs font-mono font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  วันที่สิ้นสุด (End Date)
                </label>
                <input
                  type="date"
                  required
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-xs font-mono font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDateModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white hover:from-sky-700 hover:to-teal-700 transition-all shadow-xs"
                >
                  อัปเดตช่วงเวลา
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Key Modal (Viewport-Safe, Centered) */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                  <Key className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base">ตั้งค่าการเชื่อมต่อ ARDA API Key</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  ARDA <span className="font-mono text-sky-700">x-api-key</span> Header
                </label>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  ใช้สำหรับดึงข้อมูลจริงจาก{" "}
                  <span className="font-mono text-teal-700">https://weather-api.arda365days.com</span>
                </p>
                <input
                  type="text"
                  value={tempKey}
                  onChange={(e) => {
                    setTempKey(e.target.value);
                    setVerificationError(null);
                  }}
                  placeholder="วางรหัส x-api-key ของคุณที่นี่..."
                  className="mt-2 h-10 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 font-mono text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {verificationError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <p>{verificationError}</p>
                </div>
              )}

              <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-3 text-xs text-sky-900">
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                  <span>ระบบสลับโหมดอัตโนมัติ (Smart Fallback)</span>
                </div>
                <p className="mt-1 text-[11px] text-sky-800/90 leading-relaxed">
                  หากใส่ API Key ที่ถูกต้อง ระบบจะดึงข้อมูลสดจากเซิร์ฟเวอร์ ARDA ทันที หรือกด{" "}
                  <strong>&ldquo;ใช้โหมดจำลอง&rdquo;</strong> เพื่อแสดงผลชุดข้อมูลจำลองเสมือนจริง
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempKey("");
                    onSaveApiKey("");
                    setShowKeyModal(false);
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  ใช้โหมดจำลอง
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white hover:from-sky-700 hover:to-teal-700 transition-all disabled:opacity-60"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>กำลังตรวจสอบ...</span>
                    </>
                  ) : (
                    <span>บันทึกและเชื่อมต่อ</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
