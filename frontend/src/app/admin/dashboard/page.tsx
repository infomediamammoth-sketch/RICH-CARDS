'use strict';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  FileImage,
  Calendar,
  Eye,
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getDashboardAnalytics();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-brand-black/5 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-brand-black/5" />
          ))}
        </div>
        <div className="h-96 bg-brand-black/5" />
      </div>
    );
  }

  const overview = stats?.overview || { totalTemplates: 0, totalLeads: 0, totalBlogs: 0, totalUsers: 0 };
  const leadsByStatus = stats?.leadsByStatus || { New: 0, Contacted: 0, Interested: 0, Closed: 0, Rejected: 0 };
  const popularTemplates = stats?.popularTemplates || [];
  const popularCategories = stats?.popularCategories || [];
  const recentLeads = stats?.recentLeads || [];
  const recentLogs = stats?.recentLogs || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-brand-gold text-[10px] font-sans font-bold tracking-[0.2em] uppercase block mb-1">
          RichCards Management
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-black uppercase tracking-wider">
          System Overview
        </h1>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-brand-gold/15 p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-sans tracking-widest text-brand-black/40 font-semibold">
              Total Inquiries
            </span>
            <h3 className="text-2xl font-serif font-bold text-brand-black">{overview.totalLeads}</h3>
          </div>
          <Users className="w-8 h-8 text-brand-gold bg-brand-ivory p-1.5 border border-brand-gold/20" />
        </div>

        <div className="bg-white border border-brand-gold/15 p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-sans tracking-widest text-brand-black/40 font-semibold">
              Active Templates
            </span>
            <h3 className="text-2xl font-serif font-bold text-brand-black">{overview.totalTemplates}</h3>
          </div>
          <FileImage className="w-8 h-8 text-brand-gold bg-brand-ivory p-1.5 border border-brand-gold/20" />
        </div>

        <div className="bg-white border border-brand-gold/15 p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-sans tracking-widest text-brand-black/40 font-semibold">
              Blog Posts
            </span>
            <h3 className="text-2xl font-serif font-bold text-brand-black">{overview.totalBlogs}</h3>
          </div>
          <FileText className="w-8 h-8 text-brand-gold bg-brand-ivory p-1.5 border border-brand-gold/20" />
        </div>

        <div className="bg-white border border-brand-gold/15 p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-sans tracking-widest text-brand-black/40 font-semibold">
              Admin Users
            </span>
            <h3 className="text-2xl font-serif font-bold text-brand-black">{overview.totalUsers}</h3>
          </div>
          <UserCheck className="w-8 h-8 text-brand-gold bg-brand-ivory p-1.5 border border-brand-gold/20" />
        </div>
      </div>

      {/* Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads Funnel Status Chart */}
        <div className="bg-white border border-brand-gold/15 p-6 shadow-sm space-y-6">
          <h3 className="font-serif text-sm font-bold text-brand-black uppercase tracking-wider border-b border-brand-gold/5 pb-3">
            Leads CRM Pipeline
          </h3>
          <div className="space-y-4">
            {Object.entries(leadsByStatus).map(([status, count]) => {
              const maxLeads = Math.max(...(Object.values(leadsByStatus) as number[]), 1);
              const pct = ((count as number) / maxLeads) * 100;
              let barColor = 'bg-brand-gold';
              if (status === 'Closed') barColor = 'bg-emerald-500';
              if (status === 'Rejected') barColor = 'bg-rose-500';

              return (
                <div key={status} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-brand-black/70">
                    <span>{status}</span>
                    <span>{count as number}</span>
                  </div>
                  <div className="w-full bg-brand-ivory h-2.5 border border-brand-gold/10">
                    <div className={`${barColor} h-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Templates Views */}
        <div className="bg-white border border-brand-gold/15 p-6 shadow-sm space-y-6">
          <h3 className="font-serif text-sm font-bold text-brand-black uppercase tracking-wider border-b border-brand-gold/5 pb-3">
            Popular Template Page Views
          </h3>
          {popularTemplates.length === 0 ? (
            <p className="text-xs text-brand-black/50 py-12 text-center">No visitor data captured yet.</p>
          ) : (
            <div className="space-y-4">
              {popularTemplates.map((item: any, idx: number) => {
                const maxViews = Math.max(...popularTemplates.map((t: any) => t.views), 1);
                const pct = (item.views / maxViews) * 100;

                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-brand-black/70">
                      <span className="truncate max-w-xs">{item.label.replace('Template viewed: ', '')}</span>
                      <span>{item.views} views</span>
                    </div>
                    <div className="w-full bg-brand-ivory h-2.5 border border-brand-gold/10">
                      <div className="bg-brand-black h-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Leads Spreadsheet Widget */}
      <div className="bg-white border border-brand-gold/15 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-gold/10 flex items-center justify-between">
          <h3 className="font-serif text-sm font-bold text-brand-black uppercase tracking-wider">
            Recent Leads Inquiries
          </h3>
          <Link
            href="/admin/leads"
            className="text-[10px] uppercase font-sans tracking-widest font-bold text-brand-gold hover:text-brand-black transition-colors flex items-center gap-1.5"
          >
            Open CRM Board
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-brand-ivory text-brand-black/50 border-b border-brand-gold/15 font-semibold">
                <th className="p-4">Customer</th>
                <th className="p-4">WhatsApp Phone</th>
                <th className="p-4">Inquired Item</th>
                <th className="p-4">Source</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-brand-black/40">
                    No lead submissions found.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead: any) => {
                  let statusBadge = 'bg-brand-gold/10 text-brand-gold border-brand-gold/30';
                  if (lead.status === 'Closed') statusBadge = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
                  if (lead.status === 'Rejected') statusBadge = 'bg-rose-500/10 text-rose-600 border-rose-500/20';

                  return (
                    <tr key={lead.id} className="border-b border-brand-gold/5 hover:bg-brand-ivory/25 transition-colors">
                      <td className="p-4 font-bold text-brand-black">{lead.name}</td>
                      <td className="p-4 font-sans">{lead.phone}</td>
                      <td className="p-4 truncate max-w-xs">{lead.template?.title || 'General Inquiry'}</td>
                      <td className="p-4 text-brand-black/50">{lead.source}</td>
                      <td className="p-4 text-brand-black/50">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 border text-[9px] uppercase font-bold tracking-wider ${statusBadge}`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Audit Trails */}
      <div className="bg-white border border-brand-gold/15 p-6 shadow-sm space-y-6">
        <h3 className="font-serif text-sm font-bold text-brand-black uppercase tracking-wider border-b border-brand-gold/5 pb-3">
          System Activity Audit Log
        </h3>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {recentLogs.length === 0 ? (
            <p className="text-xs text-brand-black/40 text-center py-6">No logs available.</p>
          ) : (
            recentLogs.map((log: any) => (
              <div
                key={log.id}
                className="flex items-start justify-between gap-6 text-[10px] border-b border-brand-gold/5 pb-2.5 last:border-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-brand-black text-brand-ivory font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 border border-brand-gold/15">
                      {log.action}
                    </span>
                    <span className="text-brand-black/70 font-semibold">{log.details}</span>
                  </div>
                  {log.user && (
                    <span className="text-brand-black/40 block">
                      Triggered by: {log.user.name} ({log.user.email})
                    </span>
                  )}
                </div>
                <span className="text-brand-black/40 font-medium shrink-0">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
