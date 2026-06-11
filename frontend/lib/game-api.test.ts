import { afterEach, describe, expect, it, vi } from "vitest";

import {
  completeGame,
  fetchScenarios,
  socraticReply,
  studentLogin,
  submitRound,
} from "./game-api";

function mockFetch(ok: boolean, data: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: async () => data,
      text: async () => JSON.stringify(data),
    }),
  );
}

afterEach(() => { vi.restoreAllMocks(); });

describe("studentLogin", () => {
  it("returns parsed payload on success", async () => {
    const payload = { student_id: "abc", ism: "Ali", guruh: "experimental" };
    mockFetch(true, payload);
    const result = await studentLogin("TEST01");
    expect(result).toEqual(payload);
  });

  it("throws on non-2xx", async () => {
    mockFetch(false, { xato: "Topilmadi" }, 404);
    await expect(studentLogin("BAD")).rejects.toThrow(/404/);
  });
});

describe("fetchScenarios", () => {
  it("builds correct URL without student_id", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ sessiya_id: 1, stsenariylar: [] }),
    });
    vi.stubGlobal("fetch", fetchSpy);
    await fetchScenarios();
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/api/game/scenarios/"),
      expect.anything(),
    );
  });

  it("appends student_id query param when provided", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ sessiya_id: 1, stsenariylar: [] }),
    });
    vi.stubGlobal("fetch", fetchSpy);
    await fetchScenarios("student-uuid");
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("student_id=student-uuid"),
      expect.anything(),
    );
  });
});

describe("submitRound", () => {
  it("returns ball fields on success", async () => {
    const payload = {
      ball: 100,
      tanlov_ball: 60,
      dalil_ball: 0,
      tushuntirish_ball: 40,
      togri_javob: "D3",
      ai_izoh: "2/2",
      sokrat_kerakmi: false,
    };
    mockFetch(true, payload);
    const result = await submitRound({
      sessiya_id: 1,
      stsenariy_id: 1,
      tur_raqami: 1,
      tanlangan_davo: "D3",
      tushuntirish: "chunki",
    });
    expect(result.ball).toBe(100);
    expect(result.sokrat_kerakmi).toBe(false);
  });
});

describe("completeGame", () => {
  it("returns jami_ball", async () => {
    mockFetch(true, { jami_ball: 320, sessiya_id: 1 });
    const result = await completeGame(1);
    expect(result.jami_ball).toBe(320);
  });
});

describe("socraticReply", () => {
  it("returns savol and sessiya_id", async () => {
    mockFetch(true, {
      savol: "Nega?",
      tugadimi: false,
      navbat: 1,
      sessiya_id: "uuid-123",
    });
    const result = await socraticReply({ stsenariy_tur: "yolgon_top" });
    expect(result.savol).toBe("Nega?");
    expect(result.sessiya_id).toBe("uuid-123");
  });
});
