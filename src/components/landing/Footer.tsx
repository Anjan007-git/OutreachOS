import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

interface FooterProps {
  isAuthenticated: boolean;
  onNavigateLogin: () => void;
  onNavigateDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isAuthenticated,
  onNavigateLogin,
  onNavigateDashboard,
}) => {
  // Configurable URLs (generic/placeholder until officially configured)
  const githubUrl = 'https://github.com/Anjan007-git';
  const linkedinUrl = 'https://linkedin.com/in/anjanprajapati';
  const contactEmail = 'anjantrends@gmail.com';

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs">
      {/* Top Multi-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10">
          {/* Brand Column (Span 4 on md) */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-2xs">
                O
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Outreach<span className="text-indigo-600">OS</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              AI-powered professional outreach, built around Gmail, intelligent personalization, scheduling, and secure document workflows.
            </p>

            <div className="text-[11px] font-semibold text-slate-400">
              Built for thoughtful outreach.
            </div>

            {/* Social / Creator Row */}
            <div className="pt-2 flex items-center gap-3">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Repository"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  aria-label="Contact via Email"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Product Links (Span 2) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Product
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  AI Personalization
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Gmail Sending
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Smart Scheduling
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Campaigns
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Follow-Ups
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Documents
                </a>
              </li>
            </ul>
          </div>

          {/* Resources (Span 2) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Resources
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => scrollToSection(e, 'how-it-works')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  onClick={(e) => scrollToSection(e, 'security')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Security Architecture
                </a>
              </li>
              <li>
                <a
                  href="#use-cases"
                  onClick={(e) => scrollToSection(e, 'use-cases')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Use Cases
                </a>
              </li>
              <li>
                <a
                  href="#ai-assistant"
                  onClick={(e) => scrollToSection(e, 'ai-assistant')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  OutreachOS AI
                </a>
              </li>
            </ul>
          </div>

          {/* Company (Span 2) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Company
            </div>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400">About OutreachOS</span>
              </li>
              <li>
                <span className="text-slate-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400">Terms of Service</span>
              </li>
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Account / Action Column (Span 2) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Account
            </div>
            <ul className="space-y-2">
              {isAuthenticated ? (
                <>
                  <li>
                    <button
                      onClick={onNavigateDashboard}
                      className="hover:text-indigo-600 transition-colors cursor-pointer text-left font-semibold text-indigo-600"
                    >
                      Open Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={onNavigateDashboard}
                      className="hover:text-indigo-600 transition-colors cursor-pointer text-left text-slate-500"
                    >
                      Workspace Settings
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={onNavigateLogin}
                      className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                    >
                      Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={onNavigateLogin}
                      className="hover:text-indigo-600 transition-colors cursor-pointer text-left text-indigo-600 font-semibold"
                    >
                      Get Started Free
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-slate-200/80 bg-slate-50/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <div>
            © 2026 OutreachOS. All rights reserved.
          </div>

          {/* Required Exact Developer & Powered By Credit */}
          <div className="text-slate-600 font-medium flex items-center gap-1.5">
            <span>Developed by Anjan • Powered by TRIFECTA TRENDS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
