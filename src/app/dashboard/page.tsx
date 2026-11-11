"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { Station, HandyDevice, WeatherData, SoilData } from "@/types/arda";
import {
  fetchStations,
  fetchLatestWeather,
  fetchWeatherHistory,
  fetchHandyDevices,
  fetchLatestSoil,
  fetchSoilHistory,
} from "@/lib/ardaApi";
import { HeaderControls } from "@/components/smart-farm/HeaderControls";
import { WeatherOverviewCards } from "@/components/smart-farm/WeatherOverviewCards";
import { SoilHealthCards } from "@/components/smart-farm/SoilHealthCards";
import { InteractiveCharts } from "@/components/smart-farm/InteractiveCharts";
import { RawDataLogTable } from "@/components/smart-farm/RawDataLogTable";
import { SkeletonLoading } from "@/components/smart-farm/SkeletonLoading";
import {
  Sprout,
  AlertCircle,
  CheckCircle2,
  LogOut,
  ChevronDown,
  CloudSun,
  ShieldCheck,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // API Key & Connection Mode
  const [apiKey, setApiKey] = useState("");
  const [isMockMode, setIsMockMode] = useState(true);

  // Stations & Devices
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStationId, setSelectedStationId] = useState("");
  const [handyDevices, setHandyDevices] = useState<HandyDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  // Date Range (default: last 7 days)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Data
  const [latestWeather, setLatestWeather] = useState<WeatherData | null>(null);
  const [latestSoil, setLatestSoil] = useState<SoilData | null>(null);
  const [weatherHistory, setWeatherHistory] = useState<WeatherData[]>([]);
  const [soilHistory, setSoilHistory] = useState<SoilData[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "warning" | "error";
    text: string;
  } | null>(null);

  // Load API Key from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("arda_api_key") || "";
      setApiKey(savedKey);
    }
  }, []);

  // Fetch all data function
  const fetchAllData = useCallback(
    async (
      currentKey: string,
      targetStationId?: string,
      targetDeviceId?: string,
      sDate: string = startDate,
      eDate: string = endDate
    ) => {
      setIsRefreshing(true);

      try {
        // 1. Fetch stations & devices
        const [stationsRes, devicesRes] = await Promise.all([
          fetchStations(currentKey),
          fetchHandyDevices(currentKey),
        ]);

        const stationList = stationsRes.data;
        const deviceList = devicesRes.data;

        setStations(stationList);
        setHandyDevices(deviceList);

        const activeStationId =
          targetStationId || selectedStationId || (stationList[0]?.id ?? "ST-CM01");
        const activeDeviceId =
          targetDeviceId || selectedDeviceId || (deviceList[0]?.id ?? "HD-SOIL-01");

        setSelectedStationId(activeStationId);
        setSelectedDeviceId(activeDeviceId);

        const isUsingMock = stationsRes.isMock || devicesRes.isMock;
        setIsMockMode(isUsingMock);

        // 2. Fetch Latest & History
        const [wLatestRes, sLatestRes, wHistoryRes, sHistoryRes] = await Promise.all([
          fetchLatestWeather(activeStationId, currentKey),
          fetchLatestSoil(activeDeviceId, currentKey),
          fetchWeatherHistory(activeStationId, sDate, eDate, currentKey),
          fetchSoilHistory(activeDeviceId, sDate, eDate, currentKey),
        ]);

        setLatestWeather(wLatestRes.data);
        setLatestSoil(sLatestRes.data);
        setWeatherHistory(wHistoryRes.data);
        setSoilHistory(sHistoryRes.data);

        if (wLatestRes.isMock || sLatestRes.isMock) {
          setIsMockMode(true);
          if (currentKey && currentKey !== "demo") {
            setStatusMessage({
              type: "warning",
              text: "API Key ที่ระบุไม่ผ่านการตรวจสอบ (401) ระบบสลับมาแสดงชุดข้อมูลจำลองสถานีเกษตรอัตโนมัติ",
            });
          } else {
            setStatusMessage({
              type: "warning",
              text: "กำลังแสดงชุดข้อมูลจำลองเสมือนจริงจากสถานีวิจัยเกษตรหลวงเชียงใหม่ & สุพรรณบุรี (สามารถกดใส่ x-api-key เพื่อดึงข้อมูลจริงได้ทันที)",
            });
          }
        } else {
          setIsMockMode(false);
          setStatusMessage({
            type: "success",
            text: "เชื่อมต่อกับเซิร์ฟเวอร์ ARDA API สำเร็จ! กำลังแสดงข้อมูลตรวจวัดสดจากสถานีจริง",
          });
        }

        const now = new Date();
        setLastUpdated(
          `${now.toLocaleDateString("th-TH")} ${now.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })} น.`
        );
      } catch (err: any) {
        setIsMockMode(true);
        setStatusMessage({
          type: "error",
          text: `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${err?.message || "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้"}`,
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedStationId, selectedDeviceId, startDate, endDate]
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchAllData(apiKey);
  }, []);

  const handleSelectStation = (newStationId: string) => {
    setSelectedStationId(newStationId);
    fetchAllData(apiKey, newStationId, selectedDeviceId, startDate, endDate);
  };

  const handleSelectDevice = (newDeviceId: string) => {
    setSelectedDeviceId(newDeviceId);
    fetchAllData(apiKey, selectedStationId, newDeviceId, startDate, endDate);
  };

  const handleDateChange = (newStart: string, newEnd: string) => {
    setStartDate(newStart);
    setEndDate(newEnd);
    fetchAllData(apiKey, selectedStationId, selectedDeviceId, newStart, newEnd);
  };

  const handleRefresh = () => {
    fetchAllData(apiKey, selectedStationId, selectedDeviceId, startDate, endDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/70 via-slate-50 to-emerald-50/30 text-slate-800">
      {/* 100% Responsive Glassmorphic Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-sky-100/90 bg-white/85 px-3 py-2.5 backdrop-blur-xl sm:px-6 lg:px-8 shadow-2xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          {/* Brand & Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-500 text-white shadow-sm shadow-sky-500/20">
              <Sprout className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold tracking-tight text-slate-900 truncate sm:text-base">
                  ARDA <span className="text-sky-600">Smart</span>
                  <span className="text-emerald-600">Farm</span>
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 rounded-md bg-sky-50 border border-sky-200/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-sky-700">
                  v1.0 API
                </span>
              </div>
              <p className="hidden text-[11px] text-slate-500 sm:block truncate">
                ระบบศูนย์ปฏิบัติการตรวจวัดสภาพอากาศ & เซนเซอร์ดินอัจฉริยะ (IoT Telemetry)
              </p>
            </div>
          </div>

          {/* Right section: Active Station Quick Badge (Desktop) + User Profile Dropdown */}
          <div className="flex items-center gap-2.5 shrink-0">
            {selectedStationId && (
              <div className="hidden lg:flex items-center gap-2 rounded-xl border border-sky-100 bg-sky-50/60 px-3 py-1.5 text-xs">
                <CloudSun className="h-3.5 w-3.5 text-sky-600" />
                <span className="text-slate-500">สถานี:</span>
                <span className="font-mono font-bold text-sky-800">{selectedStationId}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">เซนเซอร์:</span>
                <span className="font-mono font-bold text-emerald-800">{selectedDeviceId}</span>
              </div>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white p-1.5 pr-2.5 text-left shadow-2xs hover:border-sky-200 hover:bg-sky-50/30 transition-all"
              >
                {session?.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    className="h-7 w-7 rounded-lg object-cover ring-1 ring-sky-200"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-500 to-teal-500 text-white font-bold text-xs shadow-2xs">
                    {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-28">
                    {session?.user?.name || "ผู้ใช้งาน"}
                  </p>
                  <p className="text-[10px] text-sky-600 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    {(session?.user as any)?.role || "User"}
                  </p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* Backdrop click dismiss */}
              {showProfileMenu && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
              )}

              {/* Profile Dropdown Menu (Guaranteed not to overflow viewport) */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-24px)] rounded-2xl border border-sky-100 bg-white p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="border-b border-slate-100 px-3 py-2 text-xs">
                    <p className="font-bold text-slate-800 truncate">
                      {session?.user?.name || "ผู้ใช้งาน"}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {session?.user?.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors mt-1"
                  >
                    <LogOut className="h-3.5 w-3.5 text-rose-500" />
                    <span>ออกจากระบบ (Sign Out)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        {/* Connection Status Banner */}
        {statusMessage && (
          <div
            className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs shadow-2xs ${
              statusMessage.type === "success"
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-900"
                : statusMessage.type === "warning"
                ? "bg-sky-50/90 border-sky-200/90 text-sky-900"
                : "bg-rose-50/90 border-rose-200 text-rose-900"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <AlertCircle
                className={`h-4 w-4 shrink-0 mt-0.5 ${
                  statusMessage.type === "warning" ? "text-sky-600" : "text-rose-600"
                }`}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium leading-relaxed">{statusMessage.text}</p>
            </div>
          </div>
        )}

        {/* Section 0: Controls Bar (Dropdowns & Date Range) */}
        <HeaderControls
          stations={stations}
          handyDevices={handyDevices}
          selectedStationId={selectedStationId}
          onSelectStation={handleSelectStation}
          selectedDeviceId={selectedDeviceId}
          onSelectDevice={handleSelectDevice}
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          apiKey={apiKey}
          onSaveApiKey={(key) => {
            setApiKey(key);
            if (typeof window !== "undefined") {
              if (key) localStorage.setItem("arda_api_key", key);
              else localStorage.removeItem("arda_api_key");
            }
            fetchAllData(key, selectedStationId, selectedDeviceId, startDate, endDate);
          }}
          isMockMode={isMockMode}
        />

        {/* Loading State vs Dashboard Content */}
        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <>
            {/* Section 1: สภาพอากาศปัจจุบัน (Weather Overview Cards) */}
            {latestWeather && (
              <section>
                <WeatherOverviewCards weather={latestWeather} />
              </section>
            )}

            {/* Section 2: ความสมบูรณ์ของดิน (Soil Health Cards) */}
            {latestSoil && (
              <section>
                <SoilHealthCards soil={latestSoil} />
              </section>
            )}

            {/* Section 3: กราฟวิเคราะห์แนวโน้ม (Interactive Charts) */}
            <section>
              <InteractiveCharts
                weatherHistory={weatherHistory}
                soilHistory={soilHistory}
                dateRangeText={`${startDate} ถึง ${endDate}`}
              />
            </section>

            {/* Section 4: ตารางประวัติข้อมูลดิบ (Raw Data Log Table) */}
            <section>
              <RawDataLogTable
                weatherHistory={weatherHistory}
                soilHistory={soilHistory}
              />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-sky-100 bg-white/80 py-4 text-center text-xs text-slate-400">
        <p>
          ARDA SmartFarm & Weather Telemetry Dashboard • Powered by ARDA Open API (arda365days.com)
        </p>
      </footer>
    </div>
  );
}
