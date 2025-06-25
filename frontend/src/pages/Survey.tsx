import React from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey, useAppDispatch, useUser } from "../hooks/useRedux";
import { usePostApi } from "../hooks/usePostApi";
import DebugPanel from "../components/DebugPanel";
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
} from "../store/slices/surveySlice";

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
    };

    // contribCount를 숫자로 변환
    const experienceMapping: { [key: string]: number } = {
      Never: 0,
      "1–2 times": 1,
      "3–5 times": 3,
      "More than 5 times": 6,
    };
    return {
      userId: testUserId,
      reason: whyContribute,
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
      // Redux 상태를 API 형태로 변환
      const apiData = transformToApiFormat();

      // 변환된 데이터 로그 (개발용)
      console.log("📤 Sending to API:", apiData);

      // usePostApi 훅을 사용한 API 호출
      const result = await post("/generate/recommendations", apiData);
      console.log("📥 API Response:", result);

      dispatch(completeSurvey());
      navigate("/opensource-list");
    } catch (error) {
      console.error("❌ API Error:", error);
      // 에러 처리 - 사용자에게 알림
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (apiLoading) {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8"
    >
      <h1 className="text-2xl font-bold mb-4">
        Help Us Find Your Perfect Open Source Match
      </h1>
      <p className="mb-6">
        Answer a few questions to get personalized repository recommendations
      </p>
      {/* 1. Why do you want to contribute? */}
      <div className="mb-6">
        <label className="font-semibold">
          1. Why do you want to contribute to open source?
        </label>
        <div className="flex flex-col gap-2 mt-2">
          {" "}
          {whyOptions.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="radio"
                name="whyContribute"
                value={option}
                checked={whyContribute === option}
                onChange={() => dispatch(setWhyContribute(option))}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      {/* 2. How do you want to contribute? */}
      <div className="mb-6">
        <label className="font-semibold">
          2. How do you want to contribute? (Select all that apply.)
        </label>
        <div className="flex flex-col gap-2 mt-2">
          {" "}
          {howOptions.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={howContribute.includes(option)}
                onChange={() =>
                  handleCheckboxToggle(option, howContribute, setHowContribute)
                }
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      {/* 3. Proudest project */}
      <div className="mb-6">
        <label className="font-semibold">
          3. Tell us about your proudest project or your representative public
          repo. (Optional)
        </label>{" "}
        <div className="flex flex-row gap-2 mt-2">
          <select
            className="p-2 border rounded"
            value={proudProjectType}
            onChange={(e) => dispatch(setProudProjectType(e.target.value))}
          >
            <option value="">Type</option>
            {proudProjectTypeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="Paste GitHub URL(s)"
            value={proudProject}
            onChange={(e) => dispatch(setProudProject(e.target.value))}
          />
        </div>
      </div>
      {/* 4. Confident in */}
      <div className="mb-6">
        <label className="font-semibold">
          4. Languages or frameworks you’re confident in:
        </label>
        <input
          type="text"
          className="w-full mt-2 p-2 border rounded"
          placeholder="e.g. JavaScript, React, Python"
          value={confidentLangs.join(", ")}
          onChange={(e) =>
            dispatch(
              setConfidentLangs(e.target.value.split(",").map((s) => s.trim()))
            )
          }
        />
      </div>
      {/* 5. Enjoy using */}
      <div className="mb-6">
        <label className="font-semibold">
          5. Languages or frameworks you enjoy using:
        </label>{" "}
        <input
          type="text"
          className="w-full mt-2 p-2 border rounded"
          placeholder="e.g. TypeScript, Vue, Go"
          value={enjoyLangs.join(", ")}
          onChange={(e) =>
            dispatch(
              setEnjoyLangs(e.target.value.split(",").map((s) => s.trim()))
            )
          }
        />
      </div>
      {/* 6. Want to learn */}
      <div className="mb-6">
        <label className="font-semibold">
          6. Languages or frameworks you want to learn:
        </label>
        <input
          type="text"
          className="w-full mt-2 p-2 border rounded"
          placeholder="e.g. Rust, Svelte, Elixir"
          value={learnLangs.join(", ")}
          onChange={(e) =>
            dispatch(
              setLearnLangs(e.target.value.split(",").map((s) => s.trim()))
            )
          }
        />
      </div>
      {/* 7. Contribution count */}
      <div className="mb-6">
        <label className="font-semibold">
          7. How many times have you contributed to open source?
        </label>
        <select
          className="w-full mt-2 p-2 border rounded"
          value={contribCount}
          onChange={(e) => dispatch(setContribCount(e.target.value))}
        >
          <option value="">Select...</option>
          {contribCountOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      {/* 8. Past contributions */}
      <div className="mb-6">
        <label className="font-semibold">
          8. If you’ve contributed to open source before, please share links to
          your past contributions. (Optional — up to 5 links)
        </label>
        {pastLinks.map((link, idx) => (
          <div key={idx} className="flex items-center gap-2 mt-2">
            <input
              type="url"
              className="w-full p-2 border rounded"
              placeholder="Paste URL"
              value={link}
              onChange={(e) => handlePastLinkChange(idx, e.target.value)}
            />
            {pastLinks.length > 1 && (
              <button
                type="button"
                className="text-red-500"
                onClick={() => removePastLink(idx)}
              >
                ❌
              </button>
            )}
          </div>
        ))}
        {pastLinks.length < 5 && (
          <button
            type="button"
            className="mt-2 text-blue-600"
            onClick={addPastLink}
          >
            Add another link ➕
          </button>
        )}
      </div>{" "}
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
      >
        Submit
      </button>
      {/* 개발용 디버깅 패널 */}
      <DebugPanel />
    </form>
  );
};

export default Survey;
