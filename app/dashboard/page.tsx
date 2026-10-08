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
  ArrowUpRight,
  ArrowLeftRight,
  GraduationCap,
  Users,
  Compass,
  Edit3,
  Search,
  Check,
  Plus,
  X,
  UserPlus,
  Eye,
  CheckCircle2,
  Lightbulb,
  Star,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { CompleteUserProfile } from '../../types/profile';
import { getCurrentUserProfile } from '../../lib/supabase/profile';

export default function DashboardPage() {
  const [profile, setProfile] = useState<CompleteUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);

  // Person 4 Matching Module Interactive State
  const [isSearchingMatches, setIsSearchingMatches] = useState(false);
  const [matchResultsFound, setMatchResultsFound] = useState(true);
  const [activeMatchDetailId, setActiveMatchDetailId] = useState<string | null>(null);
  const [connectedPeerIds, setConnectedPeerIds] = useState<string[]>([]);
  const [connectNotice, setConnectNotice] = useState<string | null>(null);

  // Person 5 Project Team Builder Module Interactive State
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectSkills, setProjectSkills] = useState<string[]>(['React', 'Next.js', 'Python']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [invitedPeerIds, setInvitedPeerIds] = useState<string[]>([]);
  const [createdProjects, setCreatedProjects] = useState<
    Array<{ id: string; title: string; skills: string[]; membersCount: number }>
  >([
    {
      id: 'proj-1',
      title: 'Hackathon Skill Swapper',
      skills: ['Next.js', 'TypeScript', 'Supabase'],
      membersCount: 2,
    },
  ]);

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

  const peersList = [
    {
      id: 'match-1',
      name: 'Alex Rivera',
      department: 'Computer Science · Year 4',
      matchScore: 96,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      canTeach: 'Python · Advanced',
      wantsToLearn: 'Figma',
      reviews: '4.9 · 24 reviews',
      tagline: 'Your design eye. His coding mindset.',
      skillComp: 98,
      availComp: 94,
      levelComp: 96,
    },
    {
      id: 'match-2',
      name: 'Jordan Kim',
      department: 'Computer Science · Year 3',
      matchScore: 91,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      canTeach: 'DSA · Advanced',
      wantsToLearn: 'UI/UX',
      reviews: '4.8 · 12 reviews',
      tagline: 'Mutual problem solving & architecture.',
      skillComp: 92,
      availComp: 90,
      levelComp: 94,
    },
    {
      id: 'match-3',
      name: 'Sophia Patel',
      department: 'Design · Year 3',
      matchScore: 89,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      canTeach: 'Design Systems · Advanced',
      wantsToLearn: 'Fullstack Dev',
      reviews: '4.9 · 19 reviews',
      tagline: 'Figma mastery meets modern web.',
      skillComp: 90,
      availComp: 88,
      levelComp: 92,
    },
  ];

  const activePeer = peersList.find((p) => p.id === activeMatchDetailId);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB] text-slate-900 selection:bg-[#7B57FF] selection:text-white">
      <Navbar
        userName={profile?.full_name || 'Maya Chen'}
        avatarUrl={profile?.avatar_url}
        isOnboarded={!!profile?.is_onboarded}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Workspace Breadcrumb & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Overview</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills or students"
                className="w-full text-xs rounded-full bg-slate-900 text-white pl-9 pr-4 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7B57FF]"
              />
            </div>
            <Avatar
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              name={profile?.full_name || 'Maya Chen'}
              size="sm"
              className="ring-2 ring-purple-200 shrink-0"
            />
          </div>
        </div>

        {/* Hero Greeting Banner (Deep Plum from Figma Reference) */}
        <div className="rounded-3xl bg-[#201B38] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
              WEDNESDAY, OCTOBER 7
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Hey {profile?.full_name?.split(' ')[0] || 'Maya'}. Keep growing.
            </h1>
            <p className="text-sm text-purple-200/80">
              Your next &ldquo;I made this&rdquo; moment is one exchange away.
            </p>
          </div>
          <a href="#matches">
            <Button className="bg-[#7B57FF] hover:bg-[#6D44FF] text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 border-0 shrink-0">
              <span>Find a skill match</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </a>
        </div>

        {/* If user hasn't onboarded, show action callout */}
        {!profile && !loading && (
          <div className="rounded-2xl bg-white border border-purple-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B57FF]">
                ACTION REQUIRED
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Complete Your Onboarding Profile
              </h2>
              <p className="text-xs text-slate-600 max-w-xl">
                You haven&apos;t listed your skills yet! Finish the onboarding wizard to start matching with peers and joining hackathon teams.
              </p>
            </div>
            <Link href="/onboarding">
              <Button size="sm" className="bg-[#7B57FF] hover:bg-[#6D44FF] text-white font-semibold px-4 py-2 rounded-xl border-0 shadow-sm">
                <span>Start Onboarding</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        )}

        {/* 3 Stats Metrics Row (Figma Screenshot 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-1">
            <div className="text-3xl font-extrabold text-slate-900">12</div>
            <div className="text-xs font-bold text-slate-800">Exchanges</div>
            <div className="text-[11px] text-slate-400">+2 this month</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-1">
            <div className="text-3xl font-extrabold text-slate-900">18h</div>
            <div className="text-xs font-bold text-slate-800">Peer learning</div>
            <div className="text-[11px] text-slate-400">6 skills explored</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-1">
            <div className="text-3xl font-extrabold text-slate-900">7 days</div>
            <div className="text-xs font-bold text-slate-800">Your streak</div>
            <div className="text-[11px] text-slate-400">Keep it going</div>
          </div>
        </div>

        {/* Main 2-Column Grid (~65% Left, ~35% Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Skill DNA, Strengths/Curiosity, Peer Matches */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Your Skill DNA Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    A SNAPSHOT OF YOUR POTENTIAL
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">Your Skill DNA</h3>
                </div>
                <Link
                  href="/onboarding?step=2"
                  className="text-xs font-semibold text-[#7B57FF] hover:underline flex items-center gap-1"
                >
                  <span>Edit DNA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Skill Bars */}
              <div className="space-y-4 pt-1">
                {profile?.teach_skills && profile.teach_skills.length > 0 ? (
                  profile.teach_skills.slice(0, 3).map((skill, idx) => {
                    const pct =
                      skill.proficiency === 'advanced'
                        ? 90
                        : skill.proficiency === 'intermediate'
                        ? 65
                        : 40;
                    return (
                      <div key={skill.skill_name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                          <span>{skill.skill_name}</span>
                          <span className="text-slate-400 text-[11px] capitalize">
                            {skill.proficiency}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#7B57FF] transition-all duration-500"
                            style={{ width: `${pct - idx * 10}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>Figma</span>
                        <span className="text-slate-400 text-[11px]">Advanced</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-[#7B57FF] w-[90%]" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>UI/UX</span>
                        <span className="text-slate-400 text-[11px]">Advanced</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-[#7B57FF] w-[85%]" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>Python</span>
                        <span className="text-slate-400 text-[11px]">Beginner</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-[#7B57FF] w-[35%]" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  ↑ Python grew 12% this month
                </span>
              </div>
            </div>

            {/* 2 Subcards: Skills I Can Teach & Skills I Want to Learn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Teach Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    SHARE YOUR STRENGTHS
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Skills I Can Teach</h4>
                </div>
                <div className="space-y-2 text-xs">
                  {profile?.teach_skills && profile.teach_skills.length > 0 ? (
                    profile.teach_skills.slice(0, 3).map((sk) => (
                      <div key={sk.skill_name} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                        <span className="font-medium text-slate-800">{sk.skill_name}</span>
                        <span className="text-slate-400 text-[11px] capitalize">{sk.proficiency}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="font-medium text-slate-800">Figma</span>
                        <span className="text-slate-400 text-[11px]">Advanced</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="font-medium text-slate-800">UI/UX</span>
                        <span className="text-slate-400 text-[11px]">Advanced</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="font-medium text-slate-800">Photoshop</span>
                        <span className="text-slate-400 text-[11px]">Advanced</span>
                      </div>
                    </>
                  )}
                </div>
                <Link
                  href="/onboarding?step=2"
                  className="text-xs font-semibold text-[#7B57FF] hover:underline flex items-center gap-1 pt-1 block"
                >
                  <span>Edit skills →</span>
                </Link>
              </div>

              {/* Learn Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    FOLLOW YOUR CURIOSITY
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Skills I Want to Learn</h4>
                </div>
                <div className="space-y-2 text-xs">
                  {profile?.learn_skills && profile.learn_skills.length > 0 ? (
                    profile.learn_skills.slice(0, 3).map((sk) => (
                      <div key={sk.skill_name} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                        <span className="font-medium text-slate-800">{sk.skill_name}</span>
                        <span className="text-slate-400 text-[11px] capitalize">{sk.desired_level}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="font-medium text-slate-800">Python</span>
                        <span className="text-slate-400 text-[11px]">Beginner</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="font-medium text-slate-800">DSA</span>
                        <span className="text-slate-400 text-[11px]">Beginner</span>
                      </div>
                    </>
                  )}
                </div>
                <Link
                  href="/onboarding?step=3"
                  className="text-xs font-semibold text-[#7B57FF] hover:underline flex items-center gap-1 pt-1 block"
                >
                  <span>Edit skills →</span>
                </Link>
              </div>
            </div>

            {/* Reciprocal Matches Section (Person 4 Module) */}
            <div id="matches" className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    They teach what you want. You teach what they need.
                  </h3>
                  <p className="text-xs text-slate-500">
                    Reciprocal exchanges with matching skill pairs and complementary availability.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchingMatches(true);
                    setTimeout(() => {
                      setIsSearchingMatches(false);
                      setMatchResultsFound(true);
                    }, 350);
                  }}
                  className="text-xs font-semibold text-[#7B57FF] hover:underline"
                >
                  See all →
                </button>
              </div>

              {connectNotice && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-700 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7B57FF] shrink-0" />
                  <span>{connectNotice}</span>
                </div>
              )}

              {/* Matches Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {peersList.slice(0, 2).map((peer) => {
                  const isConnected = connectedPeerIds.includes(peer.id);

                  return (
                    <div
                      key={peer.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between hover:border-purple-300 transition-all"
                    >
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={peer.avatar}
                              alt={peer.name}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {peer.name}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">
                                {peer.department}
                              </p>
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7B57FF] text-xs font-bold shrink-0">
                            <Sparkles className="w-3 h-3 text-[#7B57FF]" />
                            {peer.matchScore}%
                          </span>
                        </div>

                        {/* Teaches Chip */}
                        <div className="space-y-1 text-xs">
                          <span className="text-[11px] font-medium text-slate-400 block">Teaches</span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-[#7B57FF] border border-purple-200 font-semibold text-xs">
                            {peer.canTeach} <Check className="w-3 h-3" />
                          </span>
                        </div>

                        {/* Wants to learn */}
                        <div className="text-xs text-slate-600">
                          <span className="text-[11px] font-medium text-slate-400 block">Wants to learn</span>
                          <span className="font-medium text-slate-800">{peer.wantsToLearn}</span>
                        </div>
                      </div>

                      {/* Card Footer: Rating & Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1 font-medium">
                          ★ {peer.reviews}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveMatchDetailId(peer.id)}
                            className="font-semibold text-[#7B57FF] hover:underline"
                          >
                            View match →
                          </button>

                          <Button
                            size="sm"
                            disabled={isConnected}
                            onClick={() => {
                              if (!connectedPeerIds.includes(peer.id)) {
                                setConnectedPeerIds((prev) => [...prev, peer.id]);
                                setConnectNotice(`Connection request dispatched to ${peer.name}!`);
                                setTimeout(() => setConnectNotice(null), 3000);
                              }
                            }}
                            className={`text-xs px-3 py-1 rounded-lg font-medium ${
                              isConnected
                                ? 'bg-purple-100 text-purple-700 border-0'
                                : 'bg-[#7B57FF] hover:bg-[#6D44FF] text-white border-0 shadow-sm'
                            }`}
                          >
                            <span>{isConnected ? 'Requested' : 'Connect'}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Project Team Builder (Person 5 Module) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                    SQUAD FORMATION
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Project Team Builder
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {createdProjects.length} squad project{createdProjects.length !== 1 ? 's' : ''}
                </span>
              </div>

              {!isCreatingProject ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Form hackathon squads, balance complementary roles, and fill engineering skill gaps.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setIsCreatingProject(true)}
                    className="bg-[#7B57FF] hover:bg-[#6D44FF] text-white text-xs font-semibold px-4 py-2 rounded-xl border-0 shadow-sm flex items-center gap-1.5"
                    icon={<Plus className="w-3.5 h-3.5" />}
                  >
                    <span>Create New Project</span>
                  </Button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {createdProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            {proj.membersCount} Members
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {proj.skills.map((sk) => (
                            <span
                              key={sk}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Interactive Project Creator Form */
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      New Hackathon Project
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCreatingProject(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AI Study Companion"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full text-xs rounded-xl bg-white border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7B57FF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600 block">
                      Required Skills
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {projectSkills.map((sk) => (
                        <span
                          key={sk}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1 font-medium"
                        >
                          <span>{sk}</span>
                          <button
                            type="button"
                            onClick={() => setProjectSkills((prev) => prev.filter((s) => s !== sk))}
                            className="hover:text-purple-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="Add required skill (e.g. Docker, Figma)..."
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const trimmed = newSkillInput.trim();
                            if (trimmed && !projectSkills.includes(trimmed)) {
                              setProjectSkills((prev) => [...prev, trimmed]);
                              setNewSkillInput('');
                            }
                          }
                        }}
                        className="flex-1 text-xs rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7B57FF]"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const trimmed = newSkillInput.trim();
                          if (trimmed && !projectSkills.includes(trimmed)) {
                            setProjectSkills((prev) => [...prev, trimmed]);
                            setNewSkillInput('');
                          }
                        }}
                        className="bg-[#7B57FF] hover:bg-[#6D44FF] text-white text-xs px-3 rounded-xl border-0"
                      >
                        <span>Add</span>
                      </Button>
                    </div>
                  </div>

                  {/* Recommended Teammates */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-medium text-slate-600 block">
                      Recommended Teammates
                    </span>
                    <div className="space-y-1.5">
                      {[
                        { id: 'peer-1', name: 'Devansh Gupta', role: 'Fullstack Engineer' },
                        { id: 'peer-2', name: 'Sarah Lin', role: 'UI/UX Designer' },
                      ].map((peer) => {
                        const isInvited = invitedPeerIds.includes(peer.id);
                        return (
                          <div
                            key={peer.id}
                            className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{peer.name}</p>
                              <p className="text-[10px] text-slate-500">{peer.role}</p>
                            </div>
                            <Button
                              size="sm"
                              disabled={isInvited}
                              onClick={() => {
                                if (!invitedPeerIds.includes(peer.id)) {
                                  setInvitedPeerIds((prev) => [...prev, peer.id]);
                                }
                              }}
                              className={`text-[10px] py-1 px-2.5 rounded-lg font-medium ${
                                isInvited
                                  ? 'bg-purple-100 text-purple-700 border-0'
                                  : 'bg-[#7B57FF] hover:bg-[#6D44FF] text-white border-0'
                              }`}
                            >
                              <span>{isInvited ? 'Invited' : 'Invite'}</span>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                    <Button
                      size="sm"
                      className="flex-1 bg-[#7B57FF] hover:bg-[#6D44FF] text-white text-xs font-semibold py-2 rounded-xl border-0"
                      onClick={() => {
                        const title = projectTitle.trim() || 'Campus Hackathon Squad';
                        setCreatedProjects((prev) => [
                          ...prev,
                          {
                            id: `proj-${Date.now()}`,
                            title,
                            skills: [...projectSkills],
                            membersCount: 1 + invitedPeerIds.length,
                          },
                        ]);
                        setIsCreatingProject(false);
                        setProjectTitle('');
                      }}
                    >
                      <span>Save Project</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 border-0 rounded-xl"
                      onClick={() => setIsCreatingProject(false)}
                    >
                      <span>Cancel</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Inspiration Card & Profile Snapshot        */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* A Little Inspiration Card (Dark from Figma Reference) */}
            <div className="rounded-2xl bg-[#1C1833] text-white p-6 border border-purple-900/40 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-purple-300" />
              </div>
              <h4 className="text-sm font-bold text-white">
                What if your next side project started with a new friend?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Design + code is a powerful duo. Find someone to build with and submit to the campus hackathon together.
              </p>
            </div>

            {/* Profile Schedule / Passport Snapshot */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Your Exchange Schedule</span>
                <Link
                  href="/onboarding?step=4"
                  className="text-xs font-semibold text-[#7B57FF] hover:underline"
                >
                  Edit
                </Link>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 text-slate-600">
                  <Calendar className="w-4 h-4 text-[#7B57FF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Available Days</span>
                    <span>
                      {profile?.availability?.preferred_days && profile.availability.preferred_days.length > 0
                        ? profile.availability.preferred_days.join(', ')
                        : 'Tuesday & Thursday'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-600">
                  <Clock className="w-4 h-4 text-[#7B57FF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Preferred Time</span>
                    <span>{profile?.availability?.preferred_time || '6:00–8:00 PM · Eastern Time'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-600">
                  <Compass className="w-4 h-4 text-[#7B57FF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Interaction Mode</span>
                    <span className="capitalize">{profile?.availability?.mode || 'Hybrid (Online or Campus)'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MATCH DETAIL MODAL (Matching Screenshot 2 from Figma)    */}
        {/* ========================================================= */}
        {activePeer && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-completion-entrance">
            <div className="max-w-4xl w-full bg-[#F8F9FB] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 text-slate-900 p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveMatchDetailId(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>All matches</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMatchDetailId(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Match Hero Card (Deep Plum from Figma Reference) */}
              <div className="rounded-3xl bg-[#201B38] text-white p-6 sm:p-8 text-center space-y-3 shadow-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-medium backdrop-blur-sm mx-auto">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>AI-powered · Made for each other&apos;s skills</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white">
                  {activePeer.matchScore}% Match
                </h2>
                <p className="text-base sm:text-lg font-semibold text-purple-200">
                  {activePeer.tagline}
                </p>
                <p className="text-xs sm:text-sm text-purple-300/80 max-w-xl mx-auto">
                  A mutual exchange with the right skills, the right levels and time to make it happen.
                </p>
              </div>

              {/* Side-by-Side Peer Comparison Cards with Center Swap Circle */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                {/* You Card (Left) */}
                <div className="md:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      name={profile?.full_name || 'Maya Chen'}
                      size="md"
                      className="ring-2 ring-purple-100"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                        YOU BRING THE DESIGN
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {profile?.full_name || 'Maya Chen'}
                      </h4>
                      <p className="text-xs text-slate-400">Design · Year 3</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-medium text-slate-400 block uppercase">Can Teach</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-[#7B57FF] border border-purple-200 text-xs font-semibold">
                        Figma · Advanced <Check className="w-3 h-3" />
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-[#7B57FF] border border-purple-200 text-xs font-semibold">
                        UI/UX · Advanced <Check className="w-3 h-3" />
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200 mt-1">
                      <Check className="w-3 h-3" /> Skills verified
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                    <span className="text-[11px] font-medium text-slate-400 block uppercase">Wants to Learn</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        Python · Beginner
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        DSA · Beginner
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center Swap Circle */}
                <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                  <div className="w-10 h-10 rounded-full bg-[#7B57FF] text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Match Card (Right) */}
                <div className="md:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={activePeer.avatar}
                      alt={activePeer.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                        ALEX BRINGS THE CODE
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{activePeer.name}</h4>
                      <p className="text-xs text-slate-400">{activePeer.department}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-medium text-slate-400 block uppercase">Can Teach</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-[#7B57FF] border border-purple-200 text-xs font-semibold">
                        {activePeer.canTeach} <Check className="w-3 h-3" />
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200 mt-1">
                      <Check className="w-3 h-3" /> Skills verified
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                    <span className="text-[11px] font-medium text-slate-400 block uppercase">Wants to Learn</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        {activePeer.wantsToLearn} · Beginner
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why this is a good match & Suggested Starting Point */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Why this is a good match</h4>
                  <p className="text-xs text-slate-500">
                    Not a random recommendation. Here&apos;s what makes this exchange work.
                  </p>
                  <div className="space-y-2.5 pt-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Skill compatibility</span>
                      <span className="font-bold text-[#7B57FF]">{activePeer.skillComp}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Availability compatibility</span>
                      <span className="font-bold text-[#7B57FF]">{activePeer.availComp}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Level compatibility</span>
                      <span className="font-bold text-[#7B57FF]">{activePeer.levelComp}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    SUGGESTED STARTING POINT
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Your first exchange</h4>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Thursday, October 15 · 6:00–7:00 PM</p>
                    <div className="p-2.5 rounded-xl bg-slate-50 space-y-1">
                      <p><strong>01 You teach Figma:</strong> Frames, layout &amp; first prototype (30 min)</p>
                      <p><strong>02 Alex teaches Python:</strong> Variables, loops &amp; first script (30 min)</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                      ✓ Online or on campus
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Banner (Dark Card from Figma Reference) */}
              <div className="rounded-2xl bg-[#1C1833] text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-white">Make the first move.</h4>
                  <p className="text-xs text-slate-300">
                    Send {activePeer.name.split(' ')[0]} your exchange idea. You&apos;ll agree on a time together.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    if (!connectedPeerIds.includes(activePeer.id)) {
                      setConnectedPeerIds((prev) => [...prev, activePeer.id]);
                    }
                    setActiveMatchDetailId(null);
                    setConnectNotice(`Exchange request sent to ${activePeer.name}!`);
                    setTimeout(() => setConnectNotice(null), 3500);
                  }}
                  className="bg-[#7B57FF] hover:bg-[#6D44FF] text-white font-semibold px-6 py-2.5 rounded-xl border-0 shadow-lg shadow-purple-500/25 shrink-0"
                >
                  <span>Send Exchange Request 🚀</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
