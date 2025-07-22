// pages/api/ai-suggest.ts
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  // Replace with your LLM call here!
  // For demo, just uppercase
  const suggestion = text.toUpperCase();

  res.json({ suggestion });
}
