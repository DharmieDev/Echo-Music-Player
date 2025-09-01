import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spotify } from "../api/spotifyClient";

const AlbumsPage = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    let on = true;
    Spotify.albumById(id).then((data) => { if (data && on) setAlbum(data); }).catch(()=>{});
    return () => (on = false);
  }, [id]);

  if (!album) return <div>Loading album…</div>;

  return (
     <div className="bg-sidebar w-[1000px] h-[74vh] rounded-[30px] overflow-hidden flex flex-col gap-4 p-4">
      <div style={{ display:'flex', gap:16, marginBottom:12 }}>
        {album.images?.[0] && <img src={album.images[0].url} alt="" style={{ width:160, height:160, borderRadius:8 }} />}
        <div>
          <h2>{album.name}</h2>
          <div style={{ opacity:0.8 }}>By {album.artists.map(a=>a.name).join(", ")}</div>
          <div style={{ opacity:0.8 }}>{album.release_date} • {album.total_tracks} tracks</div>
        </div>
      </div>

      <ol>
        {album.tracks?.items?.map((t, i) => (
            <li key={t.id ?? i} className="track-row card" style={{ marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500 }}>{t.name}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  {t.artists.map((a) => a.name).join(", ")}
                </div>
              </div>
              <button
                className="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("echo:play", { detail: { ...t, album } }))
                }
              >
                Play preview
              </button>
            </li>
          ))}

      </ol>
    </div>
  )
}

export default AlbumsPage

