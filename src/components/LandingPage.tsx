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
  AwesomeScrollSection,
  ScrollProgressBar,
} from './landing';

interface LandingPageProps {
  isAuthenticated: boolean;
  onNavigateLogin: () => void;
  onNavigateDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  isAuthenticated,
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
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-zinc-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-950 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors">
      {/* Dynamic Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* 1. Navbar */}
      <Navbar
        isAuthenticated={isAuthenticated}
        onNavigateLogin={onNavigateLogin}
        onNavigateDashboard={onNavigateDashboard}
      />

      <main className="overflow-x-hidden">
        {/* 2. Hero Section */}
        <Hero
          isAuthenticated={isAuthenticated}
          onGetStarted={handleGetStarted}
          onSeeHowItWorks={handleSeeHowItWorks}
        />

        {/* 3. Hero Product Visual (Realistic OutreachOS Workspace) */}
        <AwesomeScrollSection direction="scale" glowColor="indigo" delay={0.05}>
          <HeroProductVisual />
        </AwesomeScrollSection>

        {/* 4. Trust / Value Strip */}
        <AwesomeScrollSection direction="up" glowColor="cyan" delay={0.1}>
          <TrustStrip />
        </AwesomeScrollSection>

        {/* 5. Editorial Problem & Solution Comparison */}
        <AwesomeScrollSection direction="up" glowColor="indigo" delay={0.1}>
          <ProblemSolution />
        </AwesomeScrollSection>

        {/* 6. System Capabilities Bento Grid */}
        <AwesomeScrollSection direction="scale" glowColor="indigo" delay={0.1}>
          <FeatureBento />
        </AwesomeScrollSection>

        {/* 7. OutreachOS AI Editorial Section */}
        <AwesomeScrollSection direction="up" glowColor="indigo" delay={0.1}>
          <AIAssistantSection onExploreAI={handleGetStarted} />
        </AwesomeScrollSection>

        {/* 8. How It Works Timeline */}
        <AwesomeScrollSection direction="scale" glowColor="cyan" delay={0.1}>
          <WorkflowTimeline />
        </AwesomeScrollSection>

        {/* 9. Context & Grounding Section */}
        <AwesomeScrollSection direction="up" glowColor="emerald" delay={0.1}>
          <ContextPersonalization />
        </AwesomeScrollSection>

        {/* 10. Security & Privacy Architecture */}
        <AwesomeScrollSection direction="scale" glowColor="cyan" delay={0.1}>
          <SecuritySection />
        </AwesomeScrollSection>

        {/* 11. Tailored Use Cases */}
        <AwesomeScrollSection direction="up" glowColor="indigo" delay={0.1}>
          <UseCasesSection onSelectUseCase={handleGetStarted} />
        </AwesomeScrollSection>

        {/* 12. Closing High-Impact CTA */}
        <AwesomeScrollSection direction="scale" glowColor="indigo" delay={0.1}>
          <FinalCTA
            isAuthenticated={isAuthenticated}
            onGetStarted={handleGetStarted}
            onSignIn={onNavigateLogin}
          />
        </AwesomeScrollSection>
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
