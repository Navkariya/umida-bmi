"use client";

import { useState } from "react";

import type { Scenario } from "@/lib/game-api";

interface Props {
  scenario: Scenario;
  tur: number;
  onSubmit: (davo: string, dalillar: string[], tushuntirish: string) => void;
  isSubmitting: boolean;
}

export default function Detective({
  scenario,
  tur,
  onSubmit,
  isSubmitting,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedDalillar, setSelectedDalillar] = useState<Set<string>>(
    new Set(),
  );
  const [tushuntirish, setTushuntirish] = useState("");

  const toggleDalil = (id: string) => {
    setSelectedDalillar((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const hasDalillar = (scenario.mazmun.dalillar?.length ?? 0) > 0;
  const canSubmit =
    !isSubmitting &&
    selected !== null &&
    (!hasDalillar || selectedDalillar.size > 0) &&
    tushuntirish.trim().length >= 10;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
          Raund {tur} / 5 — Dalilchi Detektiv
        </p>
        <p className="text-lg font-semibold text-[#e6e9f0]">
          {scenario.mazmun.savol}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Qaysi da&apos;vo yolg&apos;on?
        </p>
        {scenario.mazmun.davolar.map((davo) => (
          <button
            key={davo.id}
            onClick={() => setSelected(davo.id)}
            className={[
              "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
              selected === davo.id
                ? "border-amber-500 bg-amber-900/30 text-amber-200"
                : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500",
            ].join(" ")}
          >
            <span className="mr-2 font-mono text-slate-500">{davo.id}</span>
            {davo.matn}
          </button>
        ))}
      </div>

      {scenario.mazmun.dalillar && scenario.mazmun.dalillar.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Qo&apos;llab-quvvatlovchi dalillarni tanlang
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {scenario.mazmun.dalillar.map((dalil) => {
              const active = selectedDalillar.has(dalil.id);
              return (
                <button
                  key={dalil.id}
                  onClick={() => toggleDalil(dalil.id)}
                  className={[
                    "rounded-lg border p-3 text-left text-xs transition-colors",
                    active
                      ? "border-amber-500 bg-amber-900/30 text-amber-200"
                      : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500",
                  ].join(" ")}
                >
                  <span className="mr-1 font-mono text-slate-600">
                    {dalil.id}
                  </span>
                  {dalil.matn}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Dalillar asosida izohlaymiz
        </label>
        <textarea
          value={tushuntirish}
          onChange={(e) => setTushuntirish(e.target.value)}
          rows={3}
          placeholder="Kamida 10 ta belgi yozing…"
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-[#e6e9f0] placeholder-slate-600 focus:border-amber-600 focus:outline-none"
        />
        <p className="text-right text-xs text-slate-600">
          {tushuntirish.trim().length}/10 min
        </p>
      </div>

      <button
        onClick={() =>
          selected &&
          onSubmit(selected, Array.from(selectedDalillar), tushuntirish.trim())
        }
        disabled={!canSubmit}
        className="w-full rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition-opacity disabled:opacity-40 hover:bg-amber-500"
      >
        {isSubmitting ? "Tekshirilmoqda…" : "Javob berish"}
      </button>
    </div>
  );
}
