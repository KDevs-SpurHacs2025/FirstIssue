import { useNavigate } from "react-router-dom";
import OpenSourceCard from "../components/OpenSourceCard";
import Navbar from "../components/Navbar";
import {
  useRecommendation,
  useAppDispatch,
  useSurvey,
  useUser,
} from "../hooks/useRedux";
import { usePostApi } from "../hooks/usePostApi";
import {
  setRepositories,
  setLoading,
  clearRecommendations,
} from "../store/slices/recommendationSlice";

// Dummy texts - fallback when no Redux data
const hardcodedCards = [
  {
    repoName: "react",
    percentage: 98,
    createdAt: "2013-05-24",
    updatedAt: "2025-06-20",
    languages: ["JavaScript", "TypeScript"],
    difficulties: ["Intermediate"],
    description:
      "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
  },
  {
    repoName: "nestjs",
    percentage: 92,
    createdAt: "2017-03-01",
    updatedAt: "2025-06-18",
    languages: ["TypeScript"],
    difficulties: ["Intermediate", "Advanced"],
    description:
      "A progressive Node.js framework for building efficient, reliable and scalable server-side applications.",
  },
  {
    repoName: "tailwindcss",
    percentage: 89,
    createdAt: "2017-11-01",
    updatedAt: "2025-06-15",
    languages: ["CSS", "JavaScript"],
    difficulties: ["Beginner", "Intermediate"],
    description:
      "A utility-first CSS framework for rapidly building custom user interfaces.",
  },
  {
    repoName: "vscode",
    percentage: 85,
    createdAt: "2015-04-29",
    updatedAt: "2025-06-10",
    languages: ["TypeScript", "JavaScript"],
    difficulties: ["Advanced"],
    description:
      "Visual Studio Code - Open Source code editor developed by Microsoft.",
  },
  {
    repoName: "freeCodeCamp",
    percentage: 80,
    createdAt: "2014-10-15",
    updatedAt: "2025-06-12",
    languages: ["JavaScript", "HTML", "CSS"],
    difficulties: ["Beginner"],
    description:
      "Learn to code for free with millions of other people around the world.",
  },
];

// OpenSourceList Component
const OpenSourceList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { testUserId } = useUser();
  const survey = useSurvey();
  const { repositories, isLoading, error } = useRecommendation();
  const { post, isLoading: apiLoading } = usePostApi();

  // Redux에서 가져온 추천 데이터를 OpenSourceCard 형태로 변환
  const transformRepositoriesToCards = () => {
    if (repositories.length === 0) {
      return hardcodedCards; // 추천 데이터가 없으면 하드코딩된 데이터 사용
    }

    return repositories.map((repo) => ({
      repoName: repo.name,
      percentage: Math.floor(repo.stars / 100), // stars를 percentage로 간단 변환
      createdAt: repo.lastActivity.split("T")[0], // ISO 날짜를 YYYY-MM-DD 형태로
      updatedAt: repo.lastActivity.split("T")[0],
      languages: [repo.language],
      difficulties: [
        repo.difficulty.charAt(0).toUpperCase() + repo.difficulty.slice(1),
      ],
      description: repo.description || "No description available.",
    }));
  };

  const cards = transformRepositoriesToCards();

  // 재생성 버튼 핸들러
  const handleRegenerate = async () => {
    if (!survey.isCompleted) {
      alert("설문조사를 먼저 완료해주세요.");
      navigate("/survey");
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(clearRecommendations());

      // Survey에서 사용한 것과 동일한 변환 로직
      const repoTypeMapping: { [key: string]: string } = {
        "Web App": "web",
        "Mobile App": "mobile",
        "Desktop App": "desktop",
        Library: "library",
        "CLI Tool": "cli",
        "API/Backend": "backend",
        Other: "other",
      };
      const experienceMapping: { [key: string]: number } = {
        Never: 0,
        "1–2 times": 1,
        "3–5 times": 3,
        "More than 5 times": 6,
      };

      // howContribute 옵션을 간단한 키워드로 매핑
      const contributionMapping: { [key: string]: string } = {
        "Code contributions (bug fixes, refactoring, performance improvements, writing test code)":
          "Code contributions",
        "Documentation (fixing typos, improving grammar, writing API docs, adding tutorials or guides)":
          "Documentation",
        "Design & UI/UX (logos, icons, visual assets)": "Design & UI/UX",
        "Testing & Reviewing (reviewing PRs, testing projects, giving feedback)":
          "Testing & Reviewing",
      };

      const apiData = {
        userId: testUserId,
        reason: survey.whyContribute,
        ContributionDirections: survey.howContribute.map(
          (option) => contributionMapping[option] || option
        ), // 매핑된 간단한 키워드로 변환
        publicRepos: survey.proudProject ? [survey.proudProject] : [],
        repoTypes: survey.proudProjectType
          ? [repoTypeMapping[survey.proudProjectType] || "other"]
          : [],
        well: survey.confidentLangs.filter((lang) => lang.trim() !== ""),
        like: survey.enjoyLangs.filter((lang) => lang.trim() !== ""),
        wishToLearn: survey.learnLangs.filter((lang) => lang.trim() !== ""),
        numOfExperience: experienceMapping[survey.contribCount] || 0,
        experiencedUrls: survey.pastLinks.filter((url) => url.trim() !== ""),
      };
      const result = await post("/generate/recommendations", apiData);

      // API 응답을 Redux에 저장
      // 네트워크 탭에서 보이는 중첩 구조 처리: result.recommendations.recommendations
      if (result && typeof result === "object" && "recommendations" in result) {
        const outerRecommendations = (result as { recommendations: any })
          .recommendations;
        if (outerRecommendations && outerRecommendations.recommendations) {
          const recommendations =
            outerRecommendations.recommendations as unknown[];
          const transformedRepos = recommendations.map(
            (repo: unknown, index: number) => {
              const repoObj = repo as Record<string, unknown>;
              return {
                id: index + 1,
                name: (repoObj["Repo Name"] ||
                  repoObj.name ||
                  repoObj.repoName ||
                  "Unknown") as string,
                fullName: (repoObj["Repo Name"] ||
                  repoObj.fullName ||
                  repoObj.name ||
                  "Unknown") as string,
                description: (repoObj["Short Description"] ||
                  repoObj.description ||
                  "") as string,
                language: ((Array.isArray(repoObj["Languages/Frameworks"]) &&
                  repoObj["Languages/Frameworks"][0]) ||
                  repoObj.language ||
                  (Array.isArray(repoObj.languages) && repoObj.languages[0]) ||
                  "Unknown") as string,
                stars: (repoObj.stars ||
                  repoObj.stargazers_count ||
                  0) as number,
                forks: (repoObj.forks || repoObj.forks_count || 0) as number,
                issues: (repoObj.issues ||
                  repoObj.open_issues_count ||
                  0) as number,
                url: (repoObj["Repo URL"] ||
                  repoObj.url ||
                  repoObj.html_url ||
                  "") as string,
                goodFirstIssues: (repoObj.goodFirstIssues || 0) as number,
                lastActivity: (repoObj["Latest Updated Date"] ||
                  repoObj.lastActivity ||
                  repoObj.updated_at ||
                  new Date().toISOString()) as string,
                difficulty: (repoObj["Difficulties"] ||
                  repoObj.difficulty ||
                  "beginner") as "beginner" | "intermediate" | "advanced",
              };
            }
          );

          dispatch(setRepositories(transformedRepos));
        }
      }

      dispatch(setLoading(false));
    } catch (error) {
      console.error("❌ Regenerate API Error:", error);
      dispatch(setLoading(false));
      alert("새로운 추천을 생성하는 중 오류가 발생했습니다.");
    }
  };

  // 로딩 상태
  if (isLoading || apiLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">
            Loading your recommendations...
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Navbar />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/survey")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go back to Survey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Navbar />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Open Source Project Recommendations
        </h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleRegenerate}
          disabled={isLoading || apiLoading}
        >
          {isLoading || apiLoading ? "Loading..." : "Regenerate"}
        </button>
      </div>

      {repositories.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800">
            No recommendations found. Showing sample data below. Complete the
            survey to get personalized recommendations!
          </p>
        </div>
      )}

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
  );
};

export default OpenSourceList;
