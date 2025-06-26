import { useParams } from "react-router-dom";
import { useRecommendation } from "../hooks/useRedux";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import ActionPlan from "../components/ActionPlan";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

const OpenSourceDetail = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const { repositories } = useRecommendation();

  // repoId를 숫자로 변환 (기본값 1)
  const repoIdNumber = repoId ? parseInt(repoId) : 1;

  // repoId로 해당 Repository 찾기
  const currentRepo = repositories.find((repo) => repo.id === repoIdNumber);

  // contributionDirections 가져오기 (없으면 빈 배열)
  const contributionDirections = currentRepo?.contributionDirections || [];

  return (
    <div className="w-full h-screen !overflow-hidden bg-bg-black flex flex-col">
      {/* <Navbar /> */}
      <div className="flex-1 px-4 py-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <button
            onClick={() => window.history.back()}
            className="text-white flex items-center gap-1 hover:opacity-90 transition-opacity duration-150"
          >
            <KeyboardArrowLeftIcon fontSize="medium" />
            Back to List
          </button>
          <h2 className="text-white text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">
            {currentRepo?.name ? (
              <>
                Discover how to contribute to{" "}
                <span className="text-blue-400 font-bold">
                  {currentRepo.name}
                </span>
                🧐
              </>
            ) : (
              "No Repository Found"
            )}
          </h2>
          <div></div>
        </div>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-96 flex-shrink-0">
            <div className="bg-blue-light p-6 rounded-lg border border-white border-opacity-10 h-full overflow-y-auto">
              <ActionPlan
                contributionDirections={contributionDirections}
                repoUrl={currentRepo?.url}
              />
            </div>
          </div>

          {/* Right Main Content - Chatbot */}
          <div className="flex-1">
            {userId ? (
              <Chatbot userId={userId} repoId={repoIdNumber} />
            ) : (
              <div className="bg-blue-light p-8 rounded-lg border border-white border-opacity-10 text-center h-full flex items-center justify-center">
                <p className="text-white text-lg">
                  Please answer the survey first.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenSourceDetail;
