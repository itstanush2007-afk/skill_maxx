'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  Compass,
  Edit3,
} from 'lucide-react';
import { CompleteUserProfile } from '../../types/profile';
import { getCurrentUserProfile } from '../../lib/supabase/profile';
import { SkillIdentitySection } from '../../components/profile/SkillIdentitySection';

export default function DashboardPage() {
  const [profile, setProfile] = useState<CompleteUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // Check URL parameters for completion transition
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('updated') === 'true') {
          setShowUpdateNotice(true);
        }
      }

      // Check localStorage first for instant client response
      try {
        const localData = localStorage.getItem('skillmaxx_user_profile');
        if (localData) {
          const parsed = JSON.parse(localData);
          setProfile({
            id: parsed.user_id,
            user_id: parsed.user_id,
            full_name: parsed.full_name,
            department: parsed.department,
            year: parsed.year,
            bio: parsed.bio,
            avatar_url: parsed.avatar_url,
            availability: parsed.availability,
            is_onboarded: true,
            teach_skills: parsed.teach_skills || [],
            learn_skills: parsed.learn_skills || [],
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }

      // Fetch from Supabase
      const { data } = await getCurrentUserProfile();
      if (data) {
        setProfile(data);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <Navbar
        userName={profile?.full_name || 'Student'}
        avatarUrl={profile?.avatar_url}
        isOnboarded={!!profile?.is_onboarded}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* If user hasn't onboarded, show callout */}
        {!profile && !loading && (
          <div className="rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Action Required
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Complete Your Onboarding Profile
              </h2>
              <p className="text-sm text-slate-300 max-w-xl">
                You haven't listed your skills yet! Finish the 5-step onboarding wizard to start matching with peers and joining hackathon teams.
              </p>
            </div>
            <Link href="/onboarding">
              <Button size="lg" className="shrink-0 bg-emerald-400 hover:bg-emerald-300 font-bold">
                <span>Start Onboarding</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {/* Profile Update/Completion Welcome Toast */}
        {showUpdateNotice && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs animate-completion-entrance">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">Your Skill Identity is live!</span>
              <span className="text-emerald-200/80 hidden sm:inline">
                Profile successfully synced to the campus network.
              </span>
            </div>
            <Link
              href="/profile"
              className="font-bold underline hover:text-emerald-200 text-emerald-400"
            >
              View Identity Card →
            </Link>
          </div>
        )}

        {/* Profile Card & Stats Header */}
        {profile && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <Avatar
                  src={profile.avatar_url}
                  name={profile.full_name}
                  size="xl"
                  className="ring-4 ring-emerald-500/20"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {profile.full_name}
                    </h1>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      Profile Active
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span>{profile.department}</span>
                    </span>
                    <span>•</span>
                    <span>{profile.year}</span>
                    <span>•</span>
                    <span className="capitalize font-medium text-emerald-300">
                      Mode: {profile.availability?.mode}
                    </span>
                  </div>
                  {profile.bio && (
                    <p className="text-xs sm:text-sm text-slate-300 italic pt-1 max-w-2xl">
                      "{profile.bio}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0">
                <Link href="/onboarding">
                  <Button variant="outline" size="sm" icon={<Edit3 className="w-3.5 h-3.5" />}>
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

              {/* Schedule Footer */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mt-6">
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
                    <strong className="text-white">Timeslot:</strong>{' '}
                    {profile.availability?.preferred_time || 'Flexible'}
                  </span>
                </div>
              </div>
            </div>

            {/* Polished Skill Identity Section (Hackathon Presentation Feature) */}
            <SkillIdentitySection
              teachSkills={profile.teach_skills || []}
              learnSkills={profile.learn_skills || []}
              showTitle={true}
            />
          </div>
        )}

        {/* Modules Separation Notice (Preserving Boundaries) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Person 4 Matching Engine Card */}
          <div id="matches" className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-3 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Reciprocal Skill Matches</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Person 4 Module
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates peer compatibility scores (0–100%) by comparing your teaching skills with peer learning requests.
            </p>
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400">
              ⚡ Profile data layer is ready. Ready for Person 4 matching algorithms.
            </div>
          </div>

          {/* Person 5 Project Builder Card */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Project Team Builder</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Person 5 Module
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create hackathon projects, compare team skills with required competencies, and identify missing roles.
            </p>
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400">
              ⚡ Skill competencies and departments are ready for team formation queries.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
