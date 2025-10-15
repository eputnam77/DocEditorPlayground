// pages/api/ai-suggest.ts
type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  status(code: number): ApiResponse;
  json(payload: unknown): ApiResponse;
};

const ZERO_WIDTH_RE = /[\u200B-\u200D\u2060-\u206F\uFEFF]+/g;

function toText(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value instanceof String) return value.toString();
  return null;
}

const handler = async (req: ApiRequest, res: ApiResponse) => {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  if (typeof req.body !== "object" || req.body === null) {
    return res.status(400).json({ error: "No text provided" });
  }

  const { text } = req.body as { text?: unknown };
  const raw = toText(text);
  if (raw === null) {
    return res.status(400).json({ error: "No text provided" });
  }

  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({ error: "No text provided" });
  }

  const visible = trimmed.replace(ZERO_WIDTH_RE, "");
  if (visible.length === 0) {
    return res.status(400).json({ error: "No text provided" });
  }

  // Replace with your LLM call here!
  // For demo, just uppercase
  const suggestion = visible.toUpperCase();

  res.json({ suggestion });
};

export default handler;
