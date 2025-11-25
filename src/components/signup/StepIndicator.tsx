interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
  onStepClick: (step: number) => void;
}

export default function StepIndicator({ currentStep, steps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-6 sm:mb-8">
      <div className="flex items-center max-w-md sm:max-w-2xl overflow-x-auto px-2 sm:px-0 scrollbar-hide">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={label} className="flex items-center flex-shrink-0">
              {/* 단계 원 */}
              <div
                onClick={() => stepNumber < currentStep && onStepClick(stepNumber)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div
                  className={`
                    flex items-center justify-center font-semibold rounded-full 
                    transition-all duration-300 
                    ${isDone || isActive ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}
                    w-8 h-8 sm:w-12 sm:h-12
                  `}
                >
                  {isDone ? "✓" : stepNumber}
                </div>

                <span
                  className={`mt-2 transition-colors whitespace-nowrap 
                    text-xs sm:text-sm font-medium
                    ${isActive ? "text-primary" : "text-gray-500"}
                  `}
                >
                  {label}
                </span>
              </div>

              {/* 단계 사이 줄 */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    h-1 mx-2 sm:mx-3 transition-all 
                    ${stepNumber < currentStep ? "bg-primary" : "bg-gray-300"}
                    w-12 sm:w-24
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}