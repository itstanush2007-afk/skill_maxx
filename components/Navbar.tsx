'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Compass, ArrowRight, LogOut, User, Edit3, ChevronDown } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { signOutUser } from '../lib/supabase/profile';

interface NavbarProps {
  userName?: string;
  avatarUrl?: string | null;
  isOnboarded?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName = 'Student',
  avatarUrl,
  isOnboarded = false,
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    await signOutUser();
    router.push('/onboarding');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-extrabold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              SkillMaxx
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Campus Swaps
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Explore</span>
          </Link>

          <Link
            href="/onboarding"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="hidden sm:inline">Onboarding</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          {isOnboarded ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs sm:text-sm text-slate-200 transition-all hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                aria-expanded={isMenuOpen}
              >
                <Avatar
                  src={avatarUrl}
                  name={userName}
                  size="sm"
                  className="w-6 h-6 rounded-lg text-[10px]"
                />
                <span className="max-w-[100px] truncate font-medium">{userName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900/95 border border-slate-800 backdrop-blur-xl shadow-2xl p-1.5 space-y-1 z-50 animate-completion-entrance text-xs">
                  <div className="px-3 py-2 border-b border-slate-800/80">
                    <p className="font-bold text-white truncate">{userName}</p>
                    <p className="text-[10px] text-emerald-400 font-mono">Active Student</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Profile Card</span>
                  </Link>

                  <Link
                    href="/onboarding"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Edit Onboarding</span>
                  </Link>

                  <div className="h-[1px] bg-slate-800/80 my-1" />

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
