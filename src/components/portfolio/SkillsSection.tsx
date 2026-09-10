import React from 'react';
import { SkillItem } from '../../types.js';
import { Code2, Server, Database, CheckCircle, Sparkles } from 'lucide-react';

interface SkillsSectionProps {
  skills: SkillItem[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const frontendSkills = skills
    .filter((s) => s.category === 'Frontend')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const backendSkills = skills
    .filter((s) => s.category === 'Backend')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const dbToolsSkills = skills
    .filter((s) => s.category === 'Database & Tools')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const renderSkillGroup = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    items: SkillItem[]
  ) => (
    <div className="flex flex-col bg-[#121316] border border-[#22252c] p-4 sm:p-6 space-y-4 sm:space-y-5">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1f232b]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#171a21] border border-[#282d38] text-white shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight break-words">{title}</h3>
            <span className="font-mono-code text-[10px] sm:text-[11px] text-[#717887]">{subtitle}</span>
          </div>
        </div>
        <span className="font-mono-code text-[11px] sm:text-xs px-2 py-0.5 bg-[#171a21] border border-[#282d38] text-[#94a3b8] shrink-0 whitespace-nowrap">
          {items.length} Modules
        </span>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((skill) => (
          <div
            key={skill._id}
            className="flex items-center justify-between p-3 bg-[#16181f] border border-[#22252c] hover:border-[#383e4c] transition-colors"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white">{skill.name}</span>
                {skill.featured && (
                  <Sparkles className="w-3 h-3 text-[#38bdf8]" title="Core Focus" />
                )}
              </div>
              <span className="font-mono-code text-[10px] text-[#717887]">
                {skill.yearsOfExperience} Exp
              </span>
            </div>

            <span
              className={`font-mono-code text-[10px] px-2 py-0.5 border ${
                skill.level === 'Expert'
                  ? 'bg-[#1a2333] border-[#2563eb] text-[#93c5fd]'
                  : 'bg-[#181a20] border-[#2c313d] text-[#cbd5e1]'
              }`}
            >
              {skill.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0b0c0e] border-t border-[#1a1d24]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 pb-6 border-b border-[#1f232b]">
          <div className="flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#94a3b8] mb-2">
            <span className="w-2 h-2 bg-white" />
            ENGINEERING CAPABILITIES // STACK MATRIX
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase font-sans break-words">
            Technical Arsenal & Core Stack
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-2 max-w-2xl">
            Specialized in high-density React, Next.js, Node, and MongoDB production environments. Built with scalable type systems and clean separation of concerns.
          </p>
        </div>

        {/* 3 Columns for Frontend, Backend, Database & Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderSkillGroup(
            'Frontend Engineering',
            'UI Architecture & WebGL',
            <Code2 className="w-4 h-4 text-white" />,
            frontendSkills
          )}

          {renderSkillGroup(
            'Backend Architecture',
            'Server Runtime & APIs',
            <Server className="w-4 h-4 text-white" />,
            backendSkills
          )}

          {renderSkillGroup(
            'Databases & DevOps',
            'Persistence & Tooling',
            <Database className="w-4 h-4 text-white" />,
            dbToolsSkills
          )}
        </div>
      </div>
    </section>
  );
};
