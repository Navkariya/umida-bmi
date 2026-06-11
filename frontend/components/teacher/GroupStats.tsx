"use client";

import type { GroupStats } from "@/lib/teacher-api";

interface Props {
  stats: GroupStats;
}

function StatCard({
  title,
  guruh,
  data,
}: {
  title: string;
  guruh: "experimental" | "control";
  data: { soni: number; o_rtacha_ball: number; maks_ball: number };
}) {
  return (
    <div
      className={[
        "rounded-xl border p-5",
        guruh === "experimental"
          ? "border-sky-800/60 bg-sky-950/20"
          : "border-slate-700 bg-slate-900/40",
      ].join(" ")}
    >
      <p
        className={[
          "mb-4 text-xs font-semibold uppercase tracking-wider",
          guruh === "experimental" ? "text-sky-400" : "text-slate-400",
        ].join(" ")}
      >
        {title}
      </p>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-2xl font-bold text-[#e6e9f0]">{data.soni}</p>
          <p className="text-xs text-slate-500">o'quvchi</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-emerald-400">
            {data.o_rtacha_ball}
          </p>
          <p className="text-xs text-slate-500">o'rtacha ball</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-amber-400">{data.maks_ball}</p>
          <p className="text-xs text-slate-500">eng yuqori</p>
        </div>
      </div>
    </div>
  );
}

export default function GroupStatsPanel({ stats }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatCard
        title="Eksperimental guruh"
        guruh="experimental"
        data={stats.experimental}
      />
      <StatCard
        title="Nazorat guruh"
        guruh="control"
        data={stats.control}
      />
    </div>
  );
}
