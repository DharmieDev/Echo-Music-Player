import { NavLink } from 'react-router-dom'
import { useEffect, useState } from "react";
import { useSpotifyAuth } from "../auth/TokenProvider";
import { spotifyFetch } from "../auth/spotifyApi";

const SideBar = () => {
  const { token, login, logout } = useSpotifyAuth();
  const [user, setUser] = useState(null);

  // Fetch Spotify user profile
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const data = await spotifyFetch("me", token);
        setUser(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUser();
  }, [token]);

  // 🎨 Reusable nav link styles
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive ? "text-white" : "text-hover hover:text-white"
    }`;

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='bg-sidebar text-white rounded-[30px] text-center h-[96vh] w-[240px]'>
        {/* Logo */}
        <div className='flex justify-center items-center mt-[30px] mb-[40px]'>
          <img 
            src="src/assets/audio-wave-02.svg" 
            alt="Logo"
            className='w-[36px] h-[36px]' 
          />
          <p className='text-xl font-[Caprasimo]'>Echo</p>
        </div>

        {/* Navigation */}
        <nav>
          <ul className='text-[30px] text-hover flex flex-col leading-6 font-medium justify-start items-center mb-[70px]'>
            <li><NavLink to="/" end className={linkClass}>Home</NavLink></li>
            <li><NavLink to="/Genres" end className={linkClass}>Genres</NavLink></li>
            <li><NavLink to="/Artists" end className={linkClass}>Artists</NavLink></li>
            <li><NavLink to="/Albums" end className={linkClass}>Albums</NavLink></li>
          </ul>
          <p className='text-2xl font-medium'>
            <NavLink to="/Playlists" end className={linkClass}>Playlists</NavLink>
          </p>
        </nav>

        {/* Auth Section */}
      <div className="mt-auto border-t border-gray-700 pt-4">
        {!token ? (
          <button
            onClick={login}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
          >
            Login with Spotify
          </button>
        ) : (
          <div className="flex flex-col items-center">
            {user?.images?.[0]?.url && (
              <img
                src={user.images[0].url}
                alt="User Avatar"
                className="w-14 h-14 rounded-full mb-2"
              />
            )}
            <p className="mb-2 text-sm">{user?.display_name}</p>
            <button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default SideBar;

