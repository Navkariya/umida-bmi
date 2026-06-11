"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchHealth, type HealthResponse } from "@/lib/api";

type Status = "loading" | "ok" | "error";

const FEATURES = [
  {
    icon: "🔍",
    title: "Yolg'onni top",
    desc: "3 ta da'vo ichidan yolg'onini toping va izohlab bering.",
    bg: "#ebfcff",
    color: "#0290ee",
    border: "#00b3f5",
    shadow: "#0290ee",
  },
  {
    icon: "🕵️",
    title: "Dalilchi Detektiv",
    desc: "Dalillar kartalarini tahlil qiling, to'g'ri isbotni tanlang.",
    bg: "#fff4de",
    color: "#ff7139",
    border: "#FE8A4F",
    shadow: "#ff7139",
  },
  {
    icon: "💬",
    title: "Sokrat suhbati",
    desc: "Har raunddan keyin chuqurroq o'ylashga undovchi savollar.",
    bg: "#f7e3ff",
    color: "#b933e1",
    border: "#d64cf1",
    shadow: "#b933e1",
  },
];

const STATS = [
  { value: "5", label: "raund", bg: "#ebfcff", color: "#0290ee", border: "#00b3f5" },
  { value: "500", label: "maks ball", bg: "#ffffdd", color: "#FFA537", border: "#FFBD4F" },
  { value: "3", label: "fikrlash turi", bg: "#f7e3ff", color: "#b933e1", border: "#d64cf1" },
];

export default function Home() {
  const [status, setStatus] = useState<Status>("loading");
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetchHealth()
      .then((data) => { setHealth(data); setStatus("ok"); })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <div className="mx-auto max-w-2xl px-6 py-14">

        {/* Top bar */}
        <div className="mb-10 flex items-center justify-between">
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
            style={{ background: "#ebfcff", color: "#0290ee", border: "2px solid #00b3f5" }}
          >
            🧠 BMI demo
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={status === "ok" ? "" : status === "error" ? "" : "animate-pulse"}
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background:
                  status === "ok" ? "#3fe1b0" : status === "error" ? "#ff505f" : "#cacaca",
              }}
            />
            <span className="text-xs font-semibold" style={{ color: "#b3b3b3" }}>
              {status === "ok" && health
                ? `${health.service} v${health.version}`
                : status === "error"
                  ? "backend offline"
                  : "tekshirilmoqda"}
            </span>
          </div>
        </div>

        {/* Hero */}
        <section className="mb-10">
          <div
            className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl"
            style={{ background: "#00b3f5", boxShadow: "0 6px 0 #0290ee" }}
          >
            🧠
          </div>
          <h1 className="mb-3 text-4xl font-extrabold leading-tight sm:text-5xl" style={{ color: "#2c2c2c" }}>
            Mustaqil{" "}
            <span style={{ color: "#00b3f5" }}>fikrlash</span>{" "}
            platformasi
          </h1>
          <p className="max-w-lg text-base font-medium leading-relaxed" style={{ color: "#6e6e6e" }}>
            8–9-sinf o&apos;quvchilarida{" "}
            <span style={{ color: "#0290ee", fontWeight: 700 }}>tanqidiy</span>,{" "}
            <span style={{ color: "#b933e1", fontWeight: 700 }}>analitik</span> va{" "}
            <span style={{ color: "#ff7139", fontWeight: 700 }}>mantiqiy fikrlashni</span>{" "}
            o&apos;yin orqali o&apos;lchash va rivojlantirish uchun interaktiv muhit.
          </p>
        </section>

        {/* Stats */}
        <div className="mb-10 flex gap-3 flex-wrap">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex items-baseline gap-1.5 rounded-2xl px-5 py-3"
              style={{ background: s.bg, border: `2px solid ${s.border}` }}
            >
              <span className="text-2xl font-extrabold" style={{ color: s.color }}>
                {s.value}
              </span>
              <span className="text-xs font-bold" style={{ color: s.color }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-5 transition-transform hover:-translate-y-1"
              style={{
                background: f.bg,
                border: `2px solid ${f.border}`,
                boxShadow: `0 4px 0 ${f.shadow}`,
              }}
            >
              <span className="mb-3 block text-3xl">{f.icon}</span>
              <h3 className="mb-1.5 text-sm font-extrabold" style={{ color: f.color }}>
                {f.title}
              </h3>
              <p className="text-xs font-medium leading-relaxed" style={{ color: f.color, opacity: 0.75 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/game"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-extrabold text-white transition-transform active:translate-y-1"
            style={{ background: "#00b3f5", boxShadow: "0 5px 0 #0290ee" }}
          >
            O&apos;yinni boshlash
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <p className="text-xs font-semibold" style={{ color: "#b3b3b3" }}>
            Kirish kodi shart emas — mehmon sifatida ham o&apos;ynash mumkin
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-6" style={{ borderTop: "2px solid #e1e1e1" }}>
          <Link
            href="/teacher/login"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-transform active:translate-y-0.5"
            style={{
              background: "#eaeaea",
              color: "#4b4b4b",
              border: "2px solid #cacaca",
              boxShadow: "0 3px 0 #cacaca",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Ustoz paneli
          </Link>
        </div>

      </div>
    </main>
  );
}
