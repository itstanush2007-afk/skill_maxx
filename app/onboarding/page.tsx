import React from 'react';
import { OnboardingWizard } from '../../components/onboarding/OnboardingWizard';
import { Navbar } from '../../components/Navbar';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#030712]">
      <Navbar isOnboarded={false} />
      <main className="flex-1 flex flex-col justify-center py-6 sm:py-8">
        <OnboardingWizard />
      </main>
    </div>
  );
}
