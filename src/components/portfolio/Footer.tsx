import React from 'react';
import { SiteSettingsData, SocialLinksData } from '../../types.js';
import { Github, Linkedin, Mail, Shield, ArrowUp } from 'lucide-react';

interface FooterProps {
  siteSettings: SiteSettingsData;
  socialLinks: SocialLinksData;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  siteSettings,
  socialLinks,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0e1013] border-t border-[#1f232b] py-12 px-4 sm:px-6 lg:px-8 text-xs font-mono-code text-[#717887]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Info */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-white" />
            <span className="font-bold text-white tracking-wider">
              {siteSettings.name || 'SUMIT SHRIVASTAV'}
            </span>
          </div>
          <span className="hidden sm:inline text-[#383e4a]">/</span>
          <span>© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
          <span className="hidden sm:inline text-[#383e4a]">/</span>
          <span>DELHI, INDIA</span>
        </div>

        {/* Center/Right Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="text-[#94a3b8] hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-[#94a3b8] hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {siteSettings.email && (
            <a
              href={`mailto:${siteSettings.email}`}
              className="text-[#94a3b8] hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}

          <span className="text-[#383e4a]">|</span>

          {/* Admin CMS Access */}
          <button
            onClick={onOpenAdmin}
            id="footer-admin-link"
            className="flex items-center gap-1 text-[#94a3b8] hover:text-white transition-colors"
            title="Open Admin CMS"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin CMS</span>
          </button>

          <span className="text-[#383e4a]">|</span>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            id="footer-scroll-top"
            className="p-1.5 bg-[#171a21] border border-[#262a34] text-[#94a3b8] hover:text-white transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
