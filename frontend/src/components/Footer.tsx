'use strict';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-brand-ivory/80 pt-16 pb-8 border-t border-brand-gold/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-brand-gold/5">
        {/* About column */}
        <div className="space-y-4">
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-widest text-brand-ivory uppercase">
              RichCards
            </span>
            <span className="text-[9px] tracking-[0.3em] font-sans text-brand-gold uppercase -mt-0.5">
              Digital Studio
            </span>
          </Link>
          <p className="text-xs text-brand-ivory/60 leading-relaxed max-w-sm">
            RichCards is a premium digital wedding invitation design studio specializing in luxury wedding stationery, digital invite videos, monograms, and wedding hashtags.
          </p>
        </div>

        {/* Categories Column */}
        <div className="space-y-4">
          <h4 className="font-serif text-sm font-semibold tracking-wider text-brand-gold uppercase">
            Our Offerings
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/invitations?category=wedding-invitations" className="hover:text-brand-gold transition-colors">
                Wedding Monogram Design
              </Link>
            </li>
            <li>
              <Link href="/invitations?category=save-the-date" className="hover:text-brand-gold transition-colors">
                Save The Date Invites
              </Link>
            </li>
            <li>
              <Link href="/invitations?category=wedding-invitations" className="hover:text-brand-gold transition-colors">
                Digital Invitation Videos
              </Link>
            </li>
            <li>
              <Link href="/invitations?category=wardrobe-planners" className="hover:text-brand-gold transition-colors">
                Wardrobe Planner Cards
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="space-y-4">
          <h4 className="font-serif text-sm font-semibold tracking-wider text-brand-gold uppercase">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/invitations" className="hover:text-brand-gold transition-colors">
                Invitation Gallery
              </Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:text-brand-gold transition-colors">
                Our Blog
              </Link>
            </li>
            <li>
              <Link href="/testimonials" className="hover:text-brand-gold transition-colors">
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-gold transition-colors">
                Get in Touch
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info column */}
        <div className="space-y-4">
          <h4 className="font-serif text-sm font-semibold tracking-wider text-brand-gold uppercase">
            Connect With Us
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <span className="block text-brand-ivory/40">WhatsApp Inquiry</span>
              <a
                href="https://wa.me/919016705775"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-gold font-medium transition-colors"
              >
                +91 9016705775
              </a>
            </li>
            <li>
              <span className="block text-brand-ivory/40">Instagram Profile</span>
              <a
                href="https://www.instagram.com/richcardsindia"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-gold font-medium transition-colors"
              >
                @richcardsindia
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Policies & Copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-brand-ivory/40">
        <p>© {currentYear} RichCards India. All rights reserved.</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
          <Link href="/policies?tab=privacy" className="hover:text-brand-gold transition-colors">
            Privacy Policy
          </Link>
          <Link href="/policies?tab=terms" className="hover:text-brand-gold transition-colors">
            Terms & Conditions
          </Link>
          <Link href="/policies?tab=refunds" className="hover:text-brand-gold transition-colors">
            Refund Policy
          </Link>
          <Link href="/admin/dashboard" className="hover:text-brand-gold transition-colors">
            Staff Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
