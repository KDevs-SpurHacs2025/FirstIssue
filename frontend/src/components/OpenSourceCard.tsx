import React, { useState } from "react";
import { motion } from "framer-motion";
import { cardHoverMotion } from "../animations/listAnimation";

interface OpenSourceCardProps {
  repoId: number;
  repoName: string;
  percentage: number;
  createdAt: string;
  updatedAt: string;
  languages: string[];
  difficulties: string[];
  description: string;
  reasonForRecommendation?: string; 
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
  reasonForRecommendation,
  url,
  onAdvancedInsights,
}) => {

  // Hover cards
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      {...cardHoverMotion}
      className="relative bg-blue-light/80 border border-blue-900/30 shadow-lg shadow-blue-900/10 rounded-2xl p-6 mb-8 w-full cursor-pointer group"
      tabIndex={0}
      role="button"
      onClick={() => onAdvancedInsights?.(repoId)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top: Repo Name & Difficulties (left), Percentage (right) */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
  <div className="flex items-center gap-3">
    {url ? (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xl font-bold text-white hover:text-cyan-200 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {repoName}
      </a>
    ) : (
      <span className="text-xl font-bold text-white">{repoName}</span>
    )}
    {/* Improved Difficulty Badge(s) */}
    {difficulties.map((diff, idx) => (
      <span
        key={diff + idx}
        className={
          "px-2 py-0.5 rounded text-xs font-semibold shadow " +
          (diff.toLowerCase() === "beginner"
            ? "bg-green-500/80 text-white"
            : diff.toLowerCase() === "intermediate"
            ? "bg-yellow-500/80 text-white"
            : "bg-pink-600/80 text-white")
        }
        style={{
          letterSpacing: "0.02em",
          textShadow: "0 1px 4px rgba(0,0,0,0.10)",
        }}
      >
        {diff}
      </span>
    ))}
    <span className="px-2 py-0.5 rounded text-xs font-semibold shadow bg-blue-700/80 text-white"  
    style={{
          letterSpacing: "0.02em",
          textShadow: "0 1px 4px rgba(0,0,0,0.10)",
        }}>Good First Issue</span>
  </div>
<span
  className="text-cyan-100 text-base font-bold ml-4"
>
  {percentage}% match
</span>
</div>
      {/* Dates */}
      <div className="flex flex-wrap gap-2 text-xs text-text-gray">
        <span>Created: {createdAt}</span>
        <span>Updated: {updatedAt}</span>
      </div>
      {/* Languages - Liquid Glass Effect */}
       <div className="flex flex-wrap gap-2 my-3">
        {languages.map((lang, idx) => (
          <span
            key={lang + idx}
            className="backdrop-blur-md border border-cyan-100/10 shadow-inner text-cyan-100 px-3 py-1 rounded-xl text-xs font-semibold"
            style={{
              background:
                "linear-gradient(120deg, rgba(43, 86, 215, 0.1) 10%, rgba(114, 139, 238, 0.06) 100%)",
              boxShadow: "0 4px 24px 0 rgba(0,255,255,0.07)",
              border: "1px solid rgba(180,255,255,0.08)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {lang}
          </span>
        ))}
      </div>
      {/* Description */}
      <div className="text-sm text-text-gray-light mb-3">{description}</div>
      
      {/* Reason for Recommendation */}
        {hovered && (
        <div className="absolute inset-0 bg-bg-black rounded-2xl flex flex-col items-center justify-center z-20 px-10 py-6 transition-all duration-300 ease-in-out">
          <p className="text-text-gray-light text-sm font-semibold mb-2 text-center">
            ✨ {reasonForRecommendation}
          </p>
          <p className="text-cyan-200 text-xs text-center mt-2">
            <span className="font-bold">Click to view advanced insights and use the chatbot!</span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default OpenSourceCard;