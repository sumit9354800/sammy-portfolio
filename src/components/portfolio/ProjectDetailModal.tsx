import React from 'react';
import { ProjectItem } from '../../types.js';
import { X, ExternalLink, Github, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Layers, Calendar, UserCheck } from 'lucide-react';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onSelectProject: (proj: ProjectItem) => void;
  allProjects: ProjectItem[];
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectProject,
  allProjects,
}) => {
  if (!project) return null;

  const currentIndex = allProjects.findIndex((p) => p._id === project._id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div
      id="project-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="project-detail-modal"
        className="relative w-full max-w-4xl bg-[#0e1013] border border-[#262a34] text-[#f3f4f6] shadow-2xl my-8 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#22252c] bg-[#121316]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-code text-[11px] sm:text-xs uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#1a1d24] border border-[#2e3340] text-[#94a3b8]">
              {project.category}
            </span>
            <span className="font-mono-code text-[11px] sm:text-xs text-[#717887]">
              {project.role}
            </span>
          </div>

          <button
            onClick={onClose}
            id="close-project-modal"
            aria-label="Close modal"
            className="p-1.5 text-[#94a3b8] hover:text-white bg-[#1a1d24] border border-[#2e3340] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Project Title and Hero Banner */}
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 break-words">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed break-words">
              {project.shortDescription}
            </p>
          </div>

          {/* Featured Image */}
          {project.image && (
            <div className="relative w-full h-64 sm:h-80 border border-[#22252c] bg-[#14161b] overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#121316] border border-[#22252c]">
              <div className="font-mono-code text-[11px] text-[#717887] uppercase">Category</div>
              <div className="text-sm font-semibold text-white mt-0.5">{project.category}</div>
            </div>
            <div className="p-3 bg-[#121316] border border-[#22252c]">
              <div className="font-mono-code text-[11px] text-[#717887] uppercase">Shipped Year</div>
              <div className="text-sm font-semibold text-white mt-0.5">{project.year}</div>
            </div>
            <div className="p-3 bg-[#121316] border border-[#22252c]">
              <div className="font-mono-code text-[11px] text-[#717887] uppercase">Role</div>
              <div className="text-sm font-semibold text-white mt-0.5">{project.role}</div>
            </div>
            <div className="p-3 bg-[#121316] border border-[#22252c]">
              <div className="font-mono-code text-[11px] text-[#717887] uppercase">Deployment</div>
              <div className="text-sm font-semibold text-white mt-0.5">{project.published ? 'Live Production' : 'Archived'}</div>
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-3">
            <h3 className="font-mono-code text-xs uppercase tracking-widest text-[#94a3b8] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-none" />
              Project Architecture & Overview
            </h3>
            <p className="text-[#cbd5e1] text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {project.fullDescription}
            </p>
          </div>

          {/* Challenges & Solution Grid */}
          {(project.challenges || project.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.challenges && (
                <div className="p-4 bg-[#121316] border border-[#262a34]">
                  <div className="flex items-center gap-2 font-mono-code text-xs font-semibold text-[#f87171] uppercase mb-2">
                    <AlertCircle className="w-4 h-4" />
                    Engineering Challenge
                  </div>
                  <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                    {project.challenges}
                  </p>
                </div>
              )}

              {project.solution && (
                <div className="p-4 bg-[#121316] border border-[#262a34]">
                  <div className="flex items-center gap-2 font-mono-code text-xs font-semibold text-[#10b981] uppercase mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Architectural Solution
                  </div>
                  <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Key Features List */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-mono-code text-xs uppercase tracking-widest text-[#94a3b8] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white" />
                Key Technical Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.keyFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 bg-[#121316] border border-[#22252c] text-xs text-[#cbd5e1]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technology Stack Tags */}
          <div className="space-y-3">
            <h3 className="font-mono-code text-xs uppercase tracking-widest text-[#94a3b8] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white" />
              Technologies & Frameworks
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#14161b] border border-[#262a34] font-mono-code text-xs text-[#cbd5e1]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer: External Links and Next/Prev Navigation */}
        <div className="px-6 py-4 border-t border-[#22252c] bg-[#121316] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase hover:bg-[#e2e8f0] transition-colors"
              >
                <span>Live Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1a1d24] border border-[#2e3340] text-white font-mono-code text-xs font-semibold uppercase hover:bg-[#252830] transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            )}
          </div>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-2">
            {prevProject && (
              <button
                onClick={() => onSelectProject(prevProject)}
                className="flex items-center gap-1 px-3 py-2 bg-[#1a1d24] border border-[#2e3340] font-mono-code text-xs text-[#cbd5e1] hover:text-white transition-colors"
                title={`Previous: ${prevProject.title}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>
            )}
            {nextProject && (
              <button
                onClick={() => onSelectProject(nextProject)}
                className="flex items-center gap-1 px-3 py-2 bg-[#1a1d24] border border-[#2e3340] font-mono-code text-xs text-[#cbd5e1] hover:text-white transition-colors"
                title={`Next: ${nextProject.title}`}
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
