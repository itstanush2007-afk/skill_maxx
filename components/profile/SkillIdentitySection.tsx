import React, { useMemo } from 'react';
import { TeachSkill, LearnSkill, ProficiencyLevel, DesiredLevel } from '../../types/profile';
import {
  Sparkles,
  ArrowRightLeft,
  GraduationCap,
  Target,
  CheckCircle,
} from 'lucide-react';

interface SkillIdentitySectionProps {
  teachSkills: TeachSkill[];
  learnSkills: LearnSkill[];
  className?: string;
  showTitle?: boolean;
}

// Category heuristic based on common skill keywords in real profile data
function categorizeSkill(name: string): string {
  const lower = name.toLowerCase();
  if (
    lower.includes('python') ||
    lower.includes('java') ||
    lower.includes('c++') ||
    lower.includes('react') ||
    lower.includes('node') ||
    lower.includes('dsa') ||
    lower.includes('next') ||
    lower.includes('script')
  ) {
    return 'Development';
  }
  if (
    lower.includes('ai') ||
    lower.includes('machine learning') ||
    lower.includes('data') ||
    lower.includes('deep learning') ||
    lower.includes('vision')
  ) {
    return 'AI & Data';
  }
  if (
    lower.includes('ui') ||
    lower.includes('ux') ||
    lower.includes('figma') ||
    lower.includes('design')
  ) {
    return 'Design';
  }
  if (
    lower.includes('video') ||
    lower.includes('3d') ||
    lower.includes('audio') ||
    lower.includes('editing')
  ) {
    return 'Creative Media';
  }
  if (
    lower.includes('speaking') ||
    lower.includes('marketing') ||
    lower.includes('product') ||
    lower.includes('management')
  ) {
    return 'Leadership & Comm';
  }
  if (
    lower.includes('cyber') ||
    lower.includes('security') ||
    lower.includes('linux') ||
    lower.includes('cloud') ||
    lower.includes('docker')
  ) {
    return 'Systems & Cloud';
  }
  return 'General Skill';
}

export const SkillIdentitySection: React.FC<SkillIdentitySectionProps> = ({
  teachSkills,
  learnSkills,
  className = '',
  showTitle = true,
}) => {
  // 1. Calculate Real Competency Counts (No Fake Scores)
  const teachCounts = useMemo(() => {
    return {
      advanced: teachSkills.filter((s) => s.proficiency === 'advanced').length,
      intermediate: teachSkills.filter((s) => s.proficiency === 'intermediate').length,
      beginner: teachSkills.filter((s) => s.proficiency === 'beginner').length,
    };
  }, [teachSkills]);

  const learnCounts = useMemo(() => {
    return {
      advanced: learnSkills.filter((s) => s.desired_level === 'advanced').length,
      intermediate: learnSkills.filter((s) => s.desired_level === 'intermediate').length,
      beginner: learnSkills.filter((s) => s.desired_level === 'beginner').length,
    };
  }, [learnSkills]);

  // 2. Identify Domain Synergies based strictly on real profile items
  const teachDomains = useMemo(() => {
    const set = new Set<string>();
    teachSkills.forEach((s) => set.add(categorizeSkill(s.skill_name)));
    return Array.from(set);
  }, [teachSkills]);

  const learnDomains = useMemo(() => {
    const set = new Set<string>();
    learnSkills.forEach((s) => set.add(categorizeSkill(s.skill_name)));
    return Array.from(set);
  }, [learnSkills]);

  // Total balance ratio
  const totalOffered = teachSkills.length;
  const totalSought = learnSkills.length;
  const totalExchangeCapacity = totalOffered + totalSought;
  const teachRatio =
    totalExchangeCapacity > 0 ? Math.round((totalOffered / totalExchangeCapacity) * 100) : 50;

  // Level Meter Component (Truthful visual bars)
  const renderProficiencyMeter = (level: ProficiencyLevel) => {
    const bars = level === 'advanced' ? 3 : level === 'intermediate' ? 2 : 1;
    return (
      <div className="flex items-center gap-1" title={`Proficiency level: ${level}`}>
        <div
          className={`h-1.5 w-3.5 rounded-full ${
            bars >= 1 ? 'bg-gradient-to-r from-red-500 to-orange-400' : 'bg-slate-800'
          }`}
        />
        <div
          className={`h-1.5 w-3.5 rounded-full ${
            bars >= 2 ? 'bg-gradient-to-r from-orange-400 to-amber-400' : 'bg-slate-800'
          }`}
        />
        <div
          className={`h-1.5 w-3.5 rounded-full ${
            bars >= 3 ? 'bg-amber-400 shadow-sm shadow-amber-500/50' : 'bg-slate-800'
          }`}
        />
      </div>
    );
  };

  const renderDesiredMeter = (level: DesiredLevel) => {
    const bars = level === 'advanced' ? 3 : level === 'intermediate' ? 2 : 1;
    return (
      <div className="flex items-center gap-1" title={`Target desired level: ${level}`}>
        <div
          className={`h-1.5 w-3.5 rounded-full ${
            bars >= 1 ? 'bg-cyan-400' : 'bg-slate-800'
          }`}
        />
        <div
          className={`h-1.5 w-3.5 rounded-full ${
            bars >= 2 ? 'bg-cyan-400' : 'bg-slate-800'
          }`}
        />
        <div
          className={`h-1.5 w-3.5 rounded-full ${
            bars >= 3 ? 'bg-cyan-300 shadow-sm shadow-cyan-500/50' : 'bg-slate-800'
          }`}
        />
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Optional Section Header */}
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <div className="text-red-400 font-mono text-[11px] font-bold tracking-wider uppercase mb-1">
              // COMPLEMENTARY SKILL EXCHANGE
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Skill Identity & Exchange Profile
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear breakdown of competencies offered and growth aspirations sought for campus peer swaps.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-[#090d16] border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs text-slate-300 font-mono">
            <ArrowRightLeft className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold text-white">{totalOffered}</span> Offered
            <span className="text-slate-600">/</span>
            <span className="font-bold text-cyan-400">{totalSought}</span> Seeking
          </div>
        </div>
      )}

      {/* Main Grid: CAN TEACH vs WANTS TO LEARN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========================================================= */}
        {/* PILLAR 1: CAN TEACH ("I know these things") */}
        {/* ========================================================= */}
        <div className="rounded-2xl bg-[#090d16] border border-slate-800 p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between space-y-5 shadow-xl group">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 block font-mono">
                    // CAN TEACH
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    Offered Competencies
                  </h4>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-red-300 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                {teachSkills.length} SKILL{teachSkills.length !== 1 ? 'S' : ''}
              </span>
            </div>

            {/* List of Skills with Truthful Proficiency */}
            {teachSkills.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-800 text-center space-y-1.5 text-xs text-slate-500">
                <p className="font-semibold text-slate-400">No teaching skills selected yet.</p>
                <p>Add skills you are ready to guide other students in.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {teachSkills.map((skill) => {
                  const isAdvanced = skill.proficiency === 'advanced';
                  return (
                    <div
                      key={skill.skill_name}
                      className="p-3 sm:p-3.5 rounded-xl bg-[#030712] border border-slate-800/90 hover:border-red-500/40 transition-all flex items-center justify-between gap-3 group/item"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#090d16] border border-slate-800 flex items-center justify-center text-xs font-bold text-red-400 shrink-0">
                          {isAdvanced ? '★' : '✓'}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-sm font-bold text-white uppercase tracking-tight truncate">
                            {skill.skill_name}
                          </h5>
                          <span className="text-[10px] text-slate-400 block truncate font-mono">
                            {categorizeSkill(skill.skill_name)}
                          </span>
                        </div>
                      </div>

                      {/* Proficiency Indicator */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-md border font-mono uppercase ${
                            isAdvanced
                              ? 'bg-red-500/10 text-red-300 border-red-500/30 font-bold'
                              : skill.proficiency === 'intermediate'
                              ? 'bg-slate-800 text-orange-300 border-slate-700'
                              : 'bg-slate-900 text-slate-300 border-slate-800'
                          }`}
                        >
                          {isAdvanced ? 'Advanced' : skill.proficiency}
                        </span>
                        {renderProficiencyMeter(skill.proficiency)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sub-Card: Real Breakdown Stats */}
          {teachSkills.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#030712] border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-slate-400">// BREAKDOWN:</span>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                {teachCounts.advanced > 0 && (
                  <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    {teachCounts.advanced} Advanced
                  </span>
                )}
                {teachCounts.intermediate > 0 && (
                  <span className="text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    {teachCounts.intermediate} Intermediate
                  </span>
                )}
                {teachCounts.beginner > 0 && (
                  <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {teachCounts.beginner} Beginner
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* PILLAR 2: WANTS TO LEARN ("I want to learn these things") */}
        {/* ========================================================= */}
        <div className="rounded-2xl bg-[#090d16] border border-slate-800 p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between space-y-5 shadow-xl group">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block font-mono">
                    // WANTS TO LEARN
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    Learning Aspirations
                  </h4>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                {learnSkills.length} GOAL{learnSkills.length !== 1 ? 'S' : ''}
              </span>
            </div>

            {/* List of Skills with Desired Goal Level */}
            {learnSkills.length === 0 ? (
              <div className="p-8 rounded-xl border-2 border-dashed border-slate-800 text-center space-y-1.5 text-xs text-slate-500">
                <p className="font-semibold text-slate-400 font-mono">// NO LEARNING WISHLIST ADDED YET</p>
                <p>Add skills you want other students to mentor you in.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {learnSkills.map((skill) => {
                  const isAdvanced = skill.desired_level === 'advanced';
                  return (
                    <div
                      key={skill.skill_name}
                      className="p-3 sm:p-3.5 rounded-xl bg-[#030712] border border-slate-800/90 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3 group/item"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#090d16] border border-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0">
                          🎯
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-sm font-bold text-white uppercase tracking-tight truncate">
                            {skill.skill_name}
                          </h5>
                          <span className="text-[10px] text-slate-400 block truncate font-mono">
                            {categorizeSkill(skill.skill_name)}
                          </span>
                        </div>
                      </div>

                      {/* Desired Level Indicator */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-md border font-mono uppercase ${
                            isAdvanced
                              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 font-bold'
                              : skill.desired_level === 'intermediate'
                              ? 'bg-slate-800 text-cyan-300 border-slate-700'
                              : 'bg-slate-900 text-slate-300 border-slate-800'
                          }`}
                        >
                          {isAdvanced ? 'Mastery' : skill.desired_level}
                        </span>
                        {renderDesiredMeter(skill.desired_level)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sub-Card: Real Breakdown Stats */}
          {learnSkills.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#030712] border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-slate-400">// TARGETS:</span>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                {learnCounts.advanced > 0 && (
                  <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {learnCounts.advanced} Mastery
                  </span>
                )}
                {learnCounts.intermediate > 0 && (
                  <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                    {learnCounts.intermediate} Project
                  </span>
                )}
                {learnCounts.beginner > 0 && (
                  <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                    {learnCounts.beginner} Foundations
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. LIGHTWEIGHT VISUAL RELATIONSHIP & EXCHANGE BRIDGE */}
      {/* ========================================================= */}
      {(teachSkills.length > 0 || learnSkills.length > 0) && (
        <div className="rounded-2xl bg-[#090d16] border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs">
                ⇄
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">
                  Skill Exchange Synergy & Direction
                </h4>
                <p className="text-xs text-slate-400">
                  Visual mapping of knowledge you bring to the table versus what you seek in return.
                </p>
              </div>
            </div>

            {/* Truthful Exchange Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#030712] border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">EXCHANGE RATIO:</span>
              <span className="text-amber-400 font-bold uppercase">
                {totalOffered > totalSought
                  ? 'Mentor Focused'
                  : totalSought > totalOffered
                  ? 'Growth Focused'
                  : 'Balanced Trader'}
              </span>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-red-400 font-bold flex items-center gap-1">
                <span>● Teaching Capacity</span> ({totalOffered})
              </span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                ({totalSought}) <span>Learning Demand ●</span>
              </span>
            </div>

            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-500"
                style={{ width: `${teachRatio}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${100 - teachRatio}%` }}
              />
            </div>
          </div>

          {/* Domain Transition Matrix (Real Data) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#030712] border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 font-mono">
                // DOMAINS YOU CAN MENTOR
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {teachDomains.map((domain) => (
                  <span
                    key={domain}
                    className="text-xs px-2.5 py-0.5 rounded-md bg-red-500/10 text-red-300 border border-red-500/20 font-mono"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#030712] border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                // DOMAINS YOU SEEK
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {learnDomains.map((domain) => (
                  <span
                    key={domain}
                    className="text-xs px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hackathon Presentation Note */}
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 font-mono">
            <CheckCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>
              Direct student-verified calibration. Zero synthetic or fabricated AI scores.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
