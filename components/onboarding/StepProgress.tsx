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
        <span className="uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Step 0{currentStep} of 0{totalSteps}
        </span>
        <span className="text-purple-300">{percentage}% completed</span>
      </div>

      {/* Progress Bar Line */}
      <div className="h-2 w-full bg-[#1C1833] border border-purple-900/40 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-[#7B57FF] rounded-full transition-all duration-300 ease-out shadow-sm shadow-purple-500/30"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Desktop Step Badges matching Hackathon Execution Structure */}
      <div className="hidden md:grid grid-cols-5 gap-2 pt-2">
        {steps.map((s) => {
          const isDone = s.id < currentStep;
          const isCurrent = s.id === currentStep;
          const isFinal = s.id === totalSteps;

          return (
            <button
              key={s.id}
              type="button"
              disabled={s.id > currentStep}
              onClick={() => onStepClick && s.id <= currentStep && onStepClick(s.id)}
              className={`text-left p-3 rounded-2xl border transition-all text-xs select-none flex flex-col justify-between ${
                isCurrent
                  ? 'bg-[#1C1833] border-[#7B57FF] shadow-lg shadow-purple-500/10'
                  : isDone
                  ? 'bg-[#1C1833]/60 border-purple-900/40 hover:border-purple-600/50 cursor-pointer'
                  : 'bg-transparent border-slate-900 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono">
                <span
                  className={
                    isCurrent
                      ? 'text-amber-400 font-bold'
                      : isDone
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }
                >
                  PHASE 0{s.id}
                </span>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${
                    isDone
                      ? 'bg-amber-400 text-black'
                      : isCurrent
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900 text-slate-600'
                  }`}
                >
                  {isDone ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : s.id}
                </span>
              </div>

              <div>
                <h5
                  className={`font-mono font-bold text-xs truncate uppercase ${
                    isCurrent ? 'text-white' : isDone ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {s.title}
                </h5>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{s.subtitle}</p>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono">
                <span className="text-slate-500">MILESTONE</span>
                <span className={isCurrent ? 'text-amber-400 font-bold' : 'text-cyan-400'}>
                  {isFinal && isCurrent ? '★ FINISH' : '→ NEXT'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
