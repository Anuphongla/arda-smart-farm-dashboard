"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sprout,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Zap,
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("admin@example.com");
    setPassword("123456");
    setError(null);
  };

  return (
    <div className="w-full max-w-md px-1">
      {/* Decorative Brand Header */}
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-500 text-white shadow-lg shadow-sky-200/80">
          <Sprout className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
          เข้าสู่ระบบ ARDA <span className="text-sky-600">Smart</span>
          <span className="text-emerald-600">Farm</span>
        </h2>
        <p className="mt-1.5 text-xs text-slate-500">
          ระบบศูนย์ปฏิบัติการตรวจวัดสภาพอากาศ & เซนเซอร์ดิน IoT
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-6 rounded-3xl border border-sky-100 bg-white/95 p-6 shadow-xl shadow-sky-100/60 backdrop-blur-md sm:p-8">
        {/* Quick Fill Helper Pill */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50/90 to-emerald-50/60 p-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
              <Zap className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-sky-900">บัญชีผู้ดูแลระบบ (Demo Admin)</p>
              <p className="text-[10px] font-mono text-sky-700 truncate">
                admin@example.com / 123456
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="rounded-xl bg-white px-2.5 py-1 text-xs font-semibold text-sky-700 shadow-2xs border border-sky-200 hover:bg-sky-50 transition-colors shrink-0"
          >
            กรอกอัตโนมัติ
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-100 bg-rose-50/80 p-3 text-xs text-rose-600 animate-in fade-in">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              อีเมล (Email)
            </label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="h-11 w-full rounded-xl border border-sky-100 bg-sky-50/30 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              รหัสผ่าน (Password)
            </label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-sky-100 bg-sky-50/30 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-sky-200 text-sky-600 focus:ring-sky-400"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600">
              จดจำการเข้าสู่ระบบไว้ 30 วัน
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-xs font-semibold text-white shadow-md shadow-sky-200 transition-all hover:from-sky-700 hover:to-teal-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังตรวจสอบสิทธิ์...
              </>
            ) : (
              <>
                เข้าสู่ระบบ (Sign In)
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-sky-100" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400">หรือเข้าสู่ระบบด้วย</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <div>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-sky-100 bg-sky-50/40 px-4 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:border-sky-200 transition-colors shadow-2xs"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>ดำเนินการต่อด้วยบัญชี Google</span>
          </button>
        </div>

        {/* Link to Register */}
        <p className="mt-6 text-center text-xs text-slate-500">
          ยังไม่มีบัญชีผู้ใช้งาน?{" "}
          <Link
            href="/register"
            className="font-semibold text-sky-600 hover:text-sky-700 hover:underline"
          >
            สมัครสมาชิกใหม่ที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
}
