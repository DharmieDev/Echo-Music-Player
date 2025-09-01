export function parseHashToken(hashString = window.location.hash) {
  const hash = hashString.startsWith("#") ? hashString.slice(1) : hashString;
  const params = new URLSearchParams(hash);

  const access_token = params.get("access_token");
  const token_type = params.get("token_type");
  const expires_in = Number(params.get("expires_in"));
  const state = params.get("state");

  if (!access_token) return null;
  return { access_token, token_type, expires_in, state };
}

export function storeToken({ access_token, expires_in }) {
  const expiresAt = Date.now() + (expires_in - 30) * 1000;
  localStorage.setItem(
    "spotify_token",
    JSON.stringify({ access_token, expiresAt })
  );
}

export function getStoredToken() {
  const raw = localStorage.getItem("spotify_token");
  if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() >= data.expiresAt) {
      localStorage.removeItem("spotify_token");
      return null;
    }
    return data.access_token;
}

export function clearToken() {
  localStorage.removeItem("spotify_token");
}