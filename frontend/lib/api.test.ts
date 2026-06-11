import { afterEach, describe, expect, it, vi } from "vitest";

import { apiBaseUrl, apiUrl, fetchHealth } from "./api";

describe("apiBaseUrl", () => {
  it("defaults to localhost when env is unset", () => {
    expect(apiBaseUrl()).toBe("http://localhost:8000");
  });
});

describe("apiUrl", () => {
  it("joins base and an absolute path", () => {
    expect(apiUrl("/api/health/")).toBe("http://localhost:8000/api/health/");
  });

  it("adds a leading slash when missing", () => {
    expect(apiUrl("api/health/")).toBe("http://localhost:8000/api/health/");
  });
});

describe("fetchHealth", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns parsed JSON on a 2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: "ok", service: "bmi-backend", version: "0.1.0" }),
      }),
    );

    const data = await fetchHealth();

    expect(data).toEqual({ status: "ok", service: "bmi-backend", version: "0.1.0" });
  });

  it("throws on a non-2xx response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    await expect(fetchHealth()).rejects.toThrow(/500/);
  });
});
