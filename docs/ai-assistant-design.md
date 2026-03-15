# Allien AI Assistant — LLM-first design

## 1. Problem with the current approach

Today the assistant uses **case-by-case logic in the frontend** (`getMockAiResponse` in `App.tsx`):

- Many regex branches for math (addition, fractions, powers, algebra, comparison, etc.)
- Keyword branches for greetings, games, quizzes, homework, science, help
- This **does not scale**: every new type of question needs new code and can conflict with existing patterns (e.g. "1/4+3/4" was parsed as "4+3")
- We cannot cover “all sorts of problems” or natural language reliably with rules

**Goal:** The **LLM should understand the user’s prompt** and decide how to answer. The frontend should only send the conversation to the model and show the reply.

---

## 2. Target architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Frontend       │     │  Backend (proxy) │     │  LLM (OpenAI /   │
│  (React)        │────▶│  or serverless   │────▶│  other)          │
│                 │     │                  │     │                  │
│  - Chat UI      │     │  - System prompt │     │  - Understands   │
│  - Send message │     │  - Optional tools│     │    any question  │
│  - Show reply   │     │    (e.g. search) │     │  - One response   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                         │
        │                         ▼
        │                ┌──────────────────┐
        │                │  Optional:      │
        │                │  Wikipedia API   │
        │                │  (for freshness) │
        │                └──────────────────┘
        │
        ▼
  When no API key / proxy:
  - Fallback: Wikipedia for factual Qs
  - Fallback: Short “connect ChatGPT” message
  - No large case-by-case math in frontend
```

- **Frontend:** Renders chat, sends `messages` (history + new user message) to backend (or proxy). Displays the reply. Optionally calls Wikipedia from frontend only when there is **no** LLM (see fallbacks below).
- **Backend / proxy:** Holds the **system prompt**, optionally adds tools (e.g. fetch Wikipedia and inject as context), calls the LLM, returns `{ content }`.
- **LLM:** Interprets the user’s intent (math, question, greeting, help, etc.) and generates one coherent answer from the system prompt and context.

**No-backend option:** You can use **Google Gemini** from the frontend only. The app sends the **system prompt** as `system_instruction` and the **full conversation history** as multi-turn `contents` (user/model roles) so the model has “memory.” Set `VITE_GEMINI_API_KEY` in `.env`; see [AI ChatGPT Setup](AI_CHATGPT_SETUP.md).

---

## 3. System prompt for Allien AI

The system prompt defines who Allien is and how it should behave. All understanding of “what the user wants” is done by the model, not by frontend cases.

### 3.1 Persona and audience

- **Name:** Allien (friendly AI assistant on a kids’ learning site).
- **Audience:** Kids and learners; keep answers clear, accurate, and age-appropriate.
- **Tone:** Kind, encouraging, concise for simple questions; can be more detailed for hard or complex questions.

### 3.2 What Allien knows about the product

- **Games:** Memory match, Tic-tac-toe (play on site); links to Scratch, Minecraft, Wild Kratts, CrazyGames, Poki.
- **Math Lab:** Math practice by grade (K–2, 3–5, 6–8, 9–12) with levels; suggest it when the user asks for math practice or homework help.
- **Quizzes:** Quiz section on the site.
- **Search:** Site search to find games, Math Lab, quizzes, etc.

Allien can suggest these when relevant (e.g. “Want to practice more? Try Math Lab!”) but does not need to implement them — the app does.

### 3.3 Behavior

- **Any question:** Interpret the user’s intent (math, factual, “how do I…”, greeting, etc.) and answer in one response.
- **Math:** Solve arithmetic, fractions, decimals, powers, simple algebra, comparisons when the user asks. Show steps when helpful (e.g. for “1/4 + 3/4” or “if x + 7 = 15 what is x”).
- **Hard questions:** Allow longer, step-by-step answers when the question is complex.
- **Factual questions:** Answer from general knowledge; if the backend injects Wikipedia (or other) context, use it to keep answers accurate and up to date.
- **Safety:** No harmful content; keep explanations suitable for kids.

### 3.4 Example system prompt (to live in backend/proxy)

This should be maintained in one place (e.g. proxy or backend), not duplicated in the frontend.

```text
You are Allien, a friendly AI assistant for kids and learners on the Allien learning website.

## Your role
- Answer questions clearly and accurately. Be kind and encouraging.
- For simple questions, keep answers short (a few sentences).
- For hard or complex questions (math, science, “why”, etc.), you may give longer, step-by-step explanations.

## What the site offers (suggest when relevant)
- **Games:** Memory match and Tic-tac-toe to play here; links to Scratch, Minecraft, Wild Kratts, CrazyGames, Poki.
- **Math Lab:** Math practice by grade (K–2, 3–5, 6–8, 9–12) with many levels.
- **Quizzes:** Quiz section to test knowledge.
- **Search:** On-site search to find games, Math Lab, quizzes.

## Math and homework
- Solve any math the user asks: arithmetic, fractions, decimals, powers, simple algebra (e.g. “x + 7 = 15”), comparisons (“which is bigger, 0.7 or 0.55?”).
- When useful, show a short step (e.g. “1/4 + 3/4 = 4/4 = 1” or “x = 15 − 7 = 8”).
- Encourage practice in Math Lab when it fits.

## Safety and style
- Keep content appropriate for kids. Be accurate and avoid harmful or off-topic material.
- If you don’t know something, say so and suggest trying Search or Math Lab where relevant.
```

The backend sends this as the **system** message and the conversation history + new user message as **user**/ **assistant** messages; the LLM returns a single reply. No need for the frontend to “understand” the prompt with regex or cases.

---

## 4. Frontend behavior (simplified)

- **When LLM is available (proxy or API key):**
  - Send full conversation (system prompt is applied in backend) + new user message.
  - Display the model’s reply. No frontend parsing of “is this math?” or “is this a greeting?”.

- **When LLM is not available (no proxy, no key, or request fails):**
  - **Option A (minimal):** Show a short message: “Connect the AI to ChatGPT to get answers to any question. See [setup doc].” Optionally still call **Wikipedia** for clearly factual queries (e.g. “who is X”, “what is Y”) and show that result so the assistant isn’t completely blank.
  - **Option B (remove case-by-case):** Same as A; remove or drastically shrink `getMockAiResponse` so we don’t maintain two “brains” (LLM vs. hundreds of frontend cases).

Recommendation: **LLM as the single source of understanding**; frontend only does chat UI + send/receive + optional Wikipedia fallback when no LLM.

---

## 5. Backend / proxy contract

- **Request:** `POST /chat` (or same as now) with body: `{ messages: [ { role: "system" | "user" | "assistant", content: string } ] }`.
- **System prompt:** Injected by the backend (not sent by the frontend), so the frontend only sends conversation history + latest user message if the backend doesn’t prepend system itself; or the frontend sends one “system” message that the backend forwards. Prefer backend owning the system prompt so we change it in one place.
- **Response:** `{ content: string }` (or `{ text: string }`) — the assistant’s reply.
- **Optional:** Backend can call Wikipedia (or another API) for factual queries and append a short “Context: …” to the user message or a separate system/user message so the LLM can use it. That way “understand user prompt” stays in the LLM; tools stay in the backend.

---

## 6. Implementation phases

1. **Design (this doc)**  
   - Agree on LLM-first behavior and system prompt.  
   - Agree on “no case-by-case in frontend” for understanding.

2. **Backend / proxy**  
   - Move the **system prompt** into the proxy (or backend).  
   - Proxy sends: `[ system, ...history, user ]` to the LLM and returns `content`.  
   - Optionally: add a Wikipedia (or search) step for factual questions and pass result as context.

3. **Frontend**  
   - Always call the LLM when the proxy/API is configured.  
   - On success: show the model reply only; no regex branching on the user text.  
   - On no-config or failure: show “Connect ChatGPT” (and optionally Wikipedia for “who/what” style questions).  
   - **Remove or shrink** `getMockAiResponse`: either remove it or keep a tiny fallback (e.g. “Connect the AI to get answers”) and maybe 1–2 lines for “no API” + Wikipedia-only.

4. **Iterate**  
   - Improve the **system prompt** (persona, site features, math instructions, safety) in the backend.  
   - Add tools (e.g. Wikipedia) in the backend if needed, without adding new frontend cases.

---

## 7. Summary

- **Understand user prompt:** Let the **LLM** do it via a single, clear **system prompt** and conversation history.
- **System prompt:** Defines Allien’s persona, knowledge of the site (Games, Math Lab, Quizzes, Search), and behavior (math, hard questions, safety). Keep it in the **backend/proxy**, not scattered in the frontend.
- **Frontend:** Chat UI + send messages + show reply; no case-by-case parsing of intents or math.
- **Fallback when no LLM:** Short “connect ChatGPT” message; optional Wikipedia for factual lookups only. No large, maintainable “fake AI” in the frontend.

This design gets us off the “wrong way” (case-by-case in frontend) and onto an LLM-first Allien AI that can handle any user prompt in a scalable way.
