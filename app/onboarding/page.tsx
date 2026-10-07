import React from 'react';
import { OnboardingWizard } from '../../components/onboarding/OnboardingWizard';
import { Navbar } from '../../components/Navbar';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]">
      <Navbar isOnboarded={false} />
      <main className="flex-1 flex flex-col justify-center py-6 sm:py-8">
        <OnboardingWizard />
      </main>
    </div>
  );
}
