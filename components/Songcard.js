
import React from 'react'
import Image from "next/image";


const Songcard = ({ img, name, creator, onClick }) => {
  return (
    <div className="group songcard p-2 rounded-lg hover:bg-[#1f1f1f]  w-fit " onClick={onClick}>
                  <div className="relative">
                    <Image className="rounded-lg" src={`/api/getImage?path=${encodeURIComponent(img)}`} alt="cover" width="149" height="149"/>
                    
                    <Image className="absolute group-hover:shadow-lg group-hover:shadow-black group-hover:-translate-y-14 right-2 duration-300 group-hover:opacity-100 opacity-0 bg-green-400  rounded-full" src="play.svg" alt="cover" width="50" height="50"/>
                  </div>
                  <div className="songcard__info m-1">
                    <h1 className="font-medium text-[17px]">{name}</h1>
                    <p className="text-[#b3b3b3] text-sm">{creator}</p>
                  </div>
    </div>
  )
}

export default Songcard
