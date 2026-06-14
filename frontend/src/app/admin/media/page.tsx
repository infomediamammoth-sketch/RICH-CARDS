'use strict';
'use client';

import { useState, useEffect } from 'react';
import {
  FolderOpen,
  Upload,
  Trash2,
  FileText,
  Video,
  Image as ImageIcon,
  CheckCircle,
  Folder,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminMediaLibrary() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch media items
  useEffect(() => {
    async function fetchMedia() {
      setLoading(true);
      try {
        const data = await api.getMedia(activeFolder || undefined);
        setMedia(data);
      } catch (err) {
        console.error('Failed to load media items', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, [activeFolder]);

  // Upload file
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSuccessMsg('');
    try {
      const result = await api.uploadMedia(file, activeFolder, false);
      setMedia((prev) => [result, ...prev]);
      setSuccessMsg('Media uploaded and WebP compressed successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to upload media', err);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // Delete media
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file permanently?')) return;
    try {
      await api.deleteMedia(id);
      setMedia((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete media', err);
    }
  };

  const folders = ['general', 'templates', 'blogs', 'banners'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-brand-gold text-[10px] font-sans font-bold tracking-[0.2em] uppercase block mb-1">
            Studio Assets
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-black uppercase tracking-wider">
            Media Library
          </h1>
        </div>

        {/* Upload Button */}
        <label className="group px-4 py-2.5 bg-brand-black text-brand-ivory hover:bg-brand-gold hover:text-brand-black font-sans font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center gap-2 cursor-pointer self-start md:self-auto">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload File'}
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Folders Tab Controls */}
      <div className="flex flex-wrap gap-2 border-b border-brand-gold/15 pb-4">
        {folders.map((folder) => (
          <button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            className={`px-4 py-2 border text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
              activeFolder === folder
                ? 'bg-brand-black text-brand-ivory border-brand-black'
                : 'bg-white border-brand-gold/15 text-brand-black hover:border-brand-gold'
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-brand-gold" />
            {folder}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-brand-black/40 animate-pulse uppercase tracking-widest bg-white border border-brand-gold/10">
          Loading Media Files...
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-brand-gold/20 bg-white">
          <FolderOpen className="w-10 h-10 text-brand-gold/40 mx-auto mb-3" />
          <h3 className="font-serif text-base font-bold text-brand-black mb-1">
            Folder is empty
          </h3>
          <p className="text-[10px] text-brand-black/40 uppercase">
            Upload files in this category above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
          {media.map((file) => {
            const fileExt = file.format.toLowerCase();
            const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fileExt);
            const isVideo = ['mp4', 'webm', 'mov'].includes(fileExt);

            // Path resolves statically to uploads folder on backend
            const relativePath = file.filepath.startsWith('/') ? file.filepath : `/${file.filepath}`;
            const fileSrc = `http://localhost:4000${relativePath}`;

            return (
              <div
                key={file.id}
                className="group relative bg-white border border-brand-gold/10 hover-gold transition-all duration-300 p-3 flex flex-col justify-between"
              >
                {/* File Thumbnail Preview */}
                <div className="aspect-[3/4] bg-brand-ivory flex items-center justify-center border border-brand-gold/5 relative overflow-hidden mb-3">
                  {isImage ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${fileSrc})` }}
                    />
                  ) : isVideo ? (
                    <Video className="w-8 h-8 text-brand-gold/45" />
                  ) : (
                    <FileText className="w-8 h-8 text-brand-gold/45" />
                  )}
                </div>

                {/* File Meta Info */}
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-brand-black truncate" title={file.filename}>
                    {file.filename}
                  </h4>
                  <div className="flex items-center justify-between text-[8px] text-brand-black/40 uppercase font-semibold">
                    <span>{file.format}</span>
                    <span>{Math.round(file.sizeBytes / 1024)} KB</span>
                  </div>
                </div>

                {/* Trash Delete Overlay Button */}
                <button
                  onClick={() => handleDelete(file.id)}
                  className="absolute top-4 right-4 p-1.5 bg-red-500 hover:bg-red-600 text-white shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label="Delete File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
