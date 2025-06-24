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

  // 기존 userId가 있는지 확인
  useEffect(() => {
    if (testUserId) {
      console.log("기존 testUserId 사용:", testUserId);
    }
  }, [testUserId]);
  // Get Started 버튼 클릭 시 API 호출
  const handleGetStarted = async () => {
    console.log("Get Started 버튼 클릭됨");
    try {
      // 1. API 호출해서 userId 받기
      console.log("API 호출 시작...");
      const data = await get("/generate/userId");
      console.log("API 응답 받음:", data);

      // 2. Redux store에 저장 (자동으로 localStorage에도 저장됨)
      dispatch(setTestUserId(data.userId));

      console.log("새로운 userId 받음:", data.userId);

      // 3. Survey 페이지로 이동
      console.log("Survey 페이지로 이동 시도...");
      navigate("/survey");
    } catch (err) {
      console.error("userId 생성 실패:", err);
    }
  };
  return (
    <div>
      <Navbar />
      {/* 에러 표시 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-4">
          Error: {error}
        </div>
      )}
      {/* Hero Section */}
      <div className="w-full h-[300px] flex flex-row items-center justify-center bg-gray-700 text-white">
        <h1 className="text-4xl font-bold">
          Find Your First GitHub Contribution
        </h1>{" "}
        <p>
          Browse beginner-friendly GitHub repositories with issues tagged for
          new contributors. Filter by programming language and difficulty level
          to find the perfect project to contribute to.
        </p>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
          onClick={handleGetStarted}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Started"}
        </button>
      </div>
      {/* Section 1 */}
      <div className="w-full h-[300px] flex flex-row items-center justify-center bg-gray-800 text-white">
        <h2 className="text-3xl font-bold">Simple Repository Discovery</h2>
        <p>Find GitHub repositories that welcome new contributors</p>
        <div>
          <div>
            <div>
              <img />
            </div>
            <div>
              <span>Smart Filtering</span>
              <p>
                Filter repositories by programming language, issue labels, and
                project activity to find excatly what you’re looking for
              </p>
            </div>
          </div>
          <div>
            <div>
              <img />
            </div>
            <div>
              <span>Beginner-Friendly </span>
              <p>
                Focus on repositories that have “good first issue”,
                “beginner-friendly”, or “help wanted” labels for new
                contributors
              </p>
            </div>
          </div>
          <div>
            <div>
              <img />
            </div>
            <div>
              <span>Project Information</span>
              <p>
                View repository details, contribution guidelines, and issue
                descriptions to understand what you’ll be working on
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Section 2*/}
      <div className="w-full h-[300px] flex flex-row items-center justify-center bg-gray-900 text-white">
        <div>
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p>Find and contribute to open source projects in just a few steps</p>
        </div>
        <div>
          <div>
            <span>Browse Projects</span>
            <p>
              Search through curated GitHub repositories that welcome new
              contributors
            </p>
          </div>
          <div>
            <span>Filter & Find</span>
            <p>
              Use filters to find projects matching your skills and interests
            </p>
          </div>
          <div>
            <span>Read Guidelines</span>
            <p>
              Review the project's contribution guidelines and issue details
            </p>
          </div>
          <div>
            <span>Start Contributing</span>
            <p>Fork the repository and submit your first pull request</p>
          </div>
        </div>
      </div>
      {/* Section 3*/}
      <div className="w-full h-[300px] flex flex-row items-center justify-center bg-gray-800 text-white">
        <h2 className="text-3xl font-bold">
          Ready to Contribute to Open Source?
        </h2>{" "}
        <p>
          Start exploring GitHub repositories that are perfect for your first
          contribution
        </p>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
          onClick={handleGetStarted}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Started"}
        </button>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
