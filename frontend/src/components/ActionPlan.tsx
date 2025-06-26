import { useState } from "react";

interface ActionPlanProps {
  contributionDirections: Array<{
    number: number;
    title: string;
    description: string;
  }>;
}

export default function ActionPlan({
  contributionDirections,
}: ActionPlanProps) {
  // 모든 step을 처음에 펼친 상태로 초기화
  const [openSteps, setOpenSteps] = useState<Set<number>>(
    new Set(contributionDirections.map((direction) => direction.number))
  );

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
      <h3 className="text-lg font-semibold text-white mb-3">Action Plan</h3>
      {contributionDirections.length > 0 ? (
        <div className="space-y-6">
          {contributionDirections.map((direction, index) => (
            <div key={direction.number} className="relative">
              {/* Vertical line (except for last item) - uses flex to fill space */}
              {index !== contributionDirections.length - 1 && (
                <div
                  className="absolute left-4 top-8 w-0.5 bg-white bg-opacity-20"
                  style={{ height: "calc(100% + 1.5rem)" }}
                />
              )}

              <div className="flex items-start">
                {/* Step circle */}
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 z-10">
                  {direction.number}
                </div>

                {/* Content */}
                <div className="ml-3 flex-1">
                  <div
                    className="cursor-pointer hover:bg-white hover:bg-opacity-5 p-1.5 rounded transition-colors"
                    onClick={() => toggleStep(direction.number)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-white">
                        Step {direction.number} - {direction.title}
                      </h4>
                      <span
                        className={`text-white text-xs ml-2 transition-transform duration-200 ${
                          openSteps.has(direction.number) ? "rotate-90" : ""
                        }`}
                      >
                        ▶
                      </span>
                    </div>
                  </div>

                  {/* Dropdown description with smooth animation */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      openSteps.has(direction.number)
                        ? "max-h-48 opacity-100 mt-1.5"
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <div className="p-2 bg-bg-black bg-opacity-50 rounded border border-white border-opacity-10">
                      <p className="text-xs text-text-gray leading-snug">
                        {direction.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-text-gray">
          No contribution directions available.
        </p>
      )}
    </div>
  );
}
