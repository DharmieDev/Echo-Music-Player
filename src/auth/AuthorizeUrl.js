import { generateCodeVerifier, generateCodeChallenge } from "./pkceUtils";

export async function AuthorizeUrl() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
  ].join(" ");

  // Generate verifier + challenge
  const codeVerifier = generateCodeVerifier(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Save verifier for later (token exchange)
  saveCodeVerifier(codeVerifier);

  const state = generateRandomString(16);

  const url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.set("response_type", "code"); 
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("scope", scopes);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("code_challenge", codeChallenge);

  return url.toString();
}

