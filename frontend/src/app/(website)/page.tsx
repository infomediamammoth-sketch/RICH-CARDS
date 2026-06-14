'use strict';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  MessageCircle,
  Clock,
  Sparkles,
  Award,
  Video,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  FileJson,
} from 'lucide-react';
import { api } from '@/lib/api';

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function HomePage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredTemplates, setFeaturedTemplates] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Load dynamic data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [bannersData, categoriesData, templatesData, testimonialsData, blogsData] = await Promise.all([
          api.getBanners().catch(() => []),
          api.getCategories().catch(() => []),
          api.getTemplates({ limit: 4 }).catch(() => ({ items: [] })),
          api.getFeaturedTestimonials().catch(() => []),
          api.getBlogs().catch(() => []),
        ]);

        setBanners(bannersData.length ? bannersData : defaultBanners);
        setCategories(categoriesData.length ? categoriesData : defaultCategories);
        setFeaturedTemplates(templatesData.items.length ? templatesData.items : defaultTemplates);
        setTestimonials(testimonialsData.length ? testimonialsData : defaultTestimonials);
        setBlogs(blogsData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home page data', err);
      }
    }
    loadData();
  }, []);

  // Hero auto-scroll
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const defaultBanners = [
    {
      title: 'Luxury Digital Wedding Invitation Cards',
      subtitle: 'Create dynamic experiences. Share with your guests in high definition via WhatsApp.',
      ctaText: 'Browse Templates',
      ctaLink: '/invitations',
      imageUrl: '/placeholder-hero.jpg',
    },
    {
      title: 'Premium Handcrafted Monograms',
      subtitle: 'Celebrate your union with personalized custom brand marks and monograms.',
      ctaText: 'Design Monogram',
      ctaLink: '/invitations?category=monograms',
      imageUrl: '/placeholder-monogram.jpg',
    },
  ];

  const defaultCategories = [
    { id: '1', name: 'Wedding Invitations', slug: 'wedding-invitations', icon: 'Sparkles' },
    { id: '2', name: 'Save The Date', slug: 'save-the-date', icon: 'Clock' },
    { id: '3', name: 'Monograms', slug: 'monograms', icon: 'Award' },
    { id: '4', name: 'Wardrobe Planners', slug: 'wardrobe-planners', icon: 'FileText' },
  ];

  const defaultTemplates = [
    {
      id: 't1',
      title: 'Royal Gold Video Invitation',
      slug: 'royal-gold-video-invitation',
      price: '2499',
      imageUrls: ['/templates/royal_thumb.jpg'],
      category: { name: 'Wedding Invitation' },
    },
    {
      id: 't2',
      title: 'Classic Floral Save The Date',
      slug: 'classic-floral-save-the-date',
      price: '1499',
      imageUrls: ['/templates/floral_thumb.jpg'],
      category: { name: 'Save The Date' },
    },
    {
      id: 't3',
      title: 'Empress Custom Monogram Sign',
      slug: 'empress-custom-monogram-sign',
      price: '999',
      imageUrls: ['/templates/monogram_thumb.jpg'],
      category: { name: 'Monograms' },
    },
    {
      id: 't4',
      title: 'Lux Wardrobe Planner Deck',
      slug: 'lux-wardrobe-planner-deck',
      price: '1999',
      imageUrls: ['/templates/wardrobe_thumb.jpg'],
      category: { name: 'Wardrobe Planners' },
    },
  ];

  const defaultTestimonials = [
    {
      id: '1',
      name: 'Aditya & Ritu',
      message: 'The video invitation was stunning! All our guests called us to ask who designed it. RichCards has set a benchmark in wedding stationery.',
      rating: 5,
    },
    {
      id: '2',
      name: 'Sneha Shah',
      message: 'I purchased the custom monogram and save-the-date cards. The attention to detail is Apple-level. Extremely professional team!',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'How do I customize my wedding invitation template?',
      a: 'Once you choose a template and inquire via WhatsApp, our team will reach out to gather your wedding details (names, dates, location, themes). We will customize the colors, text, and audio and share the final invitation files.',
    },
    {
      q: 'What is the delivery turnaround time?',
      a: 'Standard turnaround is 2-4 business days. Express delivery is available within 24 hours for urgent invitations.',
    },
    {
      q: 'Can I add multiple languages to my invite?',
      a: 'Yes! We support multi-language versions including English, Hindi, Gujarati, Marathi, and custom translations as requested.',
    },
    {
      q: 'What formats will I receive?',
      a: 'Depending on the template, you will receive MP4 Video (Full HD), PDF (perfect for links and detailed maps), or high-resolution JPG/PNG images.',
    },
  ];

  const instagramPosts = [
    { id: 1, img: '/insta1.jpg', link: 'https://www.instagram.com/richcardsindia' },
    { id: 2, img: '/insta2.jpg', link: 'https://www.instagram.com/richcardsindia' },
    { id: 3, img: '/insta3.jpg', link: 'https://www.instagram.com/richcardsindia' },
    { id: 4, img: '/insta4.jpg', link: 'https://www.instagram.com/richcardsindia' },
  ];

  return (
    <div className="bg-[#FDFBF7] text-brand-black overflow-x-hidden">
      {/* 1. Hero Banner Slider */}
      <section className="relative h-[85vh] md:h-[90vh] bg-brand-black overflow-hidden">
        {banners.length > 0 && (
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.85)), url(${banners[activeSlide]?.imageUrl || '/placeholder-hero.jpg'})`,
                }}
              >
                <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-start text-brand-ivory">
                  <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-brand-gold text-xs md:text-sm font-sans font-semibold tracking-[0.3em] uppercase mb-4"
                  >
                    Exquisite Digital Artistry
                  </motion.span>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="font-serif text-3xl md:text-6xl font-bold max-w-3xl leading-tight mb-6"
                  >
                    {banners[activeSlide]?.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-brand-ivory/70 text-sm md:text-lg max-w-xl leading-relaxed mb-8"
                  >
                    {banners[activeSlide]?.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Link
                      href={banners[activeSlide]?.ctaLink || '/invitations'}
                      className="group px-8 py-4 bg-brand-gold text-brand-black hover:bg-brand-ivory font-sans font-bold uppercase tracking-wider text-xs transition-all duration-500 flex items-center gap-3"
                    >
                      {banners[activeSlide]?.ctaText || 'Browse Collection'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      activeSlide === idx ? 'bg-brand-gold w-8' : 'bg-brand-ivory/30 hover:bg-brand-ivory/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 2. Invitation Categories */}
      <section className="py-20 bg-brand-ivory">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-brand-gold text-xs font-sans font-bold tracking-[0.2em] uppercase block mb-3">
            Explore Options
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-black mb-12">
            Browse By Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/invitations?category=${cat.slug}`}
                className="group relative bg-[#FFF] border border-brand-gold/10 hover-gold p-8 transition-all duration-500 text-left flex flex-col justify-between h-48"
              >
                <div>
                  <div className="text-brand-gold mb-4 group-hover:scale-110 transition-transform duration-300 w-10 h-10 flex items-center justify-center bg-brand-ivory border border-brand-gold/20">
                    {idx === 0 && <Sparkles className="w-5 h-5" />}
                    {idx === 1 && <Clock className="w-5 h-5" />}
                    {idx === 2 && <Award className="w-5 h-5" />}
                    {idx === 3 && <FileText className="w-5 h-5" />}
                    {idx > 3 && <Sparkles className="w-5 h-5" />}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-black group-hover:text-brand-gold transition-colors">
                    {cat.name}
                  </h3>
                </div>
                <span className="text-xs font-sans tracking-widest uppercase text-brand-gold/60 group-hover:text-brand-black transition-colors flex items-center gap-1">
                  View Collection
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Invitations */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-brand-gold text-xs font-sans font-bold tracking-[0.2em] uppercase block mb-3">
                Curated Designs
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-black">
                Featured Invitation Templates
              </h2>
            </div>
            <Link
              href="/invitations"
              className="text-xs font-sans font-bold uppercase tracking-widest text-brand-black hover:text-brand-gold transition-colors flex items-center gap-2 mt-4 md:mt-0"
            >
              View All Invitations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredTemplates.map((item) => (
              <Link
                key={item.id}
                href={`/invitations/${item.slug}`}
                className="group flex flex-col bg-white border border-brand-gold/10 hover-gold transition-all duration-500 overflow-hidden"
              >
                {/* Image thumb */}
                <div className="relative aspect-[3/4] bg-brand-gray overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url(${item.imageUrls?.[0] || '/templates/royal_thumb.jpg'})` }}
                  />
                  {/* Glass Card Tag */}
                  <span className="absolute top-4 left-4 glass px-3 py-1 text-[9px] tracking-wider uppercase font-semibold text-brand-black border border-brand-gold/20">
                    {item.category?.name}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-brand-black group-hover:text-brand-gold transition-colors leading-tight mb-2">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-4 border-t border-brand-gold/5 pt-3">
                    <span className="text-xs font-sans font-semibold text-brand-black/50">
                      Inquire details
                    </span>
                    <span className="text-sm font-sans font-bold text-brand-gold">
                      ₹{item.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose RichCards */}
      <section className="py-20 bg-brand-black text-brand-ivory border-y border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-brand-gold text-xs font-sans font-bold tracking-[0.2em] uppercase block mb-3">
            Elite Craftsmanship
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-16">
            The RichCards Distinction
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4 p-6 border border-brand-gold/10 bg-brand-gray/30 hover:border-brand-gold/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-full border border-brand-gold/25 flex items-center justify-center text-brand-gold mx-auto mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold">Luxury Personalization</h3>
              <p className="text-xs text-brand-ivory/60 leading-relaxed">
                Custom tailored monograms, colors, audio tracks, and detailed itineraries handcrafted by premium wedding graphic artists.
              </p>
            </div>

            <div className="space-y-4 p-6 border border-brand-gold/10 bg-brand-gray/30 hover:border-brand-gold/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-full border border-brand-gold/25 flex items-center justify-center text-brand-gold mx-auto mb-4">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold">Ultra-HD Animation</h3>
              <p className="text-xs text-brand-ivory/60 leading-relaxed">
                Cinema-grade wedding invite video reels rendered in high-definition formats, with premium fonts and transitions.
              </p>
            </div>

            <div className="space-y-4 p-6 border border-brand-gold/10 bg-brand-gray/30 hover:border-brand-gold/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-full border border-brand-gold/25 flex items-center justify-center text-brand-gold mx-auto mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold">WhatsApp Ready</h3>
              <p className="text-xs text-brand-ivory/60 leading-relaxed">
                Lightweight, compressed files optimized for seamless sharing and instant previewing inside WhatsApp threads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Delivery Formats */}
      <section className="py-20 bg-brand-ivory">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-brand-gold text-xs font-sans font-bold tracking-[0.2em] uppercase block mb-3">
            High Fidelity Outputs
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-black mb-6">
            Supported Delivery Formats
          </h2>
          <p className="text-xs text-brand-black/60 max-w-xl mx-auto leading-relaxed mb-12">
            Every invitation package is custom packaged in three digital formats, ensuring you can message, print, or email your guests.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-brand-gold/10 hover-gold transition-all duration-300">
              <Video className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <h4 className="font-serif font-bold text-sm">MP4 Video</h4>
              <span className="text-[10px] text-brand-black/40 uppercase">Full HD Animation</span>
            </div>
            <div className="bg-white p-6 border border-brand-gold/10 hover-gold transition-all duration-300">
              <ImageIcon className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <h4 className="font-serif font-bold text-sm">JPG Images</h4>
              <span className="text-[10px] text-brand-black/40 uppercase">Ultra High Res Cards</span>
            </div>
            <div className="bg-white p-6 border border-brand-gold/10 hover-gold transition-all duration-300">
              <FileText className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <h4 className="font-serif font-bold text-sm">Interactive PDF</h4>
              <span className="text-[10px] text-brand-black/40 uppercase">Clickable Map Links</span>
            </div>
            <div className="bg-white p-6 border border-brand-gold/10 hover-gold transition-all duration-300">
              <FileJson className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <h4 className="font-serif font-bold text-sm">Web RSVP</h4>
              <span className="text-[10px] text-brand-black/40 uppercase">Digital Forms</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-20 bg-white border-y border-brand-gold/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-brand-gold text-xs font-sans font-bold tracking-[0.2em] uppercase block mb-3">
            Real Reviews
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-black mb-12">
            Wedding Testimonials
          </h2>

          <div className="relative p-8 md:p-12 border border-brand-gold/10 bg-brand-ivory/50">
            <div className="text-4xl text-brand-gold font-serif leading-none mb-6">“</div>
            <p className="font-serif text-base md:text-lg text-brand-black/80 leading-relaxed italic mb-8">
              {testimonials.length > 0 ? testimonials[0].message : 'The monogram designs were incredibly elegant. Excellent turnaround and support.'}
            </p>
            <h4 className="font-sans font-bold uppercase tracking-wider text-xs text-brand-black">
              — {testimonials.length > 0 ? testimonials[0].name : 'Siddharth & Meera'}
            </h4>
          </div>
        </div>
      </section>

      {/* 7. Instagram Feed */}
      <section className="py-20 bg-brand-ivory">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Instagram className="w-8 h-8 text-brand-gold mx-auto mb-4" />
          <span className="text-brand-gold text-xs font-sans font-bold tracking-[0.2em] uppercase block mb-2">
            Follow @richcardsindia
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-black mb-12">
            Instagram Highlights
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square bg-brand-gray border border-brand-gold/10 overflow-hidden block"
              >
                {/* Mock IG image with default backgrounds */}
                <div className="absolute inset-0 bg-[#B58A3D]/20 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-brand-gold/40 group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-brand-ivory text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5">
                    View Post
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold text-brand-black text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-brand-gold/15 transition-all duration-300"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-serif text-sm font-bold text-brand-black flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-gold shrink-0" />
                    {faq.q}
                  </span>
                  <span className="text-brand-gold font-serif text-xl">
                    {faqOpen === idx ? '−' : '+'}
                  </span>
                </button>
                {faqOpen === idx && (
                  <div className="p-5 pt-0 border-t border-brand-gold/5 text-xs text-brand-black/70 leading-relaxed bg-brand-ivory/25">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. WhatsApp CTA Section */}
      <section className="py-20 bg-brand-black border-t border-brand-gold/20 relative overflow-hidden">
        {/* Background glow overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
          <span className="text-brand-gold text-xs font-sans font-bold tracking-[0.3em] uppercase block">
            Begin Your Journey
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-brand-ivory leading-tight">
            Ready to design your luxury wedding stationery?
          </h2>
          <p className="text-xs md:text-sm text-brand-ivory/60 max-w-xl mx-auto leading-relaxed">
            Click below to chat with our executive designers directly. Share your inspirations, themes, and template names for a personalized wedding design layout review.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://wa.me/919016705775?text=Hello%20RichCards%2C%20I%20am%20interested%20in%20your%20wedding%20invitation%20designs.%20Please%20share%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-brand-gold text-brand-black hover:bg-brand-ivory font-sans font-bold uppercase tracking-wider text-xs transition-all duration-500 flex items-center justify-center gap-3"
            >
              Inquire on WhatsApp
              <MessageCircle className="w-4.5 h-4.5 animate-bounce" />
            </a>
            <Link
              href="/invitations"
              className="group px-8 py-4 border border-brand-gold/30 text-brand-ivory hover:bg-brand-ivory hover:text-brand-black font-sans font-bold uppercase tracking-wider text-xs transition-all duration-500 flex items-center justify-center gap-3"
            >
              Browse Gallery
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
