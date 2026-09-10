import React from 'react';
import { ExperienceItem, EducationItem, CertificationItem } from '../../types.js';
import { Briefcase, GraduationCap, Award, Calendar, MapPin, CheckCircle, ExternalLink } from 'lucide-react';

interface ExperienceSectionProps {
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experience,
  education,
  certifications,
}) => {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0b0c0e] border-t border-[#1a1d24]">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* 1. Work Experience Section */}
        <div>
          <div className="mb-10 pb-6 border-b border-[#1f232b]">
            <div className="flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#94a3b8] mb-2">
              <span className="w-2 h-2 bg-white" />
              CAREER TIMELINE // PRODUCTION ENGAGEMENT
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
              Work Experience & Shipping Record
            </h2>
          </div>

          <div className="space-y-6">
            {experience.map((exp) => (
              <div
                key={exp._id}
                className="bg-[#121316] border border-[#22252c] p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1f232b]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white break-words">{exp.role}</h3>
                      {exp.currentJob && (
                        <span className="font-mono-code text-[10px] uppercase px-2 py-0.5 bg-[#10b981]/10 border border-[#10b981] text-[#10b981] whitespace-nowrap">
                          Active Role
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[#94a3b8] mt-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#64748b] shrink-0" />
                      <span className="break-words">{exp.company}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1 font-mono-code text-xs text-[#717887]">
                    <div className="flex items-center gap-1.5 text-[#cbd5e1]">
                      <Calendar className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                      <span className="whitespace-nowrap">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                      <span className="break-words">{exp.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed break-words">
                  {exp.description}
                </p>

                {/* Responsibilities list */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#717887]">
                      KEY RESPONSIBILITIES //
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {exp.responsibilities.map((resp, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#94a3b8]">
                          <span className="w-1.5 h-1.5 rounded-none bg-white shrink-0 mt-1.5" />
                          <span className="break-words">{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="pt-3 border-t border-[#1e222b] flex flex-wrap gap-1.5 sm:gap-2">
                    {exp.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#171a21] border border-[#262a34] font-mono-code text-[11px] text-[#cbd5e1] whitespace-nowrap"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Education and Certifications Two-Column Grid */}
        <div id="education" className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          {/* Education Column */}
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#1f232b]">
              <div className="flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#94a3b8] mb-1">
                <GraduationCap className="w-4 h-4 text-white" />
                ACADEMIC CREDENTIALS
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Formal Education</h3>
            </div>

            <div className="space-y-4">
              {education.map((edu) => (
                <div
                  key={edu._id}
                  className="bg-[#121316] border border-[#22252c] p-4 sm:p-6 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white break-words">{edu.degree}</h4>
                      <div className="text-xs font-semibold text-[#94a3b8] mt-0.5">{edu.field}</div>
                      <div className="text-xs text-[#717887] mt-1">{edu.institution}</div>
                    </div>
                    <span className="font-mono-code text-[11px] px-2.5 py-1 bg-[#171a21] border border-[#262a34] text-[#cbd5e1] self-start sm:self-auto shrink-0 whitespace-nowrap">
                      {edu.startYear} – {edu.endYear}
                    </span>
                  </div>

                  {edu.grade && (
                    <div className="inline-block font-mono-code text-[11px] text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 border border-[#10b981]/30">
                      {edu.grade}
                    </div>
                  )}

                  <p className="text-xs text-[#94a3b8] leading-relaxed pt-2 border-t border-[#1e222b] break-words">
                    {edu.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Awards & Certifications Column */}
          <div id="awards" className="space-y-6">
            <div className="pb-4 border-b border-[#1f232b]">
              <div className="flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#94a3b8] mb-1">
                <Award className="w-4 h-4 text-white" />
                HONORS & VERIFICATIONS
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Awards & Certifications</h3>
            </div>

            <div className="space-y-4">
              {certifications.map((cert) => (
                <div
                  key={cert._id}
                  className="bg-[#121316] border border-[#22252c] p-4 sm:p-6 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-white break-words">{cert.name}</h4>
                        {cert.isAward && (
                          <span className="font-mono-code text-[10px] uppercase px-2 py-0.5 bg-[#f59e0b]/10 border border-[#f59e0b] text-[#fbbf24] whitespace-nowrap">
                            Award Winner
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#717887] mt-1">{cert.issuer}</div>
                    </div>
                    <span className="font-mono-code text-[11px] px-2.5 py-1 bg-[#171a21] border border-[#262a34] text-[#cbd5e1] self-start sm:self-auto shrink-0 whitespace-nowrap">
                      {cert.issueDate}
                    </span>
                  </div>

                  <p className="text-xs text-[#94a3b8] leading-relaxed pt-2 border-t border-[#1e222b] break-words">
                    {cert.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
