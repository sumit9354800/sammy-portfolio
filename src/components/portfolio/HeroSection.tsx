import React, { useState, useEffect } from 'react';
import { HeroData, SiteSettingsData } from '../../types.js';
import { HeroScene } from '../three/HeroScene.js';
import { ArrowDown, MapPin, Terminal, Layers, ArrowUpRight, Code, Database, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  hero: HeroData;
  siteSettings: SiteSettingsData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero, siteSettings }) => {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const titles = hero.rotatingTitles && hero.rotatingTitles.length > 0
    ? hero.rotatingTitles
    : ['Full Stack Developer', 'MERN Stack Engineer', 'Next.js Developer', 'Frontend Creative Engineer'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <section
      id="hero"
      className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0b0c0e]"
    >
      {/* 3D Background Experience Canvas */}
      {hero.hero3DEnabled && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-80 lg:opacity-100">
          <HeroScene intensity={hero.hero3DIntensity || 1.0} />
        </div>
      )}

      {/* Subtle Technical Architectural Grid Lines (Solid 1px dividers, zero gradients) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="max-w-7xl mx-auto h-full border-x border-[#16181f] flex justify-between">
          <div className="w-[1px] h-full bg-[#16181f] hidden lg:block" />
          <div className="w-[1px] h-full bg-[#16181f] hidden md:block" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
        {/* Top Badges: Status & Location */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-6 px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#121316] border border-[#22252c] text-xs font-mono-code text-[#cbd5e1] max-w-full">
            <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" />
            <span className="truncate">{hero.availabilityStatus || 'Available for opportunities'}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121316] border border-[#22252c] text-xs font-mono-code text-[#94a3b8] max-w-full">
            <MapPin className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
            <span className="truncate">{hero.locationBadge || 'Uttam Nagar, Delhi – 110059'}</span>
          </div>
        </div>

        {/* Primary Headline */}
        <h1
          id="hero-name"
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase font-sans mb-3 break-words px-2"
        >
          {hero.headlineName || 'SUMIT SHRIVASTAV'}
        </h1>

        {/* Rotating Titles Terminal Ribbon */}
        <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2 bg-[#121316] border border-[#262a34] mb-8 text-center mx-2">
          <Terminal className="w-4 h-4 text-[#94a3b8] shrink-0" />
          <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-widest text-[#717887] whitespace-nowrap">
            ENGINEER_TRACK //
          </span>
          <span
            key={currentTitleIndex}
            className="font-mono-code text-xs sm:text-sm font-semibold tracking-wider text-white transition-opacity duration-300"
          >
            {titles[currentTitleIndex]}
          </span>
        </div>

        {/* Description Paragraph */}
        <p
          id="hero-description"
          className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-[#94a3b8] leading-relaxed mb-8 sm:mb-10 font-sans px-3"
        >
          {hero.description ||
            'Self-taught MERN stack developer building fast, clean, and production-ready web applications. From database to deployment — I own the full stack.'}
        </p>

        {/* Action Buttons (Solid buttons, strictly NO gradients) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-14 px-4 w-full max-w-md sm:max-w-none mx-auto">
          <a
            href={hero.primaryCtaLink || '#projects'}
            id="hero-primary-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#0b0c0e] font-mono-code text-xs sm:text-sm font-bold tracking-wider uppercase border border-white hover:bg-[#e2e8f0] transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span>{hero.primaryCtaText || 'Explore Work'}</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href={hero.secondaryCtaLink || '#contact'}
            id="hero-secondary-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#121316] text-white font-mono-code text-xs sm:text-sm font-semibold tracking-wider uppercase border border-[#2b303b] hover:bg-[#1a1d24] hover:border-[#424958] transition-colors focus:outline-none focus:ring-2 focus:ring-[#424958]"
          >
            <span>{hero.secondaryCtaText || 'Get In Touch'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Technical Key Pillars Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 max-w-4xl mx-auto text-left px-2">
          <div className="p-2.5 sm:p-3.5 bg-[#101216] border border-[#1e222b]">
            <div className="font-mono-code text-[10px] sm:text-[11px] text-[#64748b] uppercase mb-1">FRONTEND</div>
            <div className="text-xs sm:text-sm font-bold text-white truncate">Next.js & React</div>
            <div className="font-mono-code text-[9px] sm:text-[10px] text-[#848d9d] mt-1 truncate">TypeScript • Tailwind</div>
          </div>

          <div className="p-2.5 sm:p-3.5 bg-[#101216] border border-[#1e222b]">
            <div className="font-mono-code text-[10px] sm:text-[11px] text-[#64748b] uppercase mb-1">BACKEND</div>
            <div className="text-xs sm:text-sm font-bold text-white truncate">Node & Express</div>
            <div className="font-mono-code text-[9px] sm:text-[10px] text-[#848d9d] mt-1 truncate">REST APIs • Auth</div>
          </div>

          <div className="p-2.5 sm:p-3.5 bg-[#101216] border border-[#1e222b]">
            <div className="font-mono-code text-[10px] sm:text-[11px] text-[#64748b] uppercase mb-1">DATABASE</div>
            <div className="text-xs sm:text-sm font-bold text-white truncate">MongoDB Atlas</div>
            <div className="font-mono-code text-[9px] sm:text-[10px] text-[#848d9d] mt-1 truncate">Mongoose • Schemas</div>
          </div>

          <div className="p-2.5 sm:p-3.5 bg-[#101216] border border-[#1e222b]">
            <div className="font-mono-code text-[10px] sm:text-[11px] text-[#64748b] uppercase mb-1">UI / UX</div>
            <div className="text-xs sm:text-sm font-bold text-white truncate">Responsive Design</div>
            <div className="font-mono-code text-[9px] sm:text-[10px] text-[#848d9d] mt-1 truncate">Accessibility • UX</div>
          </div>
        </div>
      </div>
    </section>
  );
};
