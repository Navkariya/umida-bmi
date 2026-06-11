"use client";

import { useEffect, useState } from "react";

import { apiBaseUrl, fetchHealth, type HealthResponse } from "@/lib/api";

type Status = "loading" | "ok" | "error";

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
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 px-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-sky-400">BMI demo</p>
        <h1 className="text-3xl font-bold">Mustaqil fikrlash platformasi</h1>
        <p className="text-slate-400">
          8–9-sinf o'quvchilarida tanqidiy, ijodiy, analitik va mantiqiy fikrlashni
          AKT yordamida o'lchash va rivojlantirish.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Backend holati
        </h2>

        {status === "loading" && <p className="text-slate-300">Tekshirilmoqda…</p>}

        {status === "ok" && health && (
          <div className="flex items-center gap-3">
            <span className="inline-block h-3 w-3 rounded-full bg-emerald-400" />
            <span className="text-emerald-300">
              {health.service} ulandi (v{health.version})
            </span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-3">
            <span className="inline-block h-3 w-3 rounded-full bg-rose-500" />
            <span className="text-rose-300">
              Backendga ulanib bo'lmadi — {apiBaseUrl()} ishlayotganini tekshiring.
            </span>
          </div>
        )}
      </section>
    </main>
  );
}
