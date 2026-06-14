'use strict';
'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  Filter,
  Save,
  Trash2,
  Phone,
  Mail,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLeadsCRM() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  // Fetch leads
  useEffect(() => {
    async function loadLeads() {
      setLoading(true);
      try {
        const data = await api.getLeads(statusFilter || undefined);
        setLeads(data);
      } catch (err) {
        console.error('Failed to load CRM leads', err);
      } finally {
        setLoading(false);
      }
    }
    loadLeads();
  }, [statusFilter]);

  // Transition lead status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const updated = await api.updateLeadStatus(id, newStatus);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: updated.status } : l)));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Save private notes
  const saveNotes = async (id: string) => {
    try {
      const updated = await api.updateLeadStatus(id, undefined, notesText);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes: updated.notes } : l)));
      setEditingNotesId(null);
    } catch (err) {
      console.error('Failed to save notes', err);
    }
  };

  // Delete lead
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this CRM lead?')) return;
    try {
      await api.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Failed to delete lead', err);
    }
  };

  // Metrics
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const closedLeads = leads.filter((l) => l.status === 'Closed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-brand-gold text-[10px] font-sans font-bold tracking-[0.2em] uppercase block mb-1">
            CRM Dashboard
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-black uppercase tracking-wider">
            Lead Management
          </h1>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-brand-black/60 font-semibold flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-brand-gold" />
            Filter Pipeline:
          </span>
          {['', 'New', 'Contacted', 'Interested', 'Closed', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 border text-[10px] uppercase tracking-wider font-bold transition-all ${
                statusFilter === status
                  ? 'bg-brand-black text-brand-ivory border-brand-black'
                  : 'bg-white border-brand-gold/15 text-brand-black hover:border-brand-gold/45'
              }`}
            >
              {status === '' ? 'All Leads' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-brand-gold/15 p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-sans tracking-widest text-brand-black/40 font-semibold">
              Filter Pipeline Total
            </span>
            <h3 className="text-xl font-serif font-bold text-brand-black">{totalLeads}</h3>
          </div>
          <Users className="w-6 h-6 text-brand-gold" />
        </div>

        <div className="bg-white border border-brand-gold/15 p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-sans tracking-widest text-brand-black/40 font-semibold">
              New Inquiries
            </span>
            <h3 className="text-xl font-serif font-bold text-brand-black">{newLeads}</h3>
          </div>
          <Clock className="w-6 h-6 text-brand-gold" />
        </div>

        <div className="bg-white border border-brand-gold/15 p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-sans tracking-widest text-brand-black/40 font-semibold">
              Closed Deals
            </span>
            <h3 className="text-xl font-serif font-bold text-emerald-600">{closedLeads}</h3>
          </div>
          <CheckCircle className="w-6 h-6 text-emerald-500" />
        </div>
      </div>

      {/* CRM Main Grid Table */}
      <div className="bg-white border border-brand-gold/15 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-brand-black/40 animate-pulse uppercase tracking-widest">
            Fetching Lead Records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-ivory text-brand-black/50 border-b border-brand-gold/15 font-semibold">
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Inquired Design</th>
                  <th className="p-4">Lead Status</th>
                  <th className="p-4">Internal private notes</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-brand-black/40 font-sans">
                      No customer leads found matching filters.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-brand-gold/5 hover:bg-brand-ivory/15 transition-colors items-start align-top">
                      {/* Name / Contact details */}
                      <td className="p-4 space-y-1.5 max-w-xs">
                        <h4 className="font-bold text-brand-black text-sm">{lead.name}</h4>
                        <div className="space-y-0.5 text-[10px] text-brand-black/50">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-brand-gold" />
                            {lead.phone}
                          </span>
                          {lead.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-brand-gold" />
                              {lead.email}
                            </span>
                          )}
                          <span className="block text-[9px] mt-1">
                            Registered: {new Date(lead.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* Inquired template */}
                      <td className="p-4 space-y-1 max-w-xs">
                        {lead.template ? (
                          <>
                            <h4 className="font-semibold text-brand-black leading-tight">
                              {lead.template.title}
                            </h4>
                            <span className="text-[10px] text-brand-gold uppercase block font-medium">
                              ₹{lead.template.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-brand-black/40 italic">General Website Inquiry</span>
                        )}
                        <span className="block text-[9px] text-brand-black/40">Source: {lead.source}</span>
                      </td>

                      {/* Lead Status selection */}
                      <td className="p-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="bg-white border border-brand-gold/15 text-xs py-1 px-2 focus:border-brand-gold outline-none rounded-none font-semibold text-brand-black"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Interested">Interested</option>
                          <option value="Closed">Closed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Private Notes */}
                      <td className="p-4 max-w-sm">
                        {editingNotesId === lead.id ? (
                          <div className="flex gap-2 items-start">
                            <textarea
                              value={notesText}
                              onChange={(e) => setNotesText(e.target.value)}
                              rows={2}
                              className="w-full bg-[#FDFBF7] border border-brand-gold/25 p-2 text-xs outline-none focus:border-brand-gold resize-none"
                            />
                            <button
                              onClick={() => saveNotes(lead.id)}
                              className="p-2 bg-brand-black text-brand-ivory hover:bg-brand-gold hover:text-brand-black transition-colors"
                              aria-label="Save Notes"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingNotesId(lead.id);
                              setNotesText(lead.notes || '');
                            }}
                            className="p-2 border border-dashed border-brand-gold/10 hover:border-brand-gold/45 hover:bg-brand-ivory/25 cursor-pointer min-h-12 text-[10px] text-brand-black/70 leading-relaxed"
                          >
                            {lead.notes || 'Click to log contact summaries / internal details...'}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-2 border border-transparent hover:border-red-500/20 text-brand-black/40 hover:text-red-500 transition-colors"
                          aria-label="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
