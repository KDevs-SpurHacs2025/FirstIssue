import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <div className='w-full h-[300px] flex flex-row items-center justify-center bg-gray-700 text-white'>
        <h1 className='text-4xl font-bold'>Find Your First GitHub Contribution</h1>
        <p>Browse beginner-friendly GitHub repositories with issues tagged for new contributors. Filter by programming language and difficulty level to find the perfect project to contribute to.</p>
        <button className='mt-4 px-6 py-2 bg-blue-600 text-white rounded' onClick={() => navigate('/survey')}>Get Started</button>
      </div>
       {/* Section 1 */}
       <div className='w-full h-[300px] flex flex-row items-center justify-center bg-gray-800 text-white'>
         <h2 className='text-3xl font-bold'>Simple Repository Discovery</h2>
         <p>Find GitHub repositories that welcome new contributors</p>
         <div>
            <div><div><img /></div><div><span>Smart Filtering</span><p>Filter repositories by programming language, issue labels, and project activity to find excatly what you’re looking for</p></div></div>
            <div><div><img /></div><div><span>Beginner-Friendly </span><p>Focus on repositories that have “good first issue”, “beginner-friendly”, or “help wanted” labels for new contributors</p></div></div>
            <div><div><img /></div><div><span>Project Information</span><p>View repository details, contribution guidelines, and issue descriptions to understand what you’ll be working on</p></div></div>
         </div>
       </div>
        {/* Section 2*/}
       <div className='w-full h-[300px] flex flex-row items-center justify-center bg-gray-900 text-white'>
        <div>
         <h2 className='text-3xl font-bold'>How It Works</h2>
         <p>Find and contribute to open source projects in just a few steps</p>
         </div>
         <div>
            <div><span>Browse Projects</span><p>Search through curated GitHub repositories that welcome new contributors</p></div>
            <div><span>Filter & Find</span><p>Use filters to find projects matching your skills and interests</p></div>
            <div><span>Read Guidelines</span><p>Review the project's contribution guidelines and issue details</p></div>
            <div><span>Start Contributing</span><p>Fork the repository and submit your first pull request</p></div>
         </div>
       </div>
        {/* Section 3*/}
       <div className='w-full h-[300px] flex flex-row items-center justify-center bg-gray-800 text-white'>
         <h2 className='text-3xl font-bold'>Ready to Contribute to Open Source?</h2>
         <p>Start exploring GitHub repositories that are perfect for your first contribution</p>
         <button className='mt-4 px-6 py-2 bg-blue-600 text-white rounded' onClick={() => navigate('/survey')}>Get Started</button>
       </div>
        {/* Footer */}
       <Footer />
    </div>
  )
}

export default Home
