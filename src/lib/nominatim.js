let lastCallMs = 0;
const cache = new Map();

export async function searchPlace(query) {
  const q = query.trim();
  if (!q) return [];

  // basic caching
  if (cache.has(q)) return cache.get(q);

  // rate limit: max 1 request/sec (policy) [3](https://operations.osmfoundation.org/policies/nominatim/)
  const now = Date.now();
  const wait = 1100 - (now - lastCallMs);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCallMs = Date.now();

  let url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2"); // supported output format [2](https://nominatim.org/release-docs/latest/api/Search/)
  url.searchParams.set("limit", "5");       // limit is documented; max 40 [2](https://nominatim.org/release-docs/latest/api/Search/)

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      // In browsers you generally cannot set User-Agent; Referer will be your site origin.
      // Policy accepts Referer or User-Agent. [3](https://operations.osmfoundation.org/policies/nominatim/)
    }
  });

  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);

  const data = await res.json();
  const simplified = data.map((p) => ({
    lat: Number(p.lat),
    lon: Number(p.lon),
    label: p.display_name
  }));

  cache.set(q, simplified);
  return simplified;
}
``