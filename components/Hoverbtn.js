import React from 'react'

const hoverbtn = (props) => {
  return (
    <button className='flex gap-3 hover:text-white text-[#b3b3b3] duration-150 font-bold text-base items-center '>
          <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={props.path}
            />
          </svg>
          <p>{props.text}</p>
        </button>
  )
}

export default hoverbtn
