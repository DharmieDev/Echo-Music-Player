import React from 'react'

const TrackItem = ({ title, artist, image, duration }) => {
  // Convert ms → mm:ss for track duration
  const formatDuration = (ms) => {
    if (!ms) return "";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className='w-[380px] h-[50px] flex items-center gap-4 m-4'>
      <img src={image || "https://placehold.co/45x45"} alt={title} className='rounded-[10px] w-[45px] h-[45px]'/>
      <div className='flex items-center justify-between w-full'>
          <div>
            <h4 className='text-base'>{title}</h4>
            <p className='text-xs text-searchbar-text'>{artist}</p>
          </div>
            <span className='text-xs'>{formatDuration(duration)}</span>
      </div>
    </div>
  )
}

export default TrackItem
