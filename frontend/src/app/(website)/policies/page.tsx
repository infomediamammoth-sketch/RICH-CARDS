'use strict';
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, ShieldCheck, Scale, RefreshCcw } from 'lucide-react';

function PoliciesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('privacy');

  useEffect(() => {
    if (tabParam && ['privacy', 'terms', 'refund'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const setTab = (tab: string) => {
    setActiveTab(tab);
    router.replace(`/policies?tab=${tab}`);
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-brand-gold text-xs font-sans font-bold tracking-[0.3em] uppercase block">
            Legal Studio
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-black">
            Studio Policies
          </h1>
          <p className="text-xs text-brand-black/60 leading-relaxed">
            Please review our wedding design service agreements, privacy protections, and project refund terms.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-3 gap-2 border-b border-brand-gold/15 pb-4 mb-12">
          <button
            onClick={() => setTab('privacy')}
            className={`py-3 flex items-center justify-center gap-2 border transition-all text-xs font-sans font-bold uppercase tracking-wider ${
              activeTab === 'privacy'
                ? 'bg-brand-black text-brand-ivory border-brand-black'
                : 'border-brand-gold/10 text-brand-black hover:border-brand-gold/45 bg-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-brand-gold" />
            Privacy
          </button>

          <button
            onClick={() => setTab('terms')}
            className={`py-3 flex items-center justify-center gap-2 border transition-all text-xs font-sans font-bold uppercase tracking-wider ${
              activeTab === 'terms'
                ? 'bg-brand-black text-brand-ivory border-brand-black'
                : 'border-brand-gold/10 text-brand-black hover:border-brand-gold/45 bg-white'
            }`}
          >
            <Scale className="w-4 h-4 shrink-0 text-brand-gold" />
            Terms
          </button>

          <button
            onClick={() => setTab('refund')}
            className={`py-3 flex items-center justify-center gap-2 border transition-all text-xs font-sans font-bold uppercase tracking-wider ${
              activeTab === 'refund'
                ? 'bg-brand-black text-brand-ivory border-brand-black'
                : 'border-brand-gold/10 text-brand-black hover:border-brand-gold/45 bg-white'
            }`}
          >
            <RefreshCcw className="w-4 h-4 shrink-0 text-brand-gold" />
            Refunds
          </button>
        </div>

        {/* Policy Contents */}
        <div className="bg-white border border-brand-gold/15 p-8 md:p-12 shadow-sm text-xs text-brand-black/85 leading-relaxed space-y-6">
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-brand-black border-b border-brand-gold/10 pb-3">
                Privacy Protection Policy
              </h2>
              <p>
                RichCards India is committed to protecting your privacy. This policy details how we collect, store, and utilize the wedding details, personal information, and media files you share with us.
              </p>
              <h3 className="font-serif text-sm font-bold text-brand-black">1. Information We Collect</h3>
              <p>
                To customize your invitations, we collect details including bride/groom names, parent names, venue location addresses, itinerary times, contact details, custom music selections, and photographs.
              </p>
              <h3 className="font-serif text-sm font-bold text-brand-black">2. Media Security</h3>
              <p>
                Any files uploaded to our Media Library are secured. High-resolution unwatermarked copies of your wedding images and videos are only made available to you and authorized editors. We never share your assets with third-party advertising companies.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-brand-black border-b border-brand-gold/10 pb-3">
                Terms of Design Service
              </h2>
              <p>
                By commissioning invitation work with RichCards India, you agree to comply with and be bound by the following studio terms and conditions.
              </p>
              <h3 className="font-serif text-sm font-bold text-brand-black">1. Tailoring Limits</h3>
              <p>
                Every template purchase includes up to 3 rounds of text adjustments, schedule corrections, and music changes. Complex structural/graphic modifications beyond the pre-set template boundaries will require custom design layout fees.
              </p>
              <h3 className="font-serif text-sm font-bold text-brand-black">2. Copyright & Intellectual Property</h3>
              <p>
                RichCards retains ownership of the underlying layouts, vector illustrations, monograms, animations, and typography structures. You are granted an exclusive license to distribute the final rendered invitation files (MP4, PDF, JPG) to your guests for personal event use.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-brand-black border-b border-brand-gold/10 pb-3">
                Refund & Cancellation Terms
              </h2>
              <p>
                Due to the highly customized and digital nature of luxury invitation stationery, our refund guidelines are defined as follows:
              </p>
              <h3 className="font-serif text-sm font-bold text-brand-black">1. Work Cancellation</h3>
              <p>
                If cancellation is requested before customization work begins, a full refund will be processed minus transaction fees.
              </p>
              <h3 className="font-serif text-sm font-bold text-brand-black">2. Custom Layouts</h3>
              <p>
                Once personalization layouts are drafted or final unwatermarked digital cards/videos are delivered, refunds are not allowed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PoliciesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-sans uppercase tracking-widest text-brand-gold bg-[#FDFBF7]">Loading Policies...</div>}>
      <PoliciesContent />
    </Suspense>
  );
}
