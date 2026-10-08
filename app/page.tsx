import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '../components/Navbar';
import { ArrowRight, ArrowUpRight, Play, Sparkles, ArrowLeftRight, Check, BookOpen, Users, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#131126] text-white selection:bg-[#7B57FF] selection:text-white">
      <Navbar isOnboarded={false} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full space-y-24">
        {/* Split 2-Column Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>BIG SKILLS. ZERO PRICE TAG.</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                Learn. Teach.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-white">
                  Exchange.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                You know something someone needs. They know something you want to learn.
                Swap skills with students on your campus — and grow together.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/onboarding">
                <Button size="lg" className="bg-[#7B57FF] hover:bg-[#6D44FF] text-white font-semibold px-7 py-4 rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 border-0">
                  <span>Find My Skill Match</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="lg" className="bg-[#1C1833] hover:bg-[#272147] text-slate-200 border border-purple-500/20 px-6 py-4 rounded-xl font-medium flex items-center gap-2">
                  <span>How It Works</span>
                  <Play className="w-3.5 h-3.5 fill-current opacity-80" />
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3.5 pt-4 border-t border-purple-900/30">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#131126] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Student"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#131126] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Student"
                />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">2,400+ students. One shared ambition.</p>
                <p className="text-slate-400">Built for students, powered by each other.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Overlay Card */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden border border-purple-500/20 shadow-2xl bg-[#1A1633]">
              {/* Main Collaboration Photo */}
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80"
                alt="Students collaborating"
                className="w-full h-80 sm:h-96 object-cover object-center filter brightness-[0.95]"
              />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-900 border border-white/40 text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#7B57FF]" />
                <span>Your next skill starts here</span>
              </div>

              {/* Floating Bottom Exchange Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100 text-slate-900">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    A little give. A lot of growth.
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3 text-[#7B57FF]" />
                    96% match
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 block mb-1">Maya Chen</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-[#7B57FF] border border-purple-200 font-medium">
                      Figma <Check className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#7B57FF]">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-medium text-slate-500 block mb-1">Alex Rivera</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-[#7B57FF] border border-purple-200 font-medium">
                      Python <Check className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section: How It Works */}
        <div className="pt-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
              A SMART WAY TO GROW ON CAMPUS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              No fees. No formal classrooms. Just students helping students get better.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#1C1833] border border-purple-900/40 hover:border-purple-600/50 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 font-bold">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs font-semibold text-purple-300">01</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Build your Skill DNA</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Tell us what you can teach, what you&apos;re curious about, and when you&apos;re free.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#1C1833] border border-purple-900/40 hover:border-purple-600/50 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 font-bold">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs font-semibold text-purple-300">02</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Find your other half</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Meet peers whose strengths complement yours. AI makes the introduction.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#1C1833] border border-purple-900/40 hover:border-purple-600/50 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 font-bold">
                  <ArrowLeftRight className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs font-semibold text-purple-300">03</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Exchange. Then repeat.</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Learn together, share feedback and turn small sessions into lasting skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-purple-950/40 text-center text-xs text-slate-400">
        SkillMax Platform • Student Skill Swapping &amp; Team Building
      </footer>
    </div>
  );
}
