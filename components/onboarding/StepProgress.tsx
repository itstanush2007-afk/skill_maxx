import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: { id: number; title: string; subtitle: string }[];
  onStepClick?: (step: number) => void;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
}) => {
  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full space-y-4">
      {/* Top Mobile/Tablet Bar */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
        <span className="uppercase tracking-wider text-emerald-400">
          Step {currentStep} of {totalSteps}
        </span>
        <span>{percentage}% Completed</span>
      </div>

      {/* Progress Bar Line */}
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Desktop Step Badges */}
      <div className="hidden md:grid grid-cols-5 gap-2 pt-2">
        {steps.map((s) => {
          const isDone = s.id < currentStep;
          const isCurrent = s.id === currentStep;

          return (
            <button
              key={s.id}
              type="button"
              disabled={s.id > currentStep}
              onClick={() => onStepClick && s.id <= currentStep && onStepClick(s.id)}
              className={`text-left p-2.5 rounded-xl border transition-all text-xs select-none ${
                isCurrent
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm shadow-emerald-500/10'
                  : isDone
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 cursor-pointer'
                  : 'bg-transparent border-transparent opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 transition-colors ${
                    isDone
                      ? 'bg-emerald-500 text-black'
                      : isCurrent
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : s.id}
                </span>
                <span
                  className={`font-semibold truncate ${
                    isCurrent ? 'text-white' : isDone ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate pl-7">{s.subtitle}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
