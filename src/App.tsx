import React, { useState, useEffect } from 'react';
import { PortfolioFullData } from './types.js';
import { initialPortfolioData } from './data/initialData.js';
import { Navbar } from './components/portfolio/Navbar.js';
import { HeroSection } from './components/portfolio/HeroSection.js';
import { ProjectsSection } from './components/portfolio/ProjectsSection.js';
import { SkillsSection } from './components/portfolio/SkillsSection.js';
import { ExperienceSection } from './components/portfolio/ExperienceSection.js';
import { AboutSection } from './components/portfolio/AboutSection.js';
import { ContactSection } from './components/portfolio/ContactSection.js';
import { Footer } from './components/portfolio/Footer.js';
import { AdminLogin } from './components/admin/AdminLogin.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';

export function App() {
  const [data, setData] = useState<PortfolioFullData>(initialPortfolioData);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'portfolio' | 'admin'>('portfolio');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Check URL query / path for admin shortcut (e.g. ?admin=true or #admin)
  useEffect(() => {
    if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
      setCurrentView('admin');
    }
  }, []);

  // Fetch portfolio data from /api/portfolio
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to fetch dynamic portfolio, using local seed mirror:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
    checkAuth();
  }, []);

  // Check existing session
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const json = await res.json();
        setAdminUser(json.user);
      }
    } catch {
      // Not logged in
    }
  };

  const handleLoginSuccess = (user: any, token: string) => {
    setAdminUser(user);
    setAuthToken(token);
    setCurrentView('admin');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignored
    }
    setAdminUser(null);
    setAuthToken(null);
    setCurrentView('portfolio');
  };

  // SEO: Update page title and meta description dynamically
  useEffect(() => {
    if (data.siteSettings) {
      document.title = data.siteSettings.pageTitle || 'Sumit Shrivastav — Full Stack Developer';

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && data.siteSettings.metaDescription) {
        metaDesc.setAttribute('content', data.siteSettings.metaDescription);
      }

      // Inject JSON-LD structured data (Requirement 55)
      const existingScript = document.getElementById('json-ld-portfolio');
      if (existingScript) {
        existingScript.remove();
      }

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: data.siteSettings.author || 'Sumit Shrivastav',
        jobTitle: data.siteSettings.title || 'Full Stack Developer',
        url: window.location.origin,
        sameAs: [
          data.socialLinks.github,
          data.socialLinks.linkedin,
        ].filter(Boolean),
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Delhi',
          postalCode: '110059',
          addressCountry: 'India',
        },
        knowsAbout: data.skills.map((s) => s.name),
      };

      const script = document.createElement('script');
      script.id = 'json-ld-portfolio';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [data.siteSettings, data.socialLinks, data.skills]);

  // Handle Admin View
  if (currentView === 'admin') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToSite={() => setCurrentView('portfolio')}
        />
      );
    }

    return (
      <AdminDashboard
        initialData={data}
        onLogout={handleLogout}
        onViewSite={() => setCurrentView('portfolio')}
        onDataUpdated={(updatedData) => setData(updatedData)}
      />
    );
  }

  // Public Portfolio View
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0b0c0e] text-[#f3f4f6] selection:bg-white selection:text-black">
      {/* Dynamic Navbar */}
      <Navbar
        navigation={data.navigation}
        siteSettings={data.siteSettings}
        socialLinks={data.socialLinks}
        onOpenAdmin={() => setCurrentView('admin')}
        isAdminLoggedIn={!!adminUser}
      />

      {/* Main Content Sections */}
      <main id="main-content" className="w-full max-w-full overflow-x-hidden">
        {/* Hero Section with 3D Canvas */}
        <HeroSection hero={data.hero} siteSettings={data.siteSettings} />
        {/* About Section - with real project count sync */}
        <AboutSection about={data.about} projects={data.projects} />
        {/* Technical Skills Matrix */}
        <SkillsSection skills={data.skills} />
        {/* Selected Projects */}
        <ProjectsSection projects={data.projects} />

    

        {/* Experience, Education & Certifications */}
        <ExperienceSection
          experience={data.experience}
          education={data.education}
          certifications={data.certifications}
        />

      

        {/* Direct Channel Contact Form */}
        <ContactSection
          siteSettings={data.siteSettings}
          socialLinks={data.socialLinks}
        />
      </main>

      {/* Footer */}
      <Footer
        siteSettings={data.siteSettings}
        socialLinks={data.socialLinks}
        onOpenAdmin={() => setCurrentView('admin')}
      />
    </div>
  );
}

export default App;
