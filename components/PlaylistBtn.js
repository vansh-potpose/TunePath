import React from 'react';

function PlaylistBtn(props) {
  return (
    <div className='group flex flex-row gap-3 items-center p-2 rounded-lg hover:bg-[#1f1f1f]  '>
      <div className='relative'>
        <div className='absolute bg-stone-800 bg-opacity-40 w-full h-full flex items-center justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible'>
          <svg viewBox="0 0 24 24" className='w-6'>
            <path fill='#ffffff' d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
          </svg>
        </div>
        <img src={`/api/getImage?path=${encodeURIComponent(props.cover)}`} alt="playlist" className="rounded-md w-[50px]" />
      </div>
      
      <div className='flex flex-col'>
        <h3 className='text-white font-semibold text-base mb-1'>{props.name}</h3>
        <p className='text-[#b3b3b3] text-sm'>Playlist - {props.creator}</p>
      </div>
    </div>
  );
}

export default PlaylistBtn;
