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
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Skills I Want to Learn</span>
          <span className="text-xs font-normal text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            Step 3
          </span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          What are you eager to master? SkillMaxx connects you with campus peers ready to share their expertise.
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
