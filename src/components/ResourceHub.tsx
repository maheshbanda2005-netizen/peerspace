import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Upload,
  ThumbsUp,
  Download,
  Eye,
  FileText,
  Bookmark,
  Share2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { Resource } from '../types';

interface ResourceHubProps {
  resources: Resource[];
  activePreviewResource: Resource | null;
  onSelectPreviewResource: (res: Resource | null) => void;
  onToggleUpvote: (resourceId: string) => void;
  onAddResource: (resource: Resource) => void;
}

export const ResourceHub: React.FC<ResourceHubProps> = ({
  resources,
  activePreviewResource,
  onSelectPreviewResource,
  onToggleUpvote,
  onAddResource,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Reader state
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadDesc, setUploadDesc] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState<string>('Computer Science');
  const [uploadTags, setUploadTags] = useState<string>('Distributed Systems, Midterm, Notes');
  const [uploadType, setUploadType] = useState<'PDF' | 'Markdown' | 'Cheatsheet' | 'Summary'>('PDF');
  const [uploadSnippet, setUploadSnippet] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const categories = ['all', 'Computer Science', 'AI & ML', 'Mathematics'];

  const filteredResources = resources.filter(res => {
    const matchesCat = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesQuery =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setIsUploading(true);
    setUploadProgress(15);

    // Simulate direct-to-cloud presigned URL upload
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            const newRes: Resource = {
              id: `res_${Date.now()}`,
              title: uploadTitle.trim(),
              description: uploadDesc.trim() || 'Comprehensive student-curated revision notes.',
              category: uploadCategory,
              fileUrl: 'https://example.com/uploaded-note.pdf',
              fileSize: '2.8 MB',
              fileType: uploadType,
              tags: uploadTags.split(',').map(t => t.trim()).filter(Boolean),
              upvotes: 1,
              isUpvoted: true,
              downloads: 0,
              authorName: 'Alex Rivera',
              authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              createdAt: 'Just now',
              pages: 10,
              contentSnippet: uploadSnippet.trim() || `## ${uploadTitle.trim()}\n\nKey definitions, architectural models, and exam derivations.`,
            };
            onAddResource(newRes);
            setIsUploading(false);
            setUploadProgress(0);
            setShowUploadModal(false);
            setUploadTitle('');
            setUploadDesc('');
            setUploadSnippet('');
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleCopySnippet = () => {
    if (!activePreviewResource?.contentSnippet) return;
    navigator.clipboard.writeText(activePreviewResource.contentSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            Resource Hub & PDF Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Community-verified lecture notes, cheatsheets, and exam prep documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" /> Share Resource
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all shadow-2xs ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by topic, tag, or title..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 shadow-inner"
          />
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map(res => (
          <div
            key={res.id}
            className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-sm dark:shadow-xl"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/20">
                  {res.fileType} • {res.fileSize}
                </span>
                <button
                  onClick={() => onToggleUpvote(res.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                    res.isUpvoted
                      ? 'bg-violet-100 dark:bg-violet-600/30 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-500/40'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${res.isUpvoted ? 'fill-violet-600 dark:fill-violet-400' : ''}`} />
                  <span className="font-mono">{res.upvotes}</span>
                </button>
              </div>

              <h3
                onClick={() => onSelectPreviewResource(res)}
                className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2"
              >
                {res.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                {res.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {res.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/90 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/5 font-mono font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer / Author & Actions */}
            <div className="mt-5 pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={res.authorAvatar}
                  alt={res.authorName}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[90px] font-medium">{res.authorName}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSelectPreviewResource(res)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Document / PDF Previewer Modal */}
      {activePreviewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl h-[85vh] bg-white dark:bg-slate-900 border border-cyan-400/80 dark:border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
            {/* Top Toolbar */}
            <div className="px-6 py-3.5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-md">
                    {activePreviewResource.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    By {activePreviewResource.authorName} • {activePreviewResource.fileType} ({activePreviewResource.fileSize})
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Zoom */}
                <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-2 py-1 text-xs">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
                    className="p-1 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] px-1 font-bold">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(175, prev + 15))}
                    className="p-1 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-2 py-1 text-xs font-mono">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage <= 1}
                    className="p-1 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-bold">
                    {currentPage} / {activePreviewResource.pages || 8}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(activePreviewResource.pages || 8, prev + 1))}
                    disabled={currentPage >= (activePreviewResource.pages || 8)}
                    className="p-1 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 disabled:opacity-30"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleCopySnippet}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Copy markdown text"
                >
                  {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Bookmark className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => onSelectPreviewResource(null)}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content View */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-100 dark:bg-[#0B0F19] flex justify-center">
              <div
                className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-xl text-slate-800 dark:text-slate-200 transition-all font-sans leading-relaxed"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-4 font-bold">
                  Document Preview • Page {currentPage}
                </div>

                {activePreviewResource.contentSnippet ? (
                  <div className="prose dark:prose-invert max-w-none text-sm space-y-4 whitespace-pre-line font-mono text-slate-800 dark:text-slate-300">
                    {activePreviewResource.contentSnippet}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Full document content loaded securely via encrypted CDN presigned token.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-4">
                <span>Direct S3/R2 Streaming</span>
                <span>Verified by Academic Peer Group</span>
              </div>
              <button
                onClick={() => alert('Downloading original verified PDF resource...')}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF ({activePreviewResource.fileSize})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Share Academic Resource</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus & Raft Notes"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={e => setUploadCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Format</label>
                  <select
                    value={uploadType}
                    onChange={e => setUploadType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Cheatsheet">Cheatsheet</option>
                    <option value="Summary">Summary</option>
                    <option value="Markdown">Markdown</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={e => setUploadTags(e.target.value)}
                  placeholder="CS162, Midterm, Consensus"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Content Preview / Notes Summary</label>
                <textarea
                  rows={3}
                  value={uploadSnippet}
                  onChange={e => setUploadSnippet(e.target.value)}
                  placeholder="Paste brief markdown notes, key equations, or definitions..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>

              {isUploading && (
                <div className="space-y-1.5 py-2">
                  <div className="flex justify-between text-[11px] text-cyan-600 dark:text-cyan-400 font-mono font-bold">
                    <span>Direct-to-S3 Multipart Presigned Upload...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-md shadow-cyan-600/30"
                >
                  {isUploading ? 'Uploading...' : 'Publish to Colla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

