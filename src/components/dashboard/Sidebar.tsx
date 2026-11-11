"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  LayoutDashboard,
  Sparkles,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Only real, fully implemented pages — NO dead links or placeholders!
const navItems = [
  {
    name: "Smart Agriculture (เกษตร & สภาพอากาศ ARDA)",
    href: "/smart-farm",
    icon: Sprout,
    highlight: true,
    description: "ระบบตรวจวัดสภาพอากาศ & เซนเซอร์ดิน IoT",
  },
  {
    name: "Executive Overview (แดชบอร์ดภาพรวม)",
    href: "/dashboard",
    icon: LayoutDashboard,
    highlight: false,
    description: "สถิติและตัวชี้วัดทางการเงิน & ผู้ใช้งาน",
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sky-100 bg-white/95 backdrop-blur-md transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-sky-100/80 px-6">
          <Link href="/smart-farm" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-800">
                ARDA<span className="text-emerald-600">SmartFarm</span>
              </span>
              <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-600">
                IoT Weather & Soil
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-6">
          <div className="space-y-4">
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                เมนูหลักที่พร้อมใช้งาน (Active Pages)
              </p>
              <nav className="mt-3 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={`group flex flex-col gap-0.5 rounded-2xl p-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-emerald-50/80 text-emerald-800 shadow-sm border border-emerald-200"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`h-4 w-4 transition-colors ${
                              isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"
                            }`}
                          />
                          <span className="font-bold text-xs">{item.name}</span>
                        </div>
                        {item.highlight && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                            ONLINE
                          </span>
                        )}
                      </div>
                      <p className="pl-6 text-[11px] text-slate-400 font-normal">
                        {item.description}
                      </p>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* ARDA API Information Card */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/80 to-teal-50/40 p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="mt-2 text-xs font-bold text-slate-800">ARDA 365 Days API</h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              รองรับทั้งการเชื่อมต่อ API สด และโหมดจำลองสถานการณ์
            </p>
            <Link
              href="/smart-farm"
              className="mt-3 block w-full rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-xs border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              เปิดหน้าแดชบอร์ดเกษตร
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
