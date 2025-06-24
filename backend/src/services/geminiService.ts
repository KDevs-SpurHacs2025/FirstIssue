import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger'; // Assuming you have a logger utility

// --- Type Definitions for AI Analysis ---
// These type definitions clarify the JSON structure that the AI should generate
// when analyzing a repository. The prompts will enforce that the AI strictly
// adheres to this structure and the specified skill levels.
export type SkillLevel = "Novice" | "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface RepoAnalysisResult {
  devDirection: string; // Overall Development Direction/Focus (e.g., "Web Frontend", "Backend API")
  languages: { name: string; skill: SkillLevel }[];
  frameworks: { name: string; skill: SkillLevel }[];
  packages: { name: string; skill: SkillLevel }[];
  habits: { strengths: string[]; improvements: string[] };
  overallSkillLevel: SkillLevel; // A single summarized skill level for the developer based on all findings
  // Optional fields for error handling or raw response from Gemini
  error?: string;
  detail?: string;
  rawGeminiResponse?: string;
}

// --- Type Definition for User Survey Answers ---
export interface UserSurveyAnswers {
  reason: string;
  publicRepos: string[];
  repoTypes: string[]; // e.g., 'web', 'mobile', 'backend'
  well: string[]; // Languages/frameworks user is good at
  like: string[]; // Languages/frameworks user likes
  wishToLearn: string[]; // Languages/frameworks user wants to learn
  numOfExperience: number; // Number of past open-source contributions (0 for first-timer)
  experiencedUrls: string[]; // URLs of previous open-source contributions
}

// --- Type Definition for Open Source Recommendation Output ---
export interface OpenSourceRecommendation {
  Rank: number; // 1-5, 1 being the most recommended
  SuitabilityScore: string; // e.g., "95%"
  RepoName: string;
  RepoURL: string;
  CreatedDate: string; // YYYY-MM-DD
  LatestUpdatedDate: string; // YYYY-MM-DD
  LanguagesFrameworks: string[];
  Difficulties: SkillLevel; // One of Novice | Beginner | Intermediate | Advanced | Expert
  ShortDescription: string;
  ReasonForRecommendation: string; // Concise explanation
  CurrentStatusDevelopmentDirection: string;
  GoodFirstIssue: boolean; // true if the project currently has beginner-friendly issues
  ContributionDirections: string[]; // Specific ways a user can contribute (e.g., "Fixing beginner bugs", "Improving documentation")
}

// --- Helper function to get current date in YYYY-MM-DD format ---
function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// --- analyzeGitRepoProfile function ---
/**
 * Analyzes a single public Git repository to infer the developer's profile
 * using Gemini API.
 * @param repoUrl The URL of the public Git repository to analyze.
 * @param repoType The type of the repository (e.g., 'web', 'mobile').
 * @returns A JSON object representing the developer's profile analysis.
 */
export async function analyzeGitRepoProfile(
  repoUrl: string,
  repoType?: string
): Promise<RepoAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.error('Error: GEMINI_API_KEY is not set in environment variables for repo analysis.');
    // Return a default/error analysis result following the RepoAnalysisResult interface
    return {
      devDirection: 'N/A', languages: [], frameworks: [], packages: [],
      habits: { strengths: [], improvements: [] }, overallSkillLevel: 'Novice',
      error: 'Failed to analyze with Gemini',
      detail: 'API Key not configured.'
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `
You are an expert open-source code reviewer and developer profiler.
Given the following public GitHub repository URL and its type, analyze the repository and infer the following about the primary development characteristics and the likely main developer's profile:

- Overall Development Direction/Focus: (e.g., Web Frontend, Backend API, Mobile Android, Data Science, DevOps, etc.)
- Identified Core Languages: (List languages used, with inferred skill level: Novice | Beginner | Intermediate | Advanced | Expert)
- Identified Core Frameworks: (List frameworks used, with inferred skill level: Novice | Beginner | Intermediate | Advanced | Expert)
- Key Packages/Libraries Used: (List major packages/libraries, with inferred usage skill level: Novice | Beginner | Intermediate | Advanced | Expert. Focus on those that reveal specific domain knowledge.)
- Development Habits:
    - Strengths: (List specific strong points in coding style, project structure, problem-solving, etc.)
    - Areas for Improvement: (List specific areas where skills or practices could be enhanced, e.g., testing, documentation, performance optimization, error handling.)
- Overall Skill Level: (A single summarized skill level for the developer based on all findings: Novice | Beginner | Intermediate | Advanced | Expert)

Repository URL: ${repoUrl}
Repository Type: ${repoType || 'N/A'} (Use this type to guide your analysis focus)

Return the result as a JSON object with the following structure:
{
  "devDirection": "string",
  "languages": [{ "name": "string", "skill": "Novice | Beginner | Intermediate | Advanced | Expert" }],
  "frameworks": [{ "name": "string", "skill": "Novice | Beginner | Intermediate | Advanced | Expert" }],
  "packages": [{ "name": "string", "skill": "Novice | Beginner | Intermediate | Advanced | Expert" }],
  "habits": { "strengths": ["string"], "improvements": ["string"] },
  "overallSkillLevel": "Novice | Beginner | Intermediate | Advanced | Expert"
}
`;

    const result = await model.generateContent(prompt);
    if (!result || !result.response || !result.response.text) {
      logger.error('Gemini API did not return a valid response for repo analysis.');
      // Return a default/error analysis result following the RepoAnalysisResult interface
      return {
        devDirection: 'N/A', languages: [], frameworks: [], packages: [],
        habits: { strengths: [], improvements: [] }, overallSkillLevel: 'Novice',
        error: 'Failed to analyze with Gemini',
        detail: 'Invalid response from Gemini API',
        rawGeminiResponse: result?.response?.text() || 'No text in response' // Provide raw response for debugging
      };
    }

    const text = result.response.text();
    // Remove markdown code block fences (```json\n and ```) from the response text
    const jsonString = text.replace(/```json\n|```/g, '').trim();
    logger.info(`Gemini API response for ${repoUrl}:`, jsonString);

    let analysis: RepoAnalysisResult; // Declare analysis with its proper type
    try {
      analysis = JSON.parse(jsonString);
    } catch (parseError: any) {
      logger.error(`Failed to parse Gemini API response for ${repoUrl} as JSON:`, parseError);
      // Return a default/error analysis result if JSON parsing fails
      return {
        devDirection: 'N/A', languages: [], frameworks: [], packages: [],
        habits: { strengths: [], improvements: [] }, overallSkillLevel: 'Novice',
        error: 'Failed to parse Gemini response',
        detail: parseError.message,
        rawGeminiResponse: text
      };
    }
    return analysis;
  } catch (err: any) {
    logger.error(`Error calling Gemini API for repo ${repoUrl}:`, err.message);
    // Return a default/error analysis result if API call fails
    return {
      devDirection: 'N/A', languages: [], frameworks: [], packages: [],
      habits: { strengths: [], improvements: [] }, overallSkillLevel: 'Novice',
      error: 'Failed to analyze with Gemini',
      detail: err.message
    };
  }
}

// --- analyzeUserOpenSourceProfile function ---
/**
 * Analyzes user survey answers and Git repository profiles to recommend open-source
 * contribution projects using the Gemini API.
 * @param answers User's survey answers data.
 * @returns A JSON object containing success status and a list of recommended open-source projects.
 */
export async function analyzeUserOpenSourceProfile(
  answers: UserSurveyAnswers
): Promise<{ success: boolean; recommendations: OpenSourceRecommendation[] } | { error: string; detail: string; rawResponse?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.error('Error: GEMINI_API_KEY is not set in environment variables.');
    return { error: 'Failed to analyze with Gemini', detail: 'API Key not configured.' };
  }

  try {
    const todayDate = getTodayDateString();

    // Analyze each public repo using analyzeGitRepoProfile
    const repoAnalyses: RepoAnalysisResult[] = [];
    let overallHighestSkill: SkillLevel = "Novice"; // Track the highest skill level found across all repos
    const skillOrder: SkillLevel[] = ["Novice", "Beginner", "Intermediate", "Advanced", "Expert"];

    for (let i = 0; i < answers.publicRepos.length; i++) {
      const repoUrl = answers.publicRepos[i];
      const repoType = answers.repoTypes && answers.repoTypes[i] ? answers.repoTypes[i] : 'N/A';
      if (repoUrl) {
        try {
          const analysis = await analyzeGitRepoProfile(repoUrl, repoType);
          repoAnalyses.push(analysis);

          // Update overallHighestSkill based on the current repo's overallSkillLevel
          if (analysis.overallSkillLevel) {
            const currentSkillIndex = skillOrder.indexOf(analysis.overallSkillLevel);
            const highestSkillIndex = skillOrder.indexOf(overallHighestSkill);
            if (currentSkillIndex > highestSkillIndex) {
              overallHighestSkill = analysis.overallSkillLevel;
            }
          }

        } catch (err: any) {
          logger.error(`Failed to analyze repo ${repoUrl} for recommendations:`, err.message);
          // Push a partial/error analysis to ensure the prompt structure remains consistent,
          // but indicate it's an error.
          repoAnalyses.push({
            devDirection: 'N/A', languages: [], frameworks: [], packages: [],
            habits: { strengths: [], improvements: [] }, overallSkillLevel: 'Novice',
            error: 'Failed to analyze this repo',
            detail: err.message
          });
        }
      }
    }

    // Determine the maximum allowed difficulty for recommendations
    let maxRecommendedDifficulty: SkillLevel = overallHighestSkill;
    if (answers.numOfExperience === 0) { // If the user has no prior open-source experience
      const highestSkillIndex = skillOrder.indexOf(overallHighestSkill);
      if (highestSkillIndex > 0) { // If not already Novice, reduce skill level by one
        maxRecommendedDifficulty = skillOrder[highestSkillIndex - 1];
      } else { // If already Novice, recommend Novice projects
        maxRecommendedDifficulty = "Novice";
      }
      logger.info(`User has 0 experience, adjusting max recommended difficulty from ${overallHighestSkill} to ${maxRecommendedDifficulty}`);
    }


    // Format public repos list for the prompt string
    let repoList = '';
    for (let i = 0; i < answers.publicRepos.length; i++) {
      const repo = answers.publicRepos[i] || 'N/A';
      const type = answers.repoTypes && answers.repoTypes[i] ? answers.repoTypes[i] : 'N/A';
      repoList += `    ${i + 1}. URL: ${repo}, Type: ${type}\n`;
    }

    // Format previous open source experience URLs as a list for the prompt string
    let experienceList = '';
    if (answers.experiencedUrls && answers.experiencedUrls.length > 0) {
      for (let i = 0; i < answers.experiencedUrls.length; i++) {
        const url = answers.experiencedUrls[i];
        if (url && url.trim() !== "") { // Filter out empty strings if any
          experienceList += `      - ${url}\n`;
        }
      }
    }
    if (experienceList === '') { // If no valid URLs, state N/A to the AI
        experienceList = '      N/A\n';
    }


    // Format repo analysis summary as a JSON string for the prompt
    // This will now be a JSON array of analysis results generated by analyzeGitRepoProfile
    const repoAnalysisSummary = JSON.stringify(repoAnalyses, null, 2);


    const prompt = `
You are an AI assistant specialized in open-source contribution recommendations. You will analyze user survey responses, public Git repos (with types), and provided AI-based repo analysis (developer style, skills, strengths, weaknesses).

1. Analyze user survey for motivation, preferred languages/frameworks, and learning interests.

2. Analyze user's public Git repos using provided AI-based analysis (languages, types, code quality, contribution patterns, strengths, weaknesses, development style). AI analysis is a key basis.

3. Recommend 5 suitable open-source projects. Strict rules:
    - 'Difficulties' must NOT exceed highest skill level in AI-based repo analysis. The maximum allowed difficulty for recommendations is: ${maxRecommendedDifficulty}.
    - Project's 'Latest Updated Date' MUST be within the last 6 months from TODAY's date: ${todayDate}. This is a non-negotiable hard filter.
    - Prioritize projects with 'good first issue' or similar.
    - Crucially, ensure at least one recommended project directly aligns with one of the user's 'wishToLearn' languages or frameworks (e.g., Python, Three.js), providing a clear path for learning that new technology.
    - IF 'numOfExperience' is 0, the recommended projects should generally be one level easier than the user's highest measured skill level. Specifically, if the user's 'overallSkillLevel' from AI analysis is 'Beginner', recommend 'Novice' projects. If it's 'Intermediate', recommend 'Beginner' projects. If it's 'Advanced', recommend 'Intermediate' projects, and so on. This is to ensure a smooth first contribution experience.

    Prioritization: 1) User survey, 2) Public repos/habits, 3) AI-based skill/habit analysis.

4. For each recommendation, provide:
    - Rank (1-5, 1=most recommended)
    - Suitability Score (0-100%, e.g., 87%. Reflects alignment with survey, repo content/skills, project activity/good first issues.)
    - Repo Name
    - Repo URL
    - Created Date
    - Latest Updated Date
    - Languages/Frameworks
    - Difficulties (Novice | Beginner | Intermediate | Advanced | Expert, based on user's skill, NOT exceeding their highest measured skill. **Strictly use one of these five levels.**)
    - Short Description
    - ReasonForRecommendation (A **very concise, one-sentence summary** explaining the primary reason this project is suitable for the user, referencing their skills/interests and repo analysis. Example: "This project directly aligns with the user's React skills and their wish to learn Three.js, leveraging their frontend development strengths.")
    - CurrentStatusDevelopmentDirection (Information about recent activity and future plans.)
    - GoodFirstIssue (true/false)
    - ContributionDirections (A list of **1 to 3 highly specific and actionable ways** the user can contribute to this project, based on their skills and the project's nature. Each item should be a clear, concise action. Example: ["Fix beginner-friendly bugs.", "Improve component documentation for new features.", "Write unit tests for core functionalities."])

Survey Responses:
- Q1. Reason for contributing to open source: ${answers.reason}
- Q2. Public Git repos and types:\n${repoList}
- Q3. Languages/Frameworks you are good at (well): ${answers.well.join(', ')}
- Q4. Languages/Frameworks you like: ${answers.like.join(', ')}
- Q5. Languages/Frameworks you want to learn: ${answers.wishToLearn.join(', ')}
- Q6. Number of open source projects participated: ${answers.numOfExperience}
- Q7. Previous open source experience URLs (up to 5):\n${experienceList}

AI-based Analysis of User's Public Git Repositories:
// This section contains an array of JSON objects, where each object is the analysis result for a user's public repository.
// Each analysis object will strictly follow the structure defined in analyzeGitRepoProfile function's prompt,
// including 'Novice | Beginner | Intermediate | Advanced | Expert' for skill levels.
${repoAnalysisSummary}

You must provide 5 recommendations, each with the required fields. The recommendations should be diverse and cover different areas of open source contribution, such as documentation, code contributions, testing, etc. Ensure that the recommendations are tailored to the user's skills and interests, and that the ReasonForRecommendation field always references the user's public repos, their content, and the AI-based repo analysis.
Specifically, at least one recommendation MUST be directly related to a language or framework listed in 'wishToLearn'.
Double-check that ALL recommended projects strictly adhere to the 'Latest Updated Date' rule (within 6 months from today: ${todayDate}).
Output Format (Strictly follow this JSON array structure):
[
  {
    "Rank": 1,
    "Suitability Score": "95%",
    "Repo Name": "project_name_1",
    "Repo URL": "https://github.com/owner/project_name_1",
    "Created Date": "YYYY-MM-DD",
    "Latest Updated Date": "YYYY-MM-DD",
    "Languages/Frameworks": ["Lang1", "Framework1"],
    "Difficulties": "Novice | Beginner | Intermediate | Advanced | Expert",
    "Short Description": "A brief description of the project.",
    "ReasonForRecommendation": "A very concise, one-sentence summary explaining the primary reason this project is suitable for the user, referencing their skills/interests and repo analysis.",
    "CurrentStatusDevelopmentDirection": "Information about recent activity and future plans.",
    "GoodFirstIssue": true,
    "ContributionDirections": ["Fix beginner-friendly bugs.", "Improve component documentation.", "Add new test cases."]
  }
]
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    // It's generally good practice to specify a temperature if you want more (or less) creative output
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite', generationConfig: { temperature: 0.7 } });
    const result = await model.generateContent(prompt);

    if (!result || !result.response || !result.response.text) {
      logger.error('Gemini API did not return a valid response for recommendations.');
      return { error: 'Failed to analyze with Gemini', detail: 'Invalid response from Gemini API' };
    }

    const text = result.response.text();
    // Clean JSON string by removing markdown backticks
    const jsonString = text.replace(/```json\n|```/g, '').trim();
    logger.info('Gemini API response for recommendations:', jsonString);

    let analysis: { success: boolean; recommendations: OpenSourceRecommendation[] };
    try {
      analysis = {
        success: true, // Assuming success if parsing is successful
        recommendations: JSON.parse(jsonString) as OpenSourceRecommendation[] // Cast to array of recommendations
      };
    } catch (parseError: any) {
      logger.error('Failed to parse Gemini API response as JSON for recommendations:', parseError);
      return { error: 'Failed to parse Gemini response', detail: parseError.message, rawResponse: text };
    }
    return analysis;
  } catch (err: any) {
    logger.error('Error calling Gemini API for recommendations:', err.message);
    return { error: 'Failed to analyze with Gemini', detail: err.message };
  }
}