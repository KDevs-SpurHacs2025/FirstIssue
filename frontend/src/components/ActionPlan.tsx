import { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface ActionPlanProps {
  contributionDirections: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  repoUrl?: string;
}

export default function ActionPlan({
  contributionDirections,
  repoUrl,
}: ActionPlanProps) {
  // Step 0과 모든 step을 처음에 펼친 상태로 초기화
  const [openSteps, setOpenSteps] = useState<Set<number>>(
    new Set([0, ...contributionDirections.map((direction) => direction.number)])
  );

  // 애니메이션을 위한 visible steps 상태
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());

  // 컴포넌트가 마운트되면 스텝들을 순차적으로 보여주기
  useEffect(() => {
    const allSteps = [
      0,
      ...contributionDirections.map((direction) => direction.number),
    ];

    allSteps.forEach((stepNumber, index) => {
      setTimeout(() => {
        setVisibleSteps((prev) => new Set([...prev, stepNumber]));
      }, index * 300); // 300ms 간격으로 나타남
    });
  }, [contributionDirections]);

  const toggleStep = (stepNumber: number) => {
    const newOpenSteps = new Set(openSteps);
    if (newOpenSteps.has(stepNumber)) {
      newOpenSteps.delete(stepNumber);
    } else {
      newOpenSteps.add(stepNumber);
    }
    setOpenSteps(newOpenSteps);
  };

  return (
    <div className="action-plan mb-4">
      <h4
        className={`text-lg font-semibold text-white mb-4 transition-all duration-500 ease-out ${
          visibleSteps.size > 0
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2"
        }`}
      >
        Action Plan
      </h4>
      <div className="space-y-3">
        {/* Step 0: Explore the repo first */}
        <div
          className={`relative transition-all duration-500 ease-out transform ${
            visibleSteps.has(0)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {/* Vertical line to connect to next step */}
          <div
            className="absolute left-4 top-8 w-0.5 bg-white bg-opacity-20"
            style={{ height: "calc(100% + 1.5rem)" }}
          />

          <div className="flex items-start">
            {/* Step circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 z-10 transition-colors duration-200 ${
                openSteps.has(0) ? "bg-blue-600" : "bg-gray-500"
              }`}
            >
              0
            </div>

            {/* Content */}
            <div className="ml-3 flex-1">
              <div
                className="cursor-pointer hover:bg-white hover:bg-opacity-5 p-1 rounded transition-colors"
                onClick={() => toggleStep(0)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">
                    Step 0 - Explore the repo first!
                  </h4>
                  <span
                    className={`text-white text-xs ml-2 transition-transform duration-500 ease-in-out inline-block ${
                      openSteps.has(0) ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <KeyboardArrowDownIcon fontSize="small" />
                  </span>
                </div>
              </div>

              {/* Dropdown description with smooth animation */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  openSteps.has(0)
                    ? "max-h-32 opacity-100 mt-1"
                    : "max-h-0 opacity-0 mt-0"
                }`}
              >
                <div className="p-2 bg-bg-black bg-opacity-50 rounded border border-white border-opacity-10">
                  <p className="text-xs text-text-gray leading-relaxed mb-2">
                    Before contributing, explore the repository to understand
                    the project structure and goals.
                  </p>
                  {repoUrl && (
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                      View Repository
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separator between Step 0 and other steps */}
        {contributionDirections.length > 0 && visibleSteps.has(0) && (
          <div
            className={`my-3 border-t border-white border-opacity-10 transition-all duration-500 ease-out ${
              contributionDirections.length > 0 &&
              visibleSteps.has(contributionDirections[0]?.number)
                ? "opacity-100 scale-x-100"
                : "opacity-0 scale-x-0"
            }`}
          ></div>
        )}

        {/* Existing contribution directions */}
        {contributionDirections.length > 0 &&
          contributionDirections.map((direction, index) => (
            <div
              key={direction.number}
              className={`relative mb-2 transition-all duration-500 ease-out transform ${
                visibleSteps.has(direction.number)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {/* Vertical line (except for last item) - uses flex to fill space */}
              {index !== contributionDirections.length - 1 && (
                <div
                  className="absolute left-4 top-8 w-0.5 bg-white bg-opacity-20"
                  style={{ height: "calc(100% + 2rem)" }}
                />
              )}

              <div className="flex items-start">
                {/* Step circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 z-10 transition-colors duration-200 ${
                    openSteps.has(direction.number)
                      ? "bg-blue-600"
                      : "bg-gray-500"
                  }`}
                >
                  {direction.number}
                </div>

                {/* Content */}
                <div className="ml-3 flex-1">
                  <div
                    className="cursor-pointer hover:bg-white hover:bg-opacity-5 p-1 rounded transition-colors"
                    onClick={() => toggleStep(direction.number)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">
                        Step {direction.number} - {direction.title}
                      </h4>
                      <span
                        className={`text-white text-xs ml-2 transition-transform duration-500 ease-in-out inline-block ${
                          openSteps.has(direction.number)
                            ? "rotate-180"
                            : "rotate-0"
                        }`}
                      >
                        <KeyboardArrowDownIcon fontSize="small" />
                      </span>
                    </div>
                  </div>

                  {/* Dropdown description with smooth animation */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      openSteps.has(direction.number)
                        ? "max-h-32 opacity-100 mt-1"
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <div className="p-2 bg-bg-black bg-opacity-50 rounded border border-white border-opacity-10">
                      <p className="text-xs text-text-gray leading-relaxed whitespace-pre-line">
                        {direction.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {contributionDirections.length === 0 && (
          <p className="text-xs text-text-gray">
            No contribution directions available.
          </p>
        )}
      </div>
    </div>
  );
}
