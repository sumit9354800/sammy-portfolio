import React, { useState, useEffect } from 'react';
import { NavigationItem, SiteSettingsData, SocialLinksData } from '../../types.js';
import { Terminal, Menu, X, Shield, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';

interface NavbarProps {
  navigation: NavigationItem[];
  siteSettings: SiteSettingsData;
  socialLinks: SocialLinksData;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  navigation,
  siteSettings,
  socialLinks,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const enabledNav = navigation.filter((n) => n.enabled).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#0b0c0e] border-b border-[#1f232b] py-3'
          : 'bg-[#0b0c0e]/95 backdrop-blur-md border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          id="navbar-brand"
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-1 focus:ring-white min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#16181d] border border-[#262a34] group-hover:border-[#424856] flex items-center justify-center transition-colors shrink-0">
            <span className="font-mono-code text-xs sm:text-sm font-bold text-white tracking-wider">SS</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-[#94a3b8] transition-colors truncate">
              {siteSettings.name || 'SUMIT SHRIVASTAV'}
            </div>
            <div className="font-mono-code text-[9px] sm:text-[10px] tracking-wider uppercase text-[#717887] truncate">
              {siteSettings.title || 'FULL STACK DEVELOPER'}
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#121316] border border-[#1f232b] p-1">
          {enabledNav.map((item) => (
            <a
              key={item._id}
              href={item.href}
              id={`nav-link-${item.label.toLowerCase()}`}
              className="px-3.5 py-1.5 text-xs font-mono-code text-[#94a3b8] hover:text-white hover:bg-[#1c1f26] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Action: Availability & Admin */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#121316] border border-[#1f232b] text-xs font-mono-code text-[#cbd5e1]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </span>
            <span className="text-[11px]">AVAILABLE FOR HIRE</span>
          </div>

          {/* Social Quick Links */}
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Sumit GitHub"
              className="p-2 bg-[#121316] border border-[#1f232b] text-[#94a3b8] hover:text-white hover:border-[#383e4a] transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}

          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="Sumit LinkedIn"
              className="p-2 bg-[#121316] border border-[#1f232b] text-[#94a3b8] hover:text-white hover:border-[#383e4a] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}

          {/* Admin CMS Access Button */}
          <button
            id="navbar-admin-btn"
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono-code transition-colors ${
              isAdminLoggedIn
                ? 'bg-[#1e293b] border-[#3b82f6] text-white hover:bg-[#2563eb]'
                : 'bg-[#121316] border-[#1f232b] text-[#94a3b8] hover:text-white hover:border-[#383e4a]'
            }`}
            title="Admin CMS Portal"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? 'CMS ACTIVE' : 'CMS'}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenAdmin}
            id="mobile-admin-trigger"
            aria-label="Admin CMS"
            className="p-2 bg-[#121316] border border-[#1f232b] text-[#94a3b8]"
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            className="p-2 bg-[#121316] border border-[#1f232b] text-white hover:border-[#383e4a]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-[#0e1013] border-b border-[#1f232b] px-4 py-4 space-y-2"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#1f232b]">
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#10b981]">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              AVAILABLE FOR ROLES
            </div>
            <div className="text-[11px] font-mono-code text-[#717887]">DELHI – 110059</div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {enabledNav.map((item) => (
              <a
                key={item._id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 bg-[#14161b] border border-[#1f232b] text-xs font-mono-code text-white hover:bg-[#1f232b]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-3">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#14161b] border border-[#1f232b] text-xs text-white"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#14161b] border border-[#1f232b] text-xs text-white"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
