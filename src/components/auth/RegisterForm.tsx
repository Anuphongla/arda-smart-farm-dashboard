"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sprout,
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch {
      setError("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-1">
      {/* Decorative Brand Header */}
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-500 text-white shadow-lg shadow-sky-200/80">
          <Sprout className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
          สมัครสมาชิก ARDA <span className="text-sky-600">Smart</span>
          <span className="text-emerald-600">Farm</span>
        </h2>
        <p className="mt-1.5 text-xs text-slate-500">
          สร้างบัญชีผู้ใช้งานเพื่อเข้าถึงระบบติดตามสภาพอากาศและเซนเซอร์ดิน
        </p>
      </div>

      {/* Main Register Card */}
      <div className="mt-6 rounded-3xl border border-sky-100 bg-white/95 p-6 shadow-xl shadow-sky-100/60 backdrop-blur-md sm:p-8">
        {/* Success Alert */}
        {success && (
          <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/90 p-4 text-xs text-emerald-700 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-semibold">ลงทะเบียนสำเร็จ บันทึกลงฐานข้อมูลเรียบร้อย!</p>
              <p className="text-[11px] text-emerald-600">กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...</p>
            </div>
          </div>
        )}

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
              ชื่อ - นามสกุล (Full Name)
            </label>
            <div className="relative mt-1.5">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="สมชาย ใจดี"
                className="h-11 w-full rounded-xl border border-sky-100 bg-sky-50/30 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

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
                placeholder="somchai@example.com"
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
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="h-11 w-full rounded-xl border border-sky-100 bg-sky-50/30 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              ยืนยันรหัสผ่าน (Confirm Password)
            </label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
                className="h-11 w-full rounded-xl border border-sky-100 bg-sky-50/30 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-xs font-semibold text-white shadow-md shadow-sky-200 transition-all hover:from-sky-700 hover:to-teal-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังบันทึกข้อมูลผู้ใช้...
              </>
            ) : (
              <>
                สมัครสมาชิก (Register)
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Link back to Login */}
        <p className="mt-6 text-center text-xs text-slate-500">
          มีบัญชีผู้ใช้งานอยู่แล้ว?{" "}
          <Link
            href="/login"
            className="font-semibold text-sky-600 hover:text-sky-700 hover:underline"
          >
            เข้าสู่ระบบที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
}
