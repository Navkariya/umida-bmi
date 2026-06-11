"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import GroupStatsPanel from "@/components/teacher/GroupStats";
import StudentTable from "@/components/teacher/StudentTable";
import {
  fetchGroupStats,
  fetchStudentList,
  teacherLogout,
  type GroupStats,
  type StudentSummary,
} from "@/lib/teacher-api";

export default function TeacherDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [stats, setStats] = useState<GroupStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("bmi_teacher");
    if (!raw) {
      router.replace("/teacher/login");
      return;
    }
    const teacher = JSON.parse(raw) as { username: string };
    setUsername(teacher.username);

    Promise.all([fetchStudentList(), fetchGroupStats()])
      .then(([list, groupStats]) => {
        setStudents(list);
        setStats(groupStats);
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Xatolik";
        if (msg.includes("401") || msg.toLowerCase().includes("kirish")) {
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

  return (
    <main className="min-h-screen bg-[#0b1020]">
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
