'use strict';
'use client';

import { useState, useEffect } from 'react';
import {
  FileImage,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Sparkles,
  Upload,
  Check,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminTemplatesManager() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [watermarks, setWatermarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('0');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [watermarked, setWatermarked] = useState(true);
  const [watermarkId, setWatermarkId] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  
  // Media Files
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [templatesResult, categoriesData, tagsData, watermarksData] = await Promise.all([
          api.getTemplates({ limit: 100 }),
          api.getCategories(),
          api.getTags(),
          api.getWatermarks(),
        ]);
        setTemplates(templatesResult.items);
        setCategories(categoriesData);
        setTags(tagsData);
        setWatermarks(watermarksData);
      } catch (err) {
        console.error('Failed to load templates manager data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setTitle('');
    setPrice('0');
    setDescription('');
    setCategoryId(categories[0]?.id || '');
    setSelectedTagIds([]);
    setWatermarked(true);
    setWatermarkId('');
    setDisplayOrder('0');
    setImageUrls([]);
    setPreviewVideoUrl('');
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords('');
    setFormOpen(true);
  };

  const openEditForm = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setPrice(String(item.price));
    setDescription(item.description);
    setCategoryId(item.categoryId);
    setSelectedTagIds(item.tags?.map((t: any) => t.id) || []);
    setWatermarked(item.watermarked);
    setWatermarkId(item.watermarkId || '');
    setDisplayOrder(String(item.displayOrder));
    setImageUrls(item.imageUrls || []);
    setPreviewVideoUrl(item.previewVideoUrl || '');
    setSeoTitle(item.seoMetadata?.title || '');
    setSeoDescription(item.seoMetadata?.description || '');
    setSeoKeywords(item.seoMetadata?.keywords?.join(', ') || '');
    setFormOpen(true);
  };

  const handleTagToggle = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  // Upload previews
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Apply watermark if checked and uploading thumbnail/screenshot
      const uploadResult = await api.uploadMedia(
        file,
        'templates',
        type === 'image' ? watermarked : false,
        type === 'image' && watermarkId ? watermarkId : undefined
      );

      if (type === 'image') {
        setImageUrls((prev) => [...prev, uploadResult.filepath]);
      } else {
        setPreviewVideoUrl(uploadResult.filename); // Store filename or relative path
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed. Please ensure the backend is running and supports static uploads.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      price: Number(price),
      description,
      categoryId,
      tagIds: selectedTagIds,
      watermarked,
      watermarkId: watermarkId || undefined,
      displayOrder: Number(displayOrder),
      imageUrls,
      previewVideoUrl,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      seoKeywords: seoKeywords ? seoKeywords.split(',').map((k) => k.trim()) : undefined,
    };

    try {
      if (editingId) {
        const updated = await api.updateTemplate(editingId, data);
        setTemplates((prev) => prev.map((t) => (t.id === editingId ? updated : t)));
      } else {
        const created = await api.createTemplate(data);
        setTemplates((prev) => [created, ...prev]);
      }
      setFormOpen(false);
    } catch (err: any) {
      console.error('Failed to save template', err);
      alert(err.message || 'Error occurred while saving template.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this design template?')) return;
    try {
      await api.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete template', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-brand-gold text-[10px] font-sans font-bold tracking-[0.2em] uppercase block mb-1">
            Studio Portfolio
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-black uppercase tracking-wider">
            Template Manager
          </h1>
        </div>

        <button
          onClick={openAddForm}
          className="group px-4 py-2 bg-brand-black text-brand-ivory hover:bg-brand-gold hover:text-brand-black font-sans font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </button>
      </div>

      {/* Main layout: Grid list or Edit Drawer overlay */}
      {formOpen ? (
        <div className="bg-white border border-brand-gold/15 p-6 md:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-brand-gold/10 pb-4">
            <h2 className="font-serif text-lg font-bold text-brand-black uppercase tracking-wider">
              {editingId ? 'Edit Invitation Template' : 'Create New Template'}
            </h2>
            <button
              onClick={() => setFormOpen(false)}
              className="text-brand-black/40 hover:text-brand-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column Fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                  Template Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Gold Invitation"
                  className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                    Studio Price (INR)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                    Display Order (Sorting)
                  </label>
                  <input
                    type="number"
                    required
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe invitation files, audio tracks, transitions..."
                  className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold resize-none"
                />
              </div>

              {/* Category dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                  Product Category
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2.5 outline-none focus:border-brand-gold rounded-none"
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Watermarks Toggle */}
              <div className="p-4 border border-brand-gold/15 bg-brand-ivory/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-black font-semibold">Apply Watermark over Images?</span>
                  <input
                    type="checkbox"
                    checked={watermarked}
                    onChange={(e) => setWatermarked(e.target.checked)}
                    className="w-4 h-4 accent-brand-gold"
                  />
                </div>
                {watermarked && watermarks.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                      Select Watermark Overlay File
                    </label>
                    <select
                      value={watermarkId}
                      onChange={(e) => setWatermarkId(e.target.value)}
                      className="w-full bg-white border border-brand-gold/10 text-xs p-1.5 outline-none focus:border-brand-gold rounded-none"
                    >
                      <option value="">Use Global default watermark</option>
                      {watermarks.map((w) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column Fields */}
            <div className="space-y-6">
              {/* Media File Uploads */}
              <div className="p-5 border border-brand-gold/15 bg-white space-y-4">
                <h3 className="font-serif text-xs font-bold text-brand-black uppercase tracking-wide border-b border-brand-gold/5 pb-2">
                  Template Attachments
                </h3>

                {/* Screenshot Upload */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                    Screenshot Gallery (Upload files to display in carousel)
                  </span>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="relative w-14 aspect-[3/4] border border-brand-gold/20 bg-brand-ivory bg-cover bg-center">
                        <button
                          type="button"
                          onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 border border-brand-gold/25 hover:border-brand-gold text-[10px] uppercase font-sans font-bold text-brand-gold hover:text-brand-black transition-colors cursor-pointer bg-brand-ivory/10">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* Video Upload */}
                <div className="space-y-2 border-t border-brand-gold/5 pt-3">
                  <span className="text-[9px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                    Video Reel Preview (.mp4)
                  </span>
                  {previewVideoUrl ? (
                    <div className="flex items-center gap-3 bg-brand-ivory p-2 border border-brand-gold/10 text-[10px]">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate max-w-xs">{previewVideoUrl}</span>
                      <button
                        type="button"
                        onClick={() => setPreviewVideoUrl('')}
                        className="text-red-500 font-bold ml-auto"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 border border-brand-gold/25 hover:border-brand-gold text-[10px] uppercase font-sans font-bold text-brand-gold hover:text-brand-black transition-colors cursor-pointer bg-brand-ivory/10">
                      <Upload className="w-3.5 h-3.5" />
                      Upload MP4 Video
                      <input
                        type="file"
                        accept="video/mp4"
                        onChange={(e) => handleFileUpload(e, 'video')}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Tag Selection */}
              <div className="space-y-2">
                <h4 className="font-serif text-xs font-bold text-brand-black uppercase tracking-wide">
                  Design Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => {
                    const isChecked = selectedTagIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleTagToggle(t.id)}
                        className={`px-3 py-1 border text-[10px] uppercase tracking-wider font-bold transition-all ${
                          isChecked
                            ? 'bg-brand-black text-brand-ivory border-brand-black'
                            : 'bg-white border-brand-gold/15 text-brand-black hover:border-brand-gold'
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SEO Configurations */}
              <div className="p-5 border border-brand-gold/15 bg-white space-y-4">
                <h3 className="font-serif text-xs font-bold text-brand-black uppercase tracking-wide border-b border-brand-gold/5 pb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  SEO Tags Management
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="e.g. Royal Gold Premium Wedding Invite Card"
                      className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2 outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                      Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Describe the card keywords..."
                      className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs p-2.5 outline-none focus:border-brand-gold resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-sans tracking-widest text-brand-black/50 block font-semibold">
                      Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="wedding card, luxury monogram, gold invite"
                      className="w-full bg-[#FDFBF7] border border-brand-gold/10 text-xs px-3 py-2 outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-gold text-brand-black hover:bg-brand-black hover:text-brand-ivory transition-colors font-sans font-bold uppercase tracking-wider text-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Template
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-6 py-3 border border-brand-gold/15 text-brand-black hover:bg-brand-ivory transition-colors font-sans font-bold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* Template List Grid */
        <div className="bg-white border border-brand-gold/15 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-brand-black/40 animate-pulse uppercase tracking-widest">
              Fetching Catalog templates...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-ivory text-brand-black/50 border-b border-brand-gold/15 font-semibold">
                    <th className="p-4">Template details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Tags</th>
                    <th className="p-4">Watermarked</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-brand-black/40 font-sans">
                        No design templates found. Click &apos;Add Template&apos; to create one.
                      </td>
                    </tr>
                  ) : (
                    templates.map((item) => (
                      <tr key={item.id} className="border-b border-brand-gold/5 hover:bg-brand-ivory/15 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          {/* Image thumb */}
                          <div
                            className="w-10 h-12 border border-brand-gold/20 bg-brand-gray bg-cover bg-center shrink-0"
                            style={{
                              backgroundImage: `url(${
                                item.imageUrls?.[0] || '/templates/royal_thumb.jpg'
                              })`,
                            }}
                          />
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-brand-black truncate max-w-xs">{item.title}</h4>
                            <span className="text-[10px] text-brand-black/40 font-sans block truncate max-w-xs">
                              /{item.slug}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-brand-black/70">
                          {item.category?.name}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {item.tags?.slice(0, 3).map((t: any) => (
                              <span key={t.id} className="text-[9px] bg-brand-ivory text-brand-black/60 border border-brand-gold/10 px-1.5 py-0.5 font-bold">
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-semibold">
                          {item.watermarked ? (
                            <span className="text-brand-gold">Yes</span>
                          ) : (
                            <span className="text-brand-black/30">No</span>
                          )}
                        </td>
                        <td className="p-4 font-bold text-brand-black">
                          ₹{item.price}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => openEditForm(item)}
                              className="p-2 border border-transparent hover:border-brand-gold/20 text-brand-black/50 hover:text-brand-gold transition-colors"
                              aria-label="Edit Template"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 border border-transparent hover:border-red-500/20 text-brand-black/40 hover:text-red-500 transition-colors"
                              aria-label="Delete Template"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
