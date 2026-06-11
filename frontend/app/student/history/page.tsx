"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import GameHistoryList from "@/components/student/GameHistoryList";
import type { StudentLoginResponse } from "@/lib/game-api";
import { fetchStudentHistory, type GameHistorySummary } from "@/lib/teacher-api";

export default function StudentHistoryPage() {
  const router = useRouter();
  const [ism, setIsm] = useState("");
  const [history, setHistory] = useState<GameHistorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("bmi_student");
    if (!raw) {
      router.replace("/game");
      return;
    }
    const student = JSON.parse(raw) as StudentLoginResponse;
    setIsm(student.ism);

    if (!student.student_id) {
      setLoading(false);
      return;
    }

    fetchStudentHistory(student.student_id)
      .then(setHistory)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Xatolik");
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0b1020]">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#e6e9f0]">{ism}</span>
          </div>
          <Link
            href="/game"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
          >
            O&apos;yin boshlash
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="mb-6 text-xl font-bold text-[#e6e9f0]">O&apos;yin tarixi</h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          </div>
        ) : error ? (
          <p className="rounded-lg border border-rose-800 bg-rose-950/50 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        ) : (
          <GameHistoryList history={history} />
        )}
      </div>
    </main>
  );
}
