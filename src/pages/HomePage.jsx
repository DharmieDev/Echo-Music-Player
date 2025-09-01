import { useEffect, useState } from "react";
import TrackItem from "../components/TrackItem";
import TrackList from "../components/TrackList";
import { Spotify } from "../api/spotifyClient"; 
import { useSpotifyAuth } from "../auth/TokenProvider";

const HomePage = () => {
  const { token } = useSpotifyAuth();
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCharts() {
      try {
        if (!token) {
          setError("Please log in with Spotify.");
          return;
        }

        // ✅ get user profile first
        const me = await Spotify.me();
        const country = me?.country || "US";

        // ✅ fetch featured playlists using account country
        const featured = await Spotify.featuredPlaylists(country);
        if (!featured?.playlists?.items?.length) {
          setError("No featured playlists found.");
          return;
        }

        const playlistId = featured.playlists.items[0].id;
        const data = await Spotify.playlistTracks(playlistId);

        if (data?.items) {
          setTracks(data.items);
        } else {
          setError("No tracks found in playlist.");
        }

        // ✅ also fetch new releases
        const newReleases = await Spotify.newReleases("NG");
        if (newReleases?.albums?.items) {
          setAlbums(newReleases.albums.items);
        }
      } catch (err) {
        setError(err.message);
      }
    }

    fetchCharts();
  }, [token]);

  if (error) return <p className="text-red-500">{error}</p>;

  // ✅ Pick the first album image (or fallback placeholder)
  const bannerImage =
    albums.length > 0
      ? albums[0].images?.[0]?.url
      : "https://placehold.co/1000x150";

  return (
    <div className="bg-bg w-[1000px] h-[74vh] rounded-[30px] overflow-hidden flex flex-col gap-4">
      <img
        src={bannerImage}
        alt="Featured Album"
        className="w-[1000px] h-[150px] object-cover"
      />
      <div className="flex justify-center items-center gap-12">
        <div className="w-[45vw] h-[40vh]">
          <h2 className="text-[30px] p-4">New Releases</h2>
          <div className="overflow-y-scroll scrollbar-hide h-[calc(60vh-80px)]">
            {albums.length > 0 ? (
              albums.map((album) => (
                <TrackItem
                  key={album.id}
                  title={album.name}
                  artist={album.artists.map((a) => a.name).join(", ")}
                  image={album.images?.[0]?.url}
                />
              ))
            ) : (
              <p className="text-gray-400 px-4">Login to load albums...</p>
            )}
          </div>
        </div>
        <div>
          <TrackList tracks={tracks} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
