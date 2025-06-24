import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <div className='w-full h-[300px] flex flex-row items-center justify-center bg-gray-700 text-white'>
        <h1 className='text-4xl font-bold'>Welcome to FirstIssue</h1>
      </div>
       {/* Section 1 */}
       <div className='w-full h-[300px] flex flex-row items-center justify-center bg-gray-800 text-white'>
         <h2 className='text-3xl font-bold'>Section 1</h2>
       </div>
        {/* Section 2*/}
       <div className='w-full h-[300px] flex flex-row items-center justify-center bg-gray-900 text-white'>
         <h2 className='text-3xl font-bold'>Section 2</h2>
       </div>
        {/* Section 3*/}
       <div className='w-full h-[300px] flex flex-row items-center justify-center bg-gray-800 text-white'>
         <h2 className='text-3xl font-bold'>Section 3</h2>
       </div>
        {/* Footer */}
       <Footer />
    </div>
  )
}

export default Home
