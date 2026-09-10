import React, { useState, useMemo } from 'react';
import { ProjectItem } from '../../types.js';
import { ProjectDetailModal } from './ProjectDetailModal.js';
import { ArrowUpRight, Github, Sparkles, Filter, Search, Layers, Eye } from 'lucide-react';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  // Derive unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .filter((p) => {
        if (!p.published) return false;
        const matchesCategory =
          selectedCategory === 'All' ||
          p.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          searchQuery.trim() === '' ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0b0c0e] border-t border-[#1a1d24]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-[#1f232b]">
          <div>
            <div className="flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#94a3b8] mb-2">
              <span className="w-2 h-2 bg-white" />
              PORTFOLIO // PRODUCTION ARCHIVES
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase font-sans break-words">
              Selected Works & Systems
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 text-[#717887] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by tech or keyword..."
                className="w-full sm:w-64 pl-9 pr-3 py-2 bg-[#121316] border border-[#22252c] text-xs font-mono-code text-white placeholder-[#717887] focus:outline-none focus:border-[#475569]"
              />
            </div>
          </div>
        </div>

        {/* Category Filters (Strictly solid pills, no gradients) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-3.5 py-1.5 font-mono-code text-xs uppercase tracking-wider transition-colors border ${
                selectedCategory === cat
                  ? 'bg-white text-[#0b0c0e] border-white font-bold'
                  : 'bg-[#121316] text-[#94a3b8] border-[#22252c] hover:text-white hover:border-[#383e4a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center border border-[#1f232b] bg-[#101216] p-8">
            <Layers className="w-10 h-10 text-[#475569] mx-auto mb-3" />
            <div className="font-mono-code text-sm text-[#94a3b8]">NO_MATCHING_PROJECTS_FOUND</div>
            <p className="text-xs text-[#64748b] mt-1">Try selecting another category or clearing your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
            {filteredProjects.map((project) => {
              const colSpan = project.colSpan || 1;
              const rowSpan = project.rowSpan || 1;

              // Grid Span Classes
              const colSpanClass =
                colSpan === 3
                  ? 'md:col-span-2 lg:col-span-3'
                  : colSpan === 2
                  ? 'md:col-span-2 lg:col-span-2'
                  : 'col-span-1';

              const rowSpanClass = rowSpan === 2 ? 'lg:row-span-2' : 'row-span-1';
              const isWide = colSpan >= 2 && rowSpan === 1;

              return (
                <article
                  key={project._id}
                  id={`project-card-${project.slug}`}
                  className={`group flex ${
                    isWide ? 'flex-col lg:flex-row' : 'flex-col'
                  } bg-[#121316] border border-[#22252c] hover:border-[#3d4454] transition-all duration-200 overflow-hidden ${colSpanClass} ${rowSpanClass}`}
                >
                  {/* Image Container with Year/Category Badges */}
                  <div
                    className={`relative ${
                      isWide ? 'w-full lg:w-5/12 h-56 lg:h-auto min-h-[220px]' : rowSpan === 2 ? 'w-full h-72 sm:h-80' : 'w-full h-52'
                    } bg-[#171a21] overflow-hidden cursor-pointer flex-shrink-0`}
                    onClick={() => setActiveModalProject(project)}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    {/* Category & Featured Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="font-mono-code text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[#0b0c0e] border border-[#2b303b] text-white">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="font-mono-code text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[#1e293b] border border-[#3b82f6] text-[#60a5fa] flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className={`p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between space-y-4`}>
                    <div>
                      <div className="font-mono-code text-[11px] text-[#717887] mb-1 truncate">
                        ROLE // {project.role} {project.year && `• ${project.year}`}
                      </div>

                      <h3
                        onClick={() => setActiveModalProject(project)}
                        className={`font-bold text-white group-hover:text-[#94a3b8] transition-colors cursor-pointer break-words ${
                          isWide ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg'
                        }`}
                      >
                        {project.title}
                      </h3>

                      <p className={`text-xs sm:text-sm text-[#94a3b8] mt-2 ${isWide ? 'line-clamp-4' : 'line-clamp-3'} leading-relaxed break-words`}>
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Technologies Pills */}
                    <div>
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-4">
                        {project.technologies.slice(0, isWide ? 7 : 4).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-[#171a21] border border-[#262a34] font-mono-code text-[10px] text-[#cbd5e1] whitespace-nowrap"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > (isWide ? 7 : 4) && (
                          <span className="px-1.5 py-0.5 bg-[#171a21] border border-[#262a34] font-mono-code text-[10px] text-[#717887]">
                            +{project.technologies.length - (isWide ? 7 : 4)}
                          </span>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="pt-3 border-t border-[#1e222b] flex flex-wrap items-center justify-between gap-2">
                        <button
                          onClick={() => setActiveModalProject(project)}
                          id={`view-project-btn-${project._id || project.slug}`}
                          className="font-mono-code text-xs font-bold text-[#0b0c0e] bg-white hover:bg-[#e2e8f0] px-3.5 py-1.5 inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${project.title} GitHub`}
                              className="p-1.5 text-[#94a3b8] hover:text-white bg-[#171a21] border border-[#262a34] transition-colors"
                              title="GitHub"
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${project.title} Live Demo`}
                              className="p-1.5 text-white hover:bg-white hover:text-[#0b0c0e] bg-[#171a21] border border-[#262a34] transition-colors"
                              title="Live Demo"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      {activeModalProject && (
        <ProjectDetailModal
          project={activeModalProject}
          allProjects={projects}
          onClose={() => setActiveModalProject(null)}
          onSelectProject={(p) => setActiveModalProject(p)}
        />
      )}
    </section>
  );
};
