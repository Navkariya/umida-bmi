"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchFanlar, studentLogin, type Fan } from "@/lib/game-api";

const FEATURES = [
  { icon: "🔍", label: "Yolg'onni top", bg: "#ebfcff", color: "#0290ee", border: "#00b3f5" },
  { icon: "🕵️", label: "Dalilchi Detektiv", bg: "#fff4de", color: "#ff7139", border: "#FE8A4F" },
  { icon: "💬", label: "Sokrat suhbati", bg: "#f7e3ff", color: "#b933e1", border: "#d64cf1" },
];

type Step = "login" | "fan_select";

export default function GameLogin() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("login");
  const [kirish_kodi, setKirishKodi] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fanlar, setFanlar] = useState<Fan[]>([]);
  const [fansLoading, setFansLoading] = useState(false);

  const handleLogin = async (kodi: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentLogin(kodi);
      sessionStorage.setItem("bmi_student", JSON.stringify(data));
      setFansLoading(true);
      const fans = await fetchFanlar();
      setFanlar(fans);
      setFansLoading(false);
      setStep("fan_select");
    } catch {
      setError("Kirish kodi noto'g'ri yoki server javob bermayapti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFanSelect = (fan: Fan | null) => {
    if (fan) {
      sessionStorage.setItem("bmi_fan", JSON.stringify({ fan_id: fan.fan_id, nom: fan.nom, emoji: fan.emoji }));
    } else {
      sessionStorage.removeItem("bmi_fan");
    }
    router.push("/game/play");
  };

  if (step === "fan_select") {
    return (
      <main className="min-h-screen" style={{ background: "#f0f4f8" }}>
        <div className="mx-auto max-w-md px-6 py-14">
          <div className="mb-8 flex flex-col items-center text-center">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
              style={{ background: "#00b3f5", boxShadow: "0 5px 0 #0290ee" }}
            >
              📚
            </div>
            <h1 className="text-2xl font-extrabold" style={{ color: "#2c2c2c" }}>
              Fan tanlang
            </h1>
            <p className="mt-1 text-sm font-semibold" style={{ color: "#8e8e8e" }}>
              Qaysi fan bo&apos;yicha o&apos;ynashni xohlaysiz?
            </p>
          </div>

          {fansLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full" style={{ border: "3px solid #eaeaea", borderTopColor: "#00b3f5" }} />
            </div>
          ) : (
            <div className="space-y-3">
              {fanlar.map((fan) => (
                <button
                  key={fan.fan_id}
                  onClick={() => handleFanSelect(fan)}
                  className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
                  style={{
                    background: "white",
                    border: `2px solid ${fan.rang}`,
                    boxShadow: `0 4px 0 ${fan.rang}`,
                  }}
                >
                  <span className="text-3xl">{fan.emoji}</span>
                  <span className="text-base font-extrabold" style={{ color: "#2c2c2c" }}>
                    {fan.nom}
                  </span>
                  <span
                    className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{ background: `${fan.rang}22`, color: fan.rang }}
                  >
                    5 raund
                  </span>
                </button>
              ))}

              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1" style={{ background: "#e1e1e1" }} />
                <span className="text-xs font-semibold" style={{ color: "#b3b3b3" }}>yoki</span>
                <div className="h-px flex-1" style={{ background: "#e1e1e1" }} />
              </div>

              <button
                onClick={() => handleFanSelect(null)}
                className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
                style={{
                  background: "#f5f5f5",
                  border: "2px solid #cacaca",
                  boxShadow: "0 4px 0 #cacaca",
                }}
              >
                <span className="text-3xl">🌐</span>
                <span className="text-base font-extrabold" style={{ color: "#4b4b4b" }}>
                  Umumiy (barcha fanlar)
                </span>
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#f0f4f8" }}>
      <div className="mx-auto max-w-md px-6 py-14">
        {/* Logo / Icon */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl"
            style={{ background: "#00b3f5", boxShadow: "0 6px 0 #0290ee" }}
          >
            🧠
          </div>
          <h1 className="text-3xl font-extrabold" style={{ color: "#2c2c2c" }}>
            BMI O&apos;yini
          </h1>
          <p className="mt-1 text-sm font-semibold" style={{ color: "#8e8e8e" }}>
            5 raundlik mustaqil fikrlash sayohati
          </p>
        </div>

        {/* Feature chips */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
              style={{ background: f.bg, color: f.color, border: `2px solid ${f.border}` }}
            >
              {f.icon} {f.label}
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl bg-white p-6"
          style={{ border: "2px solid #e1e1e1", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <div className="space-y-4">
            <div>
              <label
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider"
                style={{ color: "#6e6e6e" }}
              >
                Kirish kodi
              </label>
              <input
                type="text"
                value={kirish_kodi}
                onChange={(e) => setKirishKodi(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin(kirish_kodi)}
                placeholder="Kodingizni kiriting…"
                className="w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-all"
                style={{
                  border: "2px solid #e1e1e1",
                  background: "#fafafa",
                  color: "#2c2c2c",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#00b3f5";
                  e.target.style.background = "#fff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e1e1e1";
                  e.target.style.background = "#fafafa";
                }}
              />
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-2.5 text-sm font-semibold"
                style={{ background: "#ffe0e8", color: "#e02950", border: "2px solid #ff505f" }}
              >
                {error}
              </div>
            )}

            <button
              onClick={() => handleLogin(kirish_kodi)}
              disabled={isLoading || kirish_kodi.trim().length === 0}
              className="w-full rounded-xl py-3.5 font-bold text-white transition-transform active:translate-y-1 disabled:opacity-40"
              style={{ background: "#00b3f5", boxShadow: "0 4px 0 #0290ee" }}
            >
              {isLoading ? "Kirilmoqda…" : "Kirish →"}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "#e1e1e1" }} />
              <span className="text-xs font-semibold" style={{ color: "#b3b3b3" }}>
                yoki
              </span>
              <div className="h-px flex-1" style={{ background: "#e1e1e1" }} />
            </div>

            <button
              onClick={() => handleLogin("")}
              disabled={isLoading}
              className="w-full rounded-xl py-3.5 text-sm font-bold transition-transform active:translate-y-0.5 disabled:opacity-40"
              style={{
                background: "#eaeaea",
                color: "#4b4b4b",
                boxShadow: "0 4px 0 #cacaca",
              }}
            >
              Mehmon sifatida kirish
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
