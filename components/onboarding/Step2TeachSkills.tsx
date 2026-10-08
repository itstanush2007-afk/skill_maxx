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
        <div className="text-[11px] font-mono text-red-400 font-bold tracking-wider uppercase mb-1">
          // STEP 02 • MENTORSHIP SUPERPOWER
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center justify-between">
          <span>Skills I Can Teach</span>
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            PHASE 02
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          // DEFINE TECHNICAL OR CREATIVE COMPETENCIES OFFERED TO CAMPUS PEERS
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
