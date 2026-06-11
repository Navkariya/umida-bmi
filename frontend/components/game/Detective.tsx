"use client";

import { useState } from "react";

import type { Scenario } from "@/lib/game-api";

interface Props {
  scenario: Scenario;
  tur: number;
  onSubmit: (davo: string, dalillar: string[], tushuntirish: string) => void;
  isSubmitting: boolean;
}

export default function Detective({ scenario, tur, onSubmit, isSubmitting }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedDalillar, setSelectedDalillar] = useState<Set<string>>(new Set());
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
    <div className="space-y-5">
      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold"
        style={{ background: "#fff4de", color: "#ff7139", border: "2px solid #FE8A4F" }}
      >
        🕵️ Raund {tur} / 5 — Dalilchi Detektiv
      </div>

      {/* Question */}
      <div className="rounded-2xl bg-white p-5" style={{ border: "2px solid #e1e1e1" }}>
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
                ? { background: "#fff4de", border: "2px solid #ff7139", color: "#ff7139" }
                : { background: "white", border: "2px solid #e1e1e1", color: "#4b4b4b" }
            }
          >
            <span
              className="mr-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
              style={
                selected === davo.id
                  ? { background: "#ff7139", color: "white" }
                  : { background: "#eaeaea", color: "#6e6e6e" }
              }
            >
              {davo.id}
            </span>
            {davo.matn}
          </button>
        ))}
      </div>

      {/* Evidence */}
      {scenario.mazmun.dalillar && scenario.mazmun.dalillar.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6e6e6e" }}>
            Qo&apos;llab-quvvatlovchi dalillar
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {scenario.mazmun.dalillar.map((dalil) => {
              const active = selectedDalillar.has(dalil.id);
              return (
                <button
                  key={dalil.id}
                  onClick={() => toggleDalil(dalil.id)}
                  className="rounded-xl p-3 text-left text-xs font-semibold transition-all"
                  style={
                    active
                      ? { background: "#fff4de", border: "2px solid #ff7139", color: "#ff7139" }
                      : { background: "white", border: "2px solid #e1e1e1", color: "#6e6e6e" }
                  }
                >
                  <span
                    className="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                    style={
                      active
                        ? { background: "#ff7139", color: "white" }
                        : { background: "#eaeaea", color: "#6e6e6e" }
                    }
                  >
                    {dalil.id}
                  </span>
                  {dalil.matn}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6e6e6e" }}>
          Dalillar asosida izohlaymiz
        </label>
        <textarea
          value={tushuntirish}
          onChange={(e) => setTushuntirish(e.target.value)}
          rows={3}
          placeholder="Kamida 10 ta belgi yozing…"
          className="w-full resize-none rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all"
          style={{ border: "2px solid #e1e1e1", background: "white", color: "#2c2c2c" }}
          onFocus={(e) => { e.target.style.borderColor = "#ff7139"; }}
          onBlur={(e) => { e.target.style.borderColor = "#e1e1e1"; }}
        />
        <p className="text-right text-xs font-semibold" style={{ color: "#b3b3b3" }}>
          {tushuntirish.trim().length}/10 min
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={() =>
          selected && onSubmit(selected, Array.from(selectedDalillar), tushuntirish.trim())
        }
        disabled={!canSubmit}
        className="w-full rounded-xl py-3.5 font-bold text-white transition-transform active:translate-y-1 disabled:opacity-40"
        style={{ background: "#FE8A4F", boxShadow: "0 4px 0 #ff7139" }}
      >
        {isSubmitting ? "Tekshirilmoqda…" : "Javob berish →"}
      </button>
    </div>
  );
}
