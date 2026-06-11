import type { Scenario, SubmitRoundResponse } from "./game-api";

export type GamePhase =
  | "login"
  | "loading"
  | "playing"
  | "round_result"
  | "socratic"
  | "complete";

export interface RoundResult extends SubmitRoundResponse {
  tur_raqami: number;
  stsenariy_id: number;
}

export interface GameState {
  phase: GamePhase;
  student_id: string | null;
  ism: string;
  sessiya_id: number | null;
  scenarios: Scenario[];
  current_tur: number;
  results: RoundResult[];
  socratic_sessiya_id: string | null;
  total_ball: number;
  error: string | null;
}

export const INITIAL_STATE: GameState = {
  phase: "login",
  student_id: null,
  ism: "",
  sessiya_id: null,
  scenarios: [],
  current_tur: 0,
  results: [],
  socratic_sessiya_id: null,
  total_ball: 0,
  error: null,
};
