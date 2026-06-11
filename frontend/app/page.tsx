"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchHealth, type HealthResponse } from "@/lib/api";

type Status = "loading" | "ok" | "error";

const FEATURES = [
  {
    icon: "🔍",
    title: "Yolg'onni top",
    desc: "3 ta da'vo ichidan yolg'onini toping va izohlab bering. Tanqidiy fikrlash sinovi.",
  },
  {
    icon: "🕵️",
    title: "Dalilchi Detektiv",
    desc: "Dalillar kartalarini tahlil qiling, to'g'ri isbotni tanlang. Mantiqiy fikrlash sinovi.",
  },
  {
    icon: "💬",
    title: "Sokrat suhbati",
    desc: "Har raunddan keyin chuqurroq o'ylashga undovchi savollar. Analitik fikrlash o'sadi.",
  },
];

const STATS = [
  { value: "5", label: "raund" },
  { value: "500", label: "maks ball" },
  { value: "3", label: "fikrlash turi" },
];

export default function Home() {
  const [status, setStatus] = useState<Status>("loading");
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetchHealth()
      .then((data) => {
        setHealth(data);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b1020]">
      {/* background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-sky-600/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-indigo-600/8 blur-[140px]"
      />

      <div className="relative mx-auto max-w-3xl px-6 py-16">
        {/* top badge */}
        <div className="mb-10 flex items-center gap-3">
          <span className="rounded-full border border-sky-800 bg-sky-950/60 px-3 py-1 text-xs font-semibold tracking-wider text-sky-400 uppercase">
            BMI demo
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent" />
          {/* backend status dot */}
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                status === "ok"
                  ? "bg-emerald-400"
                  : status === "error"
                    ? "bg-rose-500"
                    : "animate-pulse bg-slate-600",
              ].join(" ")}
            />
            {status === "ok" && health
              ? `${health.service} v${health.version}`
              : status === "error"
                ? "backend offline"
                : "tekshirilmoqda"}
          </span>
        </div>

        {/* hero */}
        <section className="mb-14 space-y-5">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#e6e9f0] sm:text-5xl">
            Mustaqil{" "}
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              fikrlash
            </span>{" "}
            platformasi
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-400">
            8–9-sinf o&apos;quvchilarida{" "}
            <span className="text-slate-300">tanqidiy</span>,{" "}
            <span className="text-slate-300">analitik</span> va{" "}
            <span className="text-slate-300">mantiqiy fikrlashni</span> o&apos;yin
            orqali o&apos;lchash va rivojlantirish uchun mo&apos;ljallangan
            interaktiv muhit.
          </p>

          {/* stats row */}
          <div className="flex gap-8 pt-2">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-[#e6e9f0]">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* feature cards */}
        <section className="mb-12 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-colors hover:border-slate-700 hover:bg-slate-900/70"
            >
              <span className="mb-3 block text-2xl">{f.icon}</span>
              <h3 className="mb-1.5 text-sm font-semibold text-[#e6e9f0]">
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-500 group-hover:text-slate-400 transition-colors">
                {f.desc}
              </p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/game"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-sky-900/40 transition-all hover:bg-sky-500 hover:shadow-sky-800/50 active:scale-95"
          >
            O&apos;yinni boshlash
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
          <p className="text-xs text-slate-600">
            Kirish kodi shart emas — mehmon sifatida ham o&apos;ynash mumkin
          </p>
        </div>

        {/* footer divider */}
        <div className="mt-20 flex items-center justify-between border-t border-slate-800 pt-6 text-xs text-slate-700">
          <span>BMI demo · Toshkent · 2025</span>
          <Link
            href="/teacher/login"
            className="text-slate-600 transition-colors hover:text-slate-400"
          >
            Ustoz paneli →
          </Link>
        </div>
      </div>
    </main>
  );
}
