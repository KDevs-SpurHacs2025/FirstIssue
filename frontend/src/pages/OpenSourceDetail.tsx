import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";

const OpenSourceDetail = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  // repoId를 숫자로 변환 (기본값 1)
  const repoIdNumber = repoId ? parseInt(repoId) : 1;

  return (
    <div className="w-full bg-bg-black !overflow-hidden">
      <Navbar />
      <div className="w-full h-[calc(100vh-60px)] pt-[60px] px-4 flex flex-col">
        <h1 className="text-3xl font-bold text-white mb-6 text-center flex-shrink-0">
          Repository Details
        </h1>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Left Sidebar - Debug Information */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-blue-light p-6 rounded-lg border border-white border-opacity-10 sticky top-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Debug Information
              </h2>
              <div className="space-y-2 text-white">
                <p>
                  <span className="font-semibold">User ID:</span>{" "}
                  {userId || "Not provided"}
                </p>
                <p>
                  <span className="font-semibold">Repo ID:</span>{" "}
                  {repoId || "Not provided"}
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => window.history.back()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to List
                </button>
              </div>
            </div>
          </div>

          {/* Right Main Content - Chatbot */}
          <div className="flex-1 min-w-0">
            {userId ? (
              <Chatbot userId={userId} repoId={repoIdNumber} />
            ) : (
              <div className="bg-blue-light p-8 rounded-lg border border-white border-opacity-10 text-center">
                <p className="text-white text-lg">
                  User ID가 필요합니다. 먼저 설문조사를 완료해주세요.
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
