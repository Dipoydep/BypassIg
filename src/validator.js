export function validateInstagramUrl(value) {
  if (!value) {
    return {
      valid: false,
      error: "Parameter url wajib diisi"
    };
  }

  let url;

  try {
    url = new URL(value);
  } catch {
    return {
      valid: false,
      error: "URL tidak valid"
    };
  }

  const hostname = url.hostname.toLowerCase();

  if (
    url.protocol !== "https:" ||
    (hostname !== "instagram.com" &&
      !hostname.endsWith(".instagram.com"))
  ) {
    return {
      valid: false,
      error: "URL harus berasal dari Instagram"
    };
  }

  return {
    valid: true,
    url: url.toString()
  };
}

export function validateType(type) {
  const allowed = ["normal", "hd", "mp3"];

  if (!allowed.includes(type)) {
    return {
      valid: false,
      error: "Type harus normal, hd, atau mp3"
    };
  }

  return {
    valid: true,
    type
  };
}
