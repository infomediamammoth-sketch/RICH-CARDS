'use strict';
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    const user = api.getCurrentUser();
    if (user) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login(email, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-dark p-8 md:p-10 border border-brand-gold/20 relative z-10">
        <div className="text-center space-y-3 mb-8">
          <span className="text-brand-gold text-[10px] font-sans font-semibold tracking-[0.3em] uppercase block">
            Security Portal
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-ivory tracking-wider uppercase">
            Staff Sign In
          </h1>
          <p className="text-[10px] text-brand-ivory/50 uppercase tracking-widest">
            RichCards Management Console
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 text-red-200 text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-sans tracking-widest text-brand-ivory/50 block font-semibold">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@richcards.in"
                className="w-full bg-brand-gray border border-brand-gold/10 text-brand-ivory text-xs px-3 py-3 pl-10 focus:border-brand-gold outline-none transition-colors"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-ivory/30" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-sans tracking-widest text-brand-ivory/50 block font-semibold">
              Security Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-gray border border-brand-gold/10 text-brand-ivory text-xs px-3 py-3 pl-10 focus:border-brand-gold outline-none transition-colors"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-ivory/30" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-gold text-brand-black hover:bg-brand-ivory hover:text-brand-black transition-all duration-500 font-sans font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authorizing Access...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
