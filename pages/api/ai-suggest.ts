// pages/api/ai-suggest.ts
type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  status(code: number): ApiResponse;
  json(payload: unknown): ApiResponse;
};

const handler = async (req: ApiRequest, res: ApiResponse) => {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  if (typeof req.body !== "object" || req.body === null) {
    return res.status(400).json({ error: "No text provided" });
  }

  const { text } = req.body as { text?: unknown };
  if (typeof text !== "string") {
    return res.status(400).json({ error: "No text provided" });
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({ error: "No text provided" });
  }

  // Replace with your LLM call here!
  // For demo, just uppercase
  const suggestion = trimmed.toUpperCase();

  res.json({ suggestion });
};

export default handler;
