'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/ui/Button';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#030712]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md rounded-2xl bg-[#090d16] border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6 text-center">
          <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/30 mx-auto flex items-center justify-center text-red-400">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">
              // PEER REGISTRATION
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              Join SkillMaxx
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Create your verified student skill identity in 5 quick steps
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              No lengthy registration forms. Start by choosing what you can teach and what you want to learn.
            </p>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold uppercase tracking-wider text-xs border-0 py-3 rounded-xl shadow-md shadow-red-500/15 active:scale-[0.98]"
              onClick={() => router.push('/onboarding')}
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>Campus student network • Instant access</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-center gap-4 font-mono">
            <Link href="/" className="hover:text-slate-300 transition-colors uppercase">Home</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-slate-300 transition-colors uppercase">Sign In</Link>
            <span>•</span>
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors uppercase">Dashboard</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
