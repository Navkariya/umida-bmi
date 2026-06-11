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
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.4)" }}>
        <div
          className="w-full max-w-lg rounded-2xl bg-white p-6"
          style={{ border: "2px solid #e1e1e1", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
        >
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold"
            style={{ background: "#e3fff3", color: "#2bc4a2", border: "2px solid #3fe1b0" }}
          >
            ✅ Sokrat suhbati tugadi
          </div>
          <p className="mb-6 text-sm font-semibold" style={{ color: "#4b4b4b" }}>
            Siz o&apos;z fikringizni chuqurroq o&apos;yladingiz. Ajoyib!
          </p>
          <button
            onClick={onSkip}
            className="w-full rounded-xl py-3.5 font-bold text-white transition-transform active:translate-y-1"
            style={{ background: "#3fe1b0", boxShadow: "0 4px 0 #2bc4a2" }}
          >
            Davom etish →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white"
        style={{ border: "2px solid #e1e1e1", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
      >
        {/* Header strip */}
        <div
          className="flex items-center gap-3 rounded-t-2xl px-5 py-4"
          style={{ background: "#f7e3ff", borderBottom: "2px solid #d64cf1" }}
        >
          <span className="text-xl">💬</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#b933e1" }}>
              Sokrat savoli {navbat}
            </p>
            <p className="text-sm font-bold" style={{ color: "#2c2c2c" }}>
              {savol}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <textarea
            value={javob}
            onChange={(e) => setJavob(e.target.value)}
            rows={3}
            placeholder="Fikringizni yozing…"
            className="w-full resize-none rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all"
            style={{ border: "2px solid #e1e1e1", background: "#fafafa", color: "#2c2c2c" }}
            onFocus={(e) => { e.target.style.borderColor = "#d64cf1"; e.target.style.background = "#fff"; }}
            onBlur={(e) => { e.target.style.borderColor = "#e1e1e1"; e.target.style.background = "#fafafa"; }}
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
              className="flex-1 rounded-xl py-3 text-sm font-bold text-white transition-transform active:translate-y-1 disabled:opacity-40"
              style={{ background: "#d64cf1", boxShadow: "0 4px 0 #b933e1" }}
            >
              {isLoading ? "Yuborilmoqda…" : "Javob berish →"}
            </button>
            <button
              onClick={onSkip}
              disabled={isLoading}
              className="rounded-xl px-4 py-3 text-sm font-bold transition-transform active:translate-y-0.5 disabled:opacity-40"
              style={{
                background: "#eaeaea",
                color: "#6e6e6e",
                boxShadow: "0 4px 0 #cacaca",
              }}
            >
              O&apos;tkazish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
