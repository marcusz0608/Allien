/**
 * Tiny proxy so the Allien AI assistant can use ChatGPT without exposing your API key.
 * Run: OPENAI_API_KEY=sk-your-key node api-proxy/server.js
 * Then in the app: set VITE_AI_PROXY_URL=http://localhost:3001/chat (and restart the app).
 *
 * Requires Node 18+ (for fetch).
 */

const http = require('http')

const OPENAI_API = 'https://api.openai.com/v1/chat/completions'
const PORT = Number(process.env.PORT) || 3001

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== 'POST' || req.url !== '/chat') {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'POST /chat only' }))
    return
  }

  const key = process.env.OPENAI_API_KEY
  if (!key) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Set OPENAI_API_KEY' }))
    return
  }

  try {
    const body = await parseBody(req)
    const messages = body.messages || []
    if (!Array.isArray(messages) || messages.length === 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Body must have messages array' }))
      return
    }

    const openaiRes = await fetch(OPENAI_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1200,
      }),
    })

    if (!openaiRes.ok) {
      const err = await openaiRes.text()
      res.writeHead(openaiRes.status, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'OpenAI error', details: err }))
      return
    }

    const data = await openaiRes.json()
    const content = data.choices?.[0]?.message?.content ?? ''
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ content }))
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: String(e.message || e) }))
  }
})

server.listen(PORT, () => {
  console.log(`AI proxy running at http://localhost:${PORT}. POST to http://localhost:${PORT}/chat`)
})
