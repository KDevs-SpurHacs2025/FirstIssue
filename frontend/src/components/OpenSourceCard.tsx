import React from 'react'

interface OpenSourceCardProps {
  repoName: string;
  percentage: number;
  createdAt: string;
  updatedAt: string;
  languages: string[];
  difficulties: string[];
  description: string;
  onAdvancedInsights?: () => void;
}

const OpenSourceCard: React.FC<OpenSourceCardProps> = ({
  repoName,
  percentage,
  createdAt,
  updatedAt,
  languages,
  difficulties,
  description,
  onAdvancedInsights
}) => {
  return (
    <div className="bg-white rounded shadow p-6 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{repoName}</h2>
        <span className="text-blue-600 font-semibold">{percentage}% match</span>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        Created: {createdAt} &nbsp;|&nbsp; Updated: {updatedAt}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Languages/Frameworks:</span> {languages.join(', ')}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Difficulties:</span> {difficulties.join(', ')}
      </div>
      <p className="mb-4 text-gray-700">{description}</p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={onAdvancedInsights}
      >
        Advanced Insights
      </button>
    </div>
  )
}

export default OpenSourceCard
