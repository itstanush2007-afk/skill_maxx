import React from 'react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { ArrowRight, Sparkles, BookOpen, Users, Compass, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]">
      <Navbar isOnboarded={false} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hackathon Skill Swapping & Team Building</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Supercharge Your Campus Skills with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
            SkillMaxx
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Teach what you love, learn what you need. Match with fellow students based on complementary skills, availability, and build dream hackathon teams.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Link href="/onboarding">
            <Button size="lg" className="bg-emerald-400 hover:bg-emerald-300 font-bold px-8 shadow-xl shadow-emerald-500/25">
              <span>Start Student Onboarding</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="border-slate-800">
              <span>View Dashboard</span>
            </Button>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 w-full text-left">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">1. Share & Learn</h3>
            <p className="text-xs text-slate-400">
              Define the skills you can mentor in, and wishlist what you want to master.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">2. Reciprocal Match</h3>
            <p className="text-xs text-slate-400">
              Find partners whose teaching skills match your learning wishlist seamlessly.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">3. Squad Up</h3>
            <p className="text-xs text-slate-400">
              Fill project skill gaps quickly for hackathons and group engineering challenges.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        SkillMaxx Platform • Profile & Onboarding Module
      </footer>
    </div>
  );
}
