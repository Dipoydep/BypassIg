export default async (request) => {
  const url = new URL(request.url);

  const instagramUrl = url.searchParams.get("url");
  const type = url.searchParams.get("type") || "normal";

  const allowedTypes = ["normal", "hd", "mp3"];

  if (!instagramUrl) {
    return Response.json(
      {
        success: false,
        error: "Parameter url wajib diisi"
      },
      { status: 400 }
    );
  }

  if (!allowedTypes.includes(type)) {
    return Response.json(
      {
        success: false,
        error: "Type harus normal, hd, atau mp3"
      },
      { status: 400 }
    );
  }

  if (!/^https?:\/\/(www\.)?instagram\.com\//i.test(instagramUrl)) {
    return Response.json(
      {
        success: false,
        error: "URL Instagram tidak valid"
      },
      { status: 400 }
    );
  }

  return Response.json({
    success: true,
    message: "Endpoint aktif",
    type,
    source: instagramUrl
  });
};
