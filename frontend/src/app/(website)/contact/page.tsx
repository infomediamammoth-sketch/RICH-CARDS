'use strict';
'use client';

import { useState } from 'react';
import { MessageCircle, Mail, MapPin, CheckCircle, Sparkles } from 'lucide-react';
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

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createLead({
        name,
        phone,
        email: email || undefined,
        source: 'Contact Form',
        notes: `General message submitted: ${message}`,
      });

      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      
      // Redirect to WhatsApp general inquiry
      const waNumber = '919016705775';
      const textMessage = `Hello RichCards,\n\nI just submitted a contact form on your website.\n\nMy Details:\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\n\nMessage:\n${message}`;
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(textMessage)}`;
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1000);

    } catch (err) {
      console.error('Failed to submit message', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-brand-gold text-xs font-sans font-bold tracking-[0.3em] uppercase block">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-black">
            Contact Us
          </h1>
          <p className="text-xs text-brand-black/60 leading-relaxed">
            Inquire about custom stationery designs, video invitations, monograms, or collaborate with our executive design studio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <div className="space-y-8 lg:pr-12">
            <h2 className="font-serif text-2xl font-bold text-brand-black">
              Reach the RichCards Studio
            </h2>
            <p className="text-xs text-brand-black/60 leading-relaxed">
              We operate globally, crafting custom premium invitations and monograms. Contact our team directly on WhatsApp or submit your inquiry below.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-brand-gold/25 rounded-full flex items-center justify-center shrink-0 text-brand-gold bg-white">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-brand-black">WhatsApp Line</h4>
                  <a href="https://wa.me/919016705775" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-gold font-bold hover:text-brand-black transition-colors block mt-1">
                    +91 9016705775
                  </a>
                  <p className="text-[10px] text-brand-black/40 mt-0.5">24/7 fast text assistance</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-brand-gold/25 rounded-full flex items-center justify-center shrink-0 text-brand-gold bg-white">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-brand-black">Instagram Channel</h4>
                  <a href="https://www.instagram.com/richcardsindia" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-gold font-bold hover:text-brand-black transition-colors block mt-1">
                    @richcardsindia
                  </a>
                  <p className="text-[10px] text-brand-black/40 mt-0.5">Browse reels & story previews</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-brand-gold/25 rounded-full flex items-center justify-center shrink-0 text-brand-gold bg-white">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-brand-black">Studio Email</h4>
                  <a href="mailto:hello@richcards.in" className="text-xs text-brand-gold font-bold hover:text-brand-black transition-colors block mt-1">
                    hello@richcards.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Capture */}
          <div className="bg-white border border-brand-gold/15 p-8 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-brand-black uppercase tracking-wider border-b border-brand-gold/10 pb-4 mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              Inquiry Form
            </h3>

            {success ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle className="w-12 h-12 text-[#25D366] mx-auto animate-bounce" />
                <h4 className="font-serif text-lg font-bold text-brand-black">Inquiry Registered!</h4>
                <p className="text-xs text-brand-black/50">
                  Redirecting to WhatsApp to start your luxury design chat...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                    Name
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                      WhatsApp Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 90123 45678"
                      className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                    Tell us about your event
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mention template names, monograms, event dates or style preferences..."
                    className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-gold text-brand-black hover:bg-brand-black hover:text-brand-ivory transition-all duration-500 font-sans font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Inquiry & Chat'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
