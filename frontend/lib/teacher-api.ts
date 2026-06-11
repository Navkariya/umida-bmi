import { apiUrl } from "./api";

export interface StudentSummary {
  student_id: string;
  ism: string;
  sinf: string;
  guruh: "experimental" | "control";
  jami_ball: number;
  sessiya_soni: number;
  oxirgi_oyin: string | null;
}

export interface GroupStats {
  experimental: { soni: number; o_rtacha_ball: number; maks_ball: number };
  control: { soni: number; o_rtacha_ball: number; maks_ball: number };
}

export interface RoundSummary {
  tur_raqami: number;
  tur_turi: string;
  tanlov_ball: number;
  dalil_ball: number;
  tushuntirish_ball: number;
  jami_ball: number;
  togri_javob: string;
  ai_izoh: string;
}

export interface SocraticEntry {
  tur_raqami: number;
  transkript: Array<{ rol: string; matn: string }>;
  navbat_soni: number;
  tugagan: boolean;
}

export interface SessionDetail {
  sessiya_id: number;
  boshlangan: string;
  jami_ball: number;
  raundlar: RoundSummary[];
  sokrat: SocraticEntry[];
}

export interface StudentDetail {
  student: StudentSummary;
  sessiyalar: SessionDetail[];
}

export interface GameHistorySummary {
  sessiya_id: number;
  boshlangan: string;
  holat: string;
  jami_ball: number;
  raundlar: Array<{
    tur_raqami: number;
    tur_turi: string;
    jami_ball: number;
    tanlov_ball: number;
    dalil_ball: number;
    tushuntirish_ball: number;
  }>;
}

async function teacherFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as Record<string, string>).xato ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function teacherLogin(
  username: string,
  password: string,
): Promise<{ ok: boolean; username: string }> {
  return teacherFetch("/api/teacher/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function teacherLogout(): Promise<void> {
  await teacherFetch("/api/teacher/logout/", { method: "POST" });
}

export async function fetchStudentList(): Promise<StudentSummary[]> {
  return teacherFetch("/api/teacher/students/");
}

export async function fetchGroupStats(): Promise<GroupStats> {
  return teacherFetch("/api/teacher/groups/");
}

export async function fetchStudentDetail(id: string): Promise<StudentDetail> {
  return teacherFetch(`/api/teacher/students/${id}/`);
}

export async function fetchStudentHistory(
  student_id: string,
): Promise<GameHistorySummary[]> {
  return teacherFetch(`/api/students/${student_id}/history/`);
}
