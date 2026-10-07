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
            bars >= 1 ? 'bg-emerald-400' : 'bg-slate-700'
          }`}
        />
        <div
          className={`h-1.5 w-3.5 rounded-full ${
            bars >= 2 ? 'bg-emerald-400' : 'bg-slate-700'
          }`}
        />
        <div
          className={`h-1.5 w-3.5 rounded-full ${
            bars >= 3 ? 'bg-emerald-400' : 'bg-slate-700'
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
            bars >= 1 ? 'bg-blue-400' : 'bg-slate-700'
          }`}
        />
        <div
          className={`h-1.5 w-3.5 rounded-full ${
            bars >= 2 ? 'bg-blue-400' : 'bg-slate-700'
          }`}
        />
        <div
          className={`h-1.5 w-3.5 rounded-full ${
            bars >= 3 ? 'bg-blue-400' : 'bg-slate-700'
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skill Identity & Exchange Profile</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Complementary Skill Exchange
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear breakdown of competencies offered and growth aspirations sought for campus peer swaps.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold font-mono text-white">{totalOffered}</span> Offered
            <span className="text-slate-600">/</span>
            <span className="font-semibold font-mono text-blue-400">{totalSought}</span> Seeking
          </div>
        </div>
      )}

      {/* Main Grid: CAN TEACH vs WANTS TO LEARN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========================================================= */}
        {/* PILLAR 1: CAN TEACH ("I know these things") */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-slate-900/80 border border-emerald-500/20 p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between space-y-5 shadow-lg shadow-black/20 group">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block font-mono">
                    Can Teach
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    "I know these things"
                  </h4>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                {teachSkills.length} skill{teachSkills.length !== 1 ? 's' : ''}
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
                      className="p-3 sm:p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-emerald-500/30 transition-all flex items-center justify-between gap-3 group/item"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                          {isAdvanced ? '⭐' : '✓'}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-sm font-bold text-white truncate">
                            {skill.skill_name}
                          </h5>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {categorizeSkill(skill.skill_name)}
                          </span>
                        </div>
                      </div>

                      {/* Proficiency Indicator */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border capitalize ${
                            isAdvanced
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                              : skill.proficiency === 'intermediate'
                              ? 'bg-slate-800 text-emerald-300 border-slate-700'
                              : 'bg-slate-900 text-slate-300 border-slate-800'
                          }`}
                        >
                          {isAdvanced ? 'Advanced (Expert)' : skill.proficiency}
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
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-slate-300">Competency Breakdown:</span>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                {teachCounts.advanced > 0 && (
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                    {teachCounts.advanced} Advanced
                  </span>
                )}
                {teachCounts.intermediate > 0 && (
                  <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded-lg">
                    {teachCounts.intermediate} Intermediate
                  </span>
                )}
                {teachCounts.beginner > 0 && (
                  <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg">
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
        <div className="rounded-3xl bg-slate-900/80 border border-blue-500/20 p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between space-y-5 shadow-lg shadow-black/20 group">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block font-mono">
                    Wants To Learn
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    "I want to learn these things"
                  </h4>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">
                {learnSkills.length} goal{learnSkills.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* List of Skills with Desired Goal Level */}
            {learnSkills.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-800 text-center space-y-1.5 text-xs text-slate-500">
                <p className="font-semibold text-slate-400">No learning wishlist added yet.</p>
                <p>Add skills you want other students to mentor you in.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {learnSkills.map((skill) => {
                  const isAdvanced = skill.desired_level === 'advanced';
                  return (
                    <div
                      key={skill.skill_name}
                      className="p-3 sm:p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-blue-500/30 transition-all flex items-center justify-between gap-3 group/item"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                          🎯
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-sm font-bold text-white truncate">
                            {skill.skill_name}
                          </h5>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {categorizeSkill(skill.skill_name)}
                          </span>
                        </div>
                      </div>

                      {/* Desired Level Indicator */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border capitalize ${
                            isAdvanced
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                              : skill.desired_level === 'intermediate'
                              ? 'bg-slate-800 text-blue-300 border-slate-700'
                              : 'bg-slate-900 text-slate-300 border-slate-800'
                          }`}
                        >
                          Target: {isAdvanced ? 'Mastery' : skill.desired_level}
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
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-slate-300">Aspiration Targets:</span>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                {learnCounts.advanced > 0 && (
                  <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                    {learnCounts.advanced} Mastery Target
                  </span>
                )}
                {learnCounts.intermediate > 0 && (
                  <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded-lg">
                    {learnCounts.intermediate} Project Target
                  </span>
                )}
                {learnCounts.beginner > 0 && (
                  <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg">
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
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-5 sm:p-6 backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                ⇄
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  Skill Exchange Synergy & Direction
                </h4>
                <p className="text-xs text-slate-400">
                  Visual mapping of knowledge you bring to the table versus what you seek in return.
                </p>
              </div>
            </div>

            {/* Truthful Exchange Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400">Exchange Profile:</span>
              <span className="text-emerald-400 font-bold">
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
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span>● Teaching Capacity</span> ({totalOffered})
              </span>
              <span className="text-blue-400 font-semibold flex items-center gap-1">
                ({totalSought}) <span>Learning Demand ●</span>
              </span>
            </div>

            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${teachRatio}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${100 - teachRatio}%` }}
              />
            </div>
          </div>

          {/* Domain Transition Matrix (Real Data) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Domains You Can Mentor
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {teachDomains.map((domain) => (
                  <span
                    key={domain}
                    className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
                Domains You Seek
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {learnDomains.map((domain) => (
                  <span
                    key={domain}
                    className="text-xs px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hackathon Presentation Note */}
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              All competencies reflect direct verified student calibration. Zero synthetic or fabricated AI scores.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
