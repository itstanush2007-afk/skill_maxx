'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Compass, ArrowRight, LogOut, User, Edit3, ChevronDown, ArrowLeftRight } from 'lucide-react';
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

  const [currentUser, setCurrentUser] = useState({
    name: userName,
    avatar: avatarUrl,
    onboarded: isOnboarded,
  });

  useEffect(() => {
    if (isOnboarded) {
      setCurrentUser({ name: userName, avatar: avatarUrl, onboarded: true });
    } else if (typeof window !== 'undefined') {
      try {
        const onboardedFlag = localStorage.getItem('skillmaxx_is_onboarded') === 'true';
        if (onboardedFlag) {
          const raw = localStorage.getItem('skillmaxx_user_profile');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.full_name) {
              setCurrentUser({
                name: parsed.full_name,
                avatar: parsed.avatar_url || null,
                onboarded: true,
              });
            }
          }
        }
      } catch {}
    }
  }, [userName, avatarUrl, isOnboarded]);

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
    setCurrentUser({ name: 'Student', avatar: null, onboarded: false });
    router.push('/onboarding');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-950/40 bg-[#131127]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#7B57FF] flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
              SkillMax
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Explore</span>
          </Link>

          <Link
            href="/onboarding"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Onboarding</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          {currentUser.onboarded ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-2 sm:pr-2.5 py-1 rounded-xl bg-[#1C1833] border border-purple-900/40 hover:border-purple-600/50 text-xs sm:text-sm text-slate-200 transition-all hover:bg-[#252042] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                aria-expanded={isMenuOpen}
              >
                <Avatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size="sm"
                  className="w-6 h-6 rounded-lg text-[10px] shrink-0"
                />
                <span className="max-w-[70px] sm:max-w-[100px] truncate font-medium">{currentUser.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#1A1633]/98 border border-purple-900/60 backdrop-blur-xl shadow-2xl p-1.5 space-y-1 z-50 animate-completion-entrance text-xs">
                  <div className="px-3 py-2 border-b border-purple-900/40">
                    <p className="font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-purple-300 font-medium">Active Student</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-purple-900/30 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>View Profile</span>
                  </Link>

                  <Link
                    href="/onboarding"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-purple-900/30 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Edit Onboarding</span>
                  </Link>

                  <div className="h-[1px] bg-purple-900/40 my-1" />

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
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors px-2.5 py-1.5 rounded-xl hover:bg-purple-950/40"
              >
                Log in
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7B57FF] hover:bg-[#6D44FF] text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-purple-500/20 active:scale-[0.98]"
              >
                <span>Join your campus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
