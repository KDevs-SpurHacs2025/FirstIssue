import React from 'react'

const Footer = () => {
  return (
    <div className='w-full h-[140px] flex flex-col items-start justify-center px-10 bg-gray-700 text-white text-left'>
      <div className='w-auto h-auto flex flex-row items-center mb-1'>
        <img src="/logo.png" style={{ width: '15px', height: '15px' }} />
        <h2 className='text-md font-semibold ml-2'>FirstIssue</h2>
      </div>
      <p className='text-xs font-light'>© 2025 FirstIssue. A tool for discovering open source projects.</p>
    </div>
  )
}

export default Footer
