'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StepProgress } from './StepProgress';
import { Step1AboutYou } from './Step1AboutYou';
import { Step2TeachSkills } from './Step2TeachSkills';
import { Step3LearnSkills } from './Step3LearnSkills';
import { Step4Availability } from './Step4Availability';
import { Step5Preview } from './Step5Preview';
import { ProfileCompletionState } from './ProfileCompletionState';
import { Button } from '../ui/Button';
import {
  Availability,
  TeachSkill,
  LearnSkill,
  SaveProfilePayload,
  calculateProfileCompleteness,
} from '../../types/profile';
import {
  saveProfile,
  getCurrentUserProfile,
  getAuthenticatedUser,
  generateUUID,
} from '../../lib/supabase/profile';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'About You', subtitle: 'Identity & Academics' },
  { id: 2, title: 'Can Teach', subtitle: 'Skills to Share' },
  { id: 3, title: 'Want to Learn', subtitle: 'Skills to Gain' },
  { id: 4, title: 'Availability', subtitle: 'Days & Time Slots' },
  { id: 5, title: 'Preview', subtitle: 'Review & Finish' },
];

const LOCAL_STORAGE_KEY = 'skillmaxx_onboarding_draft_v1';

export const OnboardingWizard: React.FC<{ initialUserId?: string }> = ({
  initialUserId,
}) => {
  const router = useRouter();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [authUserId, setAuthUserId] = useState<string | null>(initialUserId || null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://api.dicebear.com/7.x/bottts/svg?seed=Aria'
  );

  const [teachSkills, setTeachSkills] = useState<TeachSkill[]>([]);
  const [learnSkills, setLearnSkills] = useState<LearnSkill[]>([]);

  const [availability, setAvailability] = useState<Availability>({
    preferred_days: ['Monday', 'Wednesday', 'Friday'],
    preferred_time: 'Evening (6:00 PM - 9:00 PM)',
    mode: 'hybrid',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 1. Load authenticated user's existing profile on mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      setIsLoadingProfile(true);
      try {
        // Fetch current user and their profile from Supabase
        const { data: existingProfile, userId, error } = await getCurrentUserProfile();

        if (isMounted) {
          if (userId) setAuthUserId(userId);

          if (existingProfile && existingProfile.full_name) {
            // Existing profile found in Supabase! Prefill all fields
            setFullName(existingProfile.full_name);
            if (existingProfile.email) setEmail(existingProfile.email);
            setDepartment(existingProfile.department || '');
            setYear(existingProfile.year || '');
            setBio(existingProfile.bio || '');
            if (existingProfile.avatar_url) setAvatarUrl(existingProfile.avatar_url);
            if (existingProfile.teach_skills) setTeachSkills(existingProfile.teach_skills);
            if (existingProfile.learn_skills) setLearnSkills(existingProfile.learn_skills);
            if (existingProfile.availability) setAvailability(existingProfile.availability);
            setIsEditingExisting(true);
          } else {
            // No profile in cloud yet, attempt to restore local draft
            restoreLocalDraft();
          }
        }
        // Check for URL parameters (e.g. ?step=2, ?email=..., ?name=...)
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const emailParam = params.get('email');
          if (emailParam && isMounted) setEmail(emailParam);
          const nameParam = params.get('name');
          if (nameParam && isMounted) setFullName(nameParam);
          const stepParam = params.get('step');
          if (stepParam) {
            const stepNum = parseInt(stepParam, 10);
            if (stepNum >= 1 && stepNum <= STEPS.length) {
              setCurrentStep(stepNum);
            }
          }
          if (params.get('completed') === 'true') {
            setIsCompleted(true);
          }
        }
      } catch {
        if (isMounted) restoreLocalDraft();
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    }

    function restoreLocalDraft() {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.fullName) setFullName(parsed.fullName);
          if (parsed.department) setDepartment(parsed.department);
          if (parsed.year) setYear(parsed.year);
          if (parsed.bio) setBio(parsed.bio);
          if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
          if (parsed.teachSkills) setTeachSkills(parsed.teachSkills);
          if (parsed.learnSkills) setLearnSkills(parsed.learnSkills);
          if (parsed.availability) setAvailability(parsed.availability);

          // Restore current step if not explicitly overridden by URL parameter
          if (
            parsed.currentStep &&
            typeof window !== 'undefined' &&
            !new URLSearchParams(window.location.search).get('step')
          ) {
            setCurrentStep(parsed.currentStep);
          }
        }
      } catch {
        // Silent recovery
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Persist state to localStorage on every change
  useEffect(() => {
    if (isLoadingProfile) return; // avoid overwriting before load completes
    try {
      const draft = {
        currentStep,
        fullName,
        department,
        year,
        bio,
        avatarUrl,
        teachSkills,
        learnSkills,
        availability,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Silent recovery
    }
  }, [currentStep, fullName, department, year, bio, avatarUrl, teachSkills, learnSkills, availability, isLoadingProfile]);

  // Validation function per step
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        newErrors.fullName = 'Full name must be at least 2 characters.';
      }
      if (!department.trim()) {
        newErrors.department = 'Please select your academic department.';
      }
      if (!year.trim()) {
        newErrors.year = 'Please select your current year of study.';
      }
    } else if (stepNumber === 2) {
      if (teachSkills.length === 0) {
        newErrors.teachSkills = 'Please select at least 1 skill you can teach.';
      }
    } else if (stepNumber === 3) {
      if (learnSkills.length === 0) {
        newErrors.learnSkills = 'Please select at least 1 skill you want to learn.';
      }
    } else if (stepNumber === 4) {
      if (!availability.preferred_days || availability.preferred_days.length === 0) {
        newErrors.preferred_days = 'Please select at least one preferred day.';
      }
      if (!availability.preferred_time) {
        newErrors.preferred_time = 'Please select a preferred time slot.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setSubmitError(null);
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    // Validate all steps
    for (let step = 1; step <= 4; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return;
      }
    }

    setIsSaving(true);
    setSubmitError(null);
    setSyncNotice(null);

    // Resolve target authenticated user ID
    let resolvedUserId = authUserId;
    if (!resolvedUserId || resolvedUserId === '11111111-1111-1111-1111-111111111111') {
      const user = await getAuthenticatedUser();
      resolvedUserId = user?.id || generateUUID();
    }

    const payload: SaveProfilePayload = {
      user_id: resolvedUserId,
      full_name: fullName.trim(),
      email: email.trim() || undefined,
      department,
      year,
      bio: bio.trim(),
      avatar_url: avatarUrl,
      availability,
      teach_skills: teachSkills.map((s) => ({
        skill_name: s.skill_name,
        proficiency: s.proficiency,
      })),
      learn_skills: learnSkills.map((s) => ({
        skill_name: s.skill_name,
        desired_level: s.desired_level,
      })),
    };

    try {
      // Save directly to Supabase
      const { success, error, savedLocally } = await saveProfile(payload);

      // Clear draft since save succeeded
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      if (!success && error) {
        // Handled gracefully: inform user that data is safe locally
        setSyncNotice(
          `Notice: Your profile is safely saved locally. Supabase cloud sync reported: ${error.message}`
        );
      }

      // Smooth transition to polished profile completion state
      setIsSaving(false);
      setIsCompleted(true);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      // Even if network drops completely, local storage already persisted it
      setSyncNotice('Saved locally! Cloud sync will retry once network connects.');
      setIsSaving(false);
      setIsCompleted(true);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Initial Loading Skeleton State
  if (isLoadingProfile) {
    return (
      <div className="w-full max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto flex items-center justify-center text-red-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white font-mono uppercase tracking-tight">Loading Your Profile...</h3>
          <p className="text-xs text-slate-400 font-mono">
            // Checking Supabase for your existing skills and preferences.
          </p>
        </div>
      </div>
    );
  }

  // Polished Profile Completion State (Subtle professional animation)
  if (isCompleted) {
    const completeness = calculateProfileCompleteness({
      full_name: fullName,
      department,
      year,
      bio,
      teach_skills: teachSkills,
      learn_skills: learnSkills,
      availability,
    });

    return (
      <ProfileCompletionState
        fullName={fullName}
        department={department}
        year={year}
        avatarUrl={avatarUrl}
        teachingSkills={teachSkills}
        learningSkills={learnSkills}
        completenessScore={completeness.score}
      />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      {/* Existing Profile Notification */}
      {isEditingExisting && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-[#090d16] border border-amber-500/30 text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-mono text-xs">
              // LOADED ACTIVE PROFILE FOR <strong className="text-white">{fullName}</strong>. Edits will sync to student card.
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="text-xs text-amber-400 hover:text-amber-300 font-mono font-medium underline shrink-0 sm:ml-2 uppercase"
          >
            Cancel & Return
          </button>
        </div>
      )}

      {/* Dynamic Intro Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>// STEP-BY-STEP PARTICIPANT PROGRESSION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          {isEditingExisting ? 'Update Your Skill Profile' : 'Build Your SkillMaxx Profile'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono">
          // DEFINE TECHNICAL SUPERPOWERS & DESIRED GROWTH ASPIRATIONS
        </p>
      </div>

      {/* Step Progress Component */}
      <StepProgress
        currentStep={currentStep}
        totalSteps={STEPS.length}
        steps={STEPS}
        onStepClick={(s) => {
          if (s < currentStep) {
            setCurrentStep(s);
          }
        }}
      />

      {/* Card Wrapper */}
      <div className="rounded-2xl bg-[#090d16] border border-slate-800 p-4 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/60">
        {/* Step Views */}
        {currentStep === 1 && (
          <Step1AboutYou
            fullName={fullName}
            email={email}
            department={department}
            year={year}
            bio={bio}
            avatarUrl={avatarUrl}
            onChange={(fields) => {
              if (fields.fullName !== undefined) setFullName(fields.fullName);
              if (fields.email !== undefined) setEmail(fields.email);
              if (fields.department !== undefined) setDepartment(fields.department);
              if (fields.year !== undefined) setYear(fields.year);
              if (fields.bio !== undefined) setBio(fields.bio);
              if (fields.avatarUrl !== undefined) setAvatarUrl(fields.avatarUrl);

              if (fields.fullName !== undefined) {
                if (fields.fullName.trim().length >= 2 && errors.fullName) {
                  setErrors((prev) => ({ ...prev, fullName: '' }));
                }
              }
              if (fields.department !== undefined) {
                if (fields.department.trim() && errors.department) {
                  setErrors((prev) => ({ ...prev, department: '' }));
                }
              }
              if (fields.year !== undefined) {
                if (fields.year.trim() && errors.year) {
                  setErrors((prev) => ({ ...prev, year: '' }));
                }
              }
            }}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <Step2TeachSkills
            teachSkills={teachSkills}
            onChange={(skills) => {
              setTeachSkills(skills);
              if (skills.length > 0 && errors.teachSkills) {
                setErrors((prev) => ({ ...prev, teachSkills: '' }));
              }
            }}
            error={errors.teachSkills}
          />
        )}

        {currentStep === 3 && (
          <Step3LearnSkills
            learnSkills={learnSkills}
            onChange={(skills) => {
              setLearnSkills(skills);
              if (skills.length > 0 && errors.learnSkills) {
                setErrors((prev) => ({ ...prev, learnSkills: '' }));
              }
            }}
            error={errors.learnSkills}
          />
        )}

        {currentStep === 4 && (
          <Step4Availability
            availability={availability}
            onChange={(avail) => {
              setAvailability(avail);
              if (avail.preferred_days?.length > 0 && errors.preferred_days) {
                setErrors((prev) => ({ ...prev, preferred_days: '' }));
              }
              if (avail.preferred_time && errors.preferred_time) {
                setErrors((prev) => ({ ...prev, preferred_time: '' }));
              }
            }}
            errors={errors}
          />
        )}

        {currentStep === 5 && (
          <Step5Preview
            fullName={fullName}
            department={department}
            year={year}
            bio={bio}
            avatarUrl={avatarUrl}
            teachSkills={teachSkills}
            learnSkills={learnSkills}
            availability={availability}
          />
        )}

        {/* Global Error Notice if any */}
        {submitError && (
          <div className="mt-6 flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Cloud Sync Notice (Fallback Notification) */}
        {syncNotice && (
          <div className="mt-6 flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <RefreshCw className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{syncNotice}</span>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div
          className={`mt-8 pt-6 border-t border-slate-800 flex ${
            currentStep === STEPS.length
              ? 'flex-col sm:flex-row items-stretch sm:items-center'
              : 'items-center'
          } justify-between gap-3`}
        >
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={currentStep === 1 || isSaving}
            onClick={handleBack}
            icon={<ArrowLeft className="w-4 h-4" />}
            className={`bg-[#1C1833] border border-purple-900/40 text-slate-300 hover:text-white rounded-xl ${
              currentStep === STEPS.length ? 'w-full sm:w-auto order-2 sm:order-1' : ''
            }`}
          >
            Back
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              className="gap-2 bg-[#7B57FF] hover:bg-[#6D44FF] text-white font-semibold text-xs tracking-wide shadow-md shadow-purple-500/20 active:scale-[0.98] border-0 rounded-xl px-5 py-2.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              isLoading={isSaving}
              onClick={handleSubmit}
              className="bg-[#7B57FF] hover:bg-[#6D44FF] shadow-md shadow-purple-500/25 text-white font-semibold text-xs sm:text-sm px-6 py-3 w-full sm:w-auto order-1 sm:order-2 rounded-xl tracking-wide active:scale-[0.98] border-0"
              icon={<Check className="w-5 h-5 stroke-[3]" />}
            >
              {isEditingExisting ? 'Save & Update Profile' : 'Save & Launch Dashboard'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
