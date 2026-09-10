import React, { useState } from 'react';
import { SiteSettingsData, SocialLinksData } from '../../types.js';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Github, Linkedin, Clock } from 'lucide-react';

interface ContactSectionProps {
  siteSettings: SiteSettingsData;
  socialLinks: SocialLinksData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  siteSettings,
  socialLinks,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // Honeypot field
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to transmit message.');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        website: '',
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0b0c0e] border-t border-[#1a1d24]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 pb-6 border-b border-[#1f232b]">
          <div className="flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#94a3b8] mb-2">
            <span className="w-2 h-2 bg-white" />
            DIRECT CHANNEL // SECURE INQUIRY
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase font-sans break-words">
            Initiate Conversation
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-2 max-w-2xl">
            Currently available for engineering roles, high-impact contract development, and technical consulting. Messages route directly to my inbox with automated receipt.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column: Direct Info & Availability */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121316] border border-[#22252c] p-4 sm:p-6 space-y-6">
              <div>
                <span className="font-mono-code text-xs text-[#717887] uppercase tracking-wider">
                  DIRECT CONTACT //
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Sumit Shrivastav</h3>
                <p className="font-mono-code text-xs text-[#94a3b8] mt-0.5">
                  Full Stack MERN & Next.js Engineer
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 text-xs font-mono-code">
                <a
                  href={`mailto:${siteSettings.email || 'sumit9354800@gmail.com'}`}
                  className="flex items-center gap-3 p-3 bg-[#16181f] border border-[#22252c] text-[#cbd5e1] hover:text-white hover:border-[#383e4c] transition-colors"
                >
                  <Mail className="w-4 h-4 text-white shrink-0" />
                  <span className="truncate">{siteSettings.email || 'sumit9354800@gmail.com'}</span>
                </a>

                <a
                  href={`tel:${siteSettings.phone || '+919354800375'}`}
                  className="flex items-center gap-3 p-3 bg-[#16181f] border border-[#22252c] text-[#cbd5e1] hover:text-white hover:border-[#383e4c] transition-colors"
                >
                  <Phone className="w-4 h-4 text-white shrink-0" />
                  <span className="truncate">{siteSettings.phone || '+91 9354800375'}</span>
                </a>

                <div className="flex items-center gap-3 p-3 bg-[#16181f] border border-[#22252c] text-[#cbd5e1]">
                  <MapPin className="w-4 h-4 text-white shrink-0" />
                  <span className="break-words">{siteSettings.location || 'Uttam Nagar, Delhi – 110059'}</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-[#1e222b]">
                <div className="font-mono-code text-[11px] text-[#717887] uppercase mb-3">
                  AUTHENTICATED PROFILES //
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {socialLinks.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2.5 bg-[#16181f] border border-[#22252c] text-xs text-[#cbd5e1] hover:text-white hover:border-[#383e4c] transition-colors font-mono-code"
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
                      className="flex items-center gap-2 p-2.5 bg-[#16181f] border border-[#22252c] text-xs text-[#cbd5e1] hover:text-white hover:border-[#383e4c] transition-colors font-mono-code"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Status Box */}
              <div className="p-3.5 bg-[#16181f] border border-[#22252c] flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#10b981]" />
                <div className="text-xs">
                  <div className="text-white font-semibold">Typical Response Time</div>
                  <div className="font-mono-code text-[#717887] text-[11px]">Within 4-8 hours</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#121316] border border-[#22252c] p-4 sm:p-6 md:p-8">
              <form onSubmit={handleSubmit} id="contact-form" className="space-y-4">
                {/* Honeypot anti-spam field */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="block font-mono-code text-xs text-[#94a3b8] uppercase"
                    >
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#16181f] border border-[#22252c] text-xs sm:text-sm text-white placeholder-[#525a6b] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="block font-mono-code text-xs text-[#94a3b8] uppercase"
                    >
                      Your Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#16181f] border border-[#22252c] text-xs sm:text-sm text-white placeholder-[#525a6b] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-subject"
                    className="block font-mono-code text-xs text-[#94a3b8] uppercase"
                  >
                    Subject / Topic *
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder="Project Inquiry / Engineering Role / Collaboration"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#16181f] border border-[#22252c] text-xs sm:text-sm text-white placeholder-[#525a6b] focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="block font-mono-code text-xs text-[#94a3b8] uppercase"
                  >
                    Message Body *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Tell me about your product specifications, timeline, or engineering opportunity..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#16181f] border border-[#22252c] text-xs sm:text-sm text-white placeholder-[#525a6b] focus:outline-none focus:border-white transition-colors resize-y"
                  />
                </div>

                {/* Status Banners */}
                {status === 'success' && (
                  <div
                    id="contact-success-banner"
                    className="flex items-center gap-2.5 p-3.5 bg-[#10b981]/10 border border-[#10b981] text-[#10b981] text-xs font-mono-code"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Message sent successfully. Thank you for reaching out!</span>
                  </div>
                )}

                {status === 'error' && (
                  <div
                    id="contact-error-banner"
                    className="flex items-center gap-2.5 p-3.5 bg-[#ef4444]/10 border border-[#ef4444] text-[#f87171] text-xs font-mono-code"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage || 'Something went wrong. Please try again.'}</span>
                  </div>
                )}

                {/* Submit Button (Solid white on dark, strictly no gradients) */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  disabled={status === 'sending'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#0b0c0e] font-mono-code text-xs font-bold uppercase tracking-wider hover:bg-[#e2e8f0] disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === 'sending' ? 'Sending...' : 'Transmit Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
