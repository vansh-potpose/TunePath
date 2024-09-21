import React from 'react'

const BWbtn = (props) => {
  return (
    <>
    { props.theme === 'dark' &&
    <button className='bg-stone-700 bg-opacity-80 rounded-full py-2 px-4 text-white hover:scale-105 text-sm font-semibold '>
        {props.text}
    </button>}
    { props.theme === 'light' &&
    <button className='bg-white rounded-full py-2 px-4 text-black hover:scale-105 text-sm font-semibold '>
        {props.text}
    </button>}
    </>
  )
}

export default BWbtn
