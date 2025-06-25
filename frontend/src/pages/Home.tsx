import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useUser, useAppDispatch } from "../hooks/useRedux";
import { useGetApi } from "../hooks/useGetApi";
import { setTestUserId } from "../store/slices/userSlice";

const Home = () => {
  const navigate = useNavigate();
  const { testUserId } = useUser();
  const dispatch = useAppDispatch();
  const { get, isLoading, error } = useGetApi();

  // 개발용 - userId 초기화
  const resetUserId = () => {
    dispatch(setTestUserId(""));
    console.log("🗑️ userId 초기화됨");
  };

  // 기존 userId가 있는지 확인
  useEffect(() => {
    if (testUserId) {
      console.log("🔄 기존 userId 사용:", testUserId);
    }
  }, [testUserId]); // Get Started 버튼 클릭 시 API 호출
  const handleGetStarted = async () => {
    try {
      // 기존 userId가 있으면 바로 Survey로 이동
      if (testUserId) {
        console.log("🔄 기존 userId 재사용:", testUserId);
        navigate("/survey");
        return;
      }

      // 새 userId 생성
      const data = await get("/generate/userId");
      dispatch(setTestUserId(data.userId));

      console.log("✅ 새 userId 생성:", data.userId);
      console.log(
        "✅ localStorage 저장 확인:",
        localStorage.getItem("persist:root")
      );

      // Survey 페이지로 이동
      navigate("/survey");
    } catch (err) {
      console.error("❌ userId 생성 실패:", err);
    }
  };
  return (
    <div className="w-full h-auto flex flex-col items-center">
      <Navbar />
      {/* 에러 표시 */}
      {error && (
        <div className="fixed w-3/4 h-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          Error: {error}
        </div>
      )}{" "}
      {/* Hero Section */}
      <div
        id="hero"
        className="scroll-mt-navbar w-full h-auto flex flex-col items-center justify-center bg-gray-700 text-center text-white px-28 py-32"
        style={{ minHeight: "calc(100vh - 50px)" }}
      >
        <h1 className="text-5xl font-bold mb-2">
          Find Your First GitHub Contribution
        </h1>
        <p className="text-sm">
          Find beginner-friendly GitHub issues tailored to your skills and
          experience
        </p>
        <button
          className="mt-10 px-6 py-2 bg-blue-600 text-white rounded"
          onClick={handleGetStarted}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Started"}
        </button>
      </div>
      {/* Section 1 */}
      <div
        id="discovery"
        className="w-full h-auto flex flex-col items-center justify-center bg-gray-800 text-white px-10 py-20"
      >
        <h2 className="text-xl font-bold mb-1">
          Simple Repository Discovery
        </h2>
        <p className="text-sm mb-12">
          Find GitHub repositories that welcome new contributors
        </p>
        <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-x-6">
          {/* Smart Filtering */}
          <div className="bg-black text-white w-full md:w-1/3 h-full flex flex-col justify-center p-6 mb-6 md:mb-0 rounded-lg">
            <div>
              <img src="" className="w-12 h-12 mb-6" />
            </div>
            <div>
              <span className="text-md font-semibold mb-3">Smart Filtering</span>
              <p className="text-sm font-base text-gray-200">
                Filter repositories by programming language, issue labels, and
                project activity to find exactly what you’re looking for
              </p>
            </div>
          </div>
          {/* Beginner-Friendly */}
          <div className="bg-black text-white w-full md:w-1/3 h-full flex flex-col justify-center p-6 mb-6 md:mb-0 rounded-lg">
            <div>
              <img src="" className="w-12 h-12 mb-6" />
            </div>
            <div>
              <span className="text-md font-semibold mb-3">Beginner-Friendly </span>
              <p className="text-sm font-base text-gray-200">
                Focus on repositories that have “good first issue”,
                “beginner-friendly”, or “help wanted” labels for new
                contributors
              </p>
            </div>
          </div>
          {/* Project Information */}
          <div className="bg-black text-white w-full md:w-1/3 h-full flex flex-col justify-center p-6 mb-6 md:mb-0 rounded-lg">
            <div>
              <img src="" className="w-12 h-12 mb-6" />
            </div>
            <div>
              <span className="text-md font-semibold mb-3">Project Information</span>
              <p className="text-sm font-base text-gray-200">
                View repository details, contribution guidelines, and issue
                descriptions to understand what you’ll be working on
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Section 2*/}
      <div
        id="how-it-works"
        className="w-full h-auto flex flex-col items-center justify-center bg-gray-900 text-white px-10 py-20"
      >
        <h2 className="text-xl font-bold mb-1 text-center">How It Works</h2>
        <p className="text-sm mb-10 text-center">
          Find and contribute to open source projects in just a few steps
        </p>
        <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-x-6 min-h-[220px]">
          {/* Browse Projects */}
          <div className="bg-blue-900 text-white w-full md:w-1/4 h-full flex flex-col items-center justify-center p-6 rounded-lg">
            <span className="text-md font-semibold mb-3">Browse Projects</span>
            <p className="text-sm font-base text-gray-200 text-center">
              Search through curated GitHub repositories that welcome new
              contributors
            </p>
          </div>
          {/* Filter & Find */}
          <div className="bg-blue-800 text-white w-full md:w-1/4 h-full flex flex-col items-center justify-center p-6 rounded-lg">
            <span className="text-md font-semibold mb-3">Filter & Find</span>
            <p className="text-sm font-base text-gray-200 text-center">
              Use filters to find projects matching your skills and interests
            </p>
          </div>
          {/* Read Guidelines */}
          <div className="bg-blue-700 text-white w-full md:w-1/4 h-full flex flex-col items-center justify-center p-6 rounded-lg">
            <span className="text-md font-semibold mb-3">Read Guidelines</span>
            <p className="text-sm font-base text-gray-200 text-center">
              Review the project's contribution guidelines and issue details
            </p>
          </div>
          {/* Start Contributing */}
          <div className="bg-blue-600 text-white w-full md:w-1/4 h-full flex flex-col items-center justify-center p-6 rounded-lg">
            <span className="text-md font-semibold mb-3">Start Contributing</span>
            <p className="text-sm font-base text-gray-200 text-center">
              Fork the repository and submit your first pull request
            </p>
          </div>
        </div>
      </div>
      {/* Section 3*/}
      <div
        id="ready"
        className="w-full h-auto flex flex-col items-center justify-center bg-gray-800 text-white py-16 px-10"
      >
        <h2 className="text-2xl font-bold mb-1">
          Ready to Contribute to Open Source?
        </h2>
        <p className="text-base mb-4">
          Start exploring GitHub repositories that are perfect for your first
          contribution
        </p>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
          onClick={handleGetStarted}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Started"}
        </button>{" "}
      </div>
      {/* Footer */}
      <Footer />
      {/* 개발용 - userId 초기화 버튼 (Footer 위에 배치) */}
      {testUserId && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mx-4 my-4 flex justify-between items-center">
          <span className="text-sm">🔧 개발용 | 현재 userId: {testUserId}</span>
          <button
            onClick={resetUserId}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            초기화
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
