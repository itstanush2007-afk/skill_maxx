import React from 'react';
import { Availability, TeachSkill, LearnSkill } from '../../types/profile';
import { Avatar } from '../ui/Avatar';
import { Calendar, Clock, Globe, MapPin, Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react';
import { SkillIdentitySection } from '../profile/SkillIdentitySection';

interface Step5Props {
  fullName: string;
  department: string;
  year: string;
  bio: string;
  avatarUrl: string;
  teachSkills: TeachSkill[];
  learnSkills: LearnSkill[];
  availability: Availability;
}

export const Step5Preview: React.FC<Step5Props> = ({
  fullName,
  department,
  year,
  bio,
  avatarUrl,
  teachSkills,
  learnSkills,
  availability,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <div className="text-[11px] font-mono text-red-400 font-bold tracking-wider uppercase mb-1">
          // STEP 05 • PROFILE & IDENTITY PREVIEW
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center justify-between">
          <span>Profile & Skill Identity Preview</span>
          <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/30">
            FINAL PHASE 05
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          // REVIEW STUDENT IDENTITY PASSPORT & COMPLEMENTARY COMPETENCY MATRIX
        </p>
      </div>

      {/* Main Student Card Preview - Styled like Featured Final Stage in Reference */}
      <div className="relative rounded-2xl bg-[#090d16] border border-red-500/50 p-6 sm:p-8 shadow-2xl shadow-black/80 overflow-hidden">
        <div className="relative space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-start sm:items-center gap-4 min-w-0">
              <Avatar src={avatarUrl} name={fullName || 'Student'} size="xl" className="shrink-0" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white break-words uppercase font-mono">
                    {fullName || 'Anonymous Student'}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    <span>VERIFIED PEER</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 font-medium text-slate-300">
                    <GraduationCap className="w-3.5 h-3.5 text-red-400" />
                    <span>{department || 'Department not specified'}</span>
                  </span>
                  <span>•</span>
                  <span>{year || 'Year not specified'}</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-xs font-mono">
              <span className="text-slate-400 uppercase">// MODE:</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#030712] border border-slate-700 text-white font-semibold uppercase flex items-center gap-1.5">
                {availability.mode === 'online' ? (
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                ) : availability.mode === 'in-person' ? (
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{availability.mode || 'hybrid'}</span>
              </span>
            </div>
          </div>

          {/* Bio Quote */}
          {bio && (
            <div className="p-4 rounded-xl bg-[#030712] border border-slate-800 text-sm text-slate-300 italic leading-relaxed font-mono">
              "{bio}"
            </div>
          )}

          {/* Schedule Footer */}
          <div className="p-4 rounded-xl bg-[#030712] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                <strong className="text-white uppercase">// ACTIVE DAYS:</strong>{' '}
                {availability.preferred_days?.length > 0
                  ? availability.preferred_days.join(', ')
                  : 'Flexible'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong className="text-white uppercase">// TIMESLOT:</strong>{' '}
                {availability.preferred_time || 'Flexible / Any time'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Skill Identity Section */}
      <SkillIdentitySection
        teachSkills={teachSkills}
        learnSkills={learnSkills}
        showTitle={true}
      />

      <div className="p-4 rounded-xl bg-[#090d16] border border-red-500/30 text-xs text-slate-300 flex items-center gap-3 font-mono">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
        <p>
          Everything is verified! Clicking <strong className="text-white">"Save & Launch Dashboard"</strong> below will store your profile to Supabase and instantly activate reciprocal matching and project squads.
        </p>
      </div>
    </div>
  );
};
