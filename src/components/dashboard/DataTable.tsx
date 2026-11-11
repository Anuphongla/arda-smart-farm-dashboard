"use client";

import React, { useState } from "react";
import { recentTransactions, Transaction } from "@/lib/mockData";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Loader2,
  Filter,
  Download,
  ArrowUpDown,
} from "lucide-react";

export function DataTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredData = recentTransactions.filter((item) => {
    const matchesSearch =
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-3.5 w-3.5" />
            สำเร็จ (Completed)
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600 border border-sky-100">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            กำลังดำเนิน (Processing)
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 border border-amber-100">
            <Clock className="h-3.5 w-3.5" />
            รอดำเนินการ (Pending)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm shadow-sky-100/40">
      {/* Table Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-sky-50 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              รายการธุรกรรมล่าสุด (Recent Transactions)
            </h3>
            <p className="text-xs text-slate-400">
              รายการชำระเงินและกิจกรรมลูกค้าแบบ Real-time
            </p>
          </div>
        </div>

        {/* Search, Filter & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-56 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อ, อีเมล หรือรหัส..."
              className="h-9 w-full rounded-xl border border-sky-100 bg-sky-50/50 pl-9 pr-3 text-xs text-slate-700 placeholder-slate-400 transition-all focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 appearance-none rounded-xl border border-sky-100 bg-sky-50/50 pl-3 pr-8 text-xs font-medium text-slate-600 focus:border-sky-300 focus:bg-white focus:outline-none"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
            </select>
            <Filter className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Export button */}
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-sky-200 bg-white px-3 text-xs font-semibold text-sky-600 shadow-sm hover:bg-sky-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-sky-100/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-3">Transaction ID</th>
              <th className="py-3 px-3">ลูกค้า (Customer)</th>
              <th className="py-3 px-3">ช่องทางชำระเงิน</th>
              <th className="py-3 px-3">
                <span className="flex items-center gap-1">
                  ยอดเงิน <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="py-3 px-3">สถานะ (Status)</th>
              <th className="py-3 px-3 text-right">เวลาทำรายการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-sky-50/50"
                >
                  <td className="py-3.5 px-3 font-semibold text-sky-700">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-slate-800">{item.customer}</p>
                    <p className="text-[11px] text-slate-400">{item.email}</p>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 font-medium">
                    {item.channel}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-800">
                    {item.amount}
                  </td>
                  <td className="py-3.5 px-3">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-400">
                    {item.date}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  ไม่พบรายการที่ตรงกับคำค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-sky-50 pt-4 text-xs text-slate-400">
        <p>แสดง {filteredData.length} จากทั้งหมด 5 รายการ</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-slate-300 cursor-not-allowed"
          >
            ก่อนหน้า
          </button>
          <button
            type="button"
            className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 font-semibold text-sky-700"
          >
            1
          </button>
          <button
            type="button"
            disabled
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-slate-300 cursor-not-allowed"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
