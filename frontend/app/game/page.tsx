"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { studentLogin } from "@/lib/game-api";

export default function GameLogin() {
  const router = useRouter();
  const [kirish_kodi, setKirishKodi] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (kodi: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentLogin(kodi);
      sessionStorage.setItem("bmi_student", JSON.stringify(data));
      router.push("/game/play");
    } catch {
      setError("Kirish kodi noto'g'ri yoki server javob bermayapti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">
          BMI demo
        </p>
        <h1 className="text-2xl font-bold text-[#e6e9f0]">
          Dalilchi Detektiv
        </h1>
        <p className="text-sm text-slate-400">
          5 raundlik o&apos;yin: yolg&apos;onni toping, dalillarni tanlab izohlang.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Kirish kodi
          </label>
          <input
            type="text"
            value={kirish_kodi}
            onChange={(e) => setKirishKodi(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin(kirish_kodi)}
            placeholder="Kodingizni kiriting…"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-[#e6e9f0] placeholder-slate-600 focus:border-sky-600 focus:outline-none"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-rose-800 bg-rose-950/50 px-4 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}

        <button
          onClick={() => handleLogin(kirish_kodi)}
          disabled={isLoading || kirish_kodi.trim().length === 0}
          className="w-full rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white transition-opacity disabled:opacity-40 hover:bg-sky-500"
        >
          {isLoading ? "Kirilmoqda…" : "Kirish"}
        </button>

        <div className="relative flex items-center">
          <div className="flex-1 border-t border-slate-800" />
          <span className="px-3 text-xs text-slate-600">yoki</span>
          <div className="flex-1 border-t border-slate-800" />
        </div>

        <button
          onClick={() => handleLogin("")}
          disabled={isLoading}
          className="w-full rounded-lg border border-slate-700 px-6 py-3 text-sm text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
        >
          Mehmon sifatida kirish
        </button>
      </section>
    </main>
  );
}
