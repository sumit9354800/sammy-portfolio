import React from 'react';
import { AboutData, ProjectItem } from '../../types.js';
import { Terminal, Check, Sparkles, BookOpen, Compass, Trophy } from 'lucide-react';

interface AboutSectionProps {
  about: AboutData;
  projects?: ProjectItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ about, projects = [] }) => {
  // Compute real actual count of projects dynamically
  const publishedCount = projects.filter((p) => p.published).length;
  const totalCount = projects.length;
  const realCount = publishedCount > 0 ? publishedCount : totalCount;

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0b0c0e] border-t border-[#1a1d24]">
      <div className="max-w-7xl mx-auto">
        {/* Section Tag & Headline */}
        <div className="mb-12 pb-6 border-b border-[#1f232b]">
          <div className="flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#94a3b8] mb-2">
            <span className="w-2 h-2 bg-white" />
            {about.sectionTag || 'ABOUT SUMIT'} // PHILOSOPHY & BACKGROUND
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
            {about.headline || 'Building the web, one commit at a time.'}
          </h2>
        </div>

        {/* Stats Grid - Automatically synced with real project count */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {about.stats.map((stat, i) => {
            const isProjectStat =
              stat.label.toLowerCase().includes('project') ||
              stat.subtext.toLowerCase().includes('shipped') ||
              stat.label.toLowerCase().includes('production');

            // Show real actual project count dynamically as projects are added/removed
            const displayValue = isProjectStat ? `${realCount}` : stat.value;
            const displaySubtext = isProjectStat
              ? `${realCount} ${realCount === 1 ? 'project' : 'projects'} shipped & live`
              : stat.subtext;

            return (
              <div
                key={i}
                className="bg-[#121316] border border-[#22252c] p-3.5 sm:p-5 md:p-6 space-y-1.5 sm:space-y-2 hover:border-[#383e4c] transition-colors relative overflow-hidden group"
              >
                {isProjectStat && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 font-mono-code text-[9px] uppercase px-1.5 py-0.5 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                    Live
                  </div>
                )}
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-sans tracking-tight">
                  {displayValue}
                </div>
                <div className="font-mono-code text-[11px] sm:text-xs font-bold text-[#cbd5e1] uppercase break-words">
                  {stat.label}
                </div>
                <div className="font-mono-code text-[10px] sm:text-[11px] text-[#717887] break-words">
                  {displaySubtext}
                </div>
              </div>
            );
          })}
        </div>

        {/* Narrative Narrative Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="p-4 sm:p-6 bg-[#121316] border border-[#22252c] space-y-3">
            <div className="flex items-center gap-2 font-mono-code text-xs uppercase text-[#38bdf8] font-semibold">
              <Compass className="w-4 h-4" />
              The Mission
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Full Stack Engineering</h3>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              {about.introParagraph}
            </p>
          </div>

          <div className="p-4 sm:p-6 bg-[#121316] border border-[#22252c] space-y-3">
            <div className="flex items-center gap-2 font-mono-code text-xs uppercase text-[#a855f7] font-semibold">
              <BookOpen className="w-4 h-4" />
              Self-Taught & Academia
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Continuous Growth</h3>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              {about.learningStory}
            </p>
          </div>

          <div className="p-4 sm:p-6 bg-[#121316] border border-[#22252c] space-y-3">
            <div className="flex items-center gap-2 font-mono-code text-xs uppercase text-[#10b981] font-semibold">
              <Trophy className="w-4 h-4" />
              Shipped Impact
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Delivered Systems</h3>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              {realCount > 0
                ? about.achievementsParagraph.replace(
                    /over \d+ full-stack websites/i,
                    `over ${realCount} full-stack websites`
                  )
                : about.achievementsParagraph}
            </p>
          </div>
        </div>

        {/* Technical Highlights Checklist */}
        <div className="p-4 sm:p-6 md:p-8 bg-[#121316] border border-[#22252c]">
          <div className="flex items-center gap-2 font-mono-code text-xs uppercase tracking-wider text-white mb-6">
            <Terminal className="w-4 h-4 text-[#94a3b8]" />
            CORE ARCHITECTURAL DISCIPLINES & PRACTICES
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {about.highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 bg-[#16181f] border border-[#22252c] text-xs sm:text-sm text-[#cbd5e1]"
              >
                <div className="p-1 bg-[#1e222b] border border-[#2c313d] text-[#10b981] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
