// pkceUtils.js
export function generateCodeVerifier(length = 128) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function saveCodeVerifier(verifier) {
  sessionStorage.setItem("pkce_code_verifier", verifier);
}

export function getCodeVerifier() {
  return sessionStorage.getItem("pkce_code_verifier");
}

export async function getAccessToken(code) {
  const verifier = getCodeVerifier();
  if (!verifier) throw new Error("Missing code_verifier in sessionStorage");

  const params = new URLSearchParams();
  params.append("client_id", import.meta.env.VITE_SPOTIFY_CLIENT_ID);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", import.meta.env.VITE_SPOTIFY_REDIRECT_URI);
  params.append("code_verifier", verifier);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Token request failed:", data, params.toString());
    throw new Error(data.error_description || "Failed to get access token");
  }

  return data;
}
