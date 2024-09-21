import React from 'react'

const SvgBtn = (props) => {
  return (
    <button className='rounded-full p-2 hover:text-white text-[#b3b3b3] hover:bg-stone-600 bg-stone-700 bg-opacity-50'>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 16 16" fill='white' stroke='currentColor' className='h-4 w-4'><path d={props.d}></path></svg>
    </button>
  )
}

export default SvgBtn
