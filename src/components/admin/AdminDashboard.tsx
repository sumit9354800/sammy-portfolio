import React, { useState, useEffect } from 'react';
import {
  PortfolioFullData,
  ProjectItem,
  SkillItem,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  ContactMessageItem,
} from '../../types.js';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  FileText,
  Settings,
  Share2,
  Compass,
  MessageSquare,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
  Save,
  Menu,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Grid,
  Columns,
  Rows,
  Move,
} from 'lucide-react';

interface AdminDashboardProps {
  initialData: PortfolioFullData;
  onLogout: () => void;
  onViewSite: () => void;
  onDataUpdated: (newData: PortfolioFullData) => void;
}

type AdminTab =
  | 'dashboard'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'hero'
  | 'about'
  | 'site'
  | 'social'
  | 'navigation'
  | 'messages';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialData,
  onLogout,
  onViewSite,
  onDataUpdated,
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [data, setData] = useState<PortfolioFullData>(initialData);
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [stats, setStats] = useState<any>({
    totalProjects: data.projects.length,
    publishedProjects: data.projects.filter((p) => p.published).length,
    featuredProjects: data.projects.filter((p) => p.featured).length,
    totalSkills: data.skills.length,
    totalExperience: data.experience.length,
    totalEducation: data.education.length,
    totalCertifications: data.certifications.length,
    unreadMessages: 0,
    lastUpdated: new Date().toISOString(),
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Modals & Delete Confirmations
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectLayoutViewMode, setProjectLayoutViewMode] = useState<'table' | 'visual'>('table');
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{
    type: string;
    id: string;
    name: string;
  } | null>(null);

  // Skill editing
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);

  // Experience editing
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);
  const [isCreatingExperience, setIsCreatingExperience] = useState(false);

  // Education editing
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);
  const [isCreatingEducation, setIsCreatingEducation] = useState(false);

  // Certification editing
  const [editingCertification, setEditingCertification] = useState<CertificationItem | null>(null);
  const [isCreatingCertification, setIsCreatingCertification] = useState(false);

  // Fetch admin stats & messages on mount
  useEffect(() => {
    fetchStats();
    fetchMessages();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const json = await res.json();
        setStats(json);
      }
    } catch {
      // Ignored in preview
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const json = await res.json();
        setMessages(json);
      }
    } catch {
      // Ignored
    }
  };

  const triggerToast = (msg: string, status: 'saved' | 'error' = 'saved') => {
    setStatusMessage(msg);
    setSaveStatus(status);
    setTimeout(() => {
      setSaveStatus('idle');
      setStatusMessage('');
    }, 3500);
  };

  // -------------------------------------------------------------
  // HERO & ABOUT & SITE SETTINGS SAVERS
  // -------------------------------------------------------------
  const saveHeroSettings = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.hero),
      });
      if (!res.ok) throw new Error('Failed to save Hero settings');
      onDataUpdated(data);
      triggerToast('Hero settings saved successfully');
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const saveAboutSettings = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.about),
      });
      if (!res.ok) throw new Error('Failed to save About section');
      onDataUpdated(data);
      triggerToast('About information saved successfully');
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const saveSiteSettings = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/admin/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.siteSettings),
      });
      if (!res.ok) throw new Error('Failed to save Site Settings');
      onDataUpdated(data);
      triggerToast('Site & SEO settings saved successfully');
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const saveSocialSettings = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/admin/social', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.socialLinks),
      });
      if (!res.ok) throw new Error('Failed to save Social Links');
      onDataUpdated(data);
      triggerToast('Social links saved successfully');
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // PROJECT CRUD
  // -------------------------------------------------------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSaveStatus('saving');
    try {
      if (isCreatingProject) {
        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProject),
        });
        const resJson = await res.json();
        if (!res.ok) throw new Error(resJson.error || 'Failed to create project');

        const updated = [...data.projects, resJson.project];
        setData({ ...data, projects: updated });
        onDataUpdated({ ...data, projects: updated });
        triggerToast('Project created successfully');
      } else {
        const res = await fetch(`/api/admin/projects/${editingProject._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProject),
        });
        if (!res.ok) throw new Error('Failed to update project');

        const updated = data.projects.map((p) =>
          p._id === editingProject._id ? editingProject : p
        );
        setData({ ...data, projects: updated });
        onDataUpdated({ ...data, projects: updated });
        triggerToast('Project updated successfully');
      }
      setEditingProject(null);
      setIsCreatingProject(false);
      fetchStats();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');

      const updated = data.projects.filter((p) => p._id !== id);
      setData({ ...data, projects: updated });
      onDataUpdated({ ...data, projects: updated });
      setDeleteConfirmItem(null);
      triggerToast('Project deleted successfully');
      fetchStats();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const toggleProjectPublished = async (project: ProjectItem) => {
    const updated = { ...project, published: !project.published };
    try {
      await fetch(`/api/admin/projects/${project._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const newProjects = data.projects.map((p) => (p._id === project._id ? updated : p));
      setData({ ...data, projects: newProjects });
      onDataUpdated({ ...data, projects: newProjects });
      fetchStats();
    } catch (err) {
      triggerToast('Failed to toggle status', 'error');
    }
  };

  const handleMoveProjectOrder = async (project: ProjectItem, direction: 'up' | 'down') => {
    const sorted = [...data.projects].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    const currentIndex = sorted.findIndex((p) => p._id === project._id);
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === sorted.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const currentProj = { ...sorted[currentIndex] };
    const targetProj = { ...sorted[targetIndex] };

    const currentOrder = currentProj.displayOrder ?? currentIndex + 1;
    const targetOrder = targetProj.displayOrder ?? targetIndex + 1;

    if (currentOrder === targetOrder) {
      currentProj.displayOrder = direction === 'up' ? targetOrder : targetOrder + 1;
      targetProj.displayOrder = direction === 'up' ? targetOrder + 1 : targetOrder;
    } else {
      currentProj.displayOrder = targetOrder;
      targetProj.displayOrder = currentOrder;
    }

    const updatedProjects = data.projects.map((p) => {
      if (p._id === currentProj._id) return currentProj;
      if (p._id === targetProj._id) return targetProj;
      return p;
    });

    setData({ ...data, projects: updatedProjects });
    onDataUpdated({ ...data, projects: updatedProjects });

    try {
      await Promise.all([
        fetch(`/api/admin/projects/${currentProj._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentProj),
        }),
        fetch(`/api/admin/projects/${targetProj._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetProj),
        }),
      ]);
      triggerToast(`Moved ${project.title} ${direction}`);
    } catch (err) {
      triggerToast('Failed to save project reorder', 'error');
    }
  };

  const handleQuickUpdateProjectLayout = async (
    project: ProjectItem,
    updates: { colSpan?: number; rowSpan?: number; displayOrder?: number }
  ) => {
    const updated: ProjectItem = {
      ...project,
      colSpan: updates.colSpan !== undefined ? updates.colSpan : (project.colSpan || 1),
      rowSpan: updates.rowSpan !== undefined ? updates.rowSpan : (project.rowSpan || 1),
      displayOrder: updates.displayOrder !== undefined ? updates.displayOrder : (project.displayOrder || 1),
    };

    const updatedProjects = data.projects.map((p) => (p._id === project._id ? updated : p));
    setData({ ...data, projects: updatedProjects });
    onDataUpdated({ ...data, projects: updatedProjects });

    try {
      const res = await fetch(`/api/admin/projects/${project._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to update project layout');
      const details: string[] = [];
      if (updates.colSpan !== undefined) details.push(`${updates.colSpan} Col${updates.colSpan > 1 ? 's' : ''}`);
      if (updates.rowSpan !== undefined) details.push(`${updates.rowSpan} Row${updates.rowSpan > 1 ? 's' : ''}`);
      if (updates.displayOrder !== undefined) details.push(`Order #${updates.displayOrder}`);
      triggerToast(`Saved ${project.title} layout (${details.join(', ')})`);
      fetchStats();
    } catch (err: any) {
      triggerToast(err.message || 'Failed to update project layout', 'error');
    }
  };

  // -------------------------------------------------------------
  // SKILL CRUD
  // -------------------------------------------------------------
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    setSaveStatus('saving');
    try {
      if (isCreatingSkill) {
        const res = await fetch('/api/admin/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingSkill),
        });
        const resJson = await res.json();
        if (!res.ok) throw new Error(resJson.error || 'Failed to add skill');

        const updated = [...data.skills, resJson.skill];
        setData({ ...data, skills: updated });
        onDataUpdated({ ...data, skills: updated });
        triggerToast('Skill added successfully');
      } else {
        await fetch(`/api/admin/skills/${editingSkill._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingSkill),
        });
        const updated = data.skills.map((s) =>
          s._id === editingSkill._id ? editingSkill : s
        );
        setData({ ...data, skills: updated });
        onDataUpdated({ ...data, skills: updated });
        triggerToast('Skill updated successfully');
      }
      setEditingSkill(null);
      setIsCreatingSkill(false);
      fetchStats();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      const updated = data.skills.filter((s) => s._id !== id);
      setData({ ...data, skills: updated });
      onDataUpdated({ ...data, skills: updated });
      setDeleteConfirmItem(null);
      triggerToast('Skill deleted');
      fetchStats();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // EXPERIENCE CRUD
  // -------------------------------------------------------------
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;

    setSaveStatus('saving');
    try {
      if (isCreatingExperience) {
        const res = await fetch('/api/admin/experience', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingExperience),
        });
        const resJson = await res.json();
        if (!res.ok) throw new Error(resJson.error || 'Failed to add experience');

        const updated = [...data.experience, resJson.experience];
        setData({ ...data, experience: updated });
        onDataUpdated({ ...data, experience: updated });
        triggerToast('Experience added successfully');
      } else {
        const res = await fetch(`/api/admin/experience/${editingExperience._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingExperience),
        });
        const resJson = await res.json();
        if (!res.ok) throw new Error(resJson.error || 'Failed to update experience');

        const updated = data.experience.map((exp) =>
          exp._id === editingExperience._id ? editingExperience : exp
        );
        setData({ ...data, experience: updated });
        onDataUpdated({ ...data, experience: updated });
        triggerToast('Experience updated successfully');
      }
      setEditingExperience(null);
      setIsCreatingExperience(false);
      fetchStats();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
      const updated = data.experience.filter((e) => e._id !== id);
      setData({ ...data, experience: updated });
      onDataUpdated({ ...data, experience: updated });
      setDeleteConfirmItem(null);
      triggerToast('Experience deleted');
      fetchStats();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // EDUCATION CRUD
  // -------------------------------------------------------------
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEducation) return;

    setSaveStatus('saving');
    try {
      if (isCreatingEducation) {
        const res = await fetch('/api/admin/education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingEducation),
        });
        const resJson = await res.json();
        if (!res.ok) throw new Error(resJson.error || 'Failed to add education');

        const updated = [...data.education, resJson.education];
        setData({ ...data, education: updated });
        onDataUpdated({ ...data, education: updated });
        triggerToast('Education added successfully');
      } else {
        const res = await fetch(`/api/admin/education/${editingEducation._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingEducation),
        });
        const resJson = await res.json();
        if (!res.ok) throw new Error(resJson.error || 'Failed to update education');

        const updated = data.education.map((edu) =>
          edu._id === editingEducation._id ? editingEducation : edu
        );
        setData({ ...data, education: updated });
        onDataUpdated({ ...data, education: updated });
        triggerToast('Education updated successfully');
      }
      setEditingEducation(null);
      setIsCreatingEducation(false);
      fetchStats();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      await fetch(`/api/admin/education/${id}`, { method: 'DELETE' });
      const updated = data.education.filter((e) => e._id !== id);
      setData({ ...data, education: updated });
      onDataUpdated({ ...data, education: updated });
      setDeleteConfirmItem(null);
      triggerToast('Education deleted');
      fetchStats();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // CERTIFICATIONS CRUD
  // -------------------------------------------------------------
  const handleSaveCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCertification) return;

    setSaveStatus('saving');
    try {
      if (isCreatingCertification) {
        const res = await fetch('/api/admin/certifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCertification),
        });
        const resJson = await res.json();
        if (!res.ok) throw new Error(resJson.error || 'Failed to add certification');

        const updated = [...data.certifications, resJson.certification];
        setData({ ...data, certifications: updated });
        onDataUpdated({ ...data, certifications: updated });
        triggerToast('Certification added successfully');
      } else {
        const res = await fetch(`/api/admin/certifications/${editingCertification._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCertification),
        });
        const resJson = await res.json();
        if (!res.ok) throw new Error(resJson.error || 'Failed to update certification');

        const updated = data.certifications.map((cert) =>
          cert._id === editingCertification._id ? editingCertification : cert
        );
        setData({ ...data, certifications: updated });
        onDataUpdated({ ...data, certifications: updated });
        triggerToast('Certification updated successfully');
      }
      setEditingCertification(null);
      setIsCreatingCertification(false);
      fetchStats();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const handleDeleteCertification = async (id: string) => {
    try {
      await fetch(`/api/admin/certifications/${id}`, { method: 'DELETE' });
      const updated = data.certifications.filter((c) => c._id !== id);
      setData({ ...data, certifications: updated });
      onDataUpdated({ ...data, certifications: updated });
      setDeleteConfirmItem(null);
      triggerToast('Certification deleted');
      fetchStats();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // NAVIGATION SETTINGS SAVE
  // -------------------------------------------------------------
  const saveNavigationSettings = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.navigation),
      });
      if (!res.ok) throw new Error('Failed to save navigation');
      onDataUpdated(data);
      triggerToast('Site navigation updated');
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // MESSAGE MANAGEMENT
  // -------------------------------------------------------------
  const handleUpdateMessageStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/messages/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: status as any } : m))
      );
      fetchStats();
    } catch {
      triggerToast('Failed to update status', 'error');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      setMessages((prev) => prev.filter((m) => m._id !== id));
      triggerToast('Message deleted');
      fetchStats();
    } catch {
      triggerToast('Failed to delete message', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#f3f4f6] flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-[#121316] border-b border-[#22252c] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 bg-[#171a21] border border-[#282d38] md:hidden text-white"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-white" />
            <span className="font-bold tracking-tight text-white text-sm sm:text-base">
              SUMIT SHRIVASTAV // ADMIN CMS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Toast Notification Banner */}
          {saveStatus !== 'idle' && (
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1 font-mono-code text-xs border ${
                saveStatus === 'saving'
                  ? 'bg-[#1e293b] border-[#3b82f6] text-[#93c5fd]'
                  : saveStatus === 'saved'
                  ? 'bg-[#10b981]/10 border-[#10b981] text-[#10b981]'
                  : 'bg-[#ef4444]/10 border-[#ef4444] text-[#f87171]'
              }`}
            >
              {saveStatus === 'saving' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{statusMessage || (saveStatus === 'saving' ? 'Saving...' : 'Saved successfully')}</span>
            </div>
          )}

          <button
            onClick={onViewSite}
            id="admin-view-live-site-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171a21] border border-[#282d38] hover:border-white font-mono-code text-xs text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Live Site</span>
          </button>

          <button
            onClick={onLogout}
            id="admin-logout-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f1618] border border-[#442327] hover:bg-[#2b181b] font-mono-code text-xs text-[#fca5a5] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-16 left-0 z-30 w-64 bg-[#0e1013] border-r border-[#22252c] flex flex-col justify-between transition-transform duration-200 md:translate-x-0 md:static ${
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-1 overflow-y-auto">
            <div className="font-mono-code text-[11px] text-[#717887] uppercase tracking-wider px-3 py-2">
              NAVIGATION & MODULES
            </div>

            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'projects', label: 'Projects', icon: FolderGit2, badge: data.projects.length },
              { id: 'skills', label: 'Skills', icon: Cpu, badge: data.skills.length },
              { id: 'experience', label: 'Experience', icon: Briefcase, badge: data.experience.length },
              { id: 'education', label: 'Education', icon: GraduationCap, badge: data.education.length },
              { id: 'certifications', label: 'Certifications', icon: Award, badge: data.certifications.length },
              { id: 'hero', label: 'Hero Content', icon: Sparkles },
              { id: 'about', label: 'About Story', icon: FileText },
              { id: 'messages', label: 'Messages', icon: MessageSquare, badge: stats.unreadMessages },
              { id: 'site', label: 'Site & SEO', icon: Settings },
              { id: 'social', label: 'Social Links', icon: Share2 },
              { id: 'navigation', label: 'Site Navigation', icon: Compass, badge: data.navigation.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentTab(tab.id as AdminTab);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono-code transition-colors ${
                    isActive
                      ? 'bg-white text-[#0b0c0e] font-bold'
                      : 'text-[#94a3b8] hover:text-white hover:bg-[#16181f]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 ${
                        isActive
                          ? 'bg-[#0b0c0e] text-white'
                          : 'bg-[#1e222b] text-[#cbd5e1]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-[#1f232b] font-mono-code text-[11px] text-[#717887]">
            <div>Sumit Shrivastav CMS</div>
            <div className="text-[#94a3b8] text-[10px] mt-0.5">MongoDB Atlas Ready</div>
          </div>
        </aside>

        {/* Content View Panel */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* ------------------------------------------------------------- */}
            {/* TAB 1: DASHBOARD */}
            {/* ------------------------------------------------------------- */}
            {currentTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#22252c]">
                  <div>
                    <h2 className="text-2xl font-bold text-white">System Overview</h2>
                    <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                      CMS metrics and portfolio publication status
                    </p>
                  </div>
                  <button
                    onClick={fetchStats}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16181f] border border-[#282d38] text-xs font-mono-code text-white hover:border-white"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#121316] border border-[#22252c] p-4 space-y-1">
                    <div className="font-mono-code text-[11px] text-[#717887] uppercase">Total Projects</div>
                    <div className="text-2xl font-bold text-white">{data.projects.length}</div>
                    <div className="font-mono-code text-[10px] text-[#10b981]">
                      {data.projects.filter((p) => p.published).length} Published
                    </div>
                  </div>

                  <div className="bg-[#121316] border border-[#22252c] p-4 space-y-1">
                    <div className="font-mono-code text-[11px] text-[#717887] uppercase">Featured Works</div>
                    <div className="text-2xl font-bold text-white">
                      {data.projects.filter((p) => p.featured).length}
                    </div>
                    <div className="font-mono-code text-[10px] text-[#38bdf8]">Highlighted on hero</div>
                  </div>

                  <div className="bg-[#121316] border border-[#22252c] p-4 space-y-1">
                    <div className="font-mono-code text-[11px] text-[#717887] uppercase">Skills Recorded</div>
                    <div className="text-2xl font-bold text-white">{data.skills.length}</div>
                    <div className="font-mono-code text-[10px] text-[#94a3b8]">Across 3 categories</div>
                  </div>

                  <div className="bg-[#121316] border border-[#22252c] p-4 space-y-1">
                    <div className="font-mono-code text-[11px] text-[#717887] uppercase">Contact Inquiries</div>
                    <div className="text-2xl font-bold text-white">{messages.length}</div>
                    <div className="font-mono-code text-[10px] text-[#fbbf24]">
                      {messages.filter((m) => m.status === 'new').length} Unread
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-[#121316] border border-[#22252c] p-6 space-y-4">
                  <h3 className="font-bold text-white text-sm uppercase font-mono-code">
                    Quick Operational Shortcuts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        setEditingProject({
                          _id: '',
                          title: '',
                          slug: '',
                          shortDescription: '',
                          fullDescription: '',
                          category: 'Commercial',
                          year: '2024',
                          role: 'Full Stack Developer',
                          technologies: ['React', 'Next.js', 'TypeScript', 'MongoDB'],
                          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
                          liveUrl: '',
                          githubUrl: '',
                          featured: false,
                          published: true,
                          displayOrder: data.projects.length + 1,
                          challenges: '',
                          solution: '',
                          keyFeatures: [],
                        });
                        setIsCreatingProject(true);
                        setCurrentTab('projects');
                      }}
                      className="p-4 bg-[#16181f] border border-[#262a34] hover:border-white text-left text-xs font-mono-code transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white mb-2" />
                      <div className="text-white font-bold">Add New Project</div>
                      <div className="text-[#717887] text-[11px] mt-1">Publish a new system or case study</div>
                    </button>

                    <button
                      onClick={() => setCurrentTab('hero')}
                      className="p-4 bg-[#16181f] border border-[#262a34] hover:border-white text-left text-xs font-mono-code transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-white mb-2" />
                      <div className="text-white font-bold">Configure Hero & 3D</div>
                      <div className="text-[#717887] text-[11px] mt-1">Update availability and headline</div>
                    </button>

                    <button
                      onClick={() => setCurrentTab('messages')}
                      className="p-4 bg-[#16181f] border border-[#262a34] hover:border-white text-left text-xs font-mono-code transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-white mb-2" />
                      <div className="text-white font-bold">Inspect Inquiries</div>
                      <div className="text-[#717887] text-[11px] mt-1">View leads submitted through contact form</div>
                    </button>
                  </div>
                </div>

                {/* System Diagnostics */}
                <div className="bg-[#121316] border border-[#22252c] p-4 text-xs font-mono-code space-y-2">
                  <div className="text-[#717887] uppercase">System Architecture Status</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#cbd5e1]">
                    <div>• Database: <span className="text-white">MongoDB Atlas Connection Layer</span></div>
                    <div>• Auth Secret: <span className="text-white">HMAC Signed HTTP-Only Cookies</span></div>
                    <div>• Resend Service: <span className="text-white">Active Dispatch Engine</span></div>
                    <div>• 3D Canvas Engine: <span className="text-white">Three.js WebGL Low-Overhead Loop</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 2: PROJECTS MANAGER */}
            {/* ------------------------------------------------------------- */}
            {currentTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#22252c] gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Projects Manager</h2>
                    <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                      Control column width, row height, display position, and case study details.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* View Switcher: Table vs Visual Bento Grid */}
                    <div className="flex items-center bg-[#16181f] border border-[#262a34] p-0.5">
                      <button
                        type="button"
                        onClick={() => setProjectLayoutViewMode('table')}
                        className={`px-3 py-1.5 font-mono-code text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          projectLayoutViewMode === 'table'
                            ? 'bg-white text-[#0b0c0e]'
                            : 'text-[#94a3b8] hover:text-white'
                        }`}
                        title="Table View"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Table</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProjectLayoutViewMode('visual')}
                        className={`px-3 py-1.5 font-mono-code text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          projectLayoutViewMode === 'visual'
                            ? 'bg-white text-[#0b0c0e]'
                            : 'text-[#94a3b8] hover:text-white'
                        }`}
                        title="Visual Bento Grid Layout"
                      >
                        <Grid className="w-3.5 h-3.5" />
                        <span>Bento Grid Layout</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setEditingProject({
                          _id: '',
                          title: '',
                          slug: '',
                          shortDescription: '',
                          fullDescription: '',
                          category: 'Commercial',
                          year: '2024',
                          role: 'Full Stack Developer',
                          technologies: ['React', 'Next.js', 'MongoDB', 'Tailwind CSS'],
                          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
                          liveUrl: '',
                          githubUrl: '',
                          featured: false,
                          published: true,
                          displayOrder: data.projects.length + 1,
                          colSpan: 1,
                          rowSpan: 1,
                          challenges: '',
                          solution: '',
                          keyFeatures: ['Feature 1', 'Feature 2'],
                        });
                        setIsCreatingProject(true);
                      }}
                      id="admin-add-project-btn"
                      className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase hover:bg-[#e2e8f0] transition-colors shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Project</span>
                    </button>
                  </div>
                </div>

                {/* Helper notice explaining column & row controls */}
                <div className="p-3 bg-[#14171f] border border-[#222733] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-code text-[#94a3b8]">
                  <div className="flex items-center gap-2 text-white">
                    <Grid className="w-4 h-4 text-[#38bdf8] shrink-0" />
                    <span className="font-semibold">Bento Grid Position & Sizing:</span>
                  </div>
                  <div className="text-[11px] text-[#cbd5e1]">
                    Columns: <strong className="text-white">1 Col</strong> (1/3), <strong className="text-white">2 Cols</strong> (2/3 Wide), <strong className="text-white">3 Cols</strong> (Full Row). Rows: <strong className="text-white">1 Row</strong> (Standard), <strong className="text-white">2 Rows</strong> (Tall). Click any option to instantly update.
                  </div>
                </div>

                {/* VISUAL BENTO GRID MODE */}
                {projectLayoutViewMode === 'visual' && (
                  <div className="space-y-4">
                    <div className="text-xs font-mono-code text-[#94a3b8] flex items-center justify-between">
                      <span>Desktop 3-Column Bento Grid Preview (Live Arrangement):</span>
                      <span className="text-white font-bold">{data.projects.length} Total Projects</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#0d0e12] border border-[#22252c] p-4">
                      {data.projects
                        .slice()
                        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                        .map((proj, idx, arr) => {
                          const colSpan = proj.colSpan || 1;
                          const rowSpan = proj.rowSpan || 1;
                          const colSpanClass =
                            colSpan === 3
                              ? 'md:col-span-2 lg:col-span-3'
                              : colSpan === 2
                              ? 'md:col-span-2 lg:col-span-2'
                              : 'col-span-1';
                          const rowSpanClass = rowSpan === 2 ? 'lg:row-span-2' : 'row-span-1';

                          return (
                            <div
                              key={proj._id}
                              className={`bg-[#12141a] border ${
                                proj.published ? 'border-[#292e3a]' : 'border-[#452024] opacity-75'
                              } p-3 flex flex-col justify-between gap-3 relative transition-all ${colSpanClass} ${rowSpanClass}`}
                            >
                              {/* Card Header & Order Badge */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 flex items-center justify-center bg-white text-[#0b0c0e] font-mono-code font-bold text-xs">
                                    #{proj.displayOrder ?? idx + 1}
                                  </span>
                                  <div>
                                    <div className="text-sm font-bold text-white line-clamp-1">
                                      {proj.title}
                                    </div>
                                    <div className="font-mono-code text-[10px] text-[#717887]">
                                      {proj.category} &bull; {proj.year}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveProjectOrder(proj, 'up')}
                                    disabled={idx === 0}
                                    className="p-1 bg-[#171a22] border border-[#2b303d] hover:bg-white hover:text-[#0b0c0e] text-[#94a3b8] disabled:opacity-30 disabled:pointer-events-none"
                                    title="Move Earlier in Order"
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveProjectOrder(proj, 'down')}
                                    disabled={idx === arr.length - 1}
                                    className="p-1 bg-[#171a22] border border-[#2b303d] hover:bg-white hover:text-[#0b0c0e] text-[#94a3b8] disabled:opacity-30 disabled:pointer-events-none"
                                    title="Move Later in Order"
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Card Thumbnail if available */}
                              {proj.image && (
                                <div className="h-20 bg-[#171a21] border border-[#22252c] overflow-hidden relative">
                                  <img
                                    src={proj.image}
                                    alt={proj.title}
                                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                                  />
                                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 font-mono-code text-[9px] text-[#94a3b8]">
                                    {colSpan} Col &times; {rowSpan} Row
                                  </span>
                                </div>
                              )}

                              {/* Interactive Position / Span Controls */}
                              <div className="space-y-2 pt-2 border-t border-[#1f242e] font-mono-code text-[10px]">
                                {/* Columns Selector */}
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[#717887] uppercase">Columns:</span>
                                  <div className="flex items-center gap-1">
                                    {[
                                      { val: 1, label: '1 Col' },
                                      { val: 2, label: '2 Cols' },
                                      { val: 3, label: '3 Cols' },
                                    ].map((c) => (
                                      <button
                                        key={c.val}
                                        type="button"
                                        onClick={() => handleQuickUpdateProjectLayout(proj, { colSpan: c.val })}
                                        className={`px-2 py-0.5 border font-semibold uppercase transition-all ${
                                          colSpan === c.val
                                            ? 'bg-white text-[#0b0c0e] border-white'
                                            : 'bg-[#181b23] text-[#94a3b8] border-[#292e3a] hover:text-white'
                                        }`}
                                      >
                                        {c.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Rows Selector */}
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[#717887] uppercase">Rows:</span>
                                  <div className="flex items-center gap-1">
                                    {[
                                      { val: 1, label: '1 Row' },
                                      { val: 2, label: '2 Rows' },
                                    ].map((r) => (
                                      <button
                                        key={r.val}
                                        type="button"
                                        onClick={() => handleQuickUpdateProjectLayout(proj, { rowSpan: r.val })}
                                        className={`px-2 py-0.5 border font-semibold uppercase transition-all ${
                                          rowSpan === r.val
                                            ? 'bg-white text-[#0b0c0e] border-white'
                                            : 'bg-[#181b23] text-[#94a3b8] border-[#292e3a] hover:text-white'
                                        }`}
                                      >
                                        {r.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Card Action Buttons */}
                              <div className="flex items-center justify-between pt-2 border-t border-[#1f242e]">
                                <button
                                  type="button"
                                  onClick={() => toggleProjectPublished(proj)}
                                  className={`font-mono-code text-[10px] px-2 py-0.5 border uppercase ${
                                    proj.published
                                      ? 'bg-[#10b981]/10 border-[#10b981] text-[#10b981]'
                                      : 'bg-[#ef4444]/10 border-[#ef4444] text-[#f87171]'
                                  }`}
                                >
                                  {proj.published ? 'Published' : 'Draft'}
                                </button>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingProject({ ...proj });
                                      setIsCreatingProject(false);
                                    }}
                                    className="p-1 text-[#94a3b8] hover:text-white bg-[#1a1d24] border border-[#2e3340]"
                                    title="Edit Full Project"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setDeleteConfirmItem({
                                        type: 'Project',
                                        id: proj._id,
                                        name: proj.title,
                                      })
                                    }
                                    className="p-1 text-[#f87171] hover:text-white bg-[#24171a] border border-[#442327]"
                                    title="Delete Project"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* TABLE MODE */}
                {projectLayoutViewMode === 'table' && (
                  <div className="bg-[#121316] border border-[#22252c] overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#16181f] border-b border-[#22252c] font-mono-code text-[#717887] uppercase">
                        <tr>
                          <th className="py-3 px-4 w-32">Order / Position</th>
                          <th className="py-3 px-4">Title / Category</th>
                          <th className="py-3 px-4 min-w-[260px]">Grid Layout (Columns & Rows)</th>
                          <th className="py-3 px-4">Role & Year</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Featured</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#22252c]">
                        {data.projects
                          .slice()
                          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                          .map((proj, i, arr) => {
                            const colSpan = proj.colSpan || 1;
                            const rowSpan = proj.rowSpan || 1;
                            return (
                              <tr key={proj._id} className="hover:bg-[#171a22] transition-colors">
                                {/* Position & Move Up/Down */}
                                <td className="py-3 px-4 font-mono-code">
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="number"
                                      min={1}
                                      value={proj.displayOrder ?? i + 1}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        if (!isNaN(val) && val >= 1) {
                                          handleQuickUpdateProjectLayout(proj, { displayOrder: val });
                                        }
                                      }}
                                      className="w-10 h-7 text-center bg-[#171a22] border border-[#2b303d] text-white font-bold text-xs focus:outline-none focus:border-white font-mono-code"
                                      title="Type number to change position"
                                    />
                                    <div className="flex flex-col gap-0.5">
                                      <button
                                        type="button"
                                        onClick={() => handleMoveProjectOrder(proj, 'up')}
                                        disabled={i === 0}
                                        className="p-1 bg-[#171a22] border border-[#2b303d] hover:bg-white hover:text-[#0b0c0e] text-[#94a3b8] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                        title="Move Up in Order"
                                      >
                                        <ChevronUp className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleMoveProjectOrder(proj, 'down')}
                                        disabled={i === arr.length - 1}
                                        className="p-1 bg-[#171a22] border border-[#2b303d] hover:bg-white hover:text-[#0b0c0e] text-[#94a3b8] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                        title="Move Down in Order"
                                      >
                                        <ChevronDown className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <div className="font-bold text-white">{proj.title}</div>
                                  <div className="font-mono-code text-[11px] text-[#717887]">
                                    {proj.category} • slug: {proj.slug}
                                  </div>
                                </td>

                                {/* Interactive Column & Row Span Controls */}
                                <td className="py-3 px-4 font-mono-code">
                                  <div className="space-y-1.5">
                                    {/* Column Buttons */}
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] text-[#717887] uppercase w-10">Cols:</span>
                                      <div className="flex items-center gap-1">
                                        {[
                                          { val: 1, label: '1 Col', tip: '1/3 Width' },
                                          { val: 2, label: '2 Cols', tip: '2/3 Wide' },
                                          { val: 3, label: '3 Cols', tip: 'Full Row Banner' },
                                        ].map((c) => (
                                          <button
                                            key={c.val}
                                            type="button"
                                            onClick={() => handleQuickUpdateProjectLayout(proj, { colSpan: c.val })}
                                            title={c.tip}
                                            className={`px-2 py-0.5 text-[10px] uppercase font-bold transition-all border ${
                                              colSpan === c.val
                                                ? 'bg-white text-[#0b0c0e] border-white'
                                                : 'bg-[#16181f] text-[#94a3b8] border-[#292e3a] hover:text-white hover:border-[#475569]'
                                            }`}
                                          >
                                            {c.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Row Buttons */}
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] text-[#717887] uppercase w-10">Rows:</span>
                                      <div className="flex items-center gap-1">
                                        {[
                                          { val: 1, label: '1 Row', tip: 'Standard Height' },
                                          { val: 2, label: '2 Rows', tip: 'Tall Bento Card' },
                                        ].map((r) => (
                                          <button
                                            key={r.val}
                                            type="button"
                                            onClick={() => handleQuickUpdateProjectLayout(proj, { rowSpan: r.val })}
                                            title={r.tip}
                                            className={`px-2 py-0.5 text-[10px] uppercase font-bold transition-all border ${
                                              rowSpan === r.val
                                                ? 'bg-white text-[#0b0c0e] border-white'
                                                : 'bg-[#16181f] text-[#94a3b8] border-[#292e3a] hover:text-white hover:border-[#475569]'
                                            }`}
                                          >
                                            {r.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3 px-4 font-mono-code text-[#cbd5e1]">
                                  <div>{proj.role}</div>
                                  <div className="text-[11px] text-[#717887]">{proj.year}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <button
                                    onClick={() => toggleProjectPublished(proj)}
                                    className={`font-mono-code text-[10px] px-2 py-0.5 border uppercase ${
                                      proj.published
                                        ? 'bg-[#10b981]/10 border-[#10b981] text-[#10b981]'
                                        : 'bg-[#ef4444]/10 border-[#ef4444] text-[#f87171]'
                                    }`}
                                  >
                                    {proj.published ? 'Published' : 'Draft'}
                                  </button>
                                </td>
                                <td className="py-3 px-4 font-mono-code text-xs">
                                  {proj.featured ? (
                                    <span className="text-[#38bdf8] font-bold">YES</span>
                                  ) : (
                                    <span className="text-[#64748b]">NO</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingProject({ ...proj });
                                        setIsCreatingProject(false);
                                      }}
                                      className="p-1.5 bg-[#1a1d24] border border-[#2e3340] text-[#94a3b8] hover:text-white"
                                      title="Edit Project"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setDeleteConfirmItem({
                                          type: 'Project',
                                          id: proj._id,
                                          name: proj.title,
                                        })
                                      }
                                      className="p-1.5 bg-[#24171a] border border-[#442327] text-[#fca5a5] hover:text-white"
                                      title="Delete Project"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 3: SKILLS MANAGER */}
            {/* ------------------------------------------------------------- */}
            {currentTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#22252c]">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Skills Matrix</h2>
                    <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                      Manage technical proficiencies across Frontend, Backend, and Database & Tools.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingSkill({
                        _id: '',
                        name: '',
                        category: 'Frontend',
                        displayOrder: data.skills.length + 1,
                        featured: false,
                        yearsOfExperience: '2+',
                        level: 'Expert',
                      });
                      setIsCreatingSkill(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase hover:bg-[#e2e8f0]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Frontend', 'Backend', 'Database & Tools'].map((cat) => (
                    <div key={cat} className="bg-[#121316] border border-[#22252c] p-4 space-y-3">
                      <div className="font-mono-code text-xs font-bold uppercase text-white pb-2 border-b border-[#22252c]">
                        {cat}
                      </div>
                      <div className="space-y-2">
                        {data.skills
                          .filter((s) => s.category === cat)
                          .map((skill) => (
                            <div
                              key={skill._id}
                              className="flex items-center justify-between p-2.5 bg-[#16181f] border border-[#22252c] text-xs font-mono-code"
                            >
                              <div>
                                <div className="text-white font-semibold">{skill.name}</div>
                                <div className="text-[10px] text-[#717887]">
                                  {skill.level} • {skill.yearsOfExperience}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingSkill({ ...skill });
                                    setIsCreatingSkill(false);
                                  }}
                                  className="p-1 text-[#94a3b8] hover:text-white"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirmItem({
                                      type: 'Skill',
                                      id: skill._id,
                                      name: skill.name,
                                    })
                                  }
                                  className="p-1 text-[#f87171] hover:text-white"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB: EXPERIENCE MANAGEMENT */}
            {/* ------------------------------------------------------------- */}
            {currentTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#22252c]">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Experience & Work History</h2>
                    <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                      Manage professional employment milestones, freelance work, and client engagements.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingExperience({
                        _id: '',
                        company: '',
                        role: '',
                        location: 'Delhi, India',
                        startDate: '',
                        endDate: 'Present',
                        currentJob: true,
                        description: '',
                        responsibilities: [],
                        technologies: [],
                        companyUrl: '',
                        displayOrder: data.experience.length + 1,
                      });
                      setIsCreatingExperience(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase hover:bg-[#e2e8f0]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.experience.length === 0 ? (
                    <div className="p-8 text-center bg-[#121316] border border-[#22252c] text-[#717887] font-mono-code text-xs">
                      No experience records found. Click "+ Add Experience" above to create one.
                    </div>
                  ) : (
                    data.experience.map((exp) => (
                      <div
                        key={exp._id}
                        className="bg-[#121316] border border-[#22252c] p-5 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-white">{exp.role}</h3>
                              {exp.currentJob && (
                                <span className="px-2 py-0.5 bg-[#10b981]/20 border border-[#10b981]/50 text-[#34d399] text-[10px] font-mono-code uppercase font-bold">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="font-mono-code text-xs text-[#94a3b8] mt-0.5">
                              {exp.company} &bull; {exp.location} &bull; {exp.startDate} – {exp.endDate}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                              onClick={() => {
                                setEditingExperience(exp);
                                setIsCreatingExperience(false);
                              }}
                              className="px-3 py-1.5 bg-[#171a21] border border-[#282d38] text-white hover:border-white font-mono-code text-xs flex items-center gap-1.5"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirmItem({
                                  type: 'Experience',
                                  id: exp._id,
                                  name: `${exp.role} at ${exp.company}`,
                                })
                              }
                              className="p-1.5 bg-[#171a21] border border-[#282d38] text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {exp.description && (
                          <p className="text-xs text-[#cbd5e1] leading-relaxed">
                            {exp.description}
                          </p>
                        )}

                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <div className="space-y-1 pt-1 border-t border-[#1e222b]">
                            <span className="font-mono-code text-[10px] uppercase text-[#717887]">
                              Key Responsibilities:
                            </span>
                            <ul className="list-disc list-inside text-xs text-[#94a3b8] space-y-0.5">
                              {exp.responsibilities.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {exp.technologies.map((t, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-[#171a21] border border-[#282d38] font-mono-code text-[10px] text-[#94a3b8]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB: EDUCATION MANAGEMENT */}
            {/* ------------------------------------------------------------- */}
            {currentTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#22252c]">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Education & Qualifications</h2>
                    <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                      Manage academic background, degrees, diplomas, and coursework.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingEducation({
                        _id: '',
                        institution: '',
                        degree: '',
                        field: '',
                        startYear: '',
                        endYear: '',
                        grade: '',
                        description: '',
                        location: 'New Delhi, India',
                        displayOrder: data.education.length + 1,
                      });
                      setIsCreatingEducation(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase hover:bg-[#e2e8f0]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.education.length === 0 ? (
                    <div className="p-8 text-center bg-[#121316] border border-[#22252c] text-[#717887] font-mono-code text-xs">
                      No education entries found. Click "+ Add Education" above to create one.
                    </div>
                  ) : (
                    data.education.map((edu) => (
                      <div
                        key={edu._id}
                        className="bg-[#121316] border border-[#22252c] p-5 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                              {edu.grade && (
                                <span className="px-2 py-0.5 bg-[#3b82f6]/20 border border-[#3b82f6]/50 text-[#60a5fa] text-[10px] font-mono-code font-bold">
                                  {edu.grade}
                                </span>
                              )}
                            </div>
                            <p className="font-mono-code text-xs text-[#94a3b8] mt-0.5">
                              {edu.institution} &bull; {edu.field}
                            </p>
                            <p className="font-mono-code text-[11px] text-[#717887]">
                              {edu.location} &bull; {edu.startYear} – {edu.endYear}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                              onClick={() => {
                                setEditingEducation(edu);
                                setIsCreatingEducation(false);
                              }}
                              className="px-3 py-1.5 bg-[#171a21] border border-[#282d38] text-white hover:border-white font-mono-code text-xs flex items-center gap-1.5"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirmItem({
                                  type: 'Education',
                                  id: edu._id,
                                  name: `${edu.degree} at ${edu.institution}`,
                                })
                              }
                              className="p-1.5 bg-[#171a21] border border-[#282d38] text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {edu.description && (
                          <p className="text-xs text-[#cbd5e1] leading-relaxed pt-1 border-t border-[#1e222b]">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB: CERTIFICATIONS & AWARDS */}
            {/* ------------------------------------------------------------- */}
            {currentTab === 'certifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#22252c]">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Certifications & Awards</h2>
                    <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                      Manage awards, diplomas, and verified professional certifications.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCertification({
                        _id: '',
                        name: '',
                        issuer: '',
                        issueDate: '',
                        description: '',
                        certificateUrl: '',
                        image: '',
                        isAward: false,
                        displayOrder: data.certifications.length + 1,
                      });
                      setIsCreatingCertification(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase hover:bg-[#e2e8f0]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Certification / Award</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.certifications.length === 0 ? (
                    <div className="col-span-full p-8 text-center bg-[#121316] border border-[#22252c] text-[#717887] font-mono-code text-xs">
                      No certifications or awards found. Click above to add one.
                    </div>
                  ) : (
                    data.certifications.map((cert) => (
                      <div
                        key={cert._id}
                        className="bg-[#121316] border border-[#22252c] p-5 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`px-2 py-0.5 font-mono-code text-[10px] uppercase font-bold border ${
                                cert.isAward
                                  ? 'bg-[#f59e0b]/20 border-[#f59e0b]/50 text-[#fbbf24]'
                                  : 'bg-[#171a21] border-[#282d38] text-[#94a3b8]'
                              }`}
                            >
                              {cert.isAward ? 'Industry Award' : 'Verified Certificate'}
                            </span>
                            <span className="font-mono-code text-[11px] text-[#717887]">
                              {cert.issueDate}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-white">{cert.name}</h3>
                          <p className="font-mono-code text-xs text-[#94a3b8]">
                            Issued by: {cert.issuer}
                          </p>

                          {cert.description && (
                            <p className="text-xs text-[#cbd5e1] leading-relaxed pt-1">
                              {cert.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-[#1e222b] flex items-center justify-between">
                          {cert.certificateUrl ? (
                            <a
                              href={cert.certificateUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono-code text-[11px] text-[#60a5fa] hover:underline flex items-center gap-1"
                            >
                              <span>View Certificate</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span />
                          )}

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingCertification(cert);
                                setIsCreatingCertification(false);
                              }}
                              className="px-2.5 py-1 bg-[#171a21] border border-[#282d38] text-white hover:border-white font-mono-code text-xs flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirmItem({
                                  type: 'Certification',
                                  id: cert._id,
                                  name: cert.name,
                                })
                              }
                              className="p-1 bg-[#171a21] border border-[#282d38] text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB: SITE NAVIGATION SETTINGS */}
            {/* ------------------------------------------------------------- */}
            {currentTab === 'navigation' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#22252c]">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Site Navigation Menu</h2>
                    <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                      Control links, ordering, and visibility in header navigation.
                    </p>
                  </div>
                  <button
                    onClick={saveNavigationSettings}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase hover:bg-[#e2e8f0]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Navigation</span>
                  </button>
                </div>

                <div className="bg-[#121316] border border-[#22252c] p-6 space-y-4">
                  {data.navigation.map((nav, index) => (
                    <div
                      key={nav._id || index}
                      className="flex items-center justify-between p-3 bg-[#171a21] border border-[#262a34] gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={nav.enabled}
                          onChange={(e) => {
                            const updated = [...data.navigation];
                            updated[index] = { ...nav, enabled: e.target.checked };
                            setData({ ...data, navigation: updated });
                          }}
                          className="w-4 h-4 accent-white"
                        />
                        <div>
                          <span className="text-sm font-bold text-white">{nav.label}</span>
                          <span className="font-mono-code text-xs text-[#717887] ml-2">
                            {nav.href}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="font-mono-code text-xs text-[#94a3b8]">Order:</label>
                        <input
                          type="number"
                          value={nav.displayOrder}
                          onChange={(e) => {
                            const updated = [...data.navigation];
                            updated[index] = { ...nav, displayOrder: parseInt(e.target.value) || 0 };
                            setData({ ...data, navigation: updated });
                          }}
                          className="w-16 px-2 py-1 bg-[#0e1013] border border-[#282d38] text-white font-mono-code text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 4: HERO SETTINGS */}
            {/* ------------------------------------------------------------- */}
            {currentTab === 'hero' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#22252c]">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Hero & 3D Configuration</h2>
                    <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                      Edit headline, rotating titles, description, and WebGL 3D parameters.
                    </p>
                  </div>
                  <button
                    onClick={saveHeroSettings}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase hover:bg-[#e2e8f0]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Hero</span>
                  </button>
                </div>

                <div className="bg-[#121316] border border-[#22252c] p-6 space-y-4 text-xs font-mono-code">
                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase">Headline Name</label>
                    <input
                      type="text"
                      value={data.hero.headlineName}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, headlineName: e.target.value } })
                      }
                      className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase">
                      Rotating Titles (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={data.hero.rotatingTitles.join(', ')}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: {
                            ...data.hero,
                            rotatingTitles: e.target.value.split(',').map((s) => s.trim()),
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[#94a3b8] uppercase">Availability Status</label>
                      <input
                        type="text"
                        value={data.hero.availabilityStatus}
                        onChange={(e) =>
                          setData({
                            ...data,
                            hero: { ...data.hero, availabilityStatus: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#94a3b8] uppercase">Location Badge</label>
                      <input
                        type="text"
                        value={data.hero.locationBadge}
                        onChange={(e) =>
                          setData({
                            ...data,
                            hero: { ...data.hero, locationBadge: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase">Hero Description</label>
                    <textarea
                      rows={3}
                      value={data.hero.description}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, description: e.target.value } })
                      }
                      className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  {/* 3D Toggles */}
                  <div className="pt-4 border-t border-[#22252c] grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-[#16181f] border border-[#22252c]">
                      <input
                        type="checkbox"
                        id="hero-3d-enabled"
                        checked={data.hero.hero3DEnabled}
                        onChange={(e) =>
                          setData({
                            ...data,
                            hero: { ...data.hero, hero3DEnabled: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-white"
                      />
                      <label htmlFor="hero-3d-enabled" className="text-white cursor-pointer">
                        Enable Three.js 3D Geometric Background
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#94a3b8] uppercase">
                        3D Light Intensity: {data.hero.hero3DIntensity}
                      </label>
                      <input
                        type="range"
                        min="0.4"
                        max="2.0"
                        step="0.1"
                        value={data.hero.hero3DIntensity || 1.0}
                        onChange={(e) =>
                          setData({
                            ...data,
                            hero: { ...data.hero, hero3DIntensity: parseFloat(e.target.value) },
                          })
                        }
                        className="w-full accent-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 5: ABOUT SECTION */}
            {/* ------------------------------------------------------------- */}
            {currentTab === 'about' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#22252c]">
                  <div>
                    <h2 className="text-2xl font-bold text-white">About & Narrative CMS</h2>
                    <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                      Edit story, achievements, statistics, and highlights.
                    </p>
                  </div>
                  <button
                    onClick={saveAboutSettings}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase hover:bg-[#e2e8f0]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save About</span>
                  </button>
                </div>

                <div className="bg-[#121316] border border-[#22252c] p-6 space-y-4 text-xs font-mono-code">
                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase">Section Headline</label>
                    <input
                      type="text"
                      value={data.about.headline}
                      onChange={(e) =>
                        setData({ ...data, about: { ...data.about, headline: e.target.value } })
                      }
                      className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase">Introductory Paragraph</label>
                    <textarea
                      rows={3}
                      value={data.about.introParagraph}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: { ...data.about, introParagraph: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase">Learning Story</label>
                    <textarea
                      rows={3}
                      value={data.about.learningStory}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: { ...data.about, learningStory: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase">Achievements Paragraph</label>
                    <textarea
                      rows={3}
                      value={data.about.achievementsParagraph}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: { ...data.about, achievementsParagraph: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  {/* About Statistics & Live Synced Projects Counter */}
                  <div className="pt-4 border-t border-[#22252c] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="text-white font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                        <span>About Section Metrics & Counters</span>
                      </label>
                      <span className="text-[11px] text-[#94a3b8] font-mono-code">
                        Real-time project counter is automatically synchronized
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {data.about.stats.map((stat, idx) => {
                        const isProjectStat =
                          stat.label.toLowerCase().includes('project') ||
                          stat.subtext.toLowerCase().includes('shipped') ||
                          stat.label.toLowerCase().includes('production');
                        const liveCount = data.projects.filter((p) => p.published).length || data.projects.length;

                        return (
                          <div
                            key={idx}
                            className={`p-3 border space-y-2 ${
                              isProjectStat
                                ? 'bg-[#10b981]/5 border-[#10b981]/40'
                                : 'bg-[#171a22] border-[#262b37]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-mono-code text-[#94a3b8]">
                                {stat.label}
                              </span>
                              {isProjectStat && (
                                <span className="text-[9px] px-1.5 py-0.2 bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 font-mono-code uppercase font-bold">
                                  Auto-Synced
                                </span>
                              )}
                            </div>

                            {isProjectStat ? (
                              <div className="space-y-1">
                                <div className="text-2xl font-black text-white font-sans">
                                  {liveCount}
                                </div>
                                <div className="text-[10px] text-[#34d399] font-mono-code">
                                  ⚡ Matches {liveCount} {liveCount === 1 ? 'project' : 'projects'} in database
                                </div>
                                <div className="text-[9px] text-[#717887]">
                                  (Automatically increments as new projects are added)
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <input
                                  type="text"
                                  value={stat.value}
                                  onChange={(e) => {
                                    const updatedStats = [...data.about.stats];
                                    updatedStats[idx] = { ...stat, value: e.target.value };
                                    setData({ ...data, about: { ...data.about, stats: updatedStats } });
                                  }}
                                  className="w-full px-2 py-1 bg-[#101217] border border-[#2b313e] text-white font-bold text-sm focus:outline-none focus:border-white"
                                  placeholder="Value (e.g. 2+)"
                                />
                                <input
                                  type="text"
                                  value={stat.subtext}
                                  onChange={(e) => {
                                    const updatedStats = [...data.about.stats];
                                    updatedStats[idx] = { ...stat, subtext: e.target.value };
                                    setData({ ...data, about: { ...data.about, stats: updatedStats } });
                                  }}
                                  className="w-full px-2 py-1 bg-[#101217] border border-[#2b313e] text-[#94a3b8] text-[11px] focus:outline-none focus:border-white"
                                  placeholder="Subtext description"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 6: MESSAGES INBOX */}
            {/* ------------------------------------------------------------- */}
            {currentTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#22252c]">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Inquiries Inbox</h2>
                    <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                      Messages received via contact form and Resend notification pipeline.
                    </p>
                  </div>
                  <button
                    onClick={fetchMessages}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16181f] border border-[#282d38] text-xs font-mono-code text-white hover:border-white"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Inbox</span>
                  </button>
                </div>

                {messages.length === 0 ? (
                  <div className="p-12 text-center bg-[#121316] border border-[#22252c]">
                    <MessageSquare className="w-8 h-8 text-[#475569] mx-auto mb-2" />
                    <div className="font-mono-code text-sm text-[#94a3b8]">NO_MESSAGES_RECORDED</div>
                    <p className="text-xs text-[#64748b] mt-1">Submissions through the contact form will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className="bg-[#121316] border border-[#22252c] p-5 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1f232b]">
                          <div>
                            <div className="font-bold text-white text-sm">{msg.subject}</div>
                            <div className="font-mono-code text-xs text-[#94a3b8]">
                              From: <span className="text-white">{msg.name}</span> ({msg.email})
                            </div>
                          </div>
                          <div className="flex items-center gap-2 font-mono-code text-xs">
                            <span className="text-[#717887]">
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                            <select
                              value={msg.status}
                              onChange={(e) => handleUpdateMessageStatus(msg._id, e.target.value)}
                              className="px-2 py-1 bg-[#16181f] border border-[#282d38] text-white uppercase text-[11px] focus:outline-none"
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                              <option value="archived">Archived</option>
                            </select>
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="p-1 text-[#f87171] hover:text-white"
                              title="Delete message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-line">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 7: SITE & SEO SETTINGS */}
            {/* ------------------------------------------------------------- */}
            {currentTab === 'site' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#22252c]">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Site Settings & SEO</h2>
                    <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                      Search engine optimization tags, canonical URLs, and OpenGraph parameters.
                    </p>
                  </div>
                  <button
                    onClick={saveSiteSettings}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase hover:bg-[#e2e8f0]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </button>
                </div>

                <div className="bg-[#121316] border border-[#22252c] p-6 space-y-4 text-xs font-mono-code">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[#94a3b8] uppercase">Page Title</label>
                      <input
                        type="text"
                        value={data.siteSettings.pageTitle}
                        onChange={(e) =>
                          setData({
                            ...data,
                            siteSettings: { ...data.siteSettings, pageTitle: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#94a3b8] uppercase">Author Name</label>
                      <input
                        type="text"
                        value={data.siteSettings.author}
                        onChange={(e) =>
                          setData({
                            ...data,
                            siteSettings: { ...data.siteSettings, author: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase">Meta Description</label>
                    <textarea
                      rows={2}
                      value={data.siteSettings.metaDescription}
                      onChange={(e) =>
                        setData({
                          ...data,
                          siteSettings: { ...data.siteSettings, metaDescription: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase">SEO Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={data.siteSettings.keywords}
                      onChange={(e) =>
                        setData({
                          ...data,
                          siteSettings: { ...data.siteSettings, keywords: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[#94a3b8] uppercase">Contact Email</label>
                      <input
                        type="email"
                        value={data.siteSettings.email}
                        onChange={(e) =>
                          setData({
                            ...data,
                            siteSettings: { ...data.siteSettings, email: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#94a3b8] uppercase">Contact Phone</label>
                      <input
                        type="text"
                        value={data.siteSettings.phone}
                        onChange={(e) =>
                          setData({
                            ...data,
                            siteSettings: { ...data.siteSettings, phone: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 8: SOCIAL LINKS */}
            {/* ------------------------------------------------------------- */}
            {currentTab === 'social' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#22252c]">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Social Links</h2>
                    <p className="font-mono-code text-xs text-[#94a3b8] mt-1">
                      Update your public social handles and portfolio profiles.
                    </p>
                  </div>
                  <button
                    onClick={saveSocialSettings}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase hover:bg-[#e2e8f0]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Social</span>
                  </button>
                </div>

                <div className="bg-[#121316] border border-[#22252c] p-6 space-y-4 text-xs font-mono-code">
                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={data.socialLinks.github}
                      onChange={(e) =>
                        setData({
                          ...data,
                          socialLinks: { ...data.socialLinks, github: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={data.socialLinks.linkedin}
                      onChange={(e) =>
                        setData({
                          ...data,
                          socialLinks: { ...data.socialLinks, linkedin: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: PROJECT EDITOR (CREATE & EDIT) */}
      {/* ------------------------------------------------------------- */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0e1013] border border-[#262a34] text-[#f3f4f6] shadow-2xl my-8 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#22252c] bg-[#121316]">
              <h3 className="font-bold text-white font-mono-code text-sm uppercase">
                {isCreatingProject ? 'Create New Project' : `Edit: ${editingProject.title}`}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1 text-[#94a3b8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="overflow-y-auto p-6 space-y-4 text-xs font-mono-code">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingProject({
                        ...editingProject,
                        title,
                        slug: isCreatingProject ? slug : editingProject.slug,
                      });
                    }}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, slug: e.target.value.toLowerCase() })
                    }
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Category *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Shipped Year *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.year}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, year: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Role *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.role}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, role: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Short Description (Card) *</label>
                <input
                  type="text"
                  required
                  value={editingProject.shortDescription}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Full Description (Case Study) *</label>
                <textarea
                  rows={4}
                  required
                  value={editingProject.fullDescription}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, fullDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingProject.image}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, image: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Live Website URL</label>
                  <input
                    type="text"
                    value={editingProject.liveUrl}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, liveUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">GitHub URL</label>
                  <input
                    type="text"
                    value={editingProject.githubUrl}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, githubUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={editingProject.technologies.join(', ')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Technical Challenge</label>
                  <textarea
                    rows={2}
                    value={editingProject.challenges}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, challenges: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Architectural Solution</label>
                  <textarea
                    rows={2}
                    value={editingProject.solution}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, solution: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Bento Grid Layout & Position Configuration */}
              <div className="p-4 bg-[#14171e] border border-[#252a35] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-[#222733]">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-white" />
                    <span className="font-bold text-white text-xs uppercase tracking-wider">
                      Grid Layout & Display Position (Bento Grid)
                    </span>
                  </div>
                  <span className="text-[10px] text-[#94a3b8] font-mono-code">
                    Controls card width, height & ordering on live site
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Column Width */}
                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase text-[11px] flex items-center gap-1.5">
                      <Columns className="w-3.5 h-3.5 text-white" />
                      Column Width (Desktop)
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { val: 1, label: '1 Col', desc: '1/3 Width' },
                        { val: 2, label: '2 Cols', desc: '2/3 Wide' },
                        { val: 3, label: '3 Cols', desc: 'Full Banner' },
                      ].map((col) => (
                        <button
                          type="button"
                          key={col.val}
                          onClick={() => setEditingProject({ ...editingProject, colSpan: col.val })}
                          className={`p-2 border text-center transition-all ${
                            (editingProject.colSpan || 1) === col.val
                              ? 'bg-white text-[#0b0c0e] border-white font-bold'
                              : 'bg-[#181b23] text-[#94a3b8] border-[#292e3a] hover:text-white hover:border-[#475569]'
                          }`}
                        >
                          <div className="text-xs">{col.label}</div>
                          <div className="text-[9px] opacity-80">{col.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row Height */}
                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase text-[11px] flex items-center gap-1.5">
                      <Rows className="w-3.5 h-3.5 text-white" />
                      Row Height (Span)
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { val: 1, label: '1 Row', desc: 'Standard' },
                        { val: 2, label: '2 Rows', desc: 'Tall Bento' },
                      ].map((row) => (
                        <button
                          type="button"
                          key={row.val}
                          onClick={() => setEditingProject({ ...editingProject, rowSpan: row.val })}
                          className={`p-2 border text-center transition-all ${
                            (editingProject.rowSpan || 1) === row.val
                              ? 'bg-white text-[#0b0c0e] border-white font-bold'
                              : 'bg-[#181b23] text-[#94a3b8] border-[#292e3a] hover:text-white hover:border-[#475569]'
                          }`}
                        >
                          <div className="text-xs">{row.label}</div>
                          <div className="text-[9px] opacity-80">{row.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display Order Sequence */}
                  <div className="space-y-1.5">
                    <label className="text-[#94a3b8] uppercase text-[11px] flex items-center gap-1.5">
                      <Move className="w-3.5 h-3.5 text-white" />
                      Display Position (Order)
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProject({
                            ...editingProject,
                            displayOrder: Math.max(1, (editingProject.displayOrder || 1) - 1),
                          })
                        }
                        className="px-3 py-2 bg-[#181b23] border border-[#292e3a] text-white hover:bg-[#252936] font-bold"
                        title="Decrease position number"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={editingProject.displayOrder || 1}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            displayOrder: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                        className="w-full px-2 py-2 bg-[#16181f] border border-[#22252c] text-white text-center font-bold focus:outline-none focus:border-white font-mono-code"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProject({
                            ...editingProject,
                            displayOrder: (editingProject.displayOrder || 1) + 1,
                          })
                        }
                        className="px-3 py-2 bg-[#181b23] border border-[#292e3a] text-white hover:bg-[#252936] font-bold"
                        title="Increase position number"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-[10px] text-[#717887]">
                      Pos #1 appears first in the portfolio section
                    </p>
                  </div>
                </div>

                {/* Visual Live Grid Preview */}
                <div className="pt-3 border-t border-[#222733]">
                  <div className="text-[10px] uppercase font-mono-code text-[#717887] mb-2 flex items-center justify-between">
                    <span>Live Visual Bento Layout Preview (Desktop 3-Columns Grid):</span>
                    <span className="text-white font-bold">
                      {(editingProject.colSpan || 1)} Col{(editingProject.colSpan || 1) > 1 ? 's' : ''} × {(editingProject.rowSpan || 1)} Row{(editingProject.rowSpan || 1) > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 h-20 p-2 bg-[#0b0c0e] border border-[#1f242e]">
                    <div
                      className={`border text-[11px] font-mono-code font-bold flex flex-col items-center justify-center transition-all p-1 text-center ${
                        (editingProject.colSpan || 1) === 3
                          ? 'col-span-3'
                          : (editingProject.colSpan || 1) === 2
                          ? 'col-span-2'
                          : 'col-span-1'
                      } ${
                        (editingProject.rowSpan || 1) === 2 ? 'row-span-2' : 'row-span-1'
                      } bg-white text-[#0b0c0e] border-white`}
                    >
                      <span className="truncate max-w-[90%] font-bold">
                        {editingProject.title || 'This Project'}
                      </span>
                      <span className="text-[9px] opacity-75">
                        [Span: {(editingProject.colSpan || 1)}x{(editingProject.rowSpan || 1)}]
                      </span>
                    </div>

                    {/* Surrounding ghost indicator */}
                    {(editingProject.colSpan || 1) < 3 && (
                      <div
                        className={`border border-dashed border-[#2b303b] text-[#555e6d] text-[10px] font-mono-code flex items-center justify-center p-1 ${
                          (editingProject.colSpan || 1) === 2 ? 'col-span-1' : 'col-span-2'
                        }`}
                      >
                        Other Project Cards
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.published}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, published: e.target.checked })
                    }
                    className="w-4 h-4 accent-white"
                  />
                  <span>Published to live site</span>
                </label>

                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-white"
                  />
                  <span>Featured project</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#22252c] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-[#16181f] border border-[#22252c] text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-[#0b0c0e] font-bold uppercase hover:bg-[#e2e8f0]"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: SKILL EDITOR */}
      {/* ------------------------------------------------------------- */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0e1013] border border-[#262a34] p-6 space-y-4 text-xs font-mono-code">
            <div className="flex items-center justify-between pb-3 border-b border-[#22252c]">
              <h3 className="font-bold text-white text-sm uppercase">
                {isCreatingSkill ? 'Add Technical Skill' : 'Edit Skill'}
              </h3>
              <button onClick={() => setEditingSkill(null)} className="text-[#94a3b8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Category</label>
                <select
                  value={editingSkill.category}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, category: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database & Tools">Database & Tools</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Proficiency Level</label>
                  <input
                    type="text"
                    value={editingSkill.level}
                    onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Experience</label>
                  <input
                    type="text"
                    value={editingSkill.yearsOfExperience}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, yearsOfExperience: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="skill-featured"
                  checked={editingSkill.featured}
                  onChange={(e) => setEditingSkill({ ...editingSkill, featured: e.target.checked })}
                  className="w-4 h-4 accent-white"
                />
                <label htmlFor="skill-featured" className="text-white cursor-pointer">
                  Featured Core Skill
                </label>
              </div>

              <div className="pt-3 border-t border-[#22252c] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-3 py-1.5 bg-[#16181f] text-[#94a3b8]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-1.5 bg-white text-[#0b0c0e] font-bold">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EXPERIENCE EDITOR (CREATE & EDIT) */}
      {/* ------------------------------------------------------------- */}
      {editingExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0e1013] border border-[#262a34] p-6 space-y-4 text-xs font-mono-code max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#22252c]">
              <h3 className="font-bold text-white text-sm uppercase">
                {isCreatingExperience ? 'Add Experience' : 'Edit Experience'}
              </h3>
              <button onClick={() => setEditingExperience(null)} className="text-[#94a3b8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.role}
                    onChange={(e) => setEditingExperience({ ...editingExperience, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                    placeholder="Full Stack Web Developer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Company / Client *</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.company}
                    onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                    placeholder="Freelance & Production Shipping"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Location</label>
                  <input
                    type="text"
                    value={editingExperience.location}
                    onChange={(e) => setEditingExperience({ ...editingExperience, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                    placeholder="Delhi, India"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Start Date *</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.startDate}
                    onChange={(e) => setEditingExperience({ ...editingExperience, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                    placeholder="2023"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">End Date</label>
                  <input
                    type="text"
                    value={editingExperience.endDate}
                    onChange={(e) => setEditingExperience({ ...editingExperience, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                    placeholder="Present"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="exp-current"
                  checked={editingExperience.currentJob}
                  onChange={(e) => setEditingExperience({ ...editingExperience, currentJob: e.target.checked })}
                  className="w-4 h-4 accent-white"
                />
                <label htmlFor="exp-current" className="text-white cursor-pointer">
                  Currently working in this position
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingExperience.description}
                  onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Key Responsibilities (one per line)</label>
                <textarea
                  rows={3}
                  value={editingExperience.responsibilities.join('\n')}
                  onChange={(e) =>
                    setEditingExperience({
                      ...editingExperience,
                      responsibilities: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                  placeholder="Engineered full-stack features&#10;Maintained 100% on-time delivery"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={editingExperience.technologies.join(', ')}
                  onChange={(e) =>
                    setEditingExperience({
                      ...editingExperience,
                      technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                  placeholder="React, Node.js, Express, MongoDB"
                />
              </div>

              <div className="pt-3 border-t border-[#22252c] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingExperience(null)}
                  className="px-3 py-1.5 bg-[#16181f] text-[#94a3b8]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-1.5 bg-white text-[#0b0c0e] font-bold">
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDUCATION EDITOR (CREATE & EDIT) */}
      {/* ------------------------------------------------------------- */}
      {editingEducation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0e1013] border border-[#262a34] p-6 space-y-4 text-xs font-mono-code max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#22252c]">
              <h3 className="font-bold text-white text-sm uppercase">
                {isCreatingEducation ? 'Add Education' : 'Edit Education'}
              </h3>
              <button onClick={() => setEditingEducation(null)} className="text-[#94a3b8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEducation} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Degree / Diploma *</label>
                  <input
                    type="text"
                    required
                    value={editingEducation.degree}
                    onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                    placeholder="Bachelor of Computer Applications (BCA)"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Field of Study *</label>
                  <input
                    type="text"
                    required
                    value={editingEducation.field}
                    onChange={(e) => setEditingEducation({ ...editingEducation, field: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                    placeholder="Computer Science & Software Development"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Institution / University *</label>
                <input
                  type="text"
                  required
                  value={editingEducation.institution}
                  onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                  placeholder="Indira Gandhi National Open University (IGNOU)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Location</label>
                  <input
                    type="text"
                    value={editingEducation.location}
                    onChange={(e) => setEditingEducation({ ...editingEducation, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                    placeholder="New Delhi, India"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Start Year *</label>
                  <input
                    type="text"
                    required
                    value={editingEducation.startYear}
                    onChange={(e) => setEditingEducation({ ...editingEducation, startYear: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">End Year *</label>
                  <input
                    type="text"
                    required
                    value={editingEducation.endYear}
                    onChange={(e) => setEditingEducation({ ...editingEducation, endYear: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                    placeholder="2027"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Grade / Status</label>
                <input
                  type="text"
                  value={editingEducation.grade || ''}
                  onChange={(e) => setEditingEducation({ ...editingEducation, grade: e.target.value })}
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                  placeholder="e.g. In Progress (Active Student) or 8.5 CGPA"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Description</label>
                <textarea
                  rows={3}
                  value={editingEducation.description}
                  onChange={(e) => setEditingEducation({ ...editingEducation, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                  placeholder="Key coursework, achievements, or project experience during study"
                />
              </div>

              <div className="pt-3 border-t border-[#22252c] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEducation(null)}
                  className="px-3 py-1.5 bg-[#16181f] text-[#94a3b8]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-1.5 bg-white text-[#0b0c0e] font-bold">
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CERTIFICATION & AWARD EDITOR (CREATE & EDIT) */}
      {/* ------------------------------------------------------------- */}
      {editingCertification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0e1013] border border-[#262a34] p-6 space-y-4 text-xs font-mono-code max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#22252c]">
              <h3 className="font-bold text-white text-sm uppercase">
                {isCreatingCertification ? 'Add Certification / Award' : 'Edit Certification / Award'}
              </h3>
              <button onClick={() => setEditingCertification(null)} className="text-[#94a3b8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCertification} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Name / Title *</label>
                <input
                  type="text"
                  required
                  value={editingCertification.name}
                  onChange={(e) => setEditingCertification({ ...editingCertification, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                  placeholder="Best Website Development Award"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Issuer / Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingCertification.issuer}
                    onChange={(e) => setEditingCertification({ ...editingCertification, issuer: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                    placeholder="Technical Web Innovation Summit"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#94a3b8] uppercase">Issue Date / Year *</label>
                  <input
                    type="text"
                    required
                    value={editingCertification.issueDate}
                    onChange={(e) => setEditingCertification({ ...editingCertification, issueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cert-award"
                  checked={editingCertification.isAward}
                  onChange={(e) => setEditingCertification({ ...editingCertification, isAward: e.target.checked })}
                  className="w-4 h-4 accent-white"
                />
                <label htmlFor="cert-award" className="text-white cursor-pointer">
                  This is an Award or Honors recognition
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Certificate URL (Optional)</label>
                <input
                  type="url"
                  value={editingCertification.certificateUrl || ''}
                  onChange={(e) => setEditingCertification({ ...editingCertification, certificateUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] uppercase">Description</label>
                <textarea
                  rows={3}
                  value={editingCertification.description}
                  onChange={(e) => setEditingCertification({ ...editingCertification, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#16181f] border border-[#22252c] text-white focus:outline-none"
                  placeholder="Brief description of the achievement or course content"
                />
              </div>

              <div className="pt-3 border-t border-[#22252c] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCertification(null)}
                  className="px-3 py-1.5 bg-[#16181f] text-[#94a3b8]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-1.5 bg-white text-[#0b0c0e] font-bold">
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION DIALOG (Requirement 63) */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0e1013] border border-[#442327] p-6 space-y-4 text-xs font-mono-code">
            <div className="flex items-center gap-2 text-[#f87171] font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Permanent Deletion</span>
            </div>
            <p className="text-[#cbd5e1]">
              Are you sure you want to delete {deleteConfirmItem.type.toLowerCase()}:{' '}
              <strong className="text-white">"{deleteConfirmItem.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-3 py-1.5 bg-[#16181f] border border-[#22252c] text-[#cbd5e1] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmItem.type === 'Project') {
                    handleDeleteProject(deleteConfirmItem.id);
                  } else if (deleteConfirmItem.type === 'Skill') {
                    handleDeleteSkill(deleteConfirmItem.id);
                  } else if (deleteConfirmItem.type === 'Experience') {
                    handleDeleteExperience(deleteConfirmItem.id);
                  } else if (deleteConfirmItem.type === 'Education') {
                    handleDeleteEducation(deleteConfirmItem.id);
                  } else if (deleteConfirmItem.type === 'Certification') {
                    handleDeleteCertification(deleteConfirmItem.id);
                  }
                }}
                className="px-4 py-1.5 bg-[#ef4444] text-white font-bold hover:bg-[#dc2626]"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
