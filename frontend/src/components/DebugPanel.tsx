import { useState } from "react";
import { useSurvey, useUser, useRecommendation } from "../hooks/useRedux";

// 개발용 디버깅 패널 - production에서는 제거할 것
const DebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const surveyState = useSurvey();
  const userState = useUser();
  const recommendationState = useRecommendation();

  // development 모드에서만 표시
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-purple-600 text-white px-3 py-2 rounded-full text-sm shadow-lg hover:bg-purple-700"
      >
        🐛 Debug
      </button>

      {isVisible && (
        <div className="mt-2 bg-gray-900 text-green-400 p-4 rounded-lg shadow-xl max-w-md max-h-96 overflow-auto text-xs font-mono">
          <h3 className="text-yellow-400 font-bold mb-2">Redux State</h3>
          <div className="mb-3">
            <h4 className="text-blue-400 font-semibold">User:</h4>
            <pre>{JSON.stringify(userState, null, 2)}</pre>
          </div>{" "}
          <div>
            <h4 className="text-blue-400 font-semibold">Survey:</h4>
            <pre>{JSON.stringify(surveyState, null, 2)}</pre>
          </div>
          <div className="mt-3">
            <h4 className="text-blue-400 font-semibold">
              Recommendations ({recommendationState.repositories.length}):
            </h4>
            <pre>
              {JSON.stringify(
                recommendationState.repositories.slice(0, 2),
                null,
                2
              )}
            </pre>
            {recommendationState.repositories.length > 2 && (
              <p className="text-gray-400 text-xs">
                ... and {recommendationState.repositories.length - 2} more
              </p>
            )}
          </div>
          <button
            onClick={() => {
              console.log("🔍 Full Redux State:", {
                user: userState,
                survey: surveyState,
                recommendations: recommendationState,
              });

              // API 형태로 변환된 데이터도 로그 (Survey 페이지에서만)
              if (window.location.pathname === "/survey") {
                // transformToApiFormat 함수를 여기서 호출하면 복잡하므로,
                // Survey 페이지에서 직접 확인하도록 안내
                console.log(
                  "💡 Tip: Survey 페이지의 Submit 버튼을 눌러서 API 형태로 변환된 데이터를 확인하세요!"
                );
              }
            }}
            className="mt-2 bg-blue-600 text-white px-2 py-1 rounded text-xs"
          >
            Log to Console
          </button>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
