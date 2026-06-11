"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { teacherLogin } from "@/lib/teacher-api";

export default function TeacherLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await teacherLogin(username.trim(), password);
      sessionStorage.setItem("bmi_teacher", JSON.stringify({ username: data.username }));
      router.push("/teacher/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1020] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            BMI demo
          </p>
          <h1 className="text-2xl font-bold text-[#e6e9f0]">Ustoz paneli</h1>
          <p className="mt-1 text-sm text-slate-500">
            Faqat o&apos;qituvchilar uchun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Login
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="username"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-[#e6e9f0] placeholder-slate-600 focus:border-sky-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Parol
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-[#e6e9f0] placeholder-slate-600 focus:border-sky-600 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-rose-800 bg-rose-950/50 px-4 py-2 text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white transition-opacity disabled:opacity-40 hover:bg-sky-500"
          >
            {loading ? "Kirilmoqda…" : "Kirish"}
          </button>
        </form>
      </div>
    </main>
  );
}
