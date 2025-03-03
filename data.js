export default {
  async fetch(req) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q");
    if (!query) return new Response("Missing query", { status: 400 });

    // Delay random 2-5 detik sebelum request ke Play Store
    const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
    await new Promise(resolve => setTimeout(resolve, delay));

    const playStoreUrl = `https://play.google.com/store/search?q=${encodeURIComponent(query)}&c=games`;
    const response = await fetch(playStoreUrl, { headers: { "User-Agent": "Mozilla/5.0" } });

    if (!response.ok) return new Response("Failed to fetch Play Store", { status: response.status });

    const html = await response.text();
    const results = extractPlayStoreData(html);

    return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
  },
};

function extractPlayStoreData(html) {
  const results = [];
  const regex = /<a\s+href="\/store\/apps\/details\?id=([^"]+)"[^>]*>\s*<img[^>]+src="([^"]+)"[^>]*>.*?<div[^>]+class="[^"]*">\s*([^<]+)\s*<\/div>.*?<div[^>]+>\s*(\d\.\d)\s*<\/div>/gs;

  let match;
  while ((match = regex.exec(html)) !== null && results.length < 3) {
    results.push({
      title: match[3].trim(),
      thumbnail: match[2],
      rating: match[4],
      url: `https://play.google.com/store/apps/details?id=${match[1]}`,
    });
  }
  return results;
}
