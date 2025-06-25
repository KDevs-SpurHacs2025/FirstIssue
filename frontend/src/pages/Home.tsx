import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAppDispatch } from "../hooks/useRedux";
import { useGetApi } from "../hooks/useGetApi";
import { setTestUserId } from "../store/slices/userSlice";
import { motion } from "framer-motion";
import {
  homeSection1Variants,
  homeSection1ItemVariants,
  homeTimelineFillMotion,
  homeStepRevealMotion,
  useHomeTypingAnimation,
} from "../animations/homeAnimations";
import GradientButton from "../components/GradientButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";

const Home = () => {
  const navigate = useNavigate();
  const { testUserId } = useUser();
  const dispatch = useAppDispatch();
  const { get, isLoading, error } = useGetApi();

  // Typing animation for h1
  const fullTitle = "Find Your First GitHub\nContribution";
  const [displayedTitle, typingDone] = useHomeTypingAnimation(fullTitle, 50);

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
    <div className="w-full h-auto flex flex-col items-center bg-bg-black">
      {/* Error Popup */}
      {error && (
        <div className="z-100 fixed w-3/4 h-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          Error: {error}
        </div>
      )}{" "}
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <div
        id="hero"
        className="w-full h-auto flex flex-col items-center justify-center text-center text-white mt-[60px] px-4 md:px-28 py-32"
        style={{ minHeight: "calc(100vh - 60px)" }}
      >
        <motion.h1
          className="text-5xl font-bold mb-3 whitespace-pre-line bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          {displayedTitle}
          {!typingDone && <span className="inline-block animate-pulse">|</span>}
        </motion.h1>
        <p className="text-md text-text-gray">
          Find beginner-friendly GitHub issues tailored to your skills and
          experience
        </p>
        <GradientButton
          className="mt-10 px-6 py-2"
          onClick={handleGetStarted}
          disabled={isLoading}
        >
          Get Started
        </GradientButton>
      </div>
      {/* Section 1 */}
      <motion.div
        id="discovery"
        className="w-full h-auto flex flex-col items-center justify-center text-white px-4 md:px-10 py-32"
        variants={homeSection1Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-3xl font-bold mb-2"
          variants={homeSection1ItemVariants}
        >
          Simple Repository Discovery
        </motion.h2>
        <motion.p
          className="text-sm mb-12 text-text-gray"
          variants={homeSection1ItemVariants}
        >
          Find GitHub repositories that welcome new contributors
        </motion.p>
        <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-x-6">
          {/* Smart Filtering */}
          <motion.div
            className="bg-blue-light text-white w-full md:w-1/3 h-full flex flex-col justify-center p-6 mb-6 md:mb-0 rounded-lg border border-white border-solid border-opacity-10 backdrop-blur-md"
            variants={homeSection1ItemVariants}
          >
            <div>
              <AutoAwesomeIcon
                className="w-12 h-12 mb-3"
                style={{ color: "#F9D923" }}
              />
            </div>
            <div>
              <span className="text-md font-semibold mb-3">
                Smart Filtering
              </span>
              <p className="text-sm font-base text-text-gray">
                Filter repositories by programming language, issue labels, and
                project activity to find exactly what you’re looking for
              </p>
            </div>
          </motion.div>
          {/* Beginner-Friendly */}
          <motion.div
            className="bg-blue-light text-white w-full md:w-1/3 h-full flex flex-col justify-center p-6 mb-6 md:mb-0 rounded-lg border border-white border-solid border-opacity-10 backdrop-blur-md"
            variants={homeSection1ItemVariants}
          >
            <div>
              <SentimentSatisfiedAltIcon
                className="w-12 h-12 mb-3"
                style={{ color: "#4ADE80" }}
              />
            </div>
            <div>
              <span className="text-md font-semibold mb-3">
                Beginner-Friendly{" "}
              </span>
              <p className="text-sm font-base text-text-gray">
                Focus on repositories that have “good first issue”,
                “beginner-friendly”, or “help wanted” labels for new
                contributors
              </p>
            </div>
          </motion.div>
          {/* Project Information */}
          <motion.div
            className="bg-blue-light text-white w-full md:w-1/3 h-full flex flex-col justify-center p-6 mb-6 md:mb-0 rounded-lg border border-white border-solid border-opacity-10 backdrop-blur-md"
            variants={homeSection1ItemVariants}
          >
            <div>
              <ContentPasteOutlinedIcon
                className="w-12 h-12 mb-3"
                style={{ color: "#60A5FA" }}
              />
            </div>
            <div>
              <span className="text-md font-semibold mb-3">
                Project Information
              </span>
              <p className="text-sm font-base text-text-gray">
                View repository details, contribution guidelines, and issue
                descriptions to understand what you’ll be working on
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      {/* Section 2*/}
      <div
        id="how-it-works"
        className="w-full flex flex-col items-center justify-center text-white px-4 py-28"
      >
        <h2 className="text-3xl font-bold mb-1 text-center">How It Works</h2>
        <p className="text-sm mb-10 text-center text-text-gray">
          Find and contribute to open source projects in just a few steps
        </p>
        <div className="relative w-full max-w-xl flex flex-col items-center">
          {/* Animated Timeline vertical line */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-px bg-primary z-0"
            style={{ minHeight: "420px" }}
            initial={homeTimelineFillMotion.initial}
            whileInView={homeTimelineFillMotion.whileInView}
            // transition={homeTimelineFillMotion.transition}
          />
          {/* Timeline circles */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 z-10 w-4 h-full flex flex-col justify-between pointer-events-none"
            style={{ minHeight: "420px" }}
          >
            <span
              className="w-3 h-3 rounded-full bg-primary block mx-auto"
              style={{ marginTop: 0 }}
            />
            <span className="w-3 h-3 rounded-full bg-primary block mx-auto" />
            <span className="w-3 h-3 rounded-full bg-primary block mx-auto" />
            <span
              className="w-3 h-3 rounded-full bg-primary block mx-auto"
              style={{ marginBottom: 0 }}
            />
          </div>
          {/* Timeline steps */}
          <div className="relative z-10 flex flex-col gap-16 w-full">
            {/* Step 1 - Left */}
            <motion.div
              className="flex w-full justify-start items-center relative"
              initial={homeStepRevealMotion[0].initial}
              whileInView={homeStepRevealMotion[0].whileInView}
              transition={homeStepRevealMotion[0].transition}
              viewport={homeStepRevealMotion[0].viewport}
            >
              <div className="w-1/2 flex flex-col items-end pr-8">
                <div className="max-w-xs text-right">
                  <span className="block text-xl font-bold text-primary mb-1">
                    1
                  </span>
                  <span className="text-md font-semibold">Browse Projects</span>
                  <p className="text-sm font-base text-text-gray mt-1">
                    Search through curated GitHub repositories that welcome new
                    contributors
                  </p>
                </div>
              </div>
              <div className="w-1/2" />
            </motion.div>
            {/* Step 2 - Right */}
            <motion.div
              className="flex w-full justify-end items-center relative"
              initial={homeStepRevealMotion[1].initial}
              whileInView={homeStepRevealMotion[1].whileInView}
              transition={homeStepRevealMotion[1].transition}
              viewport={homeStepRevealMotion[1].viewport}
            >
              <div className="w-1/2" />
              <div className="w-1/2 flex flex-col items-start pl-8">
                <div className="max-w-xs text-left">
                  <span className="block text-xl font-bold text-primary mb-1">
                    2
                  </span>
                  <span className="text-md font-semibold">Filter & Find</span>
                  <p className="text-sm font-base text-text-gray mt-1">
                    Use filters to find projects matching your skills and
                    interests
                  </p>
                </div>
              </div>
            </motion.div>
            {/* Step 3 - Left */}
            <motion.div
              className="flex w-full justify-start items-center relative"
              initial={homeStepRevealMotion[2].initial}
              whileInView={homeStepRevealMotion[2].whileInView}
              transition={homeStepRevealMotion[2].transition}
              viewport={homeStepRevealMotion[2].viewport}
            >
              <div className="w-1/2 flex flex-col items-end pr-8">
                <div className="max-w-xs text-right">
                  <span className="block text-xl font-bold text-primary mb-1">
                    3
                  </span>
                  <span className="text-md font-semibold">Read Guidelines</span>
                  <p className="text-sm font-base text-text-gray mt-1">
                    Review the project's contribution guidelines and issue
                    details
                  </p>
                </div>
              </div>
              <div className="w-1/2" />
            </motion.div>
            {/* Step 4 - Right */}
            <motion.div
              className="flex w-full justify-end items-center relative"
              initial={homeStepRevealMotion[3].initial}
              whileInView={homeStepRevealMotion[3].whileInView}
              transition={homeStepRevealMotion[3].transition}
              viewport={homeStepRevealMotion[3].viewport}
            >
              <div className="w-1/2" />
              <div className="w-1/2 flex flex-col items-start pl-8">
                <div className="max-w-xs text-left">
                  <span className="block text-xl font-bold text-primary mb-1">
                    4
                  </span>
                  <span className="text-md font-semibold">
                    Start Contributing
                  </span>
                  <p className="text-sm font-base text-text-gray mt-1">
                    Fork the repository and submit your first pull request
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Section 3*/}
      <div
        id="ready"
        className="w-full h-auto flex flex-col items-center justify-center text-white py-36 px-10"
      >
        <h2 className="text-3xl font-bold mb-1">
          <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-center text-transparent inline-block">
            Ready
          </span>{" "}
          to Contribute to Open Source?
        </h2>
        <p className="text-base mb-4 text-text-gray">
          Start exploring GitHub repositories that are perfect for your first
          contribution
        </p>
        <div className="relative flex flex-col items-center">
          {/* Animated Gradient Border */}
          <span
            className="absolute inset-0 w-full h-full rounded-full blur-md opacity-30 animate-pulse bg-gradient-to-r from-fuchsia-500 to-cyan-500"
            aria-hidden="true"
          />
          <GradientButton
            className="mt-4 relative z-10 px-6 py-2"
            onClick={handleGetStarted}
            disabled={isLoading}
          >
            Get Started
          </GradientButton>
        </div>
      </div>
      {/* Footer */}
      <Footer />
      {/* 개발용 - userId 초기화 버튼 (Footer 하단 배치) */}
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
