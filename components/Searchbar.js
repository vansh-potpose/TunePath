import React from 'react'
import BWbtn from "@/components/BWbtn";
import SvgBtn from "@/components/SvgBtn";
import Image from 'next/image';


const Searchbar = () => {
  return (
    <div className='absolute w-full z-50'>

    <div className=" py-3 relative z-20 px-5 flex justify-between items-center">
              <div className="left flex items-center">
              <div className="searchBar mx-3 flex items-center gap-1 bg-stone-700 rounded-full">
                <div className='flex items-center'>
                <div className='h-8 w-8 flex items-center justify-center ml-2'>
                <Image src="/search.svg" alt="search" className='w-6 h-6' width={180} height={180} />

                </div>
                </div>
                <input type="text" className='rounded-full py-2 px-3 min-w-80 max-w-fit text-base border-none outline-none bg-transparent' />
              </div>
              </div>
              
              <div className="right flex items-center gap-2">
                <BWbtn text="Explore Premium" theme="light"/>
                <BWbtn text="Install App" theme="dark"/>
                <SvgBtn  d="M8 1.5a4 4 0 0 0-4 4v3.27a.75.75 0 0 1-.1.373L2.255 12h11.49L12.1 9.142a.75.75 0 0 1-.1-.374V5.5a4 4 0 0 0-4-4zm-5.5 4a5.5 5.5 0 0 1 11 0v3.067l2.193 3.809a.75.75 0 0 1-.65 1.124H10.5a2.5 2.5 0 0 1-5 0H.957a.75.75 0 0 1-.65-1.124L2.5 8.569V5.5zm4.5 8a1 1 0 1 0 2 0H7z"/>
                <span className="bg-stone-700 bg-opacity-50 p-1 rounded-full">
                <span className=" rounded-full w-6 h-6 flex items-center justify-center font-medium bg-[#f573a0] text-black leading-6">D</span>
                </span>
              
              </div>
          </div>
    </div>
  )
}

export default Searchbar
