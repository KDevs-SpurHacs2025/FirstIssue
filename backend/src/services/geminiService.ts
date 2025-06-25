import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';
import OpenSourceSurvey, { IOpenSourceSurvey } from '../models/OpenSourceSurvey.js';
import RepoAnalysisResult from '../models/RepoAnalysisResult.js';
import Recommendation, { IRecommendation } from '../models/Recommendation.js';

// --- Type Definitions for AI Analysis (서비스 레이어용 Plain Object 타입) ---
export type SkillLevel = "Novice" | "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface RepoAnalysisResult {
  devDirection: string;
  languages: { name: string; skill: SkillLevel }[];
  frameworks: { name: string; skill: SkillLevel }[];
  packages: { name: string; skill: SkillLevel }[];
  habits: { strengths: string[]; improvements: string[] };
  overallSkillLevel: SkillLevel;
  error?: string;
  detail?: string;
  rawGeminiResponse?: string;
  repoUrl: string;
}

export type UserSurveyAnswers = Omit<IOpenSourceSurvey, 'userId' | 'createdAt' | '_id' | '__v'>;

export interface ContributionDirection {
  number: number;
  title: string;
  description: string;
}

export type OpenSourceRecommendation = Omit<IRecommendation, 'userId' | 'createdAt' | '_id' | '__v'>;

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
): Promise<RepoAnalysisResult & { repoUrl: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.error('Error: GEMINI_API_KEY is not set in environment variables for repo analysis.');
    return {
      devDirection: 'N/A', languages: [], frameworks: [], packages: [],
      habits: { strengths: [], improvements: [] }, overallSkillLevel: 'Novice',
      error: 'Failed to analyze with Gemini',
      detail: 'API Key not configured.',
      repoUrl
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
      return {
        devDirection: 'N/A', languages: [], frameworks: [], packages: [],
        habits: { strengths: [], improvements: [] }, overallSkillLevel: 'Novice',
        error: 'Failed to analyze with Gemini',
        detail: 'Invalid response from Gemini API',
        rawGeminiResponse: result?.response?.text() || 'No text in response',
        repoUrl
      };
    }

    const text = result.response.text();
    const jsonString = text.replace(/```json\n|```/g, '').trim();
    logger.info(`Gemini API response for ${repoUrl}:`, jsonString);

    let analysis: RepoAnalysisResult;
    try {
      analysis = JSON.parse(jsonString);
    } catch (parseError: any) {
      logger.error(`Failed to parse Gemini API response for ${repoUrl} as JSON:`, parseError);
      return {
        devDirection: 'N/A', languages: [], frameworks: [], packages: [],
        habits: { strengths: [], improvements: [] }, overallSkillLevel: 'Novice',
        error: 'Failed to parse Gemini response',
        detail: parseError.message,
        rawGeminiResponse: text,
        repoUrl
      };
    }
    return { ...analysis, repoUrl };
  } catch (err: any) {
    logger.error(`Error calling Gemini API for repo ${repoUrl}:`, err.message);
    return {
      devDirection: 'N/A', languages: [], frameworks: [], packages: [],
      habits: { strengths: [], improvements: [] }, overallSkillLevel: 'Novice',
      error: 'Failed to analyze with Gemini',
      detail: err.message,
      repoUrl
    };
  }
}

// --- analyzeUserOpenSourceProfile function ---
/**
 * Analyzes user survey answers and pre-analyzed Git repository profiles to recommend open-source
 * contribution projects using the Gemini API.
 * @param answers User's survey answers data.
 * @param repoAnalyses Array of pre-analyzed repository profiles (from analyzeGitRepoProfile)
 * @returns A JSON object containing success status and a list of recommended open-source projects.
 */
export async function analyzeUserOpenSourceProfile(
  answers: UserSurveyAnswers,
  repoAnalyses: (RepoAnalysisResult & { repoUrl: string })[]
): Promise<{ success: boolean; recommendations: OpenSourceRecommendation[] } | { error: string; detail: string; rawResponse?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.error('Error: GEMINI_API_KEY is not set in environment variables.');
    return { error: 'Failed to analyze with Gemini', detail: 'API Key not configured.' };
  }

  try {
    const todayDate = getTodayDateString();

    let overallHighestSkill: SkillLevel = "Novice";
    const skillOrder: SkillLevel[] = ["Novice", "Beginner", "Intermediate", "Advanced", "Expert"];

    for (let i = 0; i < repoAnalyses.length; i++) {
      const analysis = repoAnalyses[i];
      if (analysis && analysis.overallSkillLevel) {
        const currentSkillIndex = skillOrder.indexOf(analysis.overallSkillLevel);
        const highestSkillIndex = skillOrder.indexOf(overallHighestSkill);
        if (currentSkillIndex > highestSkillIndex) {
          overallHighestSkill = analysis.overallSkillLevel;
        }
      }
    }

    // Determine the maximum allowed difficulty for recommendations
    let maxRecommendedDifficulty: SkillLevel = overallHighestSkill;
    if (answers.numOfExperience === 0) {
      const highestSkillIndex = skillOrder.indexOf(overallHighestSkill);
      if (highestSkillIndex > 0) {
        maxRecommendedDifficulty = skillOrder[highestSkillIndex - 1];
      } else {
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
        if (url && url.trim() !== "") {
          experienceList += `      - ${url}\n`;
        }
      }
    }
    if (experienceList === '') {
        experienceList = '      N/A\n';
    }

    // Format repo analysis summary as a JSON string for the prompt
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
    - ContributionDirections (A list of **1 to 3 highly specific and actionable ways** the user can contribute to this project, based on their skills and the project's nature. Each item must be an object with 'number', 'title', and 'description' fields. The 'number' field is a sequential integer starting from 1, representing the action's order from easiest to most challenging. The array MUST be sorted by this 'number' field.
      Guidance for 'description' content based on difficulty:
        1. **Novice/Beginner:** Focus on tasks with low barrier to entry like documentation improvements (fix typos, add missing examples), README enhancements, translation work, or very simple UI fixes. Helps user understand basic project structure and Git workflow.
        2. **Intermediate:** Focus on tasks requiring some codebase understanding like fixing 'good first issue' bugs, adding small well-defined features, writing new test cases, or minor refactorings. Helps user deepen technical skills.
        3. **Advanced/Expert:** Focus on complex tasks like designing/implementing major new features, performance optimization, architecture improvements, or security enhancements. Requires deep project knowledge.)

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
    "ContributionDirections": [
      {
        "number": 1,
        "title": "Documentation Enhancement",
        "description": "Start by improving existing documentation - fix typos, add missing examples, or clarify confusing explanations. This requires minimal setup and helps you understand the project structure."
      },
      {
        "number": 2,
        "title": "Bug Fixing",
        "description": "Identify and fix beginner-friendly bugs labeled as 'good first issue', focusing on issues related to UI components or data validation that match your skill level."
      },
      {
        "number": 3,
        "title": "Feature Development",
        "description": "After gaining familiarity with the codebase, contribute to new feature development by implementing small, well-defined enhancements that align with your technical strengths."
      }
    ]
  }
]
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite', generationConfig: { temperature: 0.7 } });
    const result = await model.generateContent(prompt);

    if (!result || !result.response || !result.response.text) {
      logger.error('Gemini API did not return a valid response for recommendations.');
      return { error: 'Failed to analyze with Gemini', detail: 'Invalid response from Gemini API' };
    }

    const text = result.response.text();
    const jsonString = text.replace(/```json\n|```/g, '').trim();
    logger.info('Gemini API response for recommendations:', jsonString);

    let analysis: { success: boolean; recommendations: OpenSourceRecommendation[] };
    try {
      analysis = {
        success: true,
        recommendations: JSON.parse(jsonString) as OpenSourceRecommendation[]
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