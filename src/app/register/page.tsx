import React from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-tr from-sky-50 via-slate-50 to-blue-50/60 p-4 sm:p-6 lg:p-8">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-sky-100/30 blur-[100px]" />

      <RegisterForm />
    </main>
  );
}
