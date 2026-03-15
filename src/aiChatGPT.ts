/**
 * Optional ChatGPT (OpenAI) integration for the AI assistant.
 * Use either:
 * - VITE_AI_PROXY_URL: your backend proxy that forwards to OpenAI (recommended; keeps key secret).
 * - VITE_OPENAI_API_KEY: direct call (may be blocked by CORS in the browser).
 */

const OPENAI_API = 'https://api.openai.com/v1/chat/completions'

const SYSTEM_PROMPT = `You are Allien, a friendly AI assistant for kids and learners on a learning website. You help with math, homework, games, and curiosity — including very hard questions.

For HARD or COMPLEX questions: give detailed, step-by-step explanations. Break the answer into clear parts. Use examples if they help. It's okay to write a longer answer when the question is difficult (science, history, logic, deep "why" questions, etc.). Stay accurate and kind.

For simple or quick questions: keep it short (a few sentences).

The site has: Games (Memory match, Tic-tac-toe, Scratch, Minecraft, Wild Kratts), Math Lab (math practice by grade K-2, 3-5, 6-8, 9-12), and Quizzes. When relevant, you can suggest trying those.`

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

function buildOpenAIMessages(history: ChatMessage[], newUserContent: string): { role: 'system' | 'user' | 'assistant'; content: string }[] {
  const out: { role: 'system' | 'user' | 'assistant'; content: string }[] = [{ role: 'system', content: SYSTEM_PROMPT }]
  for (const m of history) {
    out.push({ role: m.role, content: m.content })
  }
  out.push({ role: 'user', content: newUserContent })
  return out
}

/**
 * Call ChatGPT via your proxy. Proxy should accept POST with body { messages } and return { content: string }.
 */
export async function callChatGPTViaProxy(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  proxyUrl: string,
): Promise<string | null> {
  try {
    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { content?: string; text?: string }
    const content = data.content ?? data.text
    return typeof content === 'string' && content.length > 0 ? content.trim() : null
  } catch {
    return null
  }
}

/**
 * Call OpenAI directly. Often blocked by CORS in the browser; use a proxy in production.
 */
export async function callOpenAIDirect(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  apiKey: string,
): Promise<string | null> {
  try {
    const res = await fetch(OPENAI_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1200,
      }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const content = data.choices?.[0]?.message?.content
    return typeof content === 'string' && content.length > 0 ? content.trim() : null
  } catch {
    return null
  }
}

/**
 * Try proxy first, then direct API. Returns ChatGPT reply or null.
 */
export async function getChatGPTReply(history: ChatMessage[], newUserContent: string): Promise<string | null> {
  const messages = buildOpenAIMessages(history, newUserContent)
  const proxyUrl = import.meta.env.VITE_AI_PROXY_URL as string | undefined
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined

  if (proxyUrl && typeof proxyUrl === 'string' && proxyUrl.startsWith('http')) {
    const reply = await callChatGPTViaProxy(messages, proxyUrl)
    if (reply) return reply
  }
  if (apiKey && typeof apiKey === 'string') {
    const reply = await callOpenAIDirect(messages, apiKey)
    if (reply) return reply
  }
  return null
}
