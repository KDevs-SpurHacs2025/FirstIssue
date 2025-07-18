import React from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey, useAppDispatch, useUser } from "../hooks/useRedux";
import { usePostApi } from "../hooks/usePostApi";
import Navbar from "../components/Navbar";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import GradientButton from "../components/GradientButton";
import {
  setWhyContribute,
  setHowContribute,
  setProudProject,
  setProudProjectType,
  setConfidentLangs,
  setEnjoyLangs,
  setLearnLangs,
  setContribCount,
  setPastLinks,
  completeSurvey,
  resetSurvey, // 초기화 액션 추가
} from "../store/slices/surveySlice";

import {
  setRepositories,
  setLoading,
  clearRecommendations,
} from "../store/slices/recommendationSlice";
import { motion } from "framer-motion";
import { questionBlockMotion } from "../animations/surveyAnimation";
import Footer from "../components/Footer";
import LoadingScreen from "../components/LoadingScreen";
import AutocompleteTagsInput from "../components/AutocompleteTagsInput";

// localStorage 관리 함수들
interface SurveyAnswers {
  whyContribute: string;
  howContribute: string[];
  proudProject: string;
  proudProjectType: string;
  confidentLangs: string[];
  enjoyLangs: string[];
  learnLangs: string[];
  contribCount: string;
  pastLinks: string[];
}

const saveSurveyAnswers = (userId: string, answers: SurveyAnswers) => {
  try {
    const existingData = JSON.parse(
      localStorage.getItem("surveyAnswers") || "{}"
    );
    existingData[userId] = answers;
    localStorage.setItem("surveyAnswers", JSON.stringify(existingData));
    console.log(`💾 Survey answers saved for userId: ${userId}`);
  } catch (error) {
    console.error("❌ Error saving survey answers:", error);
  }
};

const loadSurveyAnswers = (userId: string): SurveyAnswers | null => {
  try {
    const existingData = JSON.parse(
      localStorage.getItem("surveyAnswers") || "{}"
    );
    return existingData[userId] || null;
  } catch (error) {
    console.error("❌ Error loading survey answers:", error);
    return null;
  }
};

// Classes for consistent styling
const questionBlockClass =
  "p-8 rounded-2xl bg-blue-light border border-blue-900/30 shadow-xl shadow-blue-900/10 transition-transform question-block";
const inputClass =
  "w-full mt-2 p-3 border rounded text-text-gray-light bg-bg-black focus:ring-2 focus:primary focus:outline-none text-sm";
const selectClass =
  "p-3 border rounded text-text-gray bg-bg-black focus:ring-2 focus:primary focus:outline-none text-sm";
const iconButtonClass =
  "bg-white p-3 rounded flex items-center justify-center transition-transform hover:scale-105";
const addButtonClass =
  "bg-white px-3 py-2 rounded flex items-center justify-center mt-3 transition-transform hover:scale-105 text-sm";

// Options
const whyOptions = [
  "I want to contribute using the languages or frameworks I'm confident in.",
  "I want to learn new programming languages or frameworks through contribution.",
  "I want to contribute to a specific open-source project I like",
];
const howOptions = [
  "Code contributions (bug fixes, refactoring, performance improvements, writing test code)",
  "Documentation (fixing typos, improving grammar, writing API docs, adding tutorials or guides)",
  "Design & UI/UX (logos, icons, visual assets)",
  "Testing & Reviewing (reviewing PRs, testing projects, giving feedback)",
];
const contribCountOptions = [
  "Never",
  "1–2 times",
  "3–5 times",
  "More than 5 times",
];
const proudProjectTypeOptions = [
  "Web App",
  "Mobile App",
  "Desktop App",
  "Library",
  "CLI Tool",
  "API/Backend",
  "Other",
];

const Survey = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { testUserId } = useUser(); // userId 가져오기
  const { post, isLoading: apiLoading } = usePostApi(); // POST API 훅 사용

  // Redux state 사용
  const {
    whyContribute,
    howContribute,
    proudProject,
    proudProjectType,
    confidentLangs,
    enjoyLangs,
    learnLangs,
    contribCount,
    pastLinks,
  } = useSurvey();

  // Redux 상태 확인용 로그 (개발용)
  console.log("🔍 Survey Redux State:", {
    whyContribute,
    howContribute,
    proudProject,
    proudProjectType,
    confidentLangs,
    enjoyLangs,
    learnLangs,
    contribCount,
    pastLinks,
    loading: apiLoading, // usePostApi의 loading 상태 사용
  });

  // userId 변경시 localStorage에서 설문 답변 로드
  React.useEffect(() => {
    if (!testUserId) {
      // userId가 null이면 설문 답변도 무조건 초기화
      dispatch(resetSurvey());
      return;
    }
    const savedAnswers = loadSurveyAnswers(testUserId);
    if (savedAnswers) {
      // 저장된 답변이 있으면 Redux에 설정
      dispatch(setWhyContribute(savedAnswers.whyContribute || ""));
      dispatch(setHowContribute(savedAnswers.howContribute || []));
      dispatch(setProudProject(savedAnswers.proudProject || ""));
      dispatch(setProudProjectType(savedAnswers.proudProjectType || ""));
      dispatch(setConfidentLangs(savedAnswers.confidentLangs || []));
      dispatch(setEnjoyLangs(savedAnswers.enjoyLangs || []));
      dispatch(setLearnLangs(savedAnswers.learnLangs || []));
      dispatch(setContribCount(savedAnswers.contribCount || ""));
      dispatch(setPastLinks(savedAnswers.pastLinks || [""]));
    } else {
      dispatch(resetSurvey());
    }
  }, [testUserId, dispatch]);

  // 설문 답변 변경시 localStorage에 저장
  React.useEffect(() => {
    if (!testUserId) return; // userId 없으면 저장하지 않음
    const currentAnswers = {
      whyContribute,
      howContribute,
      proudProject,
      proudProjectType,
      confidentLangs,
      enjoyLangs,
      learnLangs,
      contribCount,
      pastLinks,
    };
    // 모든 답변이 초기값인지 확인 (초기 로드시 저장 방지)
    const isInitialState =
      !whyContribute &&
      howContribute.length === 0 &&
      !proudProject &&
      !proudProjectType &&
      confidentLangs.length === 0 &&
      enjoyLangs.length === 0 &&
      learnLangs.length === 0 &&
      !contribCount &&
      pastLinks.length === 1 &&
      pastLinks[0] === "";
    if (!isInitialState) {
      saveSurveyAnswers(testUserId, currentAnswers);
    }
  }, [
    testUserId,
    whyContribute,
    howContribute,
    proudProject,
    proudProjectType,
    confidentLangs,
    enjoyLangs,
    learnLangs,
    contribCount,
    pastLinks,
  ]);

  // Redux 상태를 백엔드 API 형태로 변환하는 함수
  const transformToApiFormat = () => {
    // repoTypes 매핑
    const repoTypeMapping: { [key: string]: string } = {
      "Web App": "web",
      "Mobile App": "mobile",
      "Desktop App": "desktop",
      Library: "library",
      "CLI Tool": "cli",
      "API/Backend": "backend",
      Other: "other",
    }; // contribCount를 숫자로 변환
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

    return {
      userId: testUserId,
      reason: whyContribute,
      ContributionDirections: howContribute.map(
        (option) => contributionMapping[option] || option
      ), // 매핑된 간단한 키워드로 변환
      publicRepos: proudProject ? [proudProject] : [],
      repoTypes: proudProjectType
        ? [repoTypeMapping[proudProjectType] || "other"]
        : [],
      well: confidentLangs.filter((lang) => lang.trim() !== ""),
      like: enjoyLangs.filter((lang) => lang.trim() !== ""),
      wishToLearn: learnLangs.filter((lang) => lang.trim() !== ""),
      numOfExperience: experienceMapping[contribCount] || 0,
      experiencedUrls: pastLinks.filter((url) => url.trim() !== ""),
    };
  };

  // Redux 액션을 사용한 핸들러들
  const handleCheckboxToggle = (
    value: string,
    currentValues: string[],
    actionCreator: typeof setHowContribute
  ) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    dispatch(actionCreator(newValues));
  };

  const handlePastLinkChange = (index: number, value: string) => {
    const newArray = [...pastLinks];
    newArray[index] = value;
    dispatch(setPastLinks(newArray));
  };

  const addPastLink = () => {
    dispatch(setPastLinks([...pastLinks, ""]));
  };

  const removePastLink = (idx: number) => {
    dispatch(setPastLinks(pastLinks.filter((_, i) => i !== idx)));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 로딩 상태 시작
      dispatch(setLoading(true));
      dispatch(clearRecommendations());

      // Redux 상태를 API 형태로 변환
      const apiData = transformToApiFormat(); // 변환된 데이터 로그 (개발용)
      console.log("📤 Sending to API:", apiData); // usePostApi 훅을 사용한 API 호출
      const result = await post("/generate/recommendations", apiData);
      console.log("📥 API Response:", result);

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
              // 기본 Repository 객체 생성
              const repository: Record<string, unknown> = {
                id: index + 1,
                name: (repoObj["Repo Name"] ||
                  repoObj["name"] ||
                  "Unknown") as string,
                fullName: (repoObj["Repo Name"] ||
                  repoObj["full_name"] ||
                  repoObj["name"] ||
                  "Unknown") as string,
                description: (repoObj["Short Description"] ||
                  repoObj["description"] ||
                  "") as string,
                language: ((Array.isArray(repoObj["Languages/Frameworks"]) &&
                  repoObj["Languages/Frameworks"].join(", ")) ||
                  repoObj["language"] ||
                  "Unknown") as string,
                stars: parseInt(
                  (repoObj["Suitability Score"] as string)?.replace("%", "") ||
                    (repoObj["stargazers_count"] as string) ||
                    "0"
                ),
                url: (repoObj["Repo URL"] ||
                  repoObj["html_url"] ||
                  repoObj["url"] ||
                  "") as string,
                goodFirstIssues: Boolean(repoObj["GoodFirstIssue"]),
                createdAt: (repoObj["Created Date"] || "") as string,
                lastActivity: (repoObj["Latest Updated Date"] ||
                  repoObj["updated_at"] ||
                  repoObj["pushed_at"] ||
                  new Date().toISOString()) as string,
                difficulty: (repoObj["Difficulties"] ||
                  repoObj["difficulty"] ||
                  "beginner") as "beginner" | "intermediate" | "advanced",
                contributionDirections: (repoObj["ContributionDirections"] ||
                  []) as Array<{
                  number: number;
                  title: string;
                  description: string;
                }>,
                reasonForRecommendation: (repoObj["ReasonForRecommendation"] ||
                  "") as string,
                currentStatusDevelopmentDirection: (repoObj[
                  "CurrentStatusDevelopmentDirection"
                ] || "") as string,
              };

              return repository;
            }
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dispatch(setRepositories(transformedRepos as any));
          console.log("✅ Repositories saved to Redux:", transformedRepos);
        } else {
          console.warn("⚠️ No recommendations found in API response");
        }
      } else {
        console.warn("⚠️ Invalid API response structure");
      }

      dispatch(setLoading(false));
      dispatch(completeSurvey());
      navigate("/opensource-list");
    } catch (error) {
      console.error("❌ API Error:", error);
      dispatch(setLoading(false));
    }
  };

  // Reset user's scroll position
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Loading Screen
  if (apiLoading) {
    return (
      <LoadingScreen title="Finding repositories that match your interests..." />
    );
  }

  return (
    <div className="bg-bg-black w-full min-h-screen">
      {/* Navbar */}
      <Navbar />
      <div className="max-w-3xl mx-auto md:px-10 pt-[140px] pb-20">
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-2 text-white text-center">
            Help Us Find Your Perfect Open Source Match
          </h1>
          <p className="text-md text-text-gray text-center">
            Answer a few questions to get personalized repository
            recommendations
          </p>
          <div className="flex flex-col gap-12 mt-20">
            {/* 1. Why do you want to contribute? */}
            <motion.div
              {...questionBlockMotion}
              className={questionBlockClass}
              aria-labelledby="why-label"
            >
              <label
                id="why-label"
                className="font-semibold text-white mb-4 text-base flex items-center gap-2"
              >
                <span role="img" aria-label="lightbulb">
                  💡
                </span>
                1. Why do you want to contribute to open source?
              </label>
              <div className="flex flex-col gap-3 mt-2">
                {whyOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 text-sm text-text-gray-light"
                  >
                    <input
                      type="radio"
                      name="whyContribute"
                      value={option}
                      checked={whyContribute === option}
                      onChange={() => dispatch(setWhyContribute(option))}
                      className="accent-blue-600 focus:outline-none"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </motion.div>
            {/* 2. How do you want to contribute? */}
            <motion.div
              {...questionBlockMotion}
              className={questionBlockClass}
              aria-labelledby="how-label"
            >
              <label
                id="how-label"
                className="font-semibold text-white mb-4 text-base flex items-center gap-2"
              >
                <span role="img" aria-label="tools">
                  🛠️
                </span>
                2. How do you want to contribute? (Select all that apply)
              </label>
              <div className="flex flex-col gap-3 mt-2">
                {howOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 text-text-gray-light text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={howContribute.includes(option)}
                      onChange={() =>
                        handleCheckboxToggle(
                          option,
                          howContribute,
                          setHowContribute
                        )
                      }
                      className="accent-blue-600 focus:outline-none"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </motion.div>
            {/* 3. Proudest project */}
            <motion.div
              {...questionBlockMotion}
              className={questionBlockClass}
              aria-labelledby="proud-label"
            >
              <label
                id="proud-label"
                className="font-semibold text-white mb-4 text-base flex items-center gap-2"
              >
                <span role="img" aria-label="trophy">
                  🏆
                </span>
                3. Tell us about your proudest project or your representative
                public repo. (Optional)
              </label>
              <div className="flex flex-row gap-4 mt-2">
                <select
                  className={selectClass}
                  value={proudProjectType}
                  onChange={(e) =>
                    dispatch(setProudProjectType(e.target.value))
                  }
                >
                  <option value="" className="text-text-gray bg-bg-black">
                    Type
                  </option>
                  {proudProjectTypeOptions.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      className="text-text-gray bg-bg-black"
                    >
                      {opt}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className={inputClass + " flex-1 mt-0"}
                  placeholder="Paste GitHub URL(s)"
                  value={proudProject}
                  onChange={(e) => dispatch(setProudProject(e.target.value))}
                />
              </div>
            </motion.div>
            {/* 4. Confident in */}
            <motion.div
              {...questionBlockMotion}
              className={questionBlockClass}
              aria-labelledby="confident-label"
            >
              <label
                id="confident-label"
                className="font-semibold text-white mb-4 text-base flex items-center gap-2"
              >
                <span role="img" aria-label="rocket">
                  🚀
                </span>
                4. Languages or frameworks you’re confident in:
              </label>
              <AutocompleteTagsInput
                value={confidentLangs}
                onChange={(newTags) => dispatch(setConfidentLangs(newTags))}
              />
              <div className="text-xs text-text-gray mt-1 ml-1">
                After typing, press <b>Enter</b> (or comma, Tab) to add as a
                tag.
              </div>
            </motion.div>
            {/* 5. Enjoy using */}
            <motion.div
              {...questionBlockMotion}
              className={questionBlockClass}
              aria-labelledby="enjoy-label"
            >
              <label
                id="enjoy-label"
                className="font-semibold text-white mb-4 text-base flex items-center gap-2"
              >
                <span role="img" aria-label="heart">
                  ❤️
                </span>
                5. Languages or frameworks you enjoy using:
              </label>
              <AutocompleteTagsInput
                value={enjoyLangs}
                onChange={(newTags) => dispatch(setEnjoyLangs(newTags))}
              />
              <div className="text-xs text-text-gray mt-1 ml-1">
                After typing, press <b>Enter</b> (or comma, Tab) to add as a
                tag.
              </div>
            </motion.div>
            {/* 6. Want to learn */}
            <motion.div
              {...questionBlockMotion}
              className={questionBlockClass}
              aria-labelledby="learn-label"
            >
              <label
                id="learn-label"
                className="font-semibold text-white mb-4 text-base flex items-center gap-2"
              >
                <span role="img" aria-label="books">
                  📚
                </span>
                6. Languages or frameworks you want to learn:
              </label>
              <AutocompleteTagsInput
                value={learnLangs}
                onChange={(newTags) => dispatch(setLearnLangs(newTags))}
              />
              <div className="text-xs text-text-gray mt-1 ml-1">
                After typing, press <b>Enter</b> (or comma, Tab) to add as a
                tag.
              </div>
            </motion.div>
            {/* 7. Contribution count */}
            <motion.div
              {...questionBlockMotion}
              className={questionBlockClass}
              aria-labelledby="count-label"
            >
              <label
                id="count-label"
                className="font-semibold text-white mb-4 text-base flex items-center gap-2"
              >
                <span role="img" aria-label="repeat">
                  🔁
                </span>
                7. How many times have you contributed to open source?
              </label>
              <select
                className={inputClass}
                value={contribCount}
                onChange={(e) => dispatch(setContribCount(e.target.value))}
              >
                <option value="" className="text-text-gray bg-bg-black">
                  Select...
                </option>
                {contribCountOptions.map((opt) => (
                  <option
                    key={opt}
                    value={opt}
                    className="text-text-gray bg-bg-black"
                  >
                    {opt}
                  </option>
                ))}
              </select>
            </motion.div>
            {/* 8. Past contributions */}
            <motion.div
              {...questionBlockMotion}
              className={questionBlockClass}
              aria-labelledby="past-label"
            >
              <label
                id="past-label"
                className="font-semibold text-white mb-4 text-base flex items-center gap-2"
              >
                <span role="img" aria-label="link">
                  🔗
                </span>
                8. If you’ve contributed to open source before, please share
                links to your past contributions. (Optional — up to 5 links)
              </label>
              {pastLinks.map((link, idx) => (
                <div key={idx} className="flex items-center gap-3 mt-2">
                  <input
                    type="url"
                    className={inputClass + " mt-0"}
                    placeholder="Paste URL"
                    value={link}
                    onChange={(e) => handlePastLinkChange(idx, e.target.value)}
                  />
                  {pastLinks.length > 1 && (
                    <button
                      type="button"
                      className={iconButtonClass}
                      onClick={() => removePastLink(idx)}
                      aria-label="Remove link"
                    >
                      <ClearIcon className="text-gray-500" fontSize="small" />
                    </button>
                  )}
                </div>
              ))}
              {pastLinks.length < 5 && (
                <button
                  type="button"
                  className={addButtonClass}
                  onClick={addPastLink}
                  aria-label="Add another link"
                >
                  <AddIcon className="text-gray-500 mr-1" fontSize="small" />
                  Add another link
                </button>
              )}
            </motion.div>
          </div>
          {/* Save Button */}
          <div className="flex justify-center w-full mt-10">
            <GradientButton
              type="submit"
              className="px-14 py-2 text-lg font-medium transition-colors duration-300"
              aria-label="Submit survey"
            >
              Save
            </GradientButton>
          </div>
        </form>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Survey;
