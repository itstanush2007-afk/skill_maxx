'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { TeachSkill, LearnSkill } from '../../types/profile';
import {
  Sparkles,
  ArrowRight,
  User,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface ProfileCompletionStateProps {
  fullName: string;
  department: string;
  year: string;
  avatarUrl?: string;
  teachingSkills: TeachSkill[];
  learningSkills: LearnSkill[];
  completenessScore: number;
}

export const ProfileCompletionState: React.FC<ProfileCompletionStateProps> = ({
  fullName,
  department,
  year,
  avatarUrl,
  teachingSkills,
  learningSkills,
  completenessScore,
}) => {
  const router = useRouter();
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Smooth progress animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(completenessScore);
    }, 200);
    return () => clearTimeout(timer);
  }, [completenessScore]);

  // Handle smooth transition to dashboard or profile
  const handleTransition = (targetUrl: string) => {
    setIsExiting(true);
    setTimeout(() => {
      router.push(targetUrl);
    }, 380);
  };

  const teachingCount = teachingSkills.length;
  const learningCount = learningSkills.length;

  return (
    <div
      className={`w-full max-w-2xl mx-auto py-4 px-4 sm:px-6 transition-all duration-400 ease-out ${
        isExiting
          ? 'opacity-0 scale-[0.98] -translate-y-2 pointer-events-none'
          : 'animate-completion-entrance'
      }`}
    >
      <div className="relative rounded-2xl bg-[#090d16] border border-slate-800 p-5 sm:p-10 shadow-2xl shadow-black/80 space-y-8 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Professional Completion Icon & Status Badge */}
        <div className="relative flex flex-col items-center text-center space-y-4">
          <div className="relative">
            {/* Outer Soft Halo */}
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/10">
              <svg
                className="w-10 h-10 text-red-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  className="animate-check-draw"
                  d="M20 6L9 17l-5-5"
                />
              </svg>
            </div>
            {/* Corner Verified Spark */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center ring-4 ring-[#090d16]">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2 max-w-lg">
            <div className="text-red-400 font-mono text-[11px] font-bold tracking-wider uppercase">
              // ONBOARDING VERIFICATION COMPLETE
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Your Skill Identity is Ready
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              SkillMaxx now knows what you can teach and what you want to learn.
            </p>
          </div>
        </div>

        {/* 2. Core Metrics: Teaching Count, Learning Count, Profile Completeness */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Card 1: Teaching Skills Count */}
          <div className="p-4 rounded-xl bg-[#030712] border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 font-mono">
                // CAN TEACH
              </span>
              <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-white tracking-tight">
                {teachingCount}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {teachingCount === 1 ? 'Skill to share' : 'Skills to share'}
              </p>
            </div>
            {/* Skill Chips Preview */}
            <div className="flex flex-wrap gap-1 pt-1">
              {teachingSkills.slice(0, 2).map((s) => (
                <span
                  key={s.skill_name}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20 truncate max-w-[120px]"
                >
                  {s.skill_name}
                </span>
              ))}
              {teachingSkills.length > 2 && (
                <span className="text-[10px] text-slate-500 self-center font-mono">
                  +{teachingSkills.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Learning Skills Count */}
          <div className="p-4 rounded-xl bg-[#030712] border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                // WANTS TO LEARN
              </span>
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Compass className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-white tracking-tight">
                {learningCount}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {learningCount === 1 ? 'Learning goal' : 'Learning goals'}
              </p>
            </div>
            {/* Skill Chips Preview */}
            <div className="flex flex-wrap gap-1 pt-1">
              {learningSkills.slice(0, 2).map((s) => (
                <span
                  key={s.skill_name}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 truncate max-w-[120px]"
                >
                  {s.skill_name}
                </span>
              ))}
              {learningSkills.length > 2 && (
                <span className="text-[10px] text-slate-500 self-center font-mono">
                  +{learningSkills.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Profile Completeness */}
          <div className="p-4 rounded-xl bg-[#030712] border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                // READINESS
              </span>
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-amber-400 tracking-tight">
                {animatedProgress}%
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">Profile readiness</p>
            </div>
            {/* Animated Flame Progress Bar */}
            <div className="w-full space-y-1.5 pt-1">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${animatedProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">
                Verified attributes
              </span>
            </div>
          </div>
        </div>

        {/* 3. Compact Student Identity Snapshot */}
        <div className="relative p-4 rounded-xl bg-[#030712] border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <Avatar
              src={avatarUrl}
              name={fullName}
              size="md"
              className="ring-2 ring-red-500/30 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-sm font-black text-white uppercase tracking-tight truncate">
                {fullName}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 truncate font-mono">
                <GraduationCap className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="truncate">{department}</span>
                <span>•</span>
                <span className="shrink-0">{year}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            <span>READY FOR MATCHING</span>
          </div>
        </div>

        {/* 4. Action Buttons - Primary & Secondary */}
        <div className="relative pt-2 flex flex-col sm:flex-row items-center gap-3">
          {/* Primary Button: "Explore My Matches" */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full sm:flex-1 bg-[#7B57FF] hover:bg-[#6D44FF] text-white font-semibold text-xs tracking-wide shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all group py-3.5 rounded-xl border-0"
            onClick={() => handleTransition('/dashboard?updated=true#matches')}
            disabled={isExiting}
          >
            <span>Explore My Matches</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Secondary Button: "View My Profile" */}
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto bg-[#1C1833] hover:bg-[#272147] text-slate-200 border border-purple-900/40 text-xs active:scale-[0.99] transition-all py-3.5 rounded-xl"
            onClick={() => handleTransition('/profile')}
            disabled={isExiting}
            icon={<User className="w-4 h-4 text-slate-400" />}
          >
            <span>View My Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
