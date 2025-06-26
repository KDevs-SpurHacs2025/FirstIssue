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
import Footer from "../components/Footer";
import GradientButton from "../components/GradientButton";
import { emptyIconDrawMotion } from "../animations/listAnimation";
import { motion } from "framer-motion";
import LoadingScreen from "../components/LoadingScreen";
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
    return repositories.map((repo) => ({
      repoId: repo.id,
      repoName: repo.name,
      percentage: repo.stars, // Suitability Score를 percentage로 사용
      createdAt: repo.createdAt
        ? repo.createdAt.split("T")[0]
        : repo.lastActivity.split("T")[0], // Created Date 우선 사용
      updatedAt: repo.lastActivity.split("T")[0],
      languages: repo.language.split(", "), // 문자열을 배열로 분할
      difficulties: [
        repo.difficulty.charAt(0).toUpperCase() + repo.difficulty.slice(1),
      ],
      description: repo.description || "No description available.",
      reasonForRecommendation: repo.reasonForRecommendation || "", // Add reason for recommendation
      url: repo.url, // Repository URL 추가
    }));
  };

  const cards = transformRepositoriesToCards();

  // Advanced Insights 핸들러 - OpenSourceDetail로 이동
  const handleAdvancedInsights = (repoId: number) => {
    navigate(`/open-source-detail/${repoId}?userId=${testUserId}`);
  };

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
      console.log("📥 Regenerate API Response:", result);

      // API 응답에서 사용 가능한 모든 필드 확인 (개발용)
      if (result && typeof result === "object" && "recommendations" in result) {
        const recommendations = (result as { recommendations: unknown[] })
          .recommendations;
        if (Array.isArray(recommendations) && recommendations.length > 0) {
          console.log(
            "🔍 Available fields in first recommendation:",
            Object.keys(recommendations[0] as Record<string, unknown>)
          );
        }
      } // API 응답을 Redux에 저장
      if (result && typeof result === "object" && "recommendations" in result) {
        const recommendations = (result as { recommendations: unknown[] })
          .recommendations;

        if (Array.isArray(recommendations) && recommendations.length > 0) {
          const transformedRepos = recommendations.map(
            (repo: unknown, index: number) => {
              const repoObj = repo as Record<string, unknown>;

              // ContributionDirections 파싱
              let contributionDirections: Array<{
                number: number;
                title: string;
                description: string;
              }> = [];

              if (Array.isArray(repoObj["ContributionDirections"])) {
                contributionDirections = repoObj["ContributionDirections"].map(
                  (direction: unknown, idx: number) => {
                    const directionObj = direction as Record<string, unknown>;
                    return {
                      number: (directionObj.number || idx + 1) as number,
                      title: (directionObj.title ||
                        `Contribution ${idx + 1}`) as string,
                      description: (directionObj.description || "") as string,
                    };
                  }
                );
              }

              return {
                id: index + 1,
                name: (repoObj["Repo Name"] || "Unknown") as string,
                fullName: (repoObj["Repo Name"] || "Unknown") as string,
                description: (repoObj["Short Description"] || "") as string,
                language: (Array.isArray(repoObj["Languages/Frameworks"])
                  ? repoObj["Languages/Frameworks"].join(", ")
                  : "Unknown") as string,
                stars: parseInt(
                  (repoObj["Suitability Score"] as string)?.replace("%", "") ||
                    "0"
                ),
                forks: 0,
                issues: 0,
                url: (repoObj["Repo URL"] || "") as string,
                goodFirstIssues: Boolean(repoObj["GoodFirstIssue"]),
                createdAt: (repoObj["Created Date"] || "") as string,
                lastActivity: (repoObj["Latest Updated Date"] ||
                  new Date().toISOString()) as string,
                difficulty: (repoObj["Difficulties"] || "beginner") as
                  | "beginner"
                  | "intermediate"
                  | "advanced",
                contributionDirections,
                reasonForRecommendation: (repoObj["ReasonForRecommendation"] ||
                  "") as string,
                currentStatusDevelopmentDirection: (repoObj[
                  "CurrentStatusDevelopmentDirection"
                ] || "") as string,
              };
            }
          );

          dispatch(setRepositories(transformedRepos));
          console.log("✅ Repositories saved to Redux:", transformedRepos);
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
    return <LoadingScreen title="Loading your recommendations..." />;
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
    <div className="w-full h-auto bg-bg-black pt-[120px]">
      {/* Navbar and Header */}
      <Navbar />
      <div className="flex justify-center items-center mb-8 px-40">
        <h1 className="text-3xl font-bold text-white">Top Projects for You</h1>
      </div>
      <div className="flex justify-end items-center mb-6 px-40">
        <GradientButton
          onClick={handleRegenerate}
          className="px-6 py-2 rounded-lg text-white font-semibold flex items-center"
          disabled={isLoading || apiLoading}
        >
          Find More
        </GradientButton>
      </div>
      {/* No repository page */}
      {repositories.length === 0 && (
        <div className="text-center py-48">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <motion.path
                {...emptyIconDrawMotion}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-medium text-white mb-2">
            No recommendations yet
          </h3>
          <p className="text-text-gray-light text-sm mb-6">
            Complete the survey to get personalized open source project
            recommendations
          </p>
          <GradientButton
            onClick={() => navigate("/survey")}
            className="px-6 py-2 rounded-lg text-white font-semibold transition-transform hover:scale-105"
          >
            Take Survey
          </GradientButton>
        </div>
      )}{" "}
      {repositories.length > 0 &&
        cards.map((card, idx) => (
          <div className="w-full h-auto px-40">
            <OpenSourceCard
              key={card.repoName + idx}
              repoId={card.repoId}
              repoName={card.repoName}
              percentage={card.percentage}
              createdAt={card.createdAt}
              updatedAt={card.updatedAt}
              languages={card.languages}
              difficulties={card.difficulties}
              description={card.description}
              reasonForRecommendation={card.reasonForRecommendation}
              url={card.url}
              onAdvancedInsights={handleAdvancedInsights}
            />
          </div>
        ))}
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OpenSourceList;
