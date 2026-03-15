/**
 * Fetch a short summary from Wikipedia for a search query.
 * Used by the AI assistant to answer factual questions from the web.
 * Uses origin=* for CORS in the browser.
 */

const WIKI_API = 'https://en.wikipedia.org/w/api.php'

function buildUrl(params: Record<string, string>): string {
  const search = new URLSearchParams({ ...params, origin: '*' })
  return `${WIKI_API}?${search.toString()}`
}

export async function fetchWikipediaSummary(searchQuery: string): Promise<string | null> {
  const query = searchQuery.trim()
  if (!query || query.length > 120) return null

  try {
    const searchRes = await fetch(
      buildUrl({
        action: 'query',
        list: 'search',
        srsearch: query,
        srlimit: '1',
        format: 'json',
      }),
    )
    if (!searchRes.ok) return null
    const searchData = (await searchRes.json()) as {
      query?: { search?: { title: string }[] }
    }
    const title = searchData.query?.search?.[0]?.title
    if (!title) return null

    const extractRes = await fetch(
      buildUrl({
        action: 'query',
        prop: 'extracts',
        titles: title,
        exintro: '1',
        explaintext: '1',
        exsentences: '10',
        format: 'json',
      }),
    )
    if (!extractRes.ok) return null
    const extractData = (await extractRes.json()) as {
      query?: { pages?: Record<string, { extract?: string }> }
    }
    const pages = extractData.query?.pages
    if (!pages) return null
    const page = Object.values(pages)[0]
    const extract = page?.extract?.trim()
    return extract && extract.length > 0 ? extract : null
  } catch {
    return null
  }
}

/**
 * Returns true if the message looks like a factual question we can look up.
 */
export function looksLikeFactualQuestion(text: string): boolean {
  const t = text.toLowerCase().trim()
  if (t.length < 4 || t.length > 200) return false
  const factualStart =
    /^(who is|who was|what is|what are|what was|when did|where is|where did|tell me about|explain|define|why do we|why does|how do|how does) /i
  if (factualStart.test(t)) return true
  if (/^what('s| is) .+\?$/.test(t)) return true
  if (/^who (invented|discovered|made|wrote) /i.test(t)) return true
  return false
}

/**
 * Turn "Who is Albert Einstein?" into "Albert Einstein" for search.
 */
export function getSearchQueryFromMessage(text: string): string {
  let q = text.trim()
  q = q.replace(/^(who is|who was|what is|what are|what was|tell me about|explain|define)\s+/i, '')
  q = q.replace(/^(when did|where is|where did|why do we|why does|how do|how does)\s+/i, '')
  q = q.replace(/^(who (invented|discovered|made|wrote))\s+/i, '')
  q = q.replace(/\?+\.*$/, '').trim()
  q = q.replace(/^(the|a|an)\s+/i, '')
  return q.slice(0, 120)
}
