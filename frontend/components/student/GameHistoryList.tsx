"use client";

import { useState } from "react";

import type { GameHistorySummary } from "@/lib/teacher-api";

interface Props {
  history: GameHistorySummary[];
}

function ScoreBadge({ ball, max }: { ball: number; max: number }) {
  const pct = (ball / max) * 100;
  const color =
    pct >= 70
      ? "text-emerald-400"
      : pct >= 40
        ? "text-amber-400"
        : "text-rose-400";
  return <span className={`font-mono font-bold ${color}`}>{ball}</span>;
}

function ScoreBar({ ball, max = 500 }: { ball: number; max?: number }) {
  const pct = Math.min(100, (ball / max) * 100);
  const color =
    pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function GameHistoryList({ history }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  if (history.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-600">
        Hali o'yin o'ynamagansiz
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((game, idx) => (
        <div
          key={game.sessiya_id}
          className="rounded-xl border border-slate-800 bg-slate-900/30"
        >
          <button
            onClick={() => setOpen(open === idx ? null : idx)}
            className="w-full px-5 py-4 text-left"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {new Date(game.boshlangan).toLocaleString("uz-UZ")}
              </span>
              <div className="flex items-center gap-2">
                <ScoreBadge ball={game.jami_ball} max={500} />
                <span className="text-xs text-slate-500">/ 500 ball</span>
                <svg
                  className={`ml-1 h-4 w-4 text-slate-500 transition-transform ${open === idx ? "rotate-180" : ""}`}
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
            </div>
            <ScoreBar ball={game.jami_ball} />
          </button>

          {open === idx && (
            <div className="border-t border-slate-800 px-5 pb-4 pt-3">
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 text-left text-slate-500">
                      <th className="px-3 py-2">Raund</th>
                      <th className="px-3 py-2">Tur</th>
                      <th className="px-3 py-2 text-right">Tanlov</th>
                      <th className="px-3 py-2 text-right">Dalil</th>
                      <th className="px-3 py-2 text-right">Izoh</th>
                      <th className="px-3 py-2 text-right">Jami</th>
                    </tr>
                  </thead>
                  <tbody>
                    {game.raundlar.map((r) => (
                      <tr
                        key={r.tur_raqami}
                        className="border-b border-slate-800/60"
                      >
                        <td className="px-3 py-2 text-slate-500">
                          {r.tur_raqami}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded px-1.5 py-0.5 ${
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
                          {r.tanlov_ball}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {r.dalil_ball}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {r.tushuntirish_ball}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-[#e6e9f0]">
                          {r.jami_ball}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
