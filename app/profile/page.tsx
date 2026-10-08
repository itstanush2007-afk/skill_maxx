'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import {
  Calendar,
  Clock,
  Edit3,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Globe,
  MapPin,
  CheckCircle2,
  Loader2,
  Plus,
  Check,
  AlertCircle,
  Zap,
  LogOut,
} from 'lucide-react';
import { CompleteUserProfile, calculateProfileCompleteness } from '../../types/profile';
import { getCurrentUserProfile, signOutUser } from '../../lib/supabase/profile';
import { SkillIdentitySection } from '../../components/profile/SkillIdentitySection';

export default function ProfilePage() {
  const [profile, setProfile] = useState<CompleteUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Instant local storage hydration for zero-flicker rendering
      try {
        const local = typeof window !== 'undefined' ? localStorage.getItem('skillmaxx_user_profile') : null;
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.full_name) {
            setProfile({
              id: parsed.user_id,
              user_id: parsed.user_id,
              full_name: parsed.full_name,
              email: parsed.email,
              department: parsed.department,
              year: parsed.year,
              bio: parsed.bio,
              avatar_url: parsed.avatar_url,
              availability: parsed.availability || { preferred_days: [], preferred_time: '', mode: 'hybrid' },
              is_onboarded: true,
              teach_skills: parsed.teach_skills || [],
              learn_skills: parsed.learn_skills || [],
            });
            setLoading(false);
          }
        }
      } catch (e) {
        console.error(e);
      }

      const { data } = await getCurrentUserProfile();
      if (data) {
        setProfile(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  // 1. Calculate Profile Completeness based strictly on real profile data
  const completeness = useMemo(() => {
    if (!profile) return { score: 0, items: [] };
    return calculateProfileCompleteness(profile);
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#090d16]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm text-slate-400">Loading student profile card...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-[#090d16]">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">No Profile Found</h2>
          <p className="text-sm text-slate-400">
            You haven't set up your SkillMaxx profile yet. Complete the onboarding wizard to generate your official student card.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="bg-emerald-400 hover:bg-emerald-300 font-bold text-black">
              <span>Create Profile</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#030712]">
      <Navbar
        userName={profile.full_name}
        avatarUrl={profile.avatar_url}
        isOnboarded={true}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation & Header Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Link href="/dashboard" className="hover:text-red-400 transition-colors">
              // DASHBOARD
            </Link>
            <span>/</span>
            <span className="text-white font-bold">// CAMPUS SKILL PASSPORT</span>
          </div>

          {/* 3 Core Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono">
            <Link href="/onboarding?step=2">
              <Button
                variant="outline"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5 text-red-400" />}
                className="bg-[#090d16] border-slate-800 hover:border-red-500/40 text-slate-300 text-xs uppercase"
              >
                <span>Add Skill</span>
              </Button>
            </Link>

            <Link href="/onboarding?step=4">
              <Button
                variant="outline"
                size="sm"
                icon={<Calendar className="w-3.5 h-3.5 text-cyan-400" />}
                className="bg-[#090d16] border-slate-800 hover:border-cyan-500/40 text-slate-300 text-xs uppercase"
              >
                <span>Update Schedule</span>
              </Button>
            </Link>

            <Link href="/onboarding">
              <Button
                variant="primary"
                size="sm"
                icon={<Edit3 className="w-3.5 h-3.5" />}
                className="bg-[#7B57FF] hover:bg-[#6D44FF] text-white font-semibold text-xs border-0 shadow-sm shadow-purple-500/20 active:scale-[0.98] rounded-xl px-4 py-2"
              >
                <span>Edit Profile</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              icon={<LogOut className="w-3.5 h-3.5 text-slate-400" />}
              className="bg-[#090d16] border-slate-800 hover:border-purple-500/40 hover:text-purple-300 text-slate-300 text-xs rounded-xl"
              onClick={async () => {
                await signOutUser();
                window.location.href = '/onboarding';
              }}
            >
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* THE "SKILL IDENTITY CARD" (10-Second Instant Recognition Hero)             */}
        {/* ========================================================================= */}
        <div className="relative rounded-2xl bg-[#090d16] border border-purple-500/30 p-6 sm:p-8 shadow-2xl shadow-purple-500/5 space-y-6 overflow-hidden">
          {/* Top Card Badge Bar */}
          <div className="relative flex items-center justify-between pb-4 border-b border-slate-800/80 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-purple-300 uppercase tracking-widest font-bold">
                // SKILLMAX STUDENT IDENTITY PASSPORT
              </span>
            </div>
            <span className="text-slate-500 hidden sm:inline-block">
              CAMPUS ID #{profile.user_id ? profile.user_id.slice(0, 8).toUpperCase() : 'VERIFIED'}
            </span>
          </div>

          {/* Profile Header */}
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
              <Avatar
                src={profile.avatar_url}
                name={profile.full_name}
                size="xl"
                className="ring-2 ring-purple-500/40 shadow-lg shadow-black/50 shrink-0"
              />
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight break-words">
                    {profile.full_name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded font-mono shrink-0 uppercase">
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    <span>Verified Peer</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 font-medium text-slate-200">
                    <GraduationCap className="w-4 h-4 text-red-400" />
                    <span>{profile.department}</span>
                  </span>
                  <span>•</span>
                  <span>{profile.year}</span>
                </div>
              </div>
            </div>

            {/* Availability Mode Badge */}
            <div className="self-start md:self-auto flex items-center gap-2 p-3 rounded-xl bg-[#030712] border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 uppercase">// MODE:</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#090d16] border border-slate-700 text-white font-bold uppercase flex items-center gap-1.5">
                {profile.availability?.mode === 'online' ? (
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                ) : profile.availability?.mode === 'in-person' ? (
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{profile.availability?.mode || 'hybrid'}</span>
              </span>
            </div>
          </div>

          {/* Bio Quote */}
          {profile.bio && (
            <div className="relative p-4 rounded-xl bg-[#030712] border border-slate-800 text-sm text-slate-300 italic leading-relaxed font-mono">
              "{profile.bio}"
            </div>
          )}

          {/* 10-Second Quick Glance: Two Skills Columns */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* CAN TEACH */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#030712] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>// SKILLS I CAN TEACH</span>
                </span>
                <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  {profile.teach_skills?.length || 0} SKILLS
                </span>
              </div>

              {(!profile.teach_skills || profile.teach_skills.length === 0) ? (
                <p className="text-xs text-slate-500 italic font-mono">// No teaching skills listed.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.teach_skills.map((s) => {
                    const isAdvanced = s.proficiency === 'advanced';
                    return (
                      <span
                        key={s.skill_name}
                        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-mono ${
                          isAdvanced
                            ? 'bg-red-500/10 text-red-300 border-red-500/30 font-bold'
                            : s.proficiency === 'intermediate'
                            ? 'bg-slate-900 text-orange-300 border-slate-800'
                            : 'bg-[#090d16] text-slate-300 border-slate-800'
                        }`}
                      >
                        <span>{s.skill_name}</span>
                        <span className="opacity-75 text-[10px] font-mono uppercase">
                          ({isAdvanced ? 'Expert' : s.proficiency})
                        </span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* WANTS TO LEARN */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#030712] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>// SKILLS I WANT TO LEARN</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {profile.learn_skills?.length || 0} GOALS
                </span>
              </div>

              {(!profile.learn_skills || profile.learn_skills.length === 0) ? (
                <p className="text-xs text-slate-500 italic font-mono">// No learning skills listed.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.learn_skills.map((s) => {
                    const isAdvanced = s.desired_level === 'advanced';
                    return (
                      <span
                        key={s.skill_name}
                        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-mono ${
                          isAdvanced
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 font-bold'
                            : s.desired_level === 'intermediate'
                            ? 'bg-slate-900 text-cyan-300 border-slate-800'
                            : 'bg-[#090d16] text-slate-300 border-slate-800'
                        }`}
                      >
                        <span>{s.skill_name}</span>
                        <span className="opacity-75 text-[10px] font-mono uppercase">
                          ({isAdvanced ? 'Mastery' : s.desired_level})
                        </span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Availability Footer */}
          <div className="relative p-4 rounded-xl bg-[#030712] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                <strong className="text-white uppercase">// ACTIVE DAYS:</strong>{' '}
                {profile.availability?.preferred_days?.length > 0
                  ? profile.availability.preferred_days.join(', ')
                  : 'Flexible'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong className="text-white uppercase">// PREFERRED SLOT:</strong>{' '}
                {profile.availability?.preferred_time || 'Flexible / Any time'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROFILE COMPLETENESS (Computed Strictly from Real Fields)                 */}
        {/* ========================================================================= */}
        <div className="rounded-2xl bg-[#090d16] border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider mb-1">
                // PROFILE VERIFICATION READINESS
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>Profile Completeness</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  VERIFIED ATTRIBUTES
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Calculated based on your completed academic data, skill sets, and schedule.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-mono text-amber-400">
                {completeness.score}%
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({completeness.items.filter((i) => i.completed).length} of{' '}
                {completeness.items.length} fields)
              </span>
            </div>
          </div>

          {/* Visual Flame Progress Bar */}
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 transition-all duration-700 ease-out"
              style={{ width: `${completeness.score}%` }}
            />
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-xs font-mono">
            {completeness.items.map((item) => (
              <div
                key={item.id}
                className={`p-2.5 rounded-lg border flex items-center gap-2 transition-all ${
                  item.completed
                    ? 'bg-[#030712] border-red-500/30 text-slate-200'
                    : 'bg-[#030712] border-slate-800 text-slate-500'
                }`}
              >
                {item.completed ? (
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 stroke-[3]" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPLEMENTARY SKILL IDENTITY & EXCHANGE SYNERGY MATRIX                    */}
        {/* ========================================================================= */}
        <SkillIdentitySection
          teachSkills={profile.teach_skills || []}
          learnSkills={profile.learn_skills || []}
          showTitle={true}
        />
      </main>
    </div>
  );
}
