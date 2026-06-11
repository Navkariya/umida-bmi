"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import GroupStatsPanel from "@/components/teacher/GroupStats";
import StudentTable from "@/components/teacher/StudentTable";
import {
  createFan,
  fetchFanStats,
  fetchGroupStats,
  fetchStudentList,
  teacherLogout,
  type FanStat,
  type GroupStats,
  type StudentSummary,
} from "@/lib/teacher-api";

const RANG_PRESETS = [
  "#0290ee",
  "#3fe1b0",
  "#FFA537",
  "#d64cf1",
  "#ff7139",
  "#e02950",
];

function FanModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (fan: FanStat) => void;
}) {
  const [nom, setNom] = useState("");
  const [emoji, setEmoji] = useState("");
  const [rang, setRang] = useState(RANG_PRESETS[0]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSave = async () => {
    if (!nom.trim()) { setErr("Fan nomini kiriting"); return; }
    setSaving(true);
    setErr(null);
    try {
      const created = await createFan({ nom: nom.trim(), emoji: emoji.trim(), rang });
      onCreated({ ...created, sessiya_soni: 0, o_rtacha_ball: 0 });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Xatolik");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h2 className="mb-5 text-base font-bold text-slate-100">Yangi fan qo&apos;shish</h2>

        <div className="space-y-4">
          {/* nom */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Fan nomi
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Masalan: Fizika"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm font-medium text-slate-200 outline-none transition-colors focus:border-sky-500"
            />
          </div>

          {/* emoji */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Emoji (ixtiyoriy)
            </label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="⚡"
              maxLength={4}
              className="w-20 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-center text-lg outline-none transition-colors focus:border-sky-500"
            />
          </div>

          {/* rang */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Rang
            </label>
            <div className="flex flex-wrap gap-2">
              {RANG_PRESETS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRang(r)}
                  className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    background: r,
                    borderColor: rang === r ? "white" : "transparent",
                    boxShadow: rang === r ? `0 0 0 2px ${r}` : "none",
                  }}
                />
              ))}
              <input
                type="color"
                value={rang}
                onChange={(e) => setRang(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded-full border-0 bg-transparent p-0"
                title="Boshqa rang"
              />
            </div>
          </div>

          {/* preview */}
          <div
            className="flex items-center gap-3 rounded-xl border p-3"
            style={{ borderColor: rang, background: `${rang}15` }}
          >
            <span className="text-2xl">{emoji || "📌"}</span>
            <span className="font-bold" style={{ color: rang }}>
              {nom || "Fan nomi"}
            </span>
          </div>

          {err && (
            <p className="rounded-lg border border-rose-800 bg-rose-950/50 px-3 py-2 text-xs text-rose-300">
              {err}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:text-slate-200"
            >
              Bekor
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !nom.trim()}
              className="flex-1 rounded-lg py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-40"
              style={{ background: rang }}
            >
              {saving ? "Saqlanmoqda…" : "Qo'shish →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [stats, setStats] = useState<GroupStats | null>(null);
  const [fanStats, setFanStats] = useState<FanStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFanModal, setShowFanModal] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("bmi_teacher");
    if (!raw) {
      router.replace("/teacher/login");
      return;
    }
    const teacher = JSON.parse(raw) as { username: string };
    setUsername(teacher.username);

    const isAuthError = (e: unknown) => {
      const msg = (e instanceof Error ? e.message : String(e)).toLowerCase();
      return msg.includes("401") || msg.includes("kirish");
    };

    Promise.all([
      fetchStudentList().catch((e) => { if (isAuthError(e)) throw e; return [] as typeof students; }),
      fetchGroupStats().catch((e) => { if (isAuthError(e)) throw e; return null; }),
      fetchFanStats().catch((e) => { if (isAuthError(e)) throw e; return [] as FanStat[]; }),
    ])
      .then(([list, groupStats, fans]) => {
        setStudents(list);
        setStats(groupStats);
        setFanStats(fans ?? []);
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Xatolik";
        if (isAuthError(err)) {
          router.replace("/teacher/login");
        } else {
          setError(msg);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await teacherLogout();
    } finally {
      sessionStorage.removeItem("bmi_teacher");
      router.push("/teacher/login");
    }
  };

  const handleFanCreated = (fan: FanStat) => {
    setFanStats((prev) => [...prev, fan]);
    setShowFanModal(false);
  };

  return (
    <main className="min-h-screen bg-[#0b1020]">
      {showFanModal && (
        <FanModal onClose={() => setShowFanModal(false)} onCreated={handleFanCreated} />
      )}

      {/* header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-sky-800 bg-sky-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-400">
              Ustoz paneli
            </span>
            <span className="text-sm text-slate-500">{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-300"
          >
            Chiqish
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
        {error && (
          <p className="rounded-lg border border-rose-800 bg-rose-950/50 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* group stats */}
            {stats && (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Guruh tahlili
                </h2>
                <GroupStatsPanel stats={stats} />
              </section>
            )}

            {/* fan stats */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Fanlar ({fanStats.length} ta)
                </h2>
                <button
                  onClick={() => setShowFanModal(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-sky-800 bg-sky-950/40 px-3 py-1.5 text-xs font-bold text-sky-400 transition-colors hover:border-sky-600 hover:text-sky-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Yangi fan
                </button>
              </div>

              {fanStats.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 py-10 text-center">
                  <p className="text-sm text-slate-500">Hech qanday fan yo&apos;q</p>
                  <button
                    onClick={() => setShowFanModal(true)}
                    className="mt-3 text-xs font-semibold text-sky-400 hover:text-sky-300"
                  >
                    + Birinchi fanni qo&apos;shish
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {fanStats.map((f) => (
                    <div
                      key={f.fan_id}
                      className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-xl">{f.emoji}</span>
                        <span className="text-sm font-bold text-slate-200">{f.nom}</span>
                        <span
                          className="ml-auto h-2.5 w-2.5 rounded-full"
                          style={{ background: f.rang }}
                        />
                      </div>
                      <div className="flex gap-4 text-xs">
                        <div>
                          <p className="text-slate-500">Sessiyalar</p>
                          <p className="text-lg font-extrabold text-slate-200">{f.sessiya_soni}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">O&apos;rtacha ball</p>
                          <p
                            className="text-lg font-extrabold"
                            style={{ color: f.sessiya_soni > 0 ? f.rang : "#475569" }}
                          >
                            {f.sessiya_soni > 0 ? f.o_rtacha_ball : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* student table */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  O&apos;quvchilar
                </h2>
                <span className="text-xs text-slate-600">
                  {students.length} ta
                </span>
              </div>
              <StudentTable
                students={students}
                onSelect={(id) => router.push(`/teacher/students/${id}`)}
              />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
