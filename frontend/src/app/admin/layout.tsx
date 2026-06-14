'use strict';
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileImage,
  FolderOpen,
  Settings,
  LogOut,
  ArrowLeft,
  UserCheck,
  Menu,
  X,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication guard
  useEffect(() => {
    const user = api.getCurrentUser();
    if (!user && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setCurrentUser(user);
    }
    setLoading(false);
  }, [router, pathname]);

  const handleLogout = () => {
    api.logout();
    router.push('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Leads CRM', href: '/admin/leads', icon: Users },
    { name: 'Templates', href: '/admin/templates', icon: FileImage },
    { name: 'Media Library', href: '/admin/media', icon: FolderOpen },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-brand-ivory font-sans text-xs uppercase tracking-widest">
        Loading Console...
      </div>
    );
  }

  // Bypassed for login route
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-black text-brand-ivory shrink-0 border-r border-brand-gold/10">
        {/* Brand */}
        <div className="p-6 border-b border-brand-gold/10 flex flex-col">
          <span className="font-serif text-xl font-bold tracking-widest uppercase text-brand-ivory">
            RichCards
          </span>
          <span className="text-[8px] tracking-[0.3em] font-sans text-brand-gold uppercase -mt-0.5">
            Admin Panel
          </span>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="p-4 mx-4 my-6 bg-brand-gray border border-brand-gold/15 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-brand-gold shrink-0 bg-brand-black p-1.5 border border-brand-gold/25" />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-brand-ivory truncate">{currentUser.name}</h4>
              <span className="text-[9px] text-brand-gold font-sans font-bold uppercase tracking-wider block mt-0.5">
                {currentUser.role}
              </span>
            </div>
          </div>
        )}

        {/* Menu Navigation */}
        <nav className="flex-grow px-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-sans font-semibold uppercase tracking-wider transition-all border ${
                  isActive
                    ? 'bg-brand-gold text-brand-black border-brand-gold'
                    : 'border-transparent text-brand-ivory/70 hover:text-brand-gold hover:bg-brand-gray/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Back and Logout */}
        <div className="p-4 border-t border-brand-gold/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-sans font-bold uppercase tracking-wider text-brand-ivory/50 hover:text-brand-ivory transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Main Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-sans font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* 2. Mobile Nav Header & Drawer */}
      <div className="flex-grow flex flex-col min-h-screen">
        <header className="lg:hidden bg-brand-black text-brand-ivory px-6 py-4 flex items-center justify-between border-b border-brand-gold/10">
          <span className="font-serif text-lg font-bold tracking-wider uppercase">RichCards Console</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle Navigation">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile menu overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 top-[60px] z-50 bg-brand-black/95 backdrop-blur-md lg:hidden animate-fade-in flex flex-col">
            <nav className="flex-grow flex flex-col items-center justify-center space-y-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 text-lg font-serif text-brand-ivory hover:text-brand-gold uppercase tracking-widest"
                  >
                    <Icon className="w-5 h-5 text-brand-gold" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 text-lg font-serif text-red-400 hover:text-red-300 uppercase tracking-widest pt-8 border-t border-brand-gold/10 w-2/3 justify-center"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>
        )}

        {/* Page Content area */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
