"use client";

import { useState } from "react";

import type { SessionDetail } from "@/lib/teacher-api";

interface Props {
  sessions: SessionDetail[];
}

function ScoreBadge({ ball, max = 100 }: { ball: number; max?: number }) {
  const pct = (ball / max) * 100;
  const color =
    pct >= 70
      ? "text-emerald-400"
      : pct >= 40
        ? "text-amber-400"
        : "text-rose-400";
  return <span className={`font-mono font-semibold ${color}`}>{ball}</span>;
}

export default function SessionAccordion({ sessions }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  if (sessions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-600">
        Hali o'yin o'ynamagan
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session, idx) => (
        <div
          key={session.sessiya_id}
          className="rounded-xl border border-slate-800 bg-slate-900/30"
        >
          <button
            onClick={() => setOpen(open === idx ? null : idx)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500">
                {new Date(session.boshlangan).toLocaleString("uz-UZ")}
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                {session.raundlar.length} raund
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ScoreBadge ball={session.jami_ball} max={500} />
              <span className="text-xs text-slate-500">/ 500</span>
              <svg
                className={`h-4 w-4 text-slate-500 transition-transform ${open === idx ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {open === idx && (
            <div className="border-t border-slate-800 px-5 pb-5 pt-4">
              {/* Rounds table */}
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Raundlar
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 text-left text-slate-500">
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Tur</th>
                      <th className="px-3 py-2 text-right">Tanlov</th>
                      <th className="px-3 py-2 text-right">Dalil</th>
                      <th className="px-3 py-2 text-right">Izoh</th>
                      <th className="px-3 py-2 text-right">Jami</th>
                    </tr>
                  </thead>
                  <tbody>
                    {session.raundlar.map((r) => (
                      <tr
                        key={r.tur_raqami}
                        className="border-b border-slate-800/60"
                      >
                        <td className="px-3 py-2 text-slate-500">
                          {r.tur_raqami}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded px-1.5 py-0.5 text-xs ${
                              r.tur_turi === "yolgon_top"
                                ? "bg-sky-900/40 text-sky-300"
                                : "bg-amber-900/40 text-amber-300"
                            }`}
                          >
                            {r.tur_turi === "yolgon_top"
                              ? "Yolg'onni top"
                              : "Detektiv"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <ScoreBadge ball={r.tanlov_ball} max={60} />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <ScoreBadge ball={r.dalil_ball} max={20} />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <ScoreBadge ball={r.tushuntirish_ball} max={40} />
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-[#e6e9f0]">
                          {r.jami_ball}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Socratic transcripts */}
              {session.sokrat.length > 0 && (
                <div className="mt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Sokrat suhbatlari
                  </p>
                  <div className="space-y-2">
                    {session.sokrat.map((ss) => (
                      <div
                        key={ss.tur_raqami}
                        className="rounded-lg border border-slate-800 bg-slate-900/20 p-3"
                      >
                        <p className="mb-2 text-xs text-slate-600">
                          Raund {ss.tur_raqami} · {ss.navbat_soni} navbat
                        </p>
                        <div className="space-y-1">
                          {ss.transkript.map((t, i) => (
                            <div
                              key={i}
                              className={`text-xs ${
                                t.rol === "o'qituvchi"
                                  ? "text-sky-400"
                                  : "text-slate-300"
                              }`}
                            >
                              <span className="mr-1 font-semibold capitalize">
                                {t.rol === "o'qituvchi" ? "AI" : "O'quvchi"}:
                              </span>
                              {t.matn}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
