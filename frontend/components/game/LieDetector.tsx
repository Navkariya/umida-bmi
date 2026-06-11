"use client";

import { useState } from "react";

import type { Scenario } from "@/lib/game-api";

interface Props {
  scenario: Scenario;
  tur: number;
  onSubmit: (davo: string, tushuntirish: string) => void;
  isSubmitting: boolean;
}

export default function LieDetector({ scenario, tur, onSubmit, isSubmitting }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [tushuntirish, setTushuntirish] = useState("");

  const canSubmit = !isSubmitting && selected !== null && tushuntirish.trim().length >= 10;

  return (
    <div className="space-y-5">
      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold"
        style={{ background: "#ebfcff", color: "#0290ee", border: "2px solid #00b3f5" }}
      >
        🔍 Raund {tur} / 5 — Yolg&apos;onni top
      </div>

      {/* Question */}
      <div
        className="rounded-2xl bg-white p-5"
        style={{ border: "2px solid #e1e1e1" }}
      >
        <p className="text-base font-bold leading-relaxed" style={{ color: "#2c2c2c" }}>
          {scenario.mazmun.savol}
        </p>
      </div>

      {/* Choices */}
      <div className="space-y-2.5">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6e6e6e" }}>
          Qaysi da&apos;vo yolg&apos;on?
        </p>
        {scenario.mazmun.davolar.map((davo) => (
          <button
            key={davo.id}
            onClick={() => setSelected(davo.id)}
            className="w-full rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition-all"
            style={
              selected === davo.id
                ? { background: "#ebfcff", border: "2px solid #0290ee", color: "#0290ee" }
                : { background: "white", border: "2px solid #e1e1e1", color: "#4b4b4b" }
            }
          >
            <span
              className="mr-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
              style={
                selected === davo.id
                  ? { background: "#0290ee", color: "white" }
                  : { background: "#eaeaea", color: "#6e6e6e" }
              }
            >
              {davo.id}
            </span>
            {davo.matn}
          </button>
        ))}
      </div>

      {/* Explanation */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6e6e6e" }}>
          Nima uchun yolg&apos;on deb o&apos;ylaysiz?
        </label>
        <textarea
          value={tushuntirish}
          onChange={(e) => setTushuntirish(e.target.value)}
          rows={3}
          placeholder="Kamida 10 ta belgi yozing…"
          className="w-full resize-none rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all"
          style={{
            border: "2px solid #e1e1e1",
            background: "white",
            color: "#2c2c2c",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#00b3f5"; }}
          onBlur={(e) => { e.target.style.borderColor = "#e1e1e1"; }}
        />
        <p className="text-right text-xs font-semibold" style={{ color: "#b3b3b3" }}>
          {tushuntirish.trim().length}/10 min
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={() => selected && onSubmit(selected, tushuntirish.trim())}
        disabled={!canSubmit}
        className="w-full rounded-xl py-3.5 font-bold text-white transition-transform active:translate-y-1 disabled:opacity-40"
        style={{ background: "#00b3f5", boxShadow: "0 4px 0 #0290ee" }}
      >
        {isSubmitting ? "Tekshirilmoqda…" : "Javob berish →"}
      </button>
    </div>
  );
}
