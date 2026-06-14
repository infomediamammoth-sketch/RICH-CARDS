'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappCTA from '@/components/WhatsappCTA';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { usePathname } from 'next/navigation';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Automatically capture a page view analytics entry
    api.trackPageView(pathname).catch(() => {});
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-[70px]">{children}</main>
      <Footer />
      <WhatsappCTA />
    </div>
  );
}
