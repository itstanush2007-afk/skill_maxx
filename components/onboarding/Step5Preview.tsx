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
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Profile & Skill Identity Preview</span>
          <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Step 5
          </span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Review your student identity card and complementary skill exchange profile before saving.
        </p>
      </div>

      {/* Main Student Card Preview */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-[#0b101c] border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-black/60 overflow-hidden">
        {/* Ambient Glow decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <Avatar src={avatarUrl} name={fullName || 'Student'} size="xl" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {fullName || 'Anonymous Student'}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Student</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-300">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{department || 'Department not specified'}</span>
                  </span>
                  <span>•</span>
                  <span>{year || 'Year not specified'}</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-xs">
              <span className="text-slate-400">Interaction Mode:</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold capitalize flex items-center gap-1.5">
                {availability.mode === 'online' ? (
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                ) : availability.mode === 'in-person' ? (
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{availability.mode || 'hybrid'}</span>
              </span>
            </div>
          </div>

          {/* Bio Quote */}
          {bio && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-300 italic leading-relaxed">
              "{bio}"
            </div>
          )}

          {/* Schedule Footer */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-white">Active Days:</strong>{' '}
                {availability.preferred_days?.length > 0
                  ? availability.preferred_days.join(', ')
                  : 'Flexible'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-white">Timeslot:</strong>{' '}
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

      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
        <p>
          Everything looks ready! Clicking <strong>"Save & Launch Dashboard"</strong> below will store your profile to Supabase and instantly unlock reciprocal matching and project squads.
        </p>
      </div>
    </div>
  );
};
