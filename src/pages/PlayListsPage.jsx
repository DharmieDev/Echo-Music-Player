import { useEffect, useState } from "react";
import { Spotify } from "../api/spotifyClient";

const PlayListsPage = () => {
  const [pls, setPls] = useState([]);

  useEffect(() => {
    let on = true;
    Spotify.playlistsMe()
      .then((data) => {
        if (data && on) setPls(data.items ?? []);
      })
      .catch((err) => console.error("Error fetching playlists:", err));
    return () => (on = false);
  }, []);

  return (
    <div className="bg-sidebar w-[1000px] h-[74vh] rounded-[30px] overflow-hidden flex flex-col gap-4 p-4">
      <h2>Your Playlists</h2>
      <div className="grid grid-cols-3 gap-4">
        {pls.map((p) => (
          <a key={p.id} href={`/playlists/${p.id}`} className="card">
            {p.images?.[0]?.url && (
              <img
                src={p.images[0].url}
                alt={p.name}
                style={{ width: "100%", borderRadius: 8 }}
              />
            )}
            <div style={{ marginTop: 8 }}>{p.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PlayListsPage;

