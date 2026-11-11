"use client";

import React from "react";

export function SkeletonLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Weather Cards Skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-56 rounded-md bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-28 rounded bg-slate-200" />
                  <div className="h-8 w-20 rounded bg-slate-200" />
                </div>
                <div className="h-10 w-10 rounded-xl bg-slate-200" />
              </div>
              <div className="h-4 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Soil Cards Skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-56 rounded-md bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-32 rounded bg-slate-200" />
                  <div className="h-6 w-40 rounded bg-slate-200" />
                </div>
                <div className="h-10 w-10 rounded-xl bg-slate-200" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full rounded bg-slate-100" />
                <div className="h-2 w-full rounded bg-slate-100" />
                <div className="h-2 w-full rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 space-y-4">
          <div className="h-5 w-48 rounded bg-slate-200" />
          <div className="h-64 w-full rounded-2xl bg-slate-100" />
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-6 space-y-4">
          <div className="h-5 w-48 rounded bg-slate-200" />
          <div className="h-64 w-full rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
