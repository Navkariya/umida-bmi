import { apiUrl } from "./api";

export interface StudentLoginResponse {
  student_id: string | null;
  ism: string;
  guruh: string | null;
}

export interface Davo {
  id: string;
  matn: string;
}

export interface Dalil {
  id: string;
  matn: string;
}

export interface ScenarioMazmun {
  savol: string;
  davolar: Davo[];
  togri_javob: string;
  dalillar?: Dalil[];
  togri_dalillar?: string[];
  tushuntirish_rubriki: { kalit_sozlar: string[]; maks: number };
  baho: { togri_tanlov: number; togri_dalil?: number; tushuntirish: number };
  izoh: string;
}

export interface Scenario {
  stsenariy_id: number;
  tur: number;
  tur_turi: "yolgon_top" | "detektiv";
  mazmun: ScenarioMazmun;
}

export interface ScenariosResponse {
  sessiya_id: number;
  stsenariylar: Scenario[];
}

export interface SubmitRoundBody {
  sessiya_id: number;
  stsenariy_id: number;
  tur_raqami: number;
  tanlangan_davo: string;
  tanlangan_dalillar?: string[];
  tushuntirish: string;
}

export interface SubmitRoundResponse {
  ball: number;
  tanlov_ball: number;
  dalil_ball: number;
  tushuntirish_ball: number;
  togri_javob: string;
  ai_izoh: string;
  sokrat_kerakmi: boolean;
}

export interface CompleteGameResponse {
  jami_ball: number;
  sessiya_id: number;
}

export interface SocraticReplyBody {
  sessiya_id?: string;
  javob?: string;
  stsenariy_tur?: string;
  game_sessiya_id?: number;
  tur_raqami?: number;
  student_id?: string | null;
}

export interface SocraticReplyResponse {
  savol: string;
  tugadimi: boolean;
  navbat: number;
  sessiya_id: string;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`${response.status}: ${text}`);
  }
  return (await response.json()) as T;
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(apiUrl(path), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }
  return (await response.json()) as T;
}

export function studentLogin(
  kirish_kodi: string,
): Promise<StudentLoginResponse> {
  return post<StudentLoginResponse>("/api/students/login/", { kirish_kodi });
}

export interface Fan {
  fan_id: number;
  nom: string;
  emoji: string;
  rang: string;
}

export function fetchFanlar(): Promise<Fan[]> {
  return get<Fan[]>("/api/game/fanlar/");
}

export function fetchScenarios(
  student_id?: string | null,
  fan_id?: number | null,
): Promise<ScenariosResponse> {
  const params = new URLSearchParams();
  if (student_id) params.set("student_id", student_id);
  if (fan_id) params.set("fan_id", String(fan_id));
  const qs = params.toString() ? `?${params.toString()}` : "";
  return get<ScenariosResponse>(`/api/game/scenarios/${qs}`);
}

export function submitRound(
  body: SubmitRoundBody,
): Promise<SubmitRoundResponse> {
  return post<SubmitRoundResponse>("/api/game/submit/", body);
}

export function completeGame(
  sessiya_id: number,
): Promise<CompleteGameResponse> {
  return post<CompleteGameResponse>("/api/game/complete/", { sessiya_id });
}

export function socraticReply(
  body: SocraticReplyBody,
): Promise<SocraticReplyResponse> {
  return post<SocraticReplyResponse>("/api/socratic/reply/", body);
}
