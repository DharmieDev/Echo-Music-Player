import SpotifyWebApi from "spotify-web-api-js";

export async function spotifyFetch(endpoint, token, options = {}) {
  if (!token) {
    throw new Error("Spotify access token is missing");
  }

  const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Spotify API request failed");
  }

  return response.json();
}

export const spotifyApi = new SpotifyWebApi({
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
});
