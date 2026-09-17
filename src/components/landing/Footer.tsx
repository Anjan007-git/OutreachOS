import React from 'react';
import { Mail, Github, Linkedin, CheckCircle2 } from 'lucide-react';

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
    <footer className="bg-white dark:bg-black border-t border-slate-200/80 dark:border-white/[0.08] text-slate-600 dark:text-zinc-400 text-xs transition-colors">
      {/* Top Multi-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10">
          {/* Brand Column (Span 4 on md) */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                O
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Outreach<span className="text-indigo-600 dark:text-indigo-400">OS</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              AI-powered professional outreach, built around native Gmail, intelligent personalization, safe scheduling, and secure document workflows.
            </p>

            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-[#0c0c0c] border border-slate-200/80 dark:border-white/[0.08] text-[11px] font-medium text-slate-700 dark:text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All systems operational</span>
            </div>

            {/* Social / Creator Row */}
            <div className="pt-2 flex items-center gap-2.5">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Repository"
                  className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#0c0c0c] hover:bg-slate-200 dark:hover:bg-[#141414] text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center border border-slate-200/60 dark:border-white/[0.05] transition-colors cursor-pointer"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#0c0c0c] hover:bg-slate-200 dark:hover:bg-[#141414] text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center border border-slate-200/60 dark:border-white/[0.05] transition-colors cursor-pointer"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  aria-label="Contact via Email"
                  className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#0c0c0c] hover:bg-slate-200 dark:hover:bg-[#141414] text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center border border-slate-200/60 dark:border-white/[0.05] transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Product Links (Span 3) */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Product
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => scrollToSection(e, 'how-it-works')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Workflow
                </a>
              </li>
              <li>
                <a
                  href="#use-cases"
                  onClick={(e) => scrollToSection(e, 'use-cases')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Use Cases
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Templates
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links (Span 3) */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Resources
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => scrollToSection(e, 'how-it-works')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  onClick={(e) => scrollToSection(e, 'security')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  onClick={(e) => scrollToSection(e, 'security')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Terms
                </a>
              </li>
              <li>
                <span className="text-slate-400 dark:text-zinc-600">
                  Changelog (v2.4)
                </span>
              </li>
            </ul>
          </div>

          {/* Account / Action Column (Span 2) */}
          <div className="col-span-2 md:col-span-2 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Access
            </div>
            <ul className="space-y-2 text-xs">
              {isAuthenticated ? (
                <>
                  <li>
                    <button
                      onClick={onNavigateDashboard}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-left font-semibold text-indigo-600 dark:text-indigo-400"
                    >
                      Open Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={onNavigateDashboard}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-left text-slate-500 dark:text-zinc-400"
                    >
                      Workspace
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={onNavigateLogin}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-left"
                    >
                      Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={onNavigateLogin}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-left text-indigo-600 dark:text-indigo-400 font-semibold"
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
      <div className="border-t border-slate-200/80 dark:border-white/[0.06] bg-slate-50/80 dark:bg-black py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 dark:text-zinc-400 text-xs">
          <div>
            © 2026 OutreachOS. All rights reserved.
          </div>

          {/* Exact Developer & Powered By Credit */}
          <div className="text-slate-600 dark:text-zinc-300 font-medium flex items-center gap-1.5">
            <span>Developed by Anjan • Powered by TRIFECTA TRENDS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
