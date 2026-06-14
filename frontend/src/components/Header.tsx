'use strict';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Invitations', href: '/invitations' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass py-4 shadow-lg shadow-brand-black/5'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex flex-col">
          <span className="font-serif text-2xl font-bold tracking-widest text-brand-black uppercase group-hover:text-brand-gold transition-colors duration-300">
            RichCards
          </span>
          <span className="text-[9px] tracking-[0.3em] font-sans text-brand-gold uppercase -mt-0.5">
            Digital Studio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-sans font-medium text-brand-black/80 hover:text-brand-gold transition-colors duration-300 relative group py-1"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/invitations"
            className="group px-5 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider bg-brand-black text-brand-ivory hover:bg-brand-gold hover:text-brand-black transition-all duration-500 rounded-none flex items-center gap-2"
          >
            Browse Gallery
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-brand-black hover:text-brand-gold transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[70px] z-40 bg-brand-ivory/95 backdrop-blur-md md:hidden animate-fade-in">
          <nav className="flex flex-col items-center justify-center h-full space-y-8 pb-24">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-serif text-2xl text-brand-black hover:text-brand-gold transition-colors duration-300 uppercase tracking-widest"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/invitations"
              onClick={() => setIsOpen(false)}
              className="px-8 py-3 bg-brand-black text-brand-ivory font-sans font-semibold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-black transition-colors rounded-none"
            >
              Browse Gallery
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
