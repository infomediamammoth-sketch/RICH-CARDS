'use strict';
'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsappCTA() {
  const whatsappNumber = '919016705775';
  const defaultMessage = 'Hello RichCards,\n\nI am interested in your luxury wedding invitation designs. Please share the details.';
  const encodedMessage = encodeURIComponent(defaultMessage);
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white hover:bg-[#20ba5a] shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group"
      aria-label="Inquire on WhatsApp"
      style={{ borderRadius: '50%' }}
    >
      <MessageCircle className="w-7 h-7 animate-pulse group-hover:scale-110 transition-transform" />
      {/* Tooltip */}
      <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-300 origin-right whitespace-nowrap bg-brand-black text-brand-ivory text-[10px] tracking-wider uppercase py-1.5 px-3 border border-brand-gold/20 font-semibold shadow-xl">
        Chat with us
      </span>
    </a>
  );
}
