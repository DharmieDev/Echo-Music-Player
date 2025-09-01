import { Route, Routes } from 'react-router-dom'
import './App.css'
import SideBar from './components/SideBar'
import AudioPlayer from './components/AudioPlayer'
import SearchBar from './components/SearchBar'
import AlbumsPage from './pages/AlbumsPage'
import ArtistsPage from './pages/ArtistsPage'
import HomePage from './pages/HomePage'
import PlaylistsPage from './pages/PlaylistsPage'
import GenresPage from './pages/GenresPage'
import LoginPage from './pages/LoginPage';
import Callback from './pages/Callback';


function App() {

  return (
    <div>
            <div className='grid grid-cols-[260px_1fr] min-w-screen min-h-screen font-[SF-Pro-Display] bg-bg text-white justify-center items-center '>
              <SideBar />
              <div className='flex flex-col justify-between  gap-3'>
                <div>
                  <SearchBar />
                </div>
                <div>
                  <Routes>
                    <Route path='/Login' element={<LoginPage />}/>
                    <Route path='/' element={<HomePage />}/>
                    <Route path='/callback' element={<Callback />}/>
                    <Route path='/Albums' element={<AlbumsPage />}/>
                    <Route path='/Artists' element={<ArtistsPage />}/>
                    <Route path='/Genres' element={<GenresPage />}/>
                    <Route path='/Playlists' element={<PlaylistsPage />}/>
                  </Routes>
                </div>
                <div>
                  <AudioPlayer />
                </div>
              </div>
            </div>
    </div>
  )
}

export default App
