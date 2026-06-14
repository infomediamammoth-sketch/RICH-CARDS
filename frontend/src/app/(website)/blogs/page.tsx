'use strict';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, User } from 'lucide-react';
import { api } from '@/lib/api';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const catData = await api.getBlogCategories();
        setCategories(catData);
      } catch (err) {
        console.error('Failed to load blog categories', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadBlogs() {
      setLoading(true);
      try {
        const blogsData = await api.getBlogs(selectedCategory || undefined);
        setBlogs(blogsData);
      } catch (err) {
        console.error('Failed to load blogs', err);
        setBlogs(mockBlogs);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, [selectedCategory]);

  const mockBlogs = [
    {
      id: '1',
      title: 'Top 5 Luxury Wedding Monogram Trends for 2026',
      slug: 'luxury-wedding-monogram-trends-2026',
      content: 'A deep dive into classic fonts, metallic elements, and crest layouts.',
      featuredImg: '',
      readingTime: 4,
      createdAt: new Date().toISOString(),
      author: { name: 'RichCards Creative Director' },
      category: { name: 'Wedding Monograms' },
    },
    {
      id: '2',
      title: 'Why Digital Video Invitations are Replacing Print Invites',
      slug: 'why-digital-video-invitations-replacing-print',
      content: 'How digital wedding stationery delivers premium elegance and instant reach.',
      featuredImg: '',
      readingTime: 5,
      createdAt: new Date().toISOString(),
      author: { name: 'Stationery Specialist' },
      category: { name: 'Digital Stationery' },
    },
  ];

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-brand-gold text-xs font-sans font-bold tracking-[0.3em] uppercase block">
            RichCards Gazette
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-black">
            The Wedding Blog
          </h1>
          <p className="text-xs text-brand-black/60 leading-relaxed">
            Inspirations, layout guides, etiquette tips, and modern digital wedding stationery design trends curated by RichCards planners.
          </p>
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-12 border-b border-brand-gold/10 pb-6">
            <button
              onClick={() => setSelectedCategory('')}
              className={`text-xs uppercase font-sans tracking-widest px-4 py-2 border transition-all ${
                selectedCategory === ''
                  ? 'bg-brand-black text-brand-ivory border-brand-black font-semibold'
                  : 'border-brand-gold/10 text-brand-black hover:border-brand-gold/45'
              }`}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs uppercase font-sans tracking-widest px-4 py-2 border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-brand-black text-brand-ivory border-brand-black font-semibold'
                    : 'border-brand-gold/10 text-brand-black hover:border-brand-gold/45'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Article Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-brand-black/5 aspect-video" />
                <div className="h-6 bg-brand-black/5 w-3/4" />
                <div className="h-4 bg-brand-black/5 w-1/2" />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white border border-brand-gold/10">
            <h3 className="font-serif text-lg font-bold text-brand-black mb-2">No articles found</h3>
            <p className="text-xs text-brand-black/55">Check back later for newly published guides.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => {
              const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <article
                  key={blog.id}
                  className="group flex flex-col bg-white border border-brand-gold/10 hover-gold transition-all duration-500 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-video bg-brand-black/5 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 flex items-center justify-center"
                      style={{
                        backgroundImage: blog.featuredImg ? `url(${blog.featuredImg})` : undefined,
                      }}
                    >
                      {!blog.featuredImg && (
                        <span className="font-serif text-lg tracking-widest text-brand-gold/40">
                          RichCards
                        </span>
                      )}
                    </div>
                    <span className="absolute top-4 left-4 glass px-3 py-1 text-[9px] tracking-wider uppercase font-semibold text-brand-black border border-brand-gold/25">
                      {blog.category?.name}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-[10px] text-brand-black/50">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-gold" />
                          {blog.readingTime} min read
                        </span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-brand-black group-hover:text-brand-gold transition-colors leading-tight line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-brand-black/60 line-clamp-3 leading-relaxed">
                        {blog.content.replace(/<[^>]*>/g, '')}
                      </p>
                    </div>

                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase font-sans font-bold tracking-widest text-brand-black hover:text-brand-gold transition-colors"
                    >
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
