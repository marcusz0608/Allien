/**
 * Call Google Gemini from the frontend (no backend). Pass system prompt + full
 * conversation history so the model has "memory." Requires VITE_GEMINI_API_KEY.
 * API key is sent from the browser — use for prototyping; for production
 * consider a backend proxy.
 */

import { ALLIEN_SYSTEM_PROMPT } from './aiSystemPrompt'

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta'
const DEFAULT_MODEL = 'gemini-2.5-flash'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

function buildContents(history: ChatMessage[], newUserContent: string): { role: string; parts: { text: string }[] }[] {
  const contents: { role: string; parts: { text: string }[] }[] = []
  for (const m of history) {
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })
  }
  contents.push({ role: 'user', parts: [{ text: newUserContent }] })
  return contents
}

export async function getGeminiReply(
  history: ChatMessage[],
  newUserContent: string,
  systemPrompt: string = ALLIEN_SYSTEM_PROMPT,
): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('AIza')) {
    if (import.meta.env.DEV && !apiKey) console.warn('[Allien] Gemini skipped: no VITE_GEMINI_API_KEY. Add it to .env and restart dev server.')
    return null
  }

  const model = (import.meta.env.VITE_GEMINI_MODEL as string) || DEFAULT_MODEL
  const url = `${GEMINI_API}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: buildContents(history, newUserContent),
    generationConfig: {
      max_output_tokens: 1024,
      temperature: 0.7,
    },
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
      error?: { message?: string; code?: number }
    }
    if (!res.ok) {
      if (import.meta.env.DEV) {
        console.warn('[Allien] Gemini API error:', res.status, data.error?.message ?? (data as unknown as { error?: { message?: string } }).error?.message ?? res.statusText)
      }
      return null
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    return typeof text === 'string' && text.length > 0 ? text.trim() : null
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[Allien] Gemini request failed:', err)
    return null
  }
}
