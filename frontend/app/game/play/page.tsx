"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Detective from "@/components/game/Detective";
import LieDetector from "@/components/game/LieDetector";
import ScoreCard from "@/components/game/ScoreCard";
import SocraticPrompt from "@/components/game/SocraticPrompt";
import {
  completeGame,
  fetchScenarios,
  socraticReply,
  submitRound,
  type StudentLoginResponse,
} from "@/lib/game-api";
import { INITIAL_STATE, type GameState, type RoundResult } from "@/lib/game-state";

function ProgressDots({
  current,
  total,
  results,
}: {
  current: number;
  total: number;
  results: RoundResult[];
}) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < results.length;
        const active = i === current;
        return (
          <span
            key={i}
            className={[
              "h-2.5 w-2.5 rounded-full transition-all",
              done ? "bg-emerald-500" : active ? "bg-sky-400 scale-125" : "bg-slate-700",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

export default function GamePlay() {
  const router = useRouter();
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [currentSavol, setCurrentSavol] = useState<string>("");
  const [currentNavbat, setCurrentNavbat] = useState<number>(1);
  const [socraticLoading, setSocraticLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("bmi_student");
    if (!raw) {
      router.replace("/game");
      return;
    }
    const student: StudentLoginResponse = JSON.parse(raw) as StudentLoginResponse;
    setState((s) => ({ ...s, student_id: student.student_id, ism: student.ism, phase: "loading" }));
    fetchScenarios(student.student_id)
      .then((data) => {
        setState((s) => ({
          ...s,
          sessiya_id: data.sessiya_id,
          scenarios: data.stsenariylar,
          phase: "playing",
        }));
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          phase: "login",
          error: "Stsenariylarni yuklashda xatolik.",
        }));
      });
  }, [router]);

  const advanceRound = (results: RoundResult[], sessiya_id: number) => {
    const next = results.length;
    if (next >= 5) {
      completeGame(sessiya_id)
        .then((resp) => {
          setState((s) => ({
            ...s,
            phase: "complete",
            total_ball: resp.jami_ball,
          }));
        })
        .catch(() => {
          setState((s) => ({
            ...s,
            phase: "complete",
            total_ball: results.reduce((acc, r) => acc + r.ball, 0),
          }));
        });
    } else {
      setState((s) => ({ ...s, current_tur: next, phase: "playing" }));
    }
  };

  const handleRoundSubmit = async (
    davo: string,
    dalillar: string[],
    tushuntirish: string,
  ) => {
    if (!state.sessiya_id) return;
    const scenario = state.scenarios[state.current_tur];
    setIsSubmitting(true);
    try {
      const resp = await submitRound({
        sessiya_id: state.sessiya_id,
        stsenariy_id: scenario.stsenariy_id,
        tur_raqami: state.current_tur + 1,
        tanlangan_davo: davo,
        tanlangan_dalillar: dalillar,
        tushuntirish,
      });

      const result: RoundResult = {
        ...resp,
        tur_raqami: state.current_tur + 1,
        stsenariy_id: scenario.stsenariy_id,
      };

      const newResults = [...state.results, result];
      setState((s) => ({ ...s, results: newResults }));

      if (resp.sokrat_kerakmi) {
        setSocraticLoading(true);
        try {
          const sr = await socraticReply({
            stsenariy_tur: scenario.tur_turi,
            game_sessiya_id: state.sessiya_id ?? undefined,
            tur_raqami: state.current_tur + 1,
            student_id: state.student_id,
          });
          setCurrentSavol(sr.savol);
          setCurrentNavbat(sr.navbat);
          setState((s) => ({
            ...s,
            socratic_sessiya_id: sr.sessiya_id,
            phase: "socratic",
          }));
        } finally {
          setSocraticLoading(false);
        }
      } else {
        advanceRound(newResults, state.sessiya_id);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocraticReply = async (javob: string) => {
    if (!state.socratic_sessiya_id) return;
    setSocraticLoading(true);
    try {
      const resp = await socraticReply({
        sessiya_id: state.socratic_sessiya_id,
        javob,
      });
      if (resp.tugadimi) {
        setState((s) => ({ ...s, phase: "socratic" }));
        setCurrentSavol("");
        setCurrentNavbat(resp.navbat);
        // Show done state briefly then advance
        setTimeout(() => {
          advanceRound(state.results, state.sessiya_id!);
        }, 1800);
      } else {
        setCurrentSavol(resp.savol);
        setCurrentNavbat(resp.navbat);
      }
    } finally {
      setSocraticLoading(false);
    }
  };

  const handleSocraticSkip = () => {
    advanceRound(state.results, state.sessiya_id!);
  };

  const handlePlayAgain = () => {
    sessionStorage.removeItem("bmi_student");
    router.push("/game");
  };

  if (state.phase === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          <p className="text-sm text-slate-400">Yuklanmoqda…</p>
        </div>
      </main>
    );
  }

  if (state.phase === "complete") {
    return (
      <main className="mx-auto min-h-screen max-w-lg px-6 py-12">
        <ScoreCard
          ism={state.ism || "Mehmon"}
          total_ball={state.total_ball}
          results={state.results}
          onPlayAgain={handlePlayAgain}
          isStudent={!!state.student_id}
        />
      </main>
    );
  }

  const scenario = state.scenarios[state.current_tur];

  return (
    <main className="mx-auto min-h-screen max-w-lg px-6 py-10">
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{state.ism || "Mehmon"}</span>
          <span>
            {state.results.reduce((a, r) => a + r.ball, 0)} ball
          </span>
        </div>
        <ProgressDots
          current={state.current_tur}
          total={5}
          results={state.results}
        />
      </div>

      {state.error && (
        <p className="mb-4 rounded-lg border border-rose-800 bg-rose-950/50 px-4 py-2 text-sm text-rose-300">
          {state.error}
        </p>
      )}

      {scenario &&
        (scenario.tur_turi === "yolgon_top" ? (
          <LieDetector
            scenario={scenario}
            tur={state.current_tur + 1}
            onSubmit={(davo, tushuntirish) =>
              handleRoundSubmit(davo, [], tushuntirish)
            }
            isSubmitting={isSubmitting}
          />
        ) : (
          <Detective
            scenario={scenario}
            tur={state.current_tur + 1}
            onSubmit={handleRoundSubmit}
            isSubmitting={isSubmitting}
          />
        ))}

      {state.phase === "socratic" && (
        <SocraticPrompt
          savol={currentSavol}
          navbat={currentNavbat}
          tugadimi={currentSavol === ""}
          isLoading={socraticLoading}
          onReply={handleSocraticReply}
          onSkip={handleSocraticSkip}
        />
      )}
    </main>
  );
}
