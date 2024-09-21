import React ,{useState} from 'react'
import Image from 'next/image'
function Playbar() {

  const song=new Audio()
  const Playcurrentsong =() => {
    alert("play")
    song.src="http://localhost:3000/Darkside x Aja Sanam Mashup-raju bhai.mp3"
    song.play()
  }
  

  return (
    
      <div className='songdetials mx-2 my-1 flex items-center'>

        <div className='group flex flex-row gap-3 items-center p-2 rounded-lg   w-[300px] '>
          <img src="cover.jpg" alt="playlist" className="rounded-md w-[55px]" />
          <div className='flex flex-col'>
            <h3 className='text-white font-semibold text-base mb-1'>props.name</h3>
            <p className='text-[#b3b3b3] text-sm'>Playlist - props.creator</p>
          </div>
        </div>
      
      <div className="options flex items-center justify-between  w-[calc(100vw-500px)] pl-14 mx-auto">
        <div className='songcontrol flex flex-col justify-center items-center'>
          <div className="upper flex items-center gap-4">
            
            <button className=' rounded-full h-8 w-8 object-cover object-center '>
            <svg xmlns="http://www.w3.org/2000/svg" className='fill-current w-5' role="img" aria-hidden="true" viewBox="0 0 16 16"><path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path></svg>
            </button>
            
            <button onClick={Playcurrentsong} className='bg-white rounded-full h-8 w-8 object-cover object-center'>
              <Image src="play.svg" className='scale-150' width={50} height={50} />
            </button>
            
            <button className='rounded-full ml-2 h-8 w-8 object-cover object-center text-white'>
            <svg xmlns="http://www.w3.org/2000/svg" className='fill-current w-5' role="img" aria-hidden="true" viewBox="0 0 16 16" ><path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path></svg>
            </button>
            
          </div>
          <div className="lower flex gap-2 text-sm items-center">
            <div className="timecompleted">0:45</div>
            <div className="relative group flex items-center overflow-visible playscroll bg-stone-900 h-[5px] rounded-full w-[550px] ">
              <div id="playbar_completed" className="completed w-44 h-full rounded-full group-hover:rounded-e-none  bg-white group-hover:bg-green-600"></div>

              <div  className='absolute -top-full z-50 group-hover:opacity-100 hover:opacity-100 opacity-0 bg-white h-4 w-4 rounded-full left-100 '></div>
            </div>
            <div className="timetocomplete">3:00</div>
          </div>
        </div>
        <div className="sound flex items-center gap-1">
          <button>
            <img src="volume.svg" alt="volume" />
          </button>
          <input type="range" name="volume" id="volume" className='bg-transparent text-white h-1' />
        </div>
      </div>
    </div>
  

  )
}

export default Playbar
