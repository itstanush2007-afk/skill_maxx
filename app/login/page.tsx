'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/ui/Button';
import { Sparkles, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { getCurrentUserProfile } from '../../lib/supabase/profile';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function checkExisting() {
      try {
        const { data } = await getCurrentUserProfile();
        if (data && data.full_name) {
          setHasProfile(true);
          setUserName(data.full_name);
        }
      } catch {
        // guest mode
      } finally {
        setLoading(false);
      }
    }
    checkExisting();
  }, []);

  const handleContinueAsGuest = () => {
    if (hasProfile) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  };

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
              // PEER AUTHENTICATION
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              Sign In to SkillMaxx
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Campus skill swapping and peer mentorship network
            </p>
          </div>

          {loading ? (
            <div className="py-6 text-xs text-slate-500 font-mono">// Checking active student session...</div>
          ) : hasProfile ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#030712] border border-red-500/30 text-xs text-slate-200 flex items-center gap-3 text-left font-mono">
                <UserCheck className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase">// ACTIVE SESSION DETECTED</p>
                  <p className="text-slate-400">Logged in as {userName}</p>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold uppercase tracking-wider text-xs border-0 py-3 rounded-xl shadow-md shadow-red-500/15 active:scale-[0.98]"
                onClick={() => router.push('/dashboard')}
              >
                <span>Go to Student Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                SkillMaxx uses instant peer authentication. Get started by completing your quick 5-step skill identity profile.
              </p>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold uppercase tracking-wider text-xs border-0 py-3 rounded-xl shadow-md shadow-red-500/15 active:scale-[0.98]"
                onClick={handleContinueAsGuest}
              >
                <span>Continue to Onboarding</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-500 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                <span>Zero password friction for campus hackathon demo</span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-center gap-4 font-mono">
            <Link href="/" className="hover:text-slate-300 transition-colors uppercase">Home</Link>
            <span>•</span>
            <Link href="/onboarding" className="hover:text-slate-300 transition-colors uppercase">Onboarding</Link>
            <span>•</span>
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors uppercase">Dashboard</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
