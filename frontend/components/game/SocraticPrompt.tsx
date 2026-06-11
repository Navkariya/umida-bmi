"use client";

import { useState } from "react";

interface Props {
  savol: string;
  navbat: number;
  tugadimi: boolean;
  isLoading: boolean;
  onReply: (javob: string) => void;
  onSkip: () => void;
}

export default function SocraticPrompt({
  savol,
  navbat,
  tugadimi,
  isLoading,
  onReply,
  onSkip,
}: Props) {
  const [javob, setJavob] = useState("");

  if (tugadimi) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0b1020] p-6 shadow-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Sokrat suhbati tugadi
          </p>
          <p className="mb-6 text-slate-300">
            Siz o&apos;z fikringizni chuqurroq o&apos;yladingiz. Ajoyib!
          </p>
          <button
            onClick={onSkip}
            className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500"
          >
            Davom etish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0b1020] p-6 shadow-2xl">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-purple-400">
          Sokrat savoli {navbat}
        </p>
        <p className="mb-4 text-base font-medium text-[#e6e9f0]">{savol}</p>

        <textarea
          value={javob}
          onChange={(e) => setJavob(e.target.value)}
          rows={3}
          placeholder="Fikringizni yozing…"
          className="mb-4 w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-[#e6e9f0] placeholder-slate-600 focus:border-purple-600 focus:outline-none"
        />

        <div className="flex gap-3">
          <button
            onClick={() => {
              if (javob.trim()) {
                onReply(javob.trim());
                setJavob("");
              }
            }}
            disabled={isLoading || javob.trim().length === 0}
            className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40 hover:bg-purple-500"
          >
            {isLoading ? "Yuborilmoqda…" : "Javob berish"}
          </button>
          <button
            onClick={onSkip}
            disabled={isLoading}
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-300"
          >
            O&apos;tkazib yuborish
          </button>
        </div>
      </div>
    </div>
  );
}
