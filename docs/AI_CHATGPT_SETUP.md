# Using an LLM in the Allien AI Assistant

For the **LLM-first design** (system prompt, no case-by-case logic in frontend), see [AI Assistant Design](ai-assistant-design.md).

The assistant can use an LLM when you connect it. **Order of use:** (1) **Gemini** (if key set, no backend), (2) **ChatGPT** (proxy or API key), (3) Wikipedia for factual questions, (4) built‑in answers.

## Option 0: Gemini (no backend)

Runs entirely in the browser. You pass the **system prompt** and **full conversation history** to Gemini so the model has “memory.”

1. Get a [Google AI (Gemini) API key](https://aistudio.google.com/apikey).
2. In `.env` add:
   ```
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```
   Optional: `VITE_GEMINI_MODEL=gemini-2.0-flash` (default).
3. Restart the app (`npm run dev`). The AI assistant will call Gemini first when the key is set.

**Note:** The API key is sent from the browser. Fine for local/dev; for production you may want a small backend proxy.

## Option 1: Local proxy (recommended)

This keeps your API key on your machine and avoids CORS.

1. Get an [OpenAI API key](https://platform.openai.com/api-keys).
2. From the project root, run:
   ```bash
   OPENAI_API_KEY=sk-your-key node api-proxy/server.js
   ```
   Leave this terminal open.
3. Create a `.env` file in the project root (if you don’t have one):
   ```
   VITE_AI_PROXY_URL=http://localhost:3001/chat
   ```
4. Restart the app (`npm run dev`). The AI assistant will send messages through the proxy to ChatGPT.

## Option 2: Direct API key (may not work in the browser)

OpenAI’s API often blocks direct requests from the browser (CORS). If you still want to try:

1. In `.env` add:
   ```
   VITE_OPENAI_API_KEY=sk-your-key
   ```
2. Restart the app. The app will try to call OpenAI directly; if it fails, it falls back to Wikipedia and built‑in answers.

## Without any setup

If you don’t set Gemini or ChatGPT (proxy/API key), the assistant still works using:

- **Wikipedia** for factual questions (e.g. “Who is …”, “What is …”).
- **Built‑in logic** for math, greetings, and site help (Games, Math Lab, Quizzes).

So ChatGPT is optional: the assistant is useful either way, and gets full GPT knowledge when you add the proxy (or a similar backend).
