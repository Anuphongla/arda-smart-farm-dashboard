"use client";

import React from "react";
import { MetricItem } from "@/lib/mockData";
import { DollarSign, Users, TrendingUp, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  item: MetricItem;
}

export function MetricCard({ item }: MetricCardProps) {
  const getIcon = () => {
    switch (item.iconName) {
      case "DollarSign":
        return <DollarSign className="h-5 w-5 text-sky-600" />;
      case "Users":
        return <Users className="h-5 w-5 text-sky-600" />;
      case "TrendingUp":
        return <TrendingUp className="h-5 w-5 text-sky-600" />;
      case "Activity":
        return <Activity className="h-5 w-5 text-sky-600" />;
      default:
        return <TrendingUp className="h-5 w-5 text-sky-600" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm shadow-sky-100/50 transition-all hover:shadow-md hover:border-sky-200 hover:-translate-y-0.5">
      {/* Decorative gradient blur */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-100/60 blur-xl" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{item.title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
            {item.value}
          </h3>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 border border-sky-100/80 shadow-xs">
          {getIcon()}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
            item.isPositive
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-rose-50 text-rose-600 border border-rose-100"
          }`}
        >
          {item.isPositive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {item.change}
        </span>
        <span className="text-xs text-slate-400">{item.subtext}</span>
      </div>
    </div>
  );
}
