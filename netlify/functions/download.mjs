import { extractInstagram } from "../../src/instagram.js";
import {
  validateInstagramUrl,
  validateType
} from "../../src/validator.js";
import {
  jsonResponse,
  corsResponse
} from "../../src/response.js";

export default async (request) => {
  // CORS preflight
  if (request.method === "OPTIONS") {
    return corsResponse();
  }

  if (request.method !== "GET") {
    return jsonResponse(
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

    // Validasi URL
    const urlCheck = validateInstagramUrl(instagramUrl);

    if (!urlCheck.valid) {
      return jsonResponse(
        {
          success: false,
          error: urlCheck.error
        },
        400
      );
    }

    // Validasi type
    const typeCheck = validateType(type);

    if (!typeCheck.valid) {
      return jsonResponse(
        {
          success: false,
          error: typeCheck.error
        },
        400
      );
    }

    // Extract media
    const media = await extractInstagram(urlCheck.url);

    // MP3 belum kita proses
    if (type === "mp3") {
      return jsonResponse(
        {
          success: false,
          error: "MP3 belum tersedia. Extractor audio akan dibuat pada tahap berikutnya."
        },
        501
      );
    }

    return jsonResponse({
      success: true,
      type,
      quality: type === "hd" ? "source" : "normal",
      download_url: media.video
    });

  } catch (error) {
    console.error(error);

    return jsonResponse(
      {
        success: false,
        error: error.message || "Gagal memproses video"
      },
      500
    );
  }
};
