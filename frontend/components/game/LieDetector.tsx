"use client";

import { useState } from "react";

import type { Scenario } from "@/lib/game-api";

interface Props {
  scenario: Scenario;
  tur: number;
  onSubmit: (davo: string, tushuntirish: string) => void;
  isSubmitting: boolean;
}

export default function LieDetector({
  scenario,
  tur,
  onSubmit,
  isSubmitting,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [tushuntirish, setTushuntirish] = useState("");

  const canSubmit =
    !isSubmitting && selected !== null && tushuntirish.trim().length >= 10;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-400">
          Raund {tur} / 5 — Yolg&apos;onni top
        </p>
        <p className="text-lg font-semibold text-[#e6e9f0]">
          {scenario.mazmun.savol}
        </p>
      </div>

      <div className="space-y-3">
        {scenario.mazmun.davolar.map((davo) => (
          <button
            key={davo.id}
            onClick={() => setSelected(davo.id)}
            className={[
              "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
              selected === davo.id
                ? "border-sky-500 bg-sky-900/40 text-sky-200"
                : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500",
            ].join(" ")}
          >
            <span className="mr-2 font-mono text-slate-500">{davo.id}</span>
            {davo.matn}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Nima uchun yolg&apos;on deb o&apos;ylaysiz?
        </label>
        <textarea
          value={tushuntirish}
          onChange={(e) => setTushuntirish(e.target.value)}
          rows={3}
          placeholder="Kamida 10 ta belgi yozing…"
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-[#e6e9f0] placeholder-slate-600 focus:border-sky-600 focus:outline-none"
        />
        <p className="text-right text-xs text-slate-600">
          {tushuntirish.trim().length}/10 min
        </p>
      </div>

      <button
        onClick={() => selected && onSubmit(selected, tushuntirish.trim())}
        disabled={!canSubmit}
        className="w-full rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white transition-opacity disabled:opacity-40 hover:bg-sky-500"
      >
        {isSubmitting ? "Tekshirilmoqda…" : "Javob berish"}
      </button>
    </div>
  );
}
