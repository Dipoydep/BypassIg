export async function extractInstagram(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  if (!response.ok) {
    throw new Error(`Instagram HTTP ${response.status}`);
  }

  const html = await response.text();

  const secureVideo =
    html.match(
      /<meta[^>]+property=["']og:video:secure_url["'][^>]+content=["']([^"']+)["']/i
    )?.[1];

  const normalVideo =
    html.match(
      /<meta[^>]+property=["']og:video["'][^>]+content=["']([^"']+)["']/i
    )?.[1];

  const video = secureVideo || normalVideo;

  if (!video) {
    throw new Error("Video publik tidak ditemukan");
  }

  return {
    video: video
      .replaceAll("&amp;", "&")
      .replaceAll("\\/", "/")
  };
}
