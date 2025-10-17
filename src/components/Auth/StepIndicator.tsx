// src/components/Auth/StepIndicator.tsx

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
  onStepClick: (step: number) => void;
}

export default function StepIndicator({ currentStep, steps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center max-w-2xl">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isClickable = stepNumber < currentStep;

          return (
            <div key={label} className="flex items-center">
              {/* 단계 원 */}
              <div
                onClick={() => isClickable && onStepClick(stepNumber)}
                className={`flex flex-col items-center ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    isDone || isActive
                      ? 'bg-primary text-white'
                      : 'bg-border-light text-text-muted'
                  }`}
                >
                  {isDone ? '✓' : stepNumber}
                </div>
                <span
                  className={`mt-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive ? 'text-primary' : 'text-text-muted'
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* 연결선 */}
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-3 transition-colors duration-300 ${
                    stepNumber < currentStep ? 'bg-primary' : 'bg-border-light'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}