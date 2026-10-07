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
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-[#0b101c] border border-slate-800/90 p-7 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-black/80 space-y-8 overflow-hidden">
        {/* Subtle Ambient Radial Lighting - Refined, Professional, Non-flashy */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-subtle-glow" />
        <div className="absolute -bottom-20 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Subtle Professional Completion Icon & Status Badge */}
        <div className="relative flex flex-col items-center text-center space-y-4">
          <div className="relative">
            {/* Outer Soft Halo */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              {/* Refined SVG Checkmark with Smooth Draw Animation */}
              <svg
                className="w-10 h-10 text-emerald-400"
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
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center ring-4 ring-slate-900">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Title & Subtitle - Exact User Specifications */}
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONBOARDING COMPLETE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Your Skill Identity is Ready
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              SkillMaxx now knows what you can teach and what you want to learn.
            </p>
          </div>
        </div>

        {/* 2. Core Metrics: Teaching Count, Learning Count, Profile Completeness */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Card 1: Teaching Skills Count */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/20 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Can Teach
              </span>
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-white tracking-tight">
                {teachingCount}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {teachingCount === 1 ? 'Skill to share' : 'Skills to share'}
              </p>
            </div>
            {/* Skill Chips Preview */}
            <div className="flex flex-wrap gap-1 pt-1">
              {teachingSkills.slice(0, 2).map((s) => (
                <span
                  key={s.skill_name}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 truncate max-w-[120px]"
                >
                  {s.skill_name}
                </span>
              ))}
              {teachingSkills.length > 2 && (
                <span className="text-[10px] text-slate-500 self-center">
                  +{teachingSkills.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Learning Skills Count */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-blue-500/20 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                Wants to Learn
              </span>
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Compass className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-white tracking-tight">
                {learningCount}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {learningCount === 1 ? 'Learning goal' : 'Learning goals'}
              </p>
            </div>
            {/* Skill Chips Preview */}
            <div className="flex flex-wrap gap-1 pt-1">
              {learningSkills.slice(0, 2).map((s) => (
                <span
                  key={s.skill_name}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 truncate max-w-[120px]"
                >
                  {s.skill_name}
                </span>
              ))}
              {learningSkills.length > 2 && (
                <span className="text-[10px] text-slate-500 self-center">
                  +{learningSkills.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Profile Completeness */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Completeness
              </span>
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono text-emerald-400 tracking-tight">
                {animatedProgress}%
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Profile readiness</p>
            </div>
            {/* Animated Progress Bar */}
            <div className="w-full space-y-1.5 pt-1">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${animatedProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                Verified attributes
              </span>
            </div>
          </div>
        </div>

        {/* 3. Compact Student Identity Snapshot */}
        <div className="relative p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <Avatar
              src={avatarUrl}
              name={fullName}
              size="md"
              className="ring-2 ring-emerald-500/20 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">
                {fullName}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{department}</span>
                <span>•</span>
                <span className="shrink-0">{year}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            <span>Ready for Matching</span>
          </div>
        </div>

        {/* 4. Action Buttons - Primary & Secondary */}
        <div className="relative pt-2 flex flex-col sm:flex-row items-center gap-3">
          {/* Primary Button: "Explore My Matches" */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full sm:flex-1 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/35 active:scale-[0.99] transition-all group"
            onClick={() => handleTransition('/dashboard#matches')}
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
            className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 font-semibold text-sm active:scale-[0.99] transition-all"
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
