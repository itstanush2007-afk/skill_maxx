'use client';

import React from 'react';
import { LearnSkill, DesiredLevel } from '../../types/profile';
import { SkillSelector, SelectedSkill } from '../skills/SkillSelector';

interface Step3Props {
  learnSkills: LearnSkill[];
  onChange: (skills: LearnSkill[]) => void;
  error?: string;
}

export const Step3LearnSkills: React.FC<Step3Props> = ({
  learnSkills,
  onChange,
  error,
}) => {
  // Convert LearnSkill[] to SelectedSkill[]
  const selectedSkills: SelectedSkill[] = learnSkills.map((s) => ({
    skill_name: s.skill_name,
    level: s.desired_level,
  }));

  const handleSkillsChange = (newSkills: SelectedSkill[]) => {
    onChange(
      newSkills.map((s) => ({
        skill_name: s.skill_name,
        desired_level: s.level as DesiredLevel,
      }))
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <div className="text-[11px] font-mono text-red-400 font-bold tracking-wider uppercase mb-1">
          // STEP 03 • LEARNING ASPIRATIONS
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center justify-between">
          <span>Skills I Want to Learn</span>
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            PHASE 03
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          // TOPICS & FRAMEWORKS SOUGHT FOR RECIPROCAL TWO-WAY EXCHANGE
        </p>
      </div>

      <SkillSelector
        mode="learn"
        selectedSkills={selectedSkills}
        onChange={handleSkillsChange}
        error={error}
        minRequired={1}
      />
    </div>
  );
};
