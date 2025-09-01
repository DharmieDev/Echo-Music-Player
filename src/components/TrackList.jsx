
import TrackItem from './TrackItem'

const TrackList = ({tracks}) => {
   const headerImage =
    tracks && tracks.length > 0 ? tracks[0].album.images?.[0]?.url : "https://placehold.co/480x140";

  return (
    <div className='w-[45wh] bg-sidebar rounded-[20px] overflow-y-scroll scrollbar-hide h-[calc(60vh-80px)] '>
      <img src={headerImage} alt="" className='w-[480px] h-[140px]' />
      <div>
        {tracks && tracks.length > 0 ? (
          tracks.map((track) => (
            <TrackItem
              key={track.id}
              title={track.name}
              artist={track.artists.map((a) => a.name).join(", ")}
              image={track.album.images?.[0]?.url}
              duration={track.duration_ms}
            />
          ))
        ) : (
          <p className="text-gray-400 p-4">No tracks loaded...</p>
        )}
      </div>
    </div>
  )
}

export default TrackList
