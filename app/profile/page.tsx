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
      setLoading(true);
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
    <div className="min-h-screen flex flex-col bg-[#090d16] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.1),rgba(255,255,255,0))]">
      <Navbar
        userName={profile.full_name}
        avatarUrl={profile.avatar_url}
        isOnboarded={true}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation & Header Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Campus Skill Passport</span>
          </div>

          {/* 3 Core Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/onboarding?step=2">
              <Button
                variant="outline"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5 text-emerald-400" />}
                className="border-slate-800 hover:border-emerald-500/40"
              >
                <span>Add Skill</span>
              </Button>
            </Link>

            <Link href="/onboarding?step=4">
              <Button
                variant="outline"
                size="sm"
                icon={<Calendar className="w-3.5 h-3.5 text-blue-400" />}
                className="border-slate-800 hover:border-blue-500/40"
              >
                <span>Update Availability</span>
              </Button>
            </Link>

            <Link href="/onboarding">
              <Button
                variant="primary"
                size="sm"
                icon={<Edit3 className="w-3.5 h-3.5" />}
                className="bg-emerald-400 hover:bg-emerald-300 text-black font-bold"
              >
                <span>Edit Profile</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              icon={<LogOut className="w-3.5 h-3.5 text-slate-400" />}
              className="border-slate-800 hover:border-red-500/40 hover:text-red-300"
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
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-[#0b101c] border border-slate-800 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/80 space-y-6 overflow-hidden">
          {/* Subtle Ambient Card Lighting */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Card Badge Bar */}
          <div className="relative flex items-center justify-between pb-4 border-b border-slate-800/80 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 uppercase tracking-widest font-bold">
                SkillMaxx Student Identity Card
              </span>
            </div>
            <span className="text-slate-500 hidden sm:inline-block">
              Campus ID #{profile.user_id ? profile.user_id.slice(0, 8).toUpperCase() : 'VERIFIED'}
            </span>
          </div>

          {/* Profile Header */}
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <Avatar
                src={profile.avatar_url}
                name={profile.full_name}
                size="xl"
                className="ring-4 ring-emerald-500/20 shadow-lg shadow-black/50"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {profile.full_name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Peer</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium text-slate-200">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>{profile.department}</span>
                  </span>
                  <span>•</span>
                  <span>{profile.year}</span>
                </div>
              </div>
            </div>

            {/* Availability Mode Badge */}
            <div className="self-start md:self-auto flex items-center gap-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
              <span className="text-slate-400">Meeting Mode:</span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold capitalize flex items-center gap-1.5">
                {profile.availability?.mode === 'online' ? (
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                ) : profile.availability?.mode === 'in-person' ? (
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{profile.availability?.mode || 'hybrid'}</span>
              </span>
            </div>
          </div>

          {/* Bio Quote */}
          {profile.bio && (
            <div className="relative p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-300 italic leading-relaxed">
              "{profile.bio}"
            </div>
          )}

          {/* 10-Second Quick Glance: Two Skills Columns */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* CAN TEACH */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Skills I Can Teach</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {profile.teach_skills?.length || 0} skills
                </span>
              </div>

              {(!profile.teach_skills || profile.teach_skills.length === 0) ? (
                <p className="text-xs text-slate-500 italic">No teaching skills listed.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.teach_skills.map((s) => {
                    const isAdvanced = s.proficiency === 'advanced';
                    return (
                      <span
                        key={s.skill_name}
                        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-medium ${
                          isAdvanced
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                            : s.proficiency === 'intermediate'
                            ? 'bg-slate-900 text-emerald-300 border-slate-700'
                            : 'bg-slate-900/90 text-slate-300 border-slate-800'
                        }`}
                      >
                        <span>{s.skill_name}</span>
                        <span className="opacity-75 text-[10px] font-mono capitalize">
                          ({isAdvanced ? 'Expert' : s.proficiency})
                        </span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* WANTS TO LEARN */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-blue-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Skills I Want to Learn</span>
                </span>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {profile.learn_skills?.length || 0} goals
                </span>
              </div>

              {(!profile.learn_skills || profile.learn_skills.length === 0) ? (
                <p className="text-xs text-slate-500 italic">No learning skills listed.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.learn_skills.map((s) => {
                    const isAdvanced = s.desired_level === 'advanced';
                    return (
                      <span
                        key={s.skill_name}
                        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-medium ${
                          isAdvanced
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                            : s.desired_level === 'intermediate'
                            ? 'bg-slate-900 text-blue-300 border-slate-700'
                            : 'bg-slate-900/90 text-slate-300 border-slate-800'
                        }`}
                      >
                        <span>{s.skill_name}</span>
                        <span className="opacity-75 text-[10px] font-mono capitalize">
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
          <div className="relative p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-white">Active Days:</strong>{' '}
                {profile.availability?.preferred_days?.length > 0
                  ? profile.availability.preferred_days.join(', ')
                  : 'Flexible'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-white">Preferred Slot:</strong>{' '}
                {profile.availability?.preferred_time || 'Flexible / Any time'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROFILE COMPLETENESS (Computed Strictly from Real Fields)                 */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Profile Completeness</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Real Field Verification
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated based on your completed academic data, skill sets, and schedule.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl font-black font-mono text-emerald-400">
                {completeness.score}%
              </span>
              <span className="text-xs text-slate-400">
                ({completeness.items.filter((i) => i.completed).length} of{' '}
                {completeness.items.length} fields)
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 transition-all duration-700 ease-out"
              style={{ width: `${completeness.score}%` }}
            />
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            {completeness.items.map((item) => (
              <div
                key={item.id}
                className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                  item.completed
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                {item.completed ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[3]" />
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
