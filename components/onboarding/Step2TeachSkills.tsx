'use client';

import React from 'react';
import { TeachSkill, ProficiencyLevel } from '../../types/profile';
import { SkillSelector, SelectedSkill } from '../skills/SkillSelector';

interface Step2Props {
  teachSkills: TeachSkill[];
  onChange: (skills: TeachSkill[]) => void;
  error?: string;
}

export const Step2TeachSkills: React.FC<Step2Props> = ({
  teachSkills,
  onChange,
  error,
}) => {
  // Convert TeachSkill[] to SelectedSkill[]
  const selectedSkills: SelectedSkill[] = teachSkills.map((s) => ({
    skill_name: s.skill_name,
    level: s.proficiency,
  }));

  const handleSkillsChange = (newSkills: SelectedSkill[]) => {
    onChange(
      newSkills.map((s) => ({
        skill_name: s.skill_name,
        proficiency: s.level as ProficiencyLevel,
      }))
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Skills I Can Teach</span>
          <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Step 2
          </span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Share your superpowers! Add the technical or creative skills you can mentor other students in.
        </p>
      </div>

      <SkillSelector
        mode="teach"
        selectedSkills={selectedSkills}
        onChange={handleSkillsChange}
        error={error}
        minRequired={1}
      />
    </div>
  );
};
