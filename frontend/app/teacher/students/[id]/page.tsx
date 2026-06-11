"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import SessionAccordion from "@/components/teacher/SessionAccordion";
import { fetchStudentDetail, type StudentDetail } from "@/lib/teacher-api";

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("bmi_teacher");
    if (!raw) {
      router.replace("/teacher/login");
      return;
    }
    fetchStudentDetail(params.id)
      .then(setDetail)
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Xatolik";
        if (msg.includes("401") || msg.toLowerCase().includes("kirish")) {
          router.replace("/teacher/login");
        } else {
          setError(msg);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  return (
    <main className="min-h-screen bg-[#0b1020]">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <Link
            href="/teacher/dashboard"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-300"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          </div>
        ) : error ? (
          <p className="rounded-lg border border-rose-800 bg-rose-950/50 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        ) : detail ? (
          <div className="space-y-8">
            {/* student header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#e6e9f0]">
                  {detail.student.ism}
                </h1>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-sm text-slate-500">
                    {detail.student.sinf}-sinf
                  </span>
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      detail.student.guruh === "experimental"
                        ? "bg-sky-900/50 text-sky-300"
                        : "bg-slate-800 text-slate-400",
                    ].join(" ")}
                  >
                    {detail.student.guruh === "experimental"
                      ? "Eksperimental"
                      : "Nazorat"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-400">
                  {detail.student.jami_ball}
                </p>
                <p className="text-xs text-slate-500">eng yuqori ball</p>
                <p className="mt-1 text-xs text-slate-600">
                  {detail.student.sessiya_soni} o&apos;yin
                </p>
              </div>
            </div>

            {/* sessions */}
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                O&apos;yin tarixi
              </h2>
              <SessionAccordion sessions={detail.sessiyalar} />
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
