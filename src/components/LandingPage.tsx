import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock,
  Send,
  Users,
  FolderOpen,
  MessageSquare,
  Bot,
  FileText,
  Mail,
  Zap,
  Lock,
  ChevronRight,
  Layers,
  BarChart3,
  RefreshCw,
  Menu,
  X,
  Database,
  ExternalLink,
  Target,
  Briefcase,
  GraduationCap,
  Building2,
  Check,
  Calendar,
} from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'compose' | 'queue' | 'replies'>('compose');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* 1. STICKY NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
              O
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                OutreachOS
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                The Outreach Operating System
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
              How It Works
            </a>
            <a href="#ai-assistant" className="hover:text-indigo-600 transition-colors">
              AI Assistant
            </a>
            <a href="#security" className="hover:text-indigo-600 transition-colors">
              Security
            </a>
            <a href="#use-cases" className="hover:text-indigo-600 transition-colors">
              Use Cases
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={onNavigateDashboard}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer hover:shadow-indigo-100"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={onNavigateLogin}
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={onNavigateLogin}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={onNavigateDashboard}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
            <nav className="flex flex-col space-y-2">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                How It Works
              </a>
              <a
                href="#ai-assistant"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                AI Assistant
              </a>
              <a
                href="#security"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Security
              </a>
              <a
                href="#use-cases"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Use Cases
              </a>
            </nav>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateDashboard();
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold text-center"
                >
                  Open Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigateLogin();
                    }}
                    className="w-full py-2 rounded-xl border border-slate-200 text-slate-800 text-sm font-semibold text-center"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigateLogin();
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold text-center shadow-xs"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32 overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Context Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI-Powered Personal Outreach & Gmail Automation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Turn Outreach Into a <span className="text-indigo-600">System.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Create personalized outreach, send through Gmail, automate follow-ups, schedule campaigns,
              and let AI handle the repetitive work — all from one professional workspace.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={isAuthenticated ? onNavigateDashboard : onNavigateLogin}
                className="w-full sm:w-auto h-12 px-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-indigo-200 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <span>See How It Works</span>
              </a>
            </div>

            {/* Trust Micro-Bullets */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No password sharing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Official Gmail API</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Private Blob Storage</span>
              </div>
            </div>
          </div>

          {/* 3. PRODUCT PREVIEW (Interactive & High-Fidelity UI Representation) */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xl overflow-hidden">
              {/* Mock App Window Header */}
              <div className="h-11 bg-slate-100 border-b border-slate-200 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="ml-3 text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-slate-400" />
                    app.outreachos.com/dashboard
                  </span>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Gmail Connected ✓</span>
                </div>
              </div>

              {/* Mock App Interior */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[440px]">
                {/* Mini Sidebar */}
                <div className="hidden md:flex md:col-span-3 border-r border-slate-100 bg-slate-50/70 p-4 flex-col justify-between">
                  <div className="space-y-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Navigation
                    </div>
                    <button
                      onClick={() => setActiveTab('compose')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        activeTab === 'compose'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Compose & AI</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('queue')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        activeTab === 'queue'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Scheduled Queue</span>
                      <span className="ml-auto bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full">
                        Queued
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('replies')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        activeTab === 'replies'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Responses & Inbox</span>
                      <span className="ml-auto bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full">
                        New
                      </span>
                    </button>
                  </div>

                  {/* Account Badge */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/70 text-xs space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Account</div>
                    <div className="font-semibold text-slate-800 truncate">anjanp93722@gmail.com</div>
                    <div className="text-[11px] text-slate-500">5 / 5 Daily Limit</div>
                  </div>
                </div>

                {/* Preview Content Area */}
                <div className="md:col-span-9 p-6 bg-white space-y-5">
                  {activeTab === 'compose' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">
                            Compose Personalized Outreach
                          </h3>
                          <p className="text-xs text-slate-500">
                            Grounded in verified contact profile and resume context.
                          </p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
                          <Bot className="w-3 h-3 text-indigo-600" />
                          Gemini 2.5 Active
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                          <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                            Recipient
                          </span>
                          <span className="font-medium text-slate-800">
                            Sarah Chen · VP of Engineering at CloudScale
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                          <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                            Attached Document
                          </span>
                          <span className="font-medium text-indigo-700 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Anjan_Prajapati_Resume.pdf (Primary)
                          </span>
                        </div>
                      </div>

                      {/* Mock Subject & Body */}
                      <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-2">
                        <div className="text-xs font-semibold text-slate-700 pb-2 border-b border-slate-100">
                          Subject: Senior Infrastructure & Distributed Systems Role — CloudScale
                        </div>
                        <div className="text-xs text-slate-600 leading-relaxed space-y-2 font-mono text-[11px]">
                          <p>Hi Sarah,</p>
                          <p>
                            I noticed CloudScale's recent expansion into multi-region Kubernetes
                            clusters. Having led distributed reliability systems and microservice
                            resilience at scale, I've attached my verified resume highlighting direct
                            achievements in latency reduction and automated failover...
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Requires explicit confirmation before sending</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={onNavigateLogin}
                            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                          >
                            Schedule Send
                          </button>
                          <button
                            onClick={onNavigateLogin}
                            className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer shadow-xs"
                          >
                            Send Immediately
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'queue' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">Automated Sending Queue</h3>
                          <p className="text-xs text-slate-500">
                            Respects human daily sending limits and delay intervals.
                          </p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          10m Spacing Interval Active
                        </span>
                      </div>

                      <div className="space-y-2">
                        {[
                          {
                            recipient: 'Marcus Vance',
                            company: 'Apex Robotics',
                            time: 'Today, 11:30 AM',
                            status: 'QUEUED',
                            attachment: 'Anjan_Prajapati_Resume.pdf',
                          },
                          {
                            recipient: 'Elena Rostova',
                            company: 'HyperScale AI',
                            time: 'Today, 11:40 AM',
                            status: 'QUEUED',
                            attachment: 'System_Architecture_Sample.pdf',
                          },
                          {
                            recipient: 'David Kim',
                            company: 'Founders Capital',
                            time: 'Today, 11:50 AM',
                            status: 'QUEUED',
                            attachment: 'Executive_Overview.pdf',
                          },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="font-semibold text-slate-800">
                                {item.recipient} · {item.company}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                <span>{item.time}</span>
                                <span>•</span>
                                <span className="text-indigo-600 flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  {item.attachment}
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'replies' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">
                            Reply Intelligence & Sentiment
                          </h3>
                          <p className="text-xs text-slate-500">
                            Gemini automatically analyzes incoming responses from Gmail.
                          </p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Auto-Categorization Enabled
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">
                              Sarah Chen · VP of Engineering
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              INTERESTED
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs italic">
                            "Thanks for reaching out Anjan! Your resume matches what we need for our
                            distributed team. Let's schedule 30 minutes this Thursday."
                          </p>
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            AI Suggested Next Step: Reply with Calendar availability
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALUE STRIP (5 Core Pillars) */}
      <section className="py-10 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">AI Personalization</h4>
              <p className="text-[11px] text-slate-500">Contextual Gemini 2.5 drafts</p>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Mail className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Gmail-Native</h4>
              <p className="text-[11px] text-slate-500">Direct OAuth delivery</p>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Smart Scheduling</h4>
              <p className="text-[11px] text-slate-500">Timezone & delay aware</p>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Follow-Up Rules</h4>
              <p className="text-[11px] text-slate-500">Automated unreplied cadence</p>
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Private Document Store</h4>
              <p className="text-[11px] text-slate-500">Private Vercel Blob & Drive</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROBLEM / SOLUTION SECTION */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Why OutreachOS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Stop Managing Outreach Manually.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When high-stakes outreach is scattered across ad-hoc spreadsheets and sticky notes,
              opportunities slip through the cracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Manual Chaos */}
            <div className="p-8 rounded-2xl bg-white border border-rose-200/80 shadow-xs space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <span>The Manual Chaos</span>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </div>
                  <span>Scattered Google Sheets with stale notes and missing recruiter links.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </div>
                  <span>Manual follow-up reminders that get delayed or forgotten during busy weeks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </div>
                  <span>Tiring copy-pasting that risks sending wrong placeholder names or titles.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </div>
                  <span>Attaching outdated resumes from local downloads folder by accident.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </div>
                  <span>Buried replies lost in your everyday inbox noise without clear follow-up actions.</span>
                </li>
              </ul>
            </div>

            {/* The OutreachOS Solution */}
            <div className="p-8 rounded-2xl bg-white border border-indigo-200/80 shadow-xs space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>The OutreachOS Workspace</span>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <span>Centralized contact directory with clean campaign status and history.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <span>Automated multi-step follow-ups that halt automatically the moment someone replies.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <span>Gemini drafts tailored to each specific company, role, and verified context.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <span>Dedicated Private Blob repository ensuring the right resume is always attached.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <span>Live reply synchronization with automatic sentiment categorization.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES GRID (8 Cards) */}
      <section id="features" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Comprehensive Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Thoughtful, High-Yield Outreach.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every tool in OutreachOS is purposefully designed to respect recipient inboxes while
              maximizing your response rate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI-Powered Outreach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate highly contextual, non-generic drafts using Gemini 2.5 Flash, informed by the
                recipient's background and your verified profile.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Gmail Integration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send directly through your authorized Gmail account via official Google APIs. Emails land
                in primary inboxes, not spam folders.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Smart Scheduling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Queue outreach with randomized human delays and timezone alignment to optimize delivery
                times and protect sender reputation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Campaign Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Organize contacts into distinct cohorts (e.g. Staff Engineers, Seed Investors, VP
                Designers) with granular recipient status tracking.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Document Attachments</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamlessly attach PDF and DOCX files stored in private Vercel Blob storage or import
                directly from Google Drive in one click.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Reply Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time sync detects incoming replies and utilizes AI to classify them into Interested,
                Not Interested, or Meeting Scheduled.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Automated Follow-Ups</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set rule-based sequences (e.g. follow up after 3 business days if no reply). Sequences
                halt immediately upon recipient response.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">OutreachOS AI Assistant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Natural-language command drawer to analyze contacts, prepare drafts, check queue
                status, and formulate strategic follow-up plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. AI ASSISTANT SHOWCASE */}
      <section id="ai-assistant" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>Conversational Workflow Automation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Meet OutreachOS AI.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Command your entire outreach workflow using natural language. The assistant analyzes
                your active contacts, pulls appropriate resume details, drafts personalized emails, and
                schedules queue slots.
              </p>

              {/* Safety Principle Highlight */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Human-in-the-Loop Safety Principle</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  OutreachOS AI prepares actions and requires your explicit confirmation before
                  sending or scheduling any email. It never sends unauthorized messages.
                </p>
              </div>
            </div>

            {/* Right Interactive Chat Preview */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                {/* Chat Header */}
                <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">OutreachOS Assistant</div>
                      <div className="text-[10px] text-slate-400">Powered by Gemini 2.5 Flash</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                    Active
                  </span>
                </div>

                {/* Chat Messages */}
                <div className="p-5 space-y-4 bg-slate-50/50 text-xs">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-md bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-xs shadow-2xs leading-relaxed">
                      "Find my resume and prepare an email for the Staff Systems Engineer role at
                      CloudScale, addressed to Sarah Chen."
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="max-w-md bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-xs shadow-2xs space-y-2.5">
                      <p className="text-slate-700 leading-relaxed">
                        I found your verified document{' '}
                        <strong className="text-indigo-600">Anjan_Prajapati_Resume.pdf</strong> in your
                        private store and prepared a tailored draft highlighting your Kubernetes and
                        distributed systems experience.
                      </p>

                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                        <div className="text-[11px] font-bold text-slate-800">
                          Subject: Senior Infrastructure & Reliability Role — CloudScale
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          Attachment: Anjan_Prajapati_Resume.pdf (Primary · 61 KB)
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={onNavigateLogin}
                          className="px-3 py-1 rounded-md bg-indigo-600 text-white font-semibold text-[11px] hover:bg-indigo-700 cursor-pointer"
                        >
                          Review in Compose
                        </button>
                        <button
                          onClick={onNavigateLogin}
                          className="px-3 py-1 rounded-md border border-slate-200 text-slate-700 font-semibold text-[11px] hover:bg-slate-50 cursor-pointer"
                        >
                          Schedule for Tomorrow 10 AM
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example Quick Prompts */}
                <div className="px-5 py-3 border-t border-slate-100 bg-white">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Example Natural Language Commands:
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                      "Show contacts who haven't replied"
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                      "Schedule follow-ups for unreplied campaigns"
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                      "Draft follow-up 3 days after initial send"
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS (5-Step Timeline) */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How OutreachOS Works
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A disciplined, predictable five-step system from contact import to secured response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Connect Gmail',
                desc: 'Authorize your primary Gmail account via official Google OAuth. No passwords required.',
                icon: Mail,
              },
              {
                step: '02',
                title: 'Add Contacts',
                desc: 'Group recipients by campaign cohort, industry, role, or strategic initiative.',
                icon: Users,
              },
              {
                step: '03',
                title: 'Personalize Drafts',
                desc: 'Gemini drafts tailored emails combining recipient context and your uploaded documents.',
                icon: Sparkles,
              },
              {
                step: '04',
                title: 'Send or Schedule',
                desc: 'Dispatch immediately or queue across human-paced intervals and optimal timezones.',
                icon: Clock,
              },
              {
                step: '05',
                title: 'Track & Follow Up',
                desc: 'Classify incoming replies in real-time and trigger automated sequences for unreplied emails.',
                icon: RefreshCw,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative flex flex-col"
                >
                  <div className="text-2xl font-extrabold text-indigo-600/40 font-mono">
                    {item.step}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed flex-1">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. DOCUMENT & PERSONALIZATION PIPELINE */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Context Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              No Generic Templates. No Hallucinations.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              OutreachOS grounds every generated draft in verified source data to ensure authentic,
              accurate outreach.
            </p>
          </div>

          {/* Visual Pipeline Strip */}
          <div className="max-w-5xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
              <div className="px-3 py-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
                Verified Recipient
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
              <div className="px-3 py-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
                Role & Company
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
              <div className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200">
                Private Resume / Docs
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
              <div className="px-3 py-2 rounded-xl bg-indigo-600 text-white">Gemini 2.5 Engine</div>
              <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
              <div className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                Authorized Gmail API
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
              <div>
                <strong className="text-slate-800 block mb-1">Private Object Storage:</strong>
                Resumes, executive briefs, and portfolios are uploaded directly to private Vercel Blob
                storage with server-side signed streaming. Your files are never publicly exposed.
              </div>
              <div>
                <strong className="text-slate-800 block mb-1">Strict Factual Alignment:</strong>
                Gemini extracts direct achievements from your uploaded resume instead of inventing
                unverifiable claims.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. SECURITY & TRUST ARCHITECTURE */}
      <section id="security" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Security Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Enterprise-Grade Privacy & Security.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Engineered from the foundation to keep your credentials, emails, and attachments private.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Google OAuth 2.0</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uses official Google Identity Services. Your password is never seen, stored, or
                transmitted to OutreachOS.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero Client-Side Token Leaks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All sensitive API tokens and Blob read/write credentials execute strictly server-side in
                protected runtime environments.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Encrypted Cloud Storage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Data persists in isolated Upstash Redis stores, while attachments live in private Vercel
                Blob stores with user-level isolation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. USE CASES SECTION */}
      <section id="use-cases" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Versatility
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Designed for High-Impact Roles.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Whether you are landing senior engineering leadership roles, closing agency deals, or
              connecting with founders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Job Applications & Career Growth</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reach out to engineering managers, VP of Engineering, and recruiters with tailored
                resumes and personalized pitch notes.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Recruiting & Talent Acquisition</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Source specialized engineering talent with bespoke role descriptions that candidates
                actually read and respond to.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Business Development & Partnerships</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with founders, partners, and agency clients using structured multi-touch follow-up
                cadences.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Professional Networking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reach out to industry peers, mentors, and conference speakers with thoughtful context.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Academic & Research Collaboration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Coordinate with professors, researchers, and university labs on co-authored papers and
                initiatives.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Founder & Investor Updates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keep angel investors and board advisors updated with clean, scheduled progress
                milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FINAL CALL TO ACTION */}
      <section className="py-20 bg-indigo-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-800/80 border border-indigo-700 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Ready to Elevate Your Outreach?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Your next opportunity shouldn't depend on another spreadsheet.
          </h2>

          <p className="text-base sm:text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
            Centralize your contacts, campaigns, and Gmail outreach in one calm, intelligent workspace.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={isAuthenticated ? onNavigateDashboard : onNavigateLogin}
              className="w-full sm:w-auto h-12 px-7 rounded-xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!isAuthenticated && (
              <button
                onClick={onNavigateLogin}
                className="w-full sm:w-auto h-12 px-6 rounded-xl bg-indigo-800/70 hover:bg-indigo-800 border border-indigo-700 text-white font-semibold text-sm transition-all flex items-center justify-center cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand Column */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-2xs">
                  O
                </div>
                <span className="text-base font-bold tracking-tight text-slate-900">OutreachOS</span>
              </div>
              <p className="text-slate-500 max-w-sm text-xs leading-relaxed">
                The professional outreach operating system for engineers, founders, and leaders.
                Native Gmail integration with private object storage.
              </p>
              <div className="text-[11px] text-slate-400">
                Designed with precision for predictable response rates.
              </div>
            </div>

            {/* Product Column */}
            <div className="space-y-2.5">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Product</div>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <a href="#features" className="hover:text-indigo-600 transition-colors">
                    AI Personalization
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-indigo-600 transition-colors">
                    Gmail Sending
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-indigo-600 transition-colors">
                    Smart Scheduling
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-indigo-600 transition-colors">
                    Follow-Up Sequences
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-indigo-600 transition-colors">
                    Document Repository
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-2.5">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Resources</div>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:text-indigo-600 transition-colors">
                    Security Architecture
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="hover:text-indigo-600 transition-colors">
                    Use Cases
                  </a>
                </li>
                <li>
                  <a href="#ai-assistant" className="hover:text-indigo-600 transition-colors">
                    OutreachOS AI Guide
                  </a>
                </li>
              </ul>
            </div>

            {/* Account / Legal */}
            <div className="space-y-2.5">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Account</div>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <button
                    onClick={isAuthenticated ? onNavigateDashboard : onNavigateLogin}
                    className="hover:text-indigo-600 transition-colors text-left cursor-pointer"
                  >
                    {isAuthenticated ? 'Open Dashboard' : 'Sign In'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={onNavigateLogin}
                    className="hover:text-indigo-600 transition-colors text-left cursor-pointer"
                  >
                    Admin Console
                  </button>
                </li>
                <li>
                  <span className="text-slate-400">Privacy & Terms</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-3">
            <p>© 2026 OutreachOS. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Official Google OAuth 2.0</span>
              <span>•</span>
              <span>Private Vercel Blob</span>
              <span>•</span>
              <span>Upstash Redis</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
