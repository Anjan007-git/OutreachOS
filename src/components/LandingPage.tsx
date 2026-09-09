import React from 'react';
import {
  Navbar,
  Hero,
  HeroProductVisual,
  TrustStrip,
  ProblemSolution,
  FeatureBento,
  AIAssistantSection,
  WorkflowTimeline,
  ContextPersonalization,
  SecuritySection,
  UseCasesSection,
  FinalCTA,
  Footer,
} from './landing';

interface LandingPageProps {
  isAuthenticated: boolean;
  user?: { email: string; name: string } | null;
  onNavigateLogin: () => void;
  onNavigateDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  isAuthenticated,
  user,
  onNavigateLogin,
  onNavigateDashboard,
}) => {
  const handleGetStarted = () => {
    if (isAuthenticated) {
      onNavigateDashboard();
    } else {
      onNavigateLogin();
    }
  };

  const handleSeeHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* 1. Navbar */}
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onNavigateLogin={onNavigateLogin}
        onNavigateDashboard={onNavigateDashboard}
      />

      <main>
        {/* 2. Hero Section */}
        <Hero
          isAuthenticated={isAuthenticated}
          onGetStarted={handleGetStarted}
          onSeeHowItWorks={handleSeeHowItWorks}
        />

        {/* 3. Hero Product Visual (Realistic OutreachOS Workspace) */}
        <HeroProductVisual />

        {/* 4. Trust / Value Strip */}
        <TrustStrip />

        {/* 5. Editorial Problem & Solution Comparison */}
        <ProblemSolution />

        {/* 6. System Capabilities Bento Grid */}
        <FeatureBento />

        {/* 7. OutreachOS AI Editorial Section */}
        <AIAssistantSection onExploreAI={handleGetStarted} />

        {/* 8. How It Works Timeline */}
        <WorkflowTimeline />

        {/* 9. Context & Grounding Section */}
        <ContextPersonalization />

        {/* 10. Security & Privacy Architecture */}
        <SecuritySection />

        {/* 11. Tailored Use Cases */}
        <UseCasesSection onSelectUseCase={handleGetStarted} />

        {/* 12. Closing High-Impact CTA */}
        <FinalCTA
          isAuthenticated={isAuthenticated}
          onGetStarted={handleGetStarted}
          onSignIn={onNavigateLogin}
        />
      </main>

      {/* 13. Multi-Column Comprehensive Footer */}
      <Footer
        isAuthenticated={isAuthenticated}
        onNavigateLogin={onNavigateLogin}
        onNavigateDashboard={onNavigateDashboard}
      />
    </div>
  );
};
