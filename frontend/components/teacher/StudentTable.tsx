"use client";

import type { StudentSummary } from "@/lib/teacher-api";

interface Props {
  students: StudentSummary[];
  onSelect: (id: string) => void;
}

export default function StudentTable({ students, onSelect }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/60 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3">Ism</th>
            <th className="px-4 py-3">Sinf</th>
            <th className="px-4 py-3">Guruh</th>
            <th className="px-4 py-3 text-right">Ball</th>
            <th className="px-4 py-3 text-right">O'yinlar</th>
            <th className="px-4 py-3">Oxirgi o'yin</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr
              key={s.student_id}
              onClick={() => onSelect(s.student_id)}
              className="cursor-pointer border-b border-slate-800/60 transition-colors hover:bg-slate-800/40"
            >
              <td className="px-4 py-3 font-medium text-[#e6e9f0]">{s.ism}</td>
              <td className="px-4 py-3 text-slate-400">{s.sinf}</td>
              <td className="px-4 py-3">
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    s.guruh === "experimental"
                      ? "bg-sky-900/50 text-sky-300"
                      : "bg-slate-800 text-slate-400",
                  ].join(" ")}
                >
                  {s.guruh === "experimental" ? "Eksperimental" : "Nazorat"}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-400">
                {s.jami_ball}
              </td>
              <td className="px-4 py-3 text-right text-slate-400">
                {s.sessiya_soni}
              </td>
              <td className="px-4 py-3 text-slate-500">
                {s.oxirgi_oyin
                  ? new Date(s.oxirgi_oyin).toLocaleDateString("uz-UZ")
                  : "—"}
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-600">
                O'quvchilar topilmadi
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
