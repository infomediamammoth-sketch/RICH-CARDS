'use strict';
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronLeft, Share2, Copy, Check, User } from 'lucide-react';
import { api } from '@/lib/api';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadBlog() {
      setLoading(true);
      try {
        const data = await api.getBlog(slug);
        setTemplateMetadata(data);
        setBlog(data);
      } catch (err) {
        console.error('Failed to load blog article', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, [slug]);

  // Fallback metadata update if needed
  const setTemplateMetadata = (data: any) => {
    if (typeof document !== 'undefined') {
      document.title = `${data.seoMetadata?.title || data.title} | RichCards Blog`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 animate-pulse space-y-8 bg-[#FDFBF7]">
        <div className="h-6 bg-brand-black/5 w-1/4" />
        <div className="h-12 bg-brand-black/5 w-3/4" />
        <div className="h-96 bg-brand-black/5 w-full" />
        <div className="space-y-4">
          <div className="h-4 bg-brand-black/5 w-full" />
          <div className="h-4 bg-brand-black/5 w-full" />
          <div className="h-4 bg-brand-black/5 w-2/3" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center bg-[#FDFBF7]">
        <h2 className="font-serif text-2xl font-bold text-brand-black mb-4">Article Not Found</h2>
        <Link href="/blogs" className="text-xs uppercase font-sans tracking-widest text-brand-gold font-bold">
          Return to Blog
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const copyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': blog.title,
    'image': blog.featuredImg,
    'datePublished': blog.createdAt,
    'author': {
      '@type': 'Person',
      'name': blog.author?.name || 'RichCards Writer',
    },
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="max-w-4xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-brand-black hover:text-brand-gold transition-colors mb-8"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="space-y-6 mb-8">
          <span className="inline-block bg-brand-gold/10 text-brand-gold text-[10px] uppercase font-sans tracking-widest font-bold py-1 px-3 border border-brand-gold/15">
            {blog.category?.name}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-black leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 border-y border-brand-gold/15 py-4 text-xs text-brand-black/60">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand-gold" />
              {blog.author?.name || 'RichCards Designer'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-gold" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-gold" />
              {blog.readingTime} min read
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {blog.featuredImg && (
          <div className="relative aspect-video w-full overflow-hidden border border-brand-gold/10 mb-12">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${blog.featuredImg})` }}
            />
          </div>
        )}

        {/* Article Content */}
        <div
          className="prose prose-serif max-w-none text-brand-black/80 text-sm leading-relaxed space-y-6 pb-12 border-b border-brand-gold/10"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Article Utilities */}
        <div className="flex items-center justify-between pt-6 text-xs text-brand-black/50">
          <div className="flex gap-2">
            {blog.tags?.map((t: any) => (
              <span key={t.id} className="bg-brand-black/5 px-2.5 py-1 text-[10px] font-sans tracking-wide uppercase">
                #{t.slug}
              </span>
            ))}
          </div>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 hover:text-brand-gold font-bold transition-colors uppercase tracking-wider text-[10px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-brand-gold" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Share Article'}
          </button>
        </div>
      </div>
    </div>
  );
}
