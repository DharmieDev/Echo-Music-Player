const BASE = "https://api.spotify.com/v1";

// 🔽 Fetch token directly from localStorage (TokenProvider saves it there)
function getStoredToken() {
  return localStorage.getItem("spotify_token");
}

async function authedFetch(path) {
  const token = getStoredToken();
  if (!token) {
    throw new Error("No valid access token. Please log in again.");
  }

  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Handle unauthorized (token expired or invalid)
  if (res.status === 401 || res.status === 403) {
    console.warn("Token expired or unauthorized. Need to refresh.");
    return null;
  }

  if (!res.ok) {
    let message = `Spotify API error: ${res.status}`;
    try {
      const err = await res.json();
      message = err.error?.message || message;
    } catch (_) {}
    throw new Error(message);
  }

  return res.json();
}

export const Spotify = {
  // Current user profile
  me: () => authedFetch("/me"),

  // New Releases
  newReleases: (country = "US") =>
    authedFetch(`/browse/new-releases?country=${country}&limit=20`),

  // Featured playlists
  featuredPlaylists: (country = "US") =>
    authedFetch(`/browse/featured-playlists?country=${country}`),

  // Categories (genres & moods)
  categories: (country = "US") =>
    authedFetch(`/browse/categories?country=${country}&limit=30`),

  // Current user playlists
  playlistsMe: () => authedFetch("/me/playlists?limit=50"),

  // Playlist details
  playlistById: (id) => authedFetch(`/playlists/${id}`),

  // Playlist tracks
  playlistTracks: (id, limit = 30, offset = 0) =>
    authedFetch(`/playlists/${id}/tracks?limit=${limit}&offset=${offset}`),

  // Search (tracks, artists, albums, playlists)
  searchAll: (q) =>
    authedFetch(
      `/search?type=track,artist,album,playlist&q=${encodeURIComponent(q)}`
    ),

  // Artists
  artistById: (id) => authedFetch(`/artists/${id}`),
  artistTopTracks: (id, market = "US") =>
    authedFetch(`/artists/${id}/top-tracks?market=${market}`),

  // Albums
  albumById: (id) => authedFetch(`/albums/${id}`),
};

