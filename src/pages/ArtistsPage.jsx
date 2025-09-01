import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spotify } from "../api/spotifyClient";

const ArtistsPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    let on = true;
    Spotify.artistById(id).then((data) => { if (data && on) setArtist(data); }).catch(()=>{});
    Spotify.artistTopTracks(id).then((data) => { if (data && on) setTracks(data.tracks ?? []); }).catch(()=>{});
    return () => (on = false);
  }, [id]);

  if (!artist) return <div>Loading artist…</div>;

  return (
    <div className="bg-sidebar w-[1000px] h-[74vh] rounded-[30px] overflow-hidden flex flex-col gap-4 p-4">
      <div style={{ display:'flex', gap:16, marginBottom:12 }}>
        {artist.images?.[0] && <img src={artist.images[0].url} alt="" style={{ width:160, height:160, borderRadius:8 }} />}
        <div>
          <h2>{artist.name}</h2>
          <div style={{ opacity:0.8 }}>{artist.followers?.total?.toLocaleString()} followers</div>
          <div style={{ opacity:0.8 }}>{artist.genres?.join(", ")}</div>
        </div>
      </div>

      <h3>Top Tracks</h3>
      <ol>
        {tracks.map((t, i) => (
          <li key={t.id ?? i} className="track-row card" style={{ marginBottom:8 }}>
            <img src={t.album.images?.[2]?.url} alt="" />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:500 }}>{t.name}</div>
              <div style={{ fontSize:12, opacity:0.75 }}>{t.album.name}</div>
            </div>
            <button className="button" onClick={() => window.dispatchEvent(new CustomEvent('echo:play', { detail: t }))}>
              Play preview
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default ArtistsPage
