const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: corsHeaders
  });
}

export default async (request) => {
  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  if (request.method !== "GET") {
    return json(
      {
        success: false,
        error: "Method tidak diizinkan"
      },
      405
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    const instagramUrl = searchParams.get("url");
    const type = searchParams.get("type") || "normal";

    if (!instagramUrl) {
      return json(
        {
          success: false,
          error: "Parameter url wajib diisi"
        },
        400
      );
    }

    if (!["normal", "hd", "mp3"].includes(type)) {
      return json(
        {
          success: false,
          error: "type harus normal, hd, atau mp3"
        },
        400
      );
    }

    const parsed = new URL(instagramUrl);

    if (
      parsed.protocol !== "https:" ||
      (parsed.hostname !== "instagram.com" &&
        !parsed.hostname.endsWith(".instagram.com"))
    ) {
      return json(
        {
          success: false,
          error: "URL Instagram tidak valid"
        },
        400
      );
    }

    const response = await fetch(instagramUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (!response.ok) {
      return json(
        {
          success: false,
          error: "Gagal mengambil halaman Instagram",
          status: response.status
        },
        502
      );
    }

    const html = await response.text();

    const secureVideoMatch = html.match(
      /<meta[^>]+property=["']og:video:secure_url["'][^>]+content=["']([^"']+)["']/i
    );

    const videoMatch = html.match(
      /<meta[^>]+property=["']og:video["'][^>]+content=["']([^"']+)["']/i
    );

    const videoUrl = secureVideoMatch?.[1] || videoMatch?.[1];

    if (!videoUrl) {
      return json(
        {
          success: false,
          error: "Media video tidak ditemukan"
        },
        404
      );
    }

    const decodedVideoUrl = videoUrl
      .replaceAll("&amp;", "&")
      .replaceAll("\\/", "/");

    if (type === "mp3") {
      return json(
        {
          success: false,
          error: "MP3 belum ditambahkan ke extractor."
        },
        501
      );
    }

    return json({
      success: true,
      type,
      download_url: decodedVideoUrl
    });
  } catch (error) {
    return json(
      {
        success: false,
        error: "Internal server error"
      },
      500
    );
  }
};
