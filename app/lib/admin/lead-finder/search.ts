import type { WebSearchHit } from "./types";

function dedupeHits(hits: WebSearchHit[]): WebSearchHit[] {
  const seen = new Set<string>();
  return hits.filter((h) => {
    const key = h.url.split("#")[0].replace(/\/$/, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function searchSerpApi(query: string): Promise<WebSearchHit[]> {
  const apiKey = process.env.SERPAPI_API_KEY?.trim();
  if (!apiKey) return [];

  const hits: WebSearchHit[] = [];

  const googleUrl = new URL("https://serpapi.com/search.json");
  googleUrl.searchParams.set("engine", "google");
  googleUrl.searchParams.set("q", query);
  googleUrl.searchParams.set("num", "10");
  googleUrl.searchParams.set("location", "Boracay, Aklan, Philippines");
  googleUrl.searchParams.set("api_key", apiKey);

  const googleRes = await fetch(googleUrl.toString());
  if (googleRes.ok) {
    const data = await googleRes.json();
    const organic = data.organic_results ?? [];
    console.log(
      `[lead-finder] SerpAPI Google organic results for "${query}":`,
      organic.length,
    );
    for (const item of organic) {
      if (item.link) {
        hits.push({
          title: item.title ?? "",
          url: item.link,
          snippet: item.snippet,
          source: "SerpAPI Google",
        });
      }
    }
    for (const item of data.local_results?.places ?? []) {
      if (item.link || item.website) {
        hits.push({
          title: item.title ?? item.name ?? "",
          url: item.website ?? item.link,
          snippet: item.description,
          source: "SerpAPI Google Maps",
        });
      }
    }
  } else {
    console.error(
      `[lead-finder] SerpAPI Google error for "${query}":`,
      googleRes.status,
    );
  }

  const mapsUrl = new URL("https://serpapi.com/search.json");
  mapsUrl.searchParams.set("engine", "google_maps");
  mapsUrl.searchParams.set("q", query);
  mapsUrl.searchParams.set("type", "search");
  mapsUrl.searchParams.set("api_key", apiKey);

  const mapsRes = await fetch(mapsUrl.toString());
  if (mapsRes.ok) {
    const data = await mapsRes.json();
    const local = data.local_results ?? [];
    console.log(
      `[lead-finder] SerpAPI Maps results for "${query}":`,
      local.length,
    );
    for (const item of local) {
      if (item.website || item.link) {
        hits.push({
          title: item.title ?? "",
          url: item.website ?? item.link,
          snippet: item.description,
          source: "SerpAPI Google Maps",
        });
      }
    }
  }

  return hits;
}

async function searchGoogleCse(query: string): Promise<WebSearchHit[]> {
  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY?.trim();
  const cx = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID?.trim();
  if (!apiKey || !cx) return [];

  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("cx", cx);
  url.searchParams.set("q", query);
  url.searchParams.set("num", "10");

  const res = await fetch(url.toString());
  if (!res.ok) return [];

  const data = await res.json();
  return (data.items ?? []).map(
    (item: { title?: string; link?: string; snippet?: string }) => ({
      title: item.title ?? "",
      url: item.link ?? "",
      snippet: item.snippet,
      source: "Google Custom Search",
    }),
  );
}

async function searchTavily(query: string): Promise<WebSearchHit[]> {
  const apiKey = process.env.TAVILY_API_KEY?.trim();
  if (!apiKey) return [];

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "basic",
      max_results: 10,
      include_answer: false,
    }),
  });

  if (!res.ok) return [];

  const data = await res.json();
  return (data.results ?? []).map(
    (item: { title?: string; url?: string; content?: string }) => ({
      title: item.title ?? "",
      url: item.url ?? "",
      snippet: item.content?.slice(0, 300),
      source: "Tavily",
    }),
  );
}

export async function searchPublicWeb(query: string): Promise<{
  hits: WebSearchHit[];
  provider: string;
}> {
  let hits: WebSearchHit[] = [];
  let provider = "none";

  if (process.env.SERPAPI_API_KEY?.trim()) {
    hits = await searchSerpApi(query);
    provider = "SerpAPI";
  }

  if (hits.length === 0 && process.env.GOOGLE_CUSTOM_SEARCH_API_KEY?.trim()) {
    hits = await searchGoogleCse(query);
    provider = "Google Custom Search";
  }

  if (hits.length === 0 && process.env.TAVILY_API_KEY?.trim()) {
    hits = await searchTavily(query);
    provider = "Tavily";
  }

  if (
    hits.length === 0 &&
    !process.env.SERPAPI_API_KEY &&
    !process.env.GOOGLE_CUSTOM_SEARCH_API_KEY &&
    !process.env.TAVILY_API_KEY
  ) {
    throw new Error(
      "No search API configured. Set SERPAPI_API_KEY, GOOGLE_CUSTOM_SEARCH_API_KEY, or TAVILY_API_KEY.",
    );
  }

  const deduped = dedupeHits(hits).filter((h) => h.url);
  console.log(
    `[lead-finder] Total hits after dedupe for "${query}":`,
    deduped.length,
  );

  return { hits: deduped.slice(0, 12), provider };
}
