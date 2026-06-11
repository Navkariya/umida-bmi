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
  if (ball < 200) return "#ff505f";
  if (ball < 350) return "#FFA537";
  return "#3fe1b0";
}

function barShadow(ball: number): string {
  if (ball < 200) return "#e02950";
  if (ball < 350) return "#ff7139";
  return "#2bc4a2";
}

function levelLabel(ball: number): string {
  if (ball < 200) return "Boshlang'ich";
  if (ball < 350) return "O'rta";
  return "Yuqori";
}

function levelBg(ball: number): { bg: string; color: string; border: string } {
  if (ball < 200) return { bg: "#ffe0e8", color: "#e02950", border: "#ff505f" };
  if (ball < 350) return { bg: "#ffffdd", color: "#FFA537", border: "#FFBD4F" };
  return { bg: "#e3fff3", color: "#2bc4a2", border: "#3fe1b0" };
}

function calcThinking(results: RoundResult[]) {
  const all = results;
  const detektiv = results.filter((r) => r.tur_raqami >= 3);
  const avg = (vals: number[]) =>
    vals.length === 0 ? 0 : vals.reduce((a, b) => a + b, 0) / vals.length;
  const tanqidiy = Math.round(avg(all.map((r) => (r.tanlov_ball / 60) * 100)));
  const analitik = Math.round(avg(all.map((r) => (r.tushuntirish_ball / r.ball || 0) * 100)));
  const mantiqiy = Math.round(avg(detektiv.map((r) => (r.dalil_ball / 20) * 100)));
  return { tanqidiy, analitik, mantiqiy };
}

interface ThinkingBarProps {
  label: string;
  value: number;
  color: string;
  shadow: string;
}

function ThinkingBar({ label, value, color, shadow }: ThinkingBarProps) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs font-bold">
        <span style={{ color: "#6e6e6e" }}>{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-3 w-full rounded-full" style={{ background: "#eaeaea" }}>
        <div
          className="h-3 rounded-full transition-all"
          style={{
            width: `${Math.min(100, value)}%`,
            background: color,
            boxShadow: `0 2px 0 ${shadow}`,
          }}
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
  const level = levelBg(total_ball);

  return (
    <div className="space-y-5">
      {/* Score hero */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: "white", border: "2px solid #e1e1e1" }}
      >
        <p className="text-sm font-bold" style={{ color: "#8e8e8e" }}>
          {ism}
        </p>
        <p className="mt-1 text-7xl font-extrabold" style={{ color: "#2c2c2c" }}>
          {total_ball}
        </p>
        <p className="text-sm font-semibold" style={{ color: "#b3b3b3" }}>
          / 500 ball
        </p>
        <div
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold"
          style={{ background: level.bg, color: level.color, border: `2px solid ${level.border}` }}
        >
          {total_ball >= 350 ? "🏆" : total_ball >= 200 ? "⭐" : "💪"} {levelLabel(total_ball)}
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="rounded-2xl bg-white p-4"
        style={{ border: "2px solid #e1e1e1" }}
      >
        <div className="mb-2 flex justify-between text-xs font-bold" style={{ color: "#b3b3b3" }}>
          <span>0</span>
          <span>500</span>
        </div>
        <div className="h-4 w-full rounded-full" style={{ background: "#eaeaea" }}>
          <div
            className="h-4 rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: barColor(total_ball),
              boxShadow: `0 2px 0 ${barShadow(total_ball)}`,
            }}
          />
        </div>
      </div>

      {/* Round results */}
      {results.length > 0 && (
        <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "2px solid #e1e1e1" }}>
          <div className="px-4 py-3" style={{ background: "#f5f5f5", borderBottom: "2px solid #e1e1e1" }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6e6e6e" }}>
              Raundlar natijasi
            </p>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid #eaeaea" }}>
                <th className="px-4 py-2.5 text-left font-bold" style={{ color: "#8e8e8e" }}>Raund</th>
                <th className="px-4 py-2.5 text-right font-bold" style={{ color: "#8e8e8e" }}>Tanlov</th>
                <th className="px-4 py-2.5 text-right font-bold" style={{ color: "#8e8e8e" }}>Dalil</th>
                <th className="px-4 py-2.5 text-right font-bold" style={{ color: "#8e8e8e" }}>Izoh</th>
                <th className="px-4 py-2.5 text-right font-bold" style={{ color: "#8e8e8e" }}>Jami</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.tur_raqami} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td className="px-4 py-2.5 font-bold" style={{ color: "#4b4b4b" }}>
                    {r.tur_raqami}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold" style={{ color: "#6e6e6e" }}>
                    {r.tanlov_ball}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold" style={{ color: "#6e6e6e" }}>
                    {r.dalil_ball}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold" style={{ color: "#6e6e6e" }}>
                    {r.tushuntirish_ball}
                  </td>
                  <td className="px-4 py-2.5 text-right font-extrabold" style={{ color: "#2c2c2c" }}>
                    {r.ball}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Thinking profile */}
      <div
        className="rounded-2xl bg-white p-5 space-y-4"
        style={{ border: "2px solid #e1e1e1" }}
      >
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6e6e6e" }}>
          Fikrlash profili
        </p>
        <ThinkingBar label="Tanqidiy fikrlash" value={thinking.tanqidiy} color="#00b3f5" shadow="#0290ee" />
        <ThinkingBar label="Analitik fikrlash" value={thinking.analitik} color="#d64cf1" shadow="#b933e1" />
        <ThinkingBar label="Mantiqiy fikrlash" value={thinking.mantiqiy} color="#FFA537" shadow="#ff7139" />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onPlayAgain}
          className="flex-1 rounded-xl py-3.5 text-sm font-bold transition-transform active:translate-y-0.5"
          style={{ background: "#eaeaea", color: "#4b4b4b", boxShadow: "0 4px 0 #cacaca" }}
        >
          Qayta o&apos;ynash
        </button>
        {isStudent && (
          <Link
            href="/student/history"
            className="flex-1 rounded-xl py-3.5 text-center text-sm font-bold text-white transition-transform active:translate-y-1"
            style={{ background: "#3fe1b0", boxShadow: "0 4px 0 #2bc4a2" }}
          >
            Tarixni ko&apos;rish →
          </Link>
        )}
      </div>
    </div>
  );
}
