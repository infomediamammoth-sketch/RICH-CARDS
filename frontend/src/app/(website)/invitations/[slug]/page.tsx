'use strict';
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Share2,
  Video,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  const [template, setTemplate] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState<'image' | 'video'>('image');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Inquiry Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadTemplate() {
      setLoading(true);
      try {
        const data = await api.getTemplate(slug);
        setTemplate(data);
        if (data.previewVideoUrl) {
          setActiveMedia('video');
        }
        const relatedData = await api.getRelatedTemplates(data.id);
        setRelated(relatedData);
      } catch (err) {
        console.error('Failed to load template details', err);
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 animate-pulse space-y-8 bg-[#FDFBF7]">
        <div className="h-6 bg-brand-black/5 w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-brand-black/5 aspect-[3/4]" />
          <div className="space-y-6">
            <div className="h-8 bg-brand-black/5 w-3/4" />
            <div className="h-4 bg-brand-black/5 w-1/2" />
            <div className="h-24 bg-brand-black/5 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center bg-[#FDFBF7]">
        <h2 className="font-serif text-2xl font-bold text-brand-black mb-4">
          Template Not Found
        </h2>
        <Link href="/invitations" className="text-xs uppercase font-sans tracking-widest text-brand-gold font-bold">
          Return to Gallery
        </Link>
      </div>
    );
  }

  // Handle WhatsApp inquiry + CRM Lead creation
  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    try {
      // 1. Save Lead in CRM
      await api.createLead({
        name,
        phone,
        templateId: template.id,
        source: 'WhatsApp Detail Form',
        notes: `User inquired on detail page: ${template.title}`,
      });

      setSuccess(true);

      // 2. Open WhatsApp Redirect Link
      const waNumber = '919016705775';
      const textMessage = `Hello RichCards,\n\nI am interested in this wedding invitation template.\n\nTemplate Name:\n${template.title}\n\nMy Details:\nName: ${name}\nPhone: ${phone}\n\nPlease share details.`;
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(textMessage)}`;

      // Delay slightly for visual success confirmation
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 800);
    } catch (err) {
      console.error('Failed to register lead', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Build schema markup JSON
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': template.title,
    'description': template.description,
    'image': template.imageUrls,
    'offers': {
      '@type': 'Offer',
      'price': template.price,
      'priceCurrency': 'INR',
      'availability': 'https://schema.org/InStock',
    },
  };

  // Get preview video file path. Serves local videos statically from /uploads
  const videoSrc = template.previewVideoUrl?.startsWith('/')
    ? template.previewVideoUrl
    : `/uploads/general/${template.previewVideoUrl}`;

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      {/* JSON-LD Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/invitations"
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-brand-black hover:text-brand-gold transition-colors mb-8"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Gallery
        </Link>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Media Viewer */}
          <div className="space-y-6">
            <div className="relative aspect-[3/4] bg-brand-gray border border-brand-gold/15 overflow-hidden flex items-center justify-center">
              {activeMedia === 'video' && template.previewVideoUrl ? (
                <video
                  src={videoSrc}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${
                      template.imageUrls?.[activeImageIndex] || '/templates/royal_thumb.jpg'
                    })`,
                  }}
                />
              )}

              {/* Watermark Overlay (Mock representation if watermarked) */}
              {template.watermarked && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none opacity-20">
                  <span className="font-serif text-3xl font-bold tracking-[0.4em] uppercase text-brand-black -rotate-45">
                    RichCards
                  </span>
                </div>
              )}
            </div>

            {/* Media Toggles / Carousels */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {template.previewVideoUrl && (
                <button
                  onClick={() => setActiveMedia('video')}
                  className={`w-20 aspect-[3/4] bg-brand-black/5 border relative flex items-center justify-center shrink-0 transition-colors ${
                    activeMedia === 'video' ? 'border-brand-gold' : 'border-brand-gold/10 hover:border-brand-gold/40'
                  }`}
                >
                  <Video className="w-6 h-6 text-brand-gold" />
                  <span className="absolute bottom-1 text-[8px] font-sans font-bold text-brand-gold uppercase tracking-wider">
                    Video
                  </span>
                </button>
              )}

              {template.imageUrls?.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveMedia('image');
                    setActiveImageIndex(idx);
                  }}
                  className={`w-20 aspect-[3/4] bg-cover bg-center border shrink-0 transition-colors ${
                    activeMedia === 'image' && activeImageIndex === idx
                      ? 'border-brand-gold'
                      : 'border-brand-gold/10 hover:border-brand-gold/40'
                  }`}
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Descriptions & Inquiry Checkout */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-brand-gold text-[10px] font-sans font-semibold tracking-widest uppercase block">
                {template.category?.name}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-black leading-tight">
                {template.title}
              </h1>
              <div className="flex items-center justify-between border-y border-brand-gold/15 py-3">
                <span className="text-xs text-brand-black/50 font-sans">Special Studio Price</span>
                <span className="text-2xl font-serif font-bold text-brand-gold">₹{template.price}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-serif text-xs font-bold text-brand-black uppercase tracking-wide">
                Description
              </h3>
              <p className="text-xs text-brand-black/70 leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Formats Included */}
            <div className="space-y-3">
              <h3 className="font-serif text-xs font-bold text-brand-black uppercase tracking-wide">
                Delivery Formats Included
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-brand-gold/10 p-3 flex items-center gap-2">
                  <Video className="w-4 h-4 text-brand-gold" />
                  <span className="text-[10px] font-sans font-bold">MP4 Video</span>
                </div>
                <div className="border border-brand-gold/10 p-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-brand-gold" />
                  <span className="text-[10px] font-sans font-bold">JPG Images</span>
                </div>
                <div className="border border-brand-gold/10 p-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-gold" />
                  <span className="text-[10px] font-sans font-bold">Interactive PDF</span>
                </div>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-3">
              <h3 className="font-serif text-xs font-bold text-brand-black uppercase tracking-wide">
                Customization Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-black/70">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  Monogram Tailoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  Text & Date Personalization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  Music/Audio Track Swap
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  Itinerary & Map Links
                </li>
              </ul>
            </div>

            {/* WhatsApp Inquiry Form */}
            <div className="bg-white border border-brand-gold/15 p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-sm font-bold text-brand-black uppercase tracking-wider border-b border-brand-gold/10 pb-3">
                WhatsApp Inquiry Form
              </h3>
              <form onSubmit={handleInquiry} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 90000 00000"
                    className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-brand-gold text-brand-black hover:bg-brand-black hover:text-brand-ivory transition-all duration-500 font-sans font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Redirecting...'
                  ) : success ? (
                    <>
                      <Check className="w-4 h-4" />
                      Inquiry Captured!
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4.5 h-4.5" />
                      Inquire on WhatsApp
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sharing & Utilities */}
            <div className="flex items-center space-x-4 border-t border-brand-gold/10 pt-4">
              <span className="text-[10px] uppercase font-sans tracking-widest text-brand-black/40 font-semibold">
                Share Design
              </span>
              <button
                onClick={copyLink}
                className="p-2 border border-brand-gold/10 hover:border-brand-gold/45 text-brand-black hover:text-brand-gold transition-colors flex items-center gap-1.5 text-xs font-medium"
                aria-label="Copy Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-gold" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>

        {/* Related Templates Module */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-brand-gold/15 pt-12 space-y-8">
            <h2 className="font-serif text-2xl font-bold text-brand-black text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/invitations/${item.slug}`}
                  className="group flex flex-col bg-white border border-brand-gold/10 hover-gold transition-all duration-500 overflow-hidden"
                >
                  <div className="relative aspect-[3/4] bg-brand-gray overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: `url(${
                          item.imageUrls?.[0] || '/templates/royal_thumb.jpg'
                        })`,
                      }}
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <h3 className="font-serif text-sm font-bold text-brand-black group-hover:text-brand-gold transition-colors leading-tight mb-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-brand-gold/5">
                      <span className="text-[10px] font-sans font-bold text-brand-gold">₹{item.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
