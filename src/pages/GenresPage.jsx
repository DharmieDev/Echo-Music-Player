import { useEffect, useState } from "react";
import { Spotify } from "../api/spotifyClient";
import { getStoredToken } from "../auth/pkceUtils";

const GenresPage = () => {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setError("You need to log in first.");
      return;
    }

    Spotify.categories()
      .then((data) => {
        if (data?.categories?.items) {
          setGenres(data.categories.items);
        } else {
          setError("No categories found.");
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="bg-sidebar w-[1000px] h-[74vh] rounded-[30px] p-4">
        <h2>Genres & Moods</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-sidebar w-[1000px] h-[74vh] rounded-[30px] overflow-hidden flex flex-col gap-4 p-4">
      <h2>Genres & Moods</h2>
      <div className="grid grid-cols-3 gap-4">
        {genres.map((g) => (
          <div key={g.id} className="card">
            {g.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenresPage;
