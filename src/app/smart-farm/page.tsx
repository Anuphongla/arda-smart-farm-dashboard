"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function SmartFarmPage() {
  // State
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

  // Current readings
  const [latestWeather, setLatestWeather] = useState<WeatherData | null>(null);
  const [latestSoil, setLatestSoil] = useState<SoilData | null>(null);

  // Histories
  const [weatherHistory, setWeatherHistory] = useState<WeatherData[]>([]);
  const [soilHistory, setSoilHistory] = useState<SoilData[]>([]);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load API Key from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("arda_api_key") || "";
      setApiKey(savedKey);
    }
  }, []);

  // Save API key
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== "undefined") {
      if (key) {
        localStorage.setItem("arda_api_key", key);
      } else {
        localStorage.removeItem("arda_api_key");
      }
    }
    // Refetch with new key
    fetchAllData(key, selectedStationId, selectedDeviceId, startDate, endDate);
  };

  // Main data fetching function
  const fetchAllData = useCallback(
    async (
      currentKey: string,
      targetStationId?: string,
      targetDeviceId?: string,
      sDate: string = startDate,
      eDate: string = endDate
    ) => {
      setIsRefreshing(true);
      setErrorMessage(null);

      try {
        // 1. Fetch station list & device list if needed
        const [stationsRes, devicesRes] = await Promise.all([
          fetchStations(currentKey),
          fetchHandyDevices(currentKey),
        ]);

        const stationList = stationsRes.data;
        const deviceList = devicesRes.data;

        setStations(stationList);
        setHandyDevices(deviceList);

        // Determine active IDs
        const activeStationId =
          targetStationId || selectedStationId || (stationList[0]?.id ?? "ST-CM01");
        const activeDeviceId =
          targetDeviceId || selectedDeviceId || (deviceList[0]?.id ?? "HD-SOIL-01");

        setSelectedStationId(activeStationId);
        setSelectedDeviceId(activeDeviceId);

        // Track if any mock data was used
        const usedMock = stationsRes.isMock || devicesRes.isMock;
        setIsMockMode(usedMock);

        // 2. Fetch Latest & Historical data in parallel
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
        setErrorMessage(
          err?.message || "ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ได้ ระบบสลับไปใช้ชุดข้อมูลจำลอง"
        );
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

  // Handle station change
  const handleSelectStation = (newStationId: string) => {
    setSelectedStationId(newStationId);
    fetchAllData(apiKey, newStationId, selectedDeviceId, startDate, endDate);
  };

  // Handle device change
  const handleSelectDevice = (newDeviceId: string) => {
    setSelectedDeviceId(newDeviceId);
    fetchAllData(apiKey, selectedStationId, newDeviceId, startDate, endDate);
  };

  // Handle date range change
  const handleDateChange = (newStart: string, newEnd: string) => {
    setStartDate(newStart);
    setEndDate(newEnd);
    fetchAllData(apiKey, selectedStationId, selectedDeviceId, newStart, newEnd);
  };

  // Handle manual refresh
  const handleManualRefresh = () => {
    fetchAllData(apiKey, selectedStationId, selectedDeviceId, startDate, endDate);
  };

  const dateRangeDisplay = `${startDate} ถึง ${endDate}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-slate-50 to-teal-50/30 text-slate-800">
      {/* Top Banner & Quick Navigation */}
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>กลับสู่หน้าหลัก</span>
            </Link>
            <div className="hidden h-4 w-px bg-slate-200 sm:block" />
            <span className="hidden items-center gap-1 text-xs font-medium text-slate-500 sm:flex">
              <Sprout className="h-4 w-4 text-emerald-600" />
              <span>Smart Agriculture Solution • ARDA 365 Days</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href="https://weather-api.arda365days.com"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1 text-emerald-700 hover:underline sm:flex font-medium"
            >
              <span>API Docs</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="rounded-full bg-emerald-100/70 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
              v1.0 Public API
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Controls Bar */}
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
          onRefresh={handleManualRefresh}
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
          isMockMode={isMockMode}
        />

        {/* Informative Alert Banner */}
        {isMockMode && (
          <div className="flex items-start justify-between rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-900 shadow-sm animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="font-bold">
                  กำลังแสดงผลในโหมดจำลอง (Demo Simulation Mode)
                </p>
                <p className="text-[11px] text-amber-700">
                  ระบบกำลังจำลองข้อมูลเซนเซอร์สภาพอากาศและดินของแปลงเกษตรจริง เพื่อให้คุณทดสอบฟังก์ชันและกราฟได้ทันที หากมี ARDA API Key สามารถกดปุ่ม{" "}
                  <span className="font-semibold underline">"ตั้งค่า API Key"</span> ด้านบนเพื่อเชื่อมต่อกับสถานีตรวจวัดจริงได้ทันที
                </p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Loading Skeleton vs Live Dashboard */}
        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <>
            {/* Section 1: Weather Overview Cards */}
            {latestWeather && (
              <section>
                <WeatherOverviewCards weather={latestWeather} />
              </section>
            )}

            {/* Section 2: Soil Health Cards */}
            {latestSoil && (
              <section>
                <SoilHealthCards soil={latestSoil} />
              </section>
            )}

            {/* Section 3: Interactive Charts */}
            <section>
              <InteractiveCharts
                weatherHistory={weatherHistory}
                soilHistory={soilHistory}
                dateRangeText={dateRangeDisplay}
              />
            </section>

            {/* Section 4: Raw Data Log Table */}
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
      <footer className="mt-12 border-t border-emerald-100 bg-white/70 py-6 text-center text-xs text-slate-400">
        <p>
          Smart Agriculture & Weather Analytics Dashboard • พัฒนาด้วย Next.js, Tailwind CSS & Recharts
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          เชื่อมต่อกับ ARDA IoT Open API (สำนักงานพัฒนาการวิจัยการเกษตร)
        </p>
      </footer>
    </div>
  );
}
