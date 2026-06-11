"use client";

import Link from "next/link";

import type { RoundResult } from "@/lib/game-state";

interface Props {
  ism: string;
  total_ball: number;
  results: RoundResult[];
  onPlayAgain: () => void;
  isStudent?: boolean;
}

function barColor(ball: number): string {
  if (ball < 200) return "bg-rose-500";
  if (ball < 350) return "bg-amber-500";
  return "bg-emerald-500";
}

function levelLabel(ball: number): string {
  if (ball < 200) return "Boshlang'ich";
  if (ball < 350) return "O'rta";
  return "Yuqori";
}

function calcThinking(results: RoundResult[]) {
  const all = results;
  const detektiv = results.filter((r) => r.tur_raqami >= 3);

  const avg = (vals: number[]) =>
    vals.length === 0 ? 0 : vals.reduce((a, b) => a + b, 0) / vals.length;

  const tanqidiy = Math.round(avg(all.map((r) => (r.tanlov_ball / 60) * 100)));
  const analitik = Math.round(
    avg(all.map((r) => (r.tushuntirish_ball / r.ball || 0) * 100)),
  );
  const mantiqiy = Math.round(
    avg(detektiv.map((r) => (r.dalil_ball / 20) * 100)),
  );

  return { tanqidiy, analitik, mantiqiy };
}

interface ThinkingBarProps {
  label: string;
  value: number;
  color: string;
}

function ThinkingBar({ label, value, color }: ThinkingBarProps) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono text-slate-300">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800">
        <div
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

export default function ScoreCard({
  ism,
  total_ball,
  results,
  onPlayAgain,
  isStudent = false,
}: Props) {
  const pct = Math.round((total_ball / 500) * 100);
  const thinking = calcThinking(results);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-slate-400">{ism}</p>
        <p className="mt-1 text-6xl font-bold text-[#e6e9f0]">{total_ball}</p>
        <p className="mt-1 text-slate-500">/ 500 ball</p>
        <p
          className={`mt-2 text-sm font-semibold ${barColor(total_ball).replace("bg-", "text-")}`}
        >
          {levelLabel(total_ball)}
        </p>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>0</span>
          <span>500</span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-800">
          <div
            className={`h-3 rounded-full transition-all ${barColor(total_ball)}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {results.length > 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/60">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-500">
                <th className="px-4 py-2 text-left">Raund</th>
                <th className="px-4 py-2 text-right">Tanlov</th>
                <th className="px-4 py-2 text-right">Dalil</th>
                <th className="px-4 py-2 text-right">Izoh</th>
                <th className="px-4 py-2 text-right">Jami</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr
                  key={r.tur_raqami}
                  className="border-b border-slate-800 last:border-0"
                >
                  <td className="px-4 py-2 text-slate-400">{r.tur_raqami}</td>
                  <td className="px-4 py-2 text-right text-slate-300">
                    {r.tanlov_ball}
                  </td>
                  <td className="px-4 py-2 text-right text-slate-300">
                    {r.dalil_ball}
                  </td>
                  <td className="px-4 py-2 text-right text-slate-300">
                    {r.tushuntirish_ball}
                  </td>
                  <td className="px-4 py-2 text-right font-semibold text-[#e6e9f0]">
                    {r.ball}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Fikrlash profili
        </p>
        <ThinkingBar
          label="Tanqidiy fikrlash"
          value={thinking.tanqidiy}
          color="bg-sky-500"
        />
        <ThinkingBar
          label="Analitik fikrlash"
          value={thinking.analitik}
          color="bg-purple-500"
        />
        <ThinkingBar
          label="Mantiqiy fikrlash"
          value={thinking.mantiqiy}
          color="bg-amber-500"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onPlayAgain}
          className="flex-1 rounded-lg border border-slate-700 px-6 py-3 text-sm text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
        >
          Qayta o&apos;ynash
        </button>
        {isStudent && (
          <Link
            href="/student/history"
            className="flex-1 rounded-lg border border-sky-800 px-6 py-3 text-center text-sm text-sky-400 transition-colors hover:border-sky-600 hover:text-sky-300"
          >
            Tarixni ko&apos;rish
          </Link>
        )}
      </div>
    </div>
  );
}
