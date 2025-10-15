import { describe, it, expect } from "vitest";
import handler from "../../pages/api/ai-suggest";

type MockRes = {
  statusCode: number;
  body: unknown;
  status(code: number): MockRes;
  json(payload: unknown): MockRes;
};

function createResponse(): MockRes {
  return {
    statusCode: 200,
    body: undefined,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
}

describe("api/ai-suggest", () => {
  it("uppercases visible content", async () => {
    const res = createResponse();
    await handler({ method: "POST", body: { text: "  hello  " } } as any, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ suggestion: "HELLO" });
  });

  it("rejects input made only of zero-width characters", async () => {
    const res = createResponse();
    await handler({ method: "POST", body: { text: "\u200B\u200C" } } as any, res);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "No text provided" });
  });
});
