
import React from 'react'
import Image from "next/image";
import PlaylistImage from './PlaylistImage';


const Songcard = ({ img, name, creator, onClick, playlist }) => {
  return (
    <div className="group songcard p-2 rounded-lg hover:bg-[#1f1f1f] w-[165px]" onClick={onClick}>
                  <div className="relative">
                    {playlist ? (
                      <PlaylistImage 
                        playlist={playlist}
                        width={149}
                        height={149}
                        className="rounded-lg"
                      />
                    ) : (
                      <Image 
                        className="rounded-lg" 
                        src={img != null ? `/api/getImage?path=${encodeURIComponent(img)}` : "/music.svg"} 
                        alt="cover" 
                        width={149} 
                        height={149}
                      />
                    )}
                    
                    <Image className="absolute group-hover:shadow-lg group-hover:shadow-black group-hover:-translate-y-14 right-2 duration-300 group-hover:opacity-100 opacity-0 bg-green-400  rounded-full" src="play.svg" alt="cover" width="50" height="50"/>
                  </div>
                  <div className="songcard__info m-1 max-w-[149px]">
                    <h1 className="font-medium text-[17px] truncate" title={name}>{name}</h1>
                    <p className="text-[#b3b3b3] text-sm truncate" title={creator}>{creator}</p>
                  </div>
    </div>
  )
}

export default Songcard
