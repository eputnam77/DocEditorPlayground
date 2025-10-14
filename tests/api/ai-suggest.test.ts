import { describe, it, expect } from "vitest";
import handler from "../../pages/api/ai-suggest";

interface MockResponse {
  statusCode: number;
  jsonBody: any;
  status(code: number): MockResponse;
  json(payload: any): MockResponse;
}

function createResponse(): MockResponse {
  const res: MockResponse = {
    statusCode: 200,
    jsonBody: undefined,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: any) {
      res.jsonBody = payload;
      return res;
    },
  };
  return res;
}

describe("api/ai-suggest", () => {
  it("returns 400 for missing or non-string text", async () => {
    const res = createResponse();
    await handler({ method: "POST", body: null } as any, res as any);
    expect(res.statusCode).toBe(400);
    expect(res.jsonBody).toEqual({ error: "No text provided" });

    const res2 = createResponse();
    await handler({ method: "POST", body: { text: 123 } } as any, res2 as any);
    expect(res2.statusCode).toBe(400);
    expect(res2.jsonBody).toEqual({ error: "No text provided" });
  });

  it("uppercases valid text input", async () => {
    const res = createResponse();
    await handler({ method: "POST", body: { text: " hello " } } as any, res as any);
    expect(res.statusCode).toBe(200);
    expect(res.jsonBody).toEqual({ suggestion: "HELLO" });
  });
});
