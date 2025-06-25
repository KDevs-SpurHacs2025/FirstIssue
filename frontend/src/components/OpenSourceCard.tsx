import React from "react";

interface OpenSourceCardProps {
  repoId: number;
  repoName: string;
  percentage: number;
  createdAt: string;
  updatedAt: string;
  languages: string[];
  difficulties: string[];
  description: string;
  url?: string; // Repository URL
  contributionDirections?: string[];
  onAdvancedInsights?: (repoId: number) => void;
}

const OpenSourceCard: React.FC<OpenSourceCardProps> = ({
  repoId,
  repoName,
  percentage,
  createdAt,
  updatedAt,
  languages,
  difficulties,
  description,
  url,
  onAdvancedInsights,
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
        <span className="font-semibold">Languages/Frameworks:</span>{" "}
        {languages.join(", ")}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Difficulties:</span>{" "}
        {difficulties.join(", ")}
      </div>
      <p className="mb-4 text-gray-700">{description}</p>
      {url && (
        <div className="mb-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View Repository
          </a>
        </div>
      )}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => onAdvancedInsights?.(repoId)}
      >
        Advanced Insights
      </button>
    </div>
  );
};

export default OpenSourceCard;
