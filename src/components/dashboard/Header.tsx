"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Calendar,
} from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export function Header({ onToggleSidebar, selectedRange, onRangeChange }: HeaderProps) {
  const { data: session } = useSession();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-sky-100 bg-white/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left section: Hamburger button & Search */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          type="button"
          className="rounded-xl border border-sky-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-sky-50 hover:text-sky-600 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาข้อมูล, รายงาน, รายการชำระ..."
            className="h-10 w-64 rounded-xl border border-sky-100 bg-sky-50/40 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 lg:w-80"
          />
        </div>
      </div>

      {/* Right section: Range Selector, Notifications & User menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Filter selector */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-sky-100 bg-sky-50/50 p-1 text-xs">
          <Calendar className="ml-2 h-3.5 w-3.5 text-sky-600" />
          {["7 วันล่าสุด", "30 วัน", "1 ปี"].map((range) => (
            <button
              key={range}
              onClick={() => onRangeChange(range)}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
                selectedRange === range
                  ? "bg-white text-sky-700 shadow-sm border border-sky-100 font-semibold"
                  : "text-slate-600 hover:text-sky-600"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Notifications Button */}
        <button
          type="button"
          className="relative rounded-xl border border-sky-100 bg-white p-2 text-slate-500 shadow-sm hover:bg-sky-50 hover:text-sky-600 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
          </span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            type="button"
            className="flex items-center gap-2 rounded-xl border border-sky-100 bg-white p-1.5 pr-2.5 text-left shadow-sm hover:border-sky-200 hover:bg-sky-50/40 transition-all"
          >
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name || "User Avatar"}
                className="h-7 w-7 rounded-lg object-cover ring-1 ring-sky-200"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700 font-bold text-xs">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {session?.user?.name || "ผู้ใช้งาน"}
              </p>
              <p className="text-[10px] text-sky-600 font-medium">
                {(session?.user as any)?.role || "Administrator"}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl border border-sky-100 bg-white p-1.5 shadow-xl shadow-sky-100/50 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              onClick={() => setShowProfileMenu(false)}
            >
              <div className="border-b border-sky-50 px-3 py-2.5">
                <p className="text-xs font-semibold text-slate-800">
                  {session?.user?.name || "ผู้ใช้งาน"}
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  {session?.user?.email || "user@example.com"}
                </p>
              </div>
              <div className="mt-1 space-y-0.5">
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                >
                  <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                  โปรไฟล์ของฉัน
                </button>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5 text-red-500" />
                  ออกจากระบบ (Sign Out)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
