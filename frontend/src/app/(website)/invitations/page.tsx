'use strict';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowRight, Grid, LayoutGrid } from 'lucide-react';
import { api } from '@/lib/api';

export default function InvitationsGallery() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load category and tags list
  useEffect(() => {
    async function loadFilters() {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          api.getCategories(),
          api.getTags(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        console.error('Failed to load filters list', err);
      }
    }
    loadFilters();
  }, []);

  // Query templates when filters change
  useEffect(() => {
    async function fetchTemplates() {
      setLoading(true);
      try {
        const result = await api.getTemplates({
          category: selectedCategory,
          format: selectedFormat,
          tag: selectedTag,
          search: searchQuery,
          sort: sortOption,
          page,
          limit: 12,
        });
        setTemplates(result.items);
        setTotalPages(result.meta.pages);
      } catch (err) {
        console.error('Failed to load templates', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, [selectedCategory, selectedFormat, selectedTag, searchQuery, sortOption, page]);

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-brand-gold text-xs font-sans font-bold tracking-[0.3em] uppercase block">
            Premium Stationery
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-black">
            Invitation Gallery
          </h1>
          <p className="text-xs text-brand-black/60 leading-relaxed">
            Discover a curated collection of luxury wedding invitation templates, digital invites, monograms, and itinerary cards custom-tailored for your wedding style.
          </p>
        </div>

        {/* Toolbar Filter Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 bg-white border border-brand-gold/15 p-6 shrink-0 space-y-8">
            <div className="flex items-center justify-between border-b border-brand-gold/10 pb-4">
              <span className="font-serif text-sm font-bold text-brand-black uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
                Filters
              </span>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedFormat('');
                  setSelectedTag('');
                  setSearchQuery('');
                  setSortOption('newest');
                }}
                className="text-[10px] uppercase font-sans tracking-widest text-brand-gold hover:text-brand-black transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <h4 className="font-serif text-xs font-bold text-brand-black uppercase tracking-wide">
                Search
              </h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search designs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 pl-8 focus:border-brand-gold outline-none transition-colors"
                />
                <Search className="absolute left-2.5 top-3 w-3.5 h-3.5 text-brand-black/40" />
              </div>
            </div>

            {/* Categories Filter */}
            <div className="space-y-2.5">
              <h4 className="font-serif text-xs font-bold text-brand-black uppercase tracking-wide border-b border-brand-gold/5 pb-2">
                Category
              </h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`text-xs text-left px-2 py-1.5 transition-colors ${
                    selectedCategory === ''
                      ? 'bg-brand-black text-brand-ivory font-semibold'
                      : 'hover:text-brand-gold text-brand-black/70'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`text-xs text-left px-2 py-1.5 transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-brand-black text-brand-ivory font-semibold'
                        : 'hover:text-brand-gold text-brand-black/70'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Format Filter */}
            <div className="space-y-2.5">
              <h4 className="font-serif text-xs font-bold text-brand-black uppercase tracking-wide border-b border-brand-gold/5 pb-2">
                Format Type
              </h4>
              <div className="flex flex-col gap-2">
                {['', 'video', 'pdf', 'jpg'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`text-xs text-left px-2 py-1.5 transition-colors uppercase ${
                      selectedFormat === fmt
                        ? 'bg-brand-black text-brand-ivory font-semibold'
                        : 'hover:text-brand-gold text-brand-black/70'
                    }`}
                  >
                    {fmt === '' ? 'All Formats' : `${fmt} Invitation`}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div className="space-y-2.5">
              <h4 className="font-serif text-xs font-bold text-brand-black uppercase tracking-wide border-b border-brand-gold/5 pb-2">
                Design Theme
              </h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedTag('')}
                  className={`text-xs text-left px-2 py-1.5 transition-colors ${
                    selectedTag === ''
                      ? 'bg-brand-black text-brand-ivory font-semibold'
                      : 'hover:text-brand-gold text-brand-black/70'
                  }`}
                >
                  All Themes
                </button>
                {tags.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTag(t.slug)}
                    className={`text-xs text-left px-2 py-1.5 transition-colors ${
                      selectedTag === t.slug
                        ? 'bg-brand-black text-brand-ivory font-semibold'
                        : 'hover:text-brand-gold text-brand-black/70'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Grid Area */}
          <div className="flex-grow w-full space-y-8">
            {/* Sorting Toolbar */}
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-4">
              <span className="text-xs text-brand-black/60 font-medium">
                Showing {templates.length} templates
              </span>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-brand-black/60 font-semibold">Sort By</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white border border-brand-gold/15 text-xs py-1.5 px-3 focus:border-brand-gold outline-none rounded-none"
                >
                  <option value="newest">Newest Arrival</option>
                  <option value="popular">Popularity</option>
                  <option value="featured">Featured</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>

            {/* Template Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col space-y-4">
                    <div className="bg-brand-black/5 aspect-[3/4]" />
                    <div className="h-4 bg-brand-black/5 w-2/3" />
                    <div className="h-3 bg-brand-black/5 w-1/3" />
                  </div>
                ))}
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-brand-gold/20 bg-white">
                <h3 className="font-serif text-lg font-bold text-brand-black mb-2">
                  No templates found
                </h3>
                <p className="text-xs text-brand-black/50">
                  Try tweaking your search keywords or resetting active filter options.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((item) => (
                  <Link
                    key={item.id}
                    href={`/invitations/${item.slug}`}
                    className="group flex flex-col bg-white border border-brand-gold/10 hover-gold transition-all duration-500 overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[3/4] bg-brand-gray overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                        style={{
                          backgroundImage: `url(${
                            item.imageUrls?.[0] || '/templates/royal_thumb.jpg'
                          })`,
                        }}
                      />
                      <span className="absolute top-4 left-4 glass px-3 py-1 text-[9px] tracking-wider uppercase font-semibold text-brand-black border border-brand-gold/20">
                        {item.category?.name}
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-base font-bold text-brand-black group-hover:text-brand-gold transition-colors leading-tight mb-2">
                          {item.title}
                        </h3>
                        {/* Tags list */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.tags?.slice(0, 2).map((t: any) => (
                            <span key={t.id} className="text-[9px] text-brand-black/40 bg-brand-ivory px-2 py-0.5 border border-brand-gold/10">
                              {t.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 border-t border-brand-gold/5 pt-3">
                        <span className="text-xs font-sans font-semibold text-brand-black/50 flex items-center gap-1">
                          Inquire
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="text-sm font-sans font-bold text-brand-gold">
                          ₹{item.price}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-8">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 font-sans text-xs font-semibold flex items-center justify-center border transition-all ${
                      page === i + 1
                        ? 'bg-brand-black text-brand-ivory border-brand-black'
                        : 'border-brand-gold/15 text-brand-black hover:border-brand-gold'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
