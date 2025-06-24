import React, { useState } from 'react'
import OpenSourceCard from '../components/OpenSourceCard'
import Navbar from '../components/Navbar'

{/* Dummy texts */}
const hardcodedCards = [
  {
    repoName: 'react',
    percentage: 98,
    createdAt: '2013-05-24',
    updatedAt: '2025-06-20',
    languages: ['JavaScript', 'TypeScript'],
    difficulties: ['Intermediate'],
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
  },
  {
    repoName: 'nestjs',
    percentage: 92,
    createdAt: '2017-03-01',
    updatedAt: '2025-06-18',
    languages: ['TypeScript'],
    difficulties: ['Intermediate', 'Advanced'],
    description: 'A progressive Node.js framework for building efficient, reliable and scalable server-side applications.',
  },
  {
    repoName: 'tailwindcss',
    percentage: 89,
    createdAt: '2017-11-01',
    updatedAt: '2025-06-15',
    languages: ['CSS', 'JavaScript'],
    difficulties: ['Beginner', 'Intermediate'],
    description: 'A utility-first CSS framework for rapidly building custom user interfaces.',
  },
  {
    repoName: 'vscode',
    percentage: 85,
    createdAt: '2015-04-29',
    updatedAt: '2025-06-10',
    languages: ['TypeScript', 'JavaScript'],
    difficulties: ['Advanced'],
    description: 'Visual Studio Code - Open Source code editor developed by Microsoft.',
  },
  {
    repoName: 'freeCodeCamp',
    percentage: 80,
    createdAt: '2014-10-15',
    updatedAt: '2025-06-12',
    languages: ['JavaScript', 'HTML', 'CSS'],
    difficulties: ['Beginner'],
    description: 'Learn to code for free with millions of other people around the world.',
  },
]

{/* OpenSourceList Component */}
const OpenSourceList = () => {
  const [cards, setCards] = useState(hardcodedCards)

  return (
    <div className="max-w-3xl mx-auto p-6">
        <Navbar />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Open Source Project Recommendations</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {/* Regenerate function */}}
        >
          Regenerate
        </button>
      </div>
      {cards.map((card, idx) => (
        <OpenSourceCard
          key={card.repoName + idx}
          repoName={card.repoName}
          percentage={card.percentage}
          createdAt={card.createdAt}
          updatedAt={card.updatedAt}
          languages={card.languages}
          difficulties={card.difficulties}
          description={card.description}
        />
      ))}
    </div>
  )
}

export default OpenSourceList
