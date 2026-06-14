'use strict';
'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle, Settings, Phone, Palette, Mail, Globe } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminSettingsManager() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Form states map
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api.getSettings();
        setSettings(data);
        const initialValues = data.reduce((acc, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {} as Record<string, string>);
        setValues(initialValues);
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await api.updateSettingsBulk(values);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update settings bulk', err);
      alert('Failed to save settings.');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-brand-black/5 w-1/4" />
        <div className="h-96 bg-brand-black/5 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-brand-gold text-[10px] font-sans font-bold tracking-[0.2em] uppercase block mb-1">
          System Control
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-black uppercase tracking-wider">
          Global Settings
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-brand-gold/15 p-6 md:p-8 shadow-sm space-y-8 max-w-4xl">
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Global site settings updated successfully!
          </div>
        )}

        {/* 1. Brand Aesthetics & Identity */}
        <div className="space-y-6">
          <h3 className="font-serif text-sm font-bold text-brand-black uppercase tracking-wider border-b border-brand-gold/10 pb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-gold" />
            Brand Aesthetics & Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                Site Name
              </label>
              <input
                type="text"
                value={values['site_name'] || ''}
                onChange={(e) => handleInputChange('site_name', e.target.value)}
                className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                Primary Brand Color (Deep Black)
              </label>
              <input
                type="text"
                value={values['brand_color_primary'] || ''}
                onChange={(e) => handleInputChange('brand_color_primary', e.target.value)}
                className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                Secondary Brand Color (Champagne Gold)
              </label>
              <input
                type="text"
                value={values['brand_color_secondary'] || ''}
                onChange={(e) => handleInputChange('brand_color_secondary', e.target.value)}
                className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                Accent Brand Color (Ivory White)
              </label>
              <input
                type="text"
                value={values['brand_color_accent'] || ''}
                onChange={(e) => handleInputChange('brand_color_accent', e.target.value)}
                className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold"
              />
            </div>
          </div>
        </div>

        {/* 2. Contact Channels */}
        <div className="space-y-6">
          <h3 className="font-serif text-sm font-bold text-brand-black uppercase tracking-wider border-b border-brand-gold/10 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-gold" />
            Contact Channels & Integrations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                WhatsApp Phone Number
              </label>
              <input
                type="text"
                value={values['whatsapp_number'] || ''}
                onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                Support Email
              </label>
              <input
                type="email"
                value={values['contact_email'] || ''}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                Instagram Handle
              </label>
              <input
                type="text"
                value={values['instagram_handle'] || ''}
                onChange={(e) => handleInputChange('instagram_handle', e.target.value)}
                className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold"
              />
            </div>
          </div>
        </div>

        {/* 3. Global SEO Defaults */}
        <div className="space-y-6">
          <h3 className="font-serif text-sm font-bold text-brand-black uppercase tracking-wider border-b border-brand-gold/10 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-gold" />
            Global SEO Defaults
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                Default Meta Title
              </label>
              <input
                type="text"
                value={values['seo_default_title'] || ''}
                onChange={(e) => handleInputChange('seo_default_title', e.target.value)}
                className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                Default Meta Description
              </label>
              <textarea
                rows={3}
                value={values['seo_default_description'] || ''}
                onChange={(e) => handleInputChange('seo_default_description', e.target.value)}
                className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs p-2.5 outline-none focus:border-brand-gold resize-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-brand-gold/10">
          <button
            type="submit"
            className="px-6 py-3.5 bg-brand-gold text-brand-black hover:bg-brand-black hover:text-brand-ivory transition-all duration-500 font-sans font-bold uppercase tracking-wider text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
