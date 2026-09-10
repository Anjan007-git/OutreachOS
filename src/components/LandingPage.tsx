import React from 'react';
import { motion } from 'motion/react';
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
  onNavigateLogin: () => void;
  onNavigateDashboard: () => void;
}

const FadeUpSection: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.08, margin: '0px 0px -30px 0px' }}
    transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* 1. Navbar */}
      <Navbar
        isAuthenticated={isAuthenticated}
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
        <FadeUpSection>
          <HeroProductVisual />
        </FadeUpSection>

        {/* 4. Trust / Value Strip */}
        <FadeUpSection>
          <TrustStrip />
        </FadeUpSection>

        {/* 5. Editorial Problem & Solution Comparison */}
        <FadeUpSection>
          <ProblemSolution />
        </FadeUpSection>

        {/* 6. System Capabilities Bento Grid */}
        <FadeUpSection>
          <FeatureBento />
        </FadeUpSection>

        {/* 7. OutreachOS AI Editorial Section */}
        <FadeUpSection>
          <AIAssistantSection onExploreAI={handleGetStarted} />
        </FadeUpSection>

        {/* 8. How It Works Timeline */}
        <FadeUpSection>
          <WorkflowTimeline />
        </FadeUpSection>

        {/* 9. Context & Grounding Section */}
        <FadeUpSection>
          <ContextPersonalization />
        </FadeUpSection>

        {/* 10. Security & Privacy Architecture */}
        <FadeUpSection>
          <SecuritySection />
        </FadeUpSection>

        {/* 11. Tailored Use Cases */}
        <FadeUpSection>
          <UseCasesSection onSelectUseCase={handleGetStarted} />
        </FadeUpSection>

        {/* 12. Closing High-Impact CTA */}
        <FadeUpSection>
          <FinalCTA
            isAuthenticated={isAuthenticated}
            onGetStarted={handleGetStarted}
            onSignIn={onNavigateLogin}
          />
        </FadeUpSection>
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
