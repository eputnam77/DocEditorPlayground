# AI Suggest Workflow

The TipTap page includes an optional **AI Suggest** sidebar that can rewrite selected text. Toggle it on, highlight a phrase, then press **AI Suggest** in the toolbar. The page posts the selection to `/api/ai-suggest` and either inserts the result or lists it in the sidebar.

```
fetch('/api/ai-suggest', { method: 'POST', body: JSON.stringify({ text }) })
```

By default the API simply uppercases the text. Replace `pages/api/ai-suggest.ts` with a call to your language model provider. Create `.env.local` and store your API key there, then load it in the handler, e.g.

```ts
const apiKey = process.env.OPENAI_API_KEY!;
```

Add `OPENAI_API_KEY=your_key` to `.env.local` at the project root.

Prompt the LLM with instructions from the GPO Style Manual or DDH to receive federal writing suggestions.
