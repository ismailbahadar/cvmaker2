import React, { useState } from 'react';
import { TEMPLATES_LIST } from '../../data/templatesMeta';
import { TemplateId, TemplateMeta } from '../../types/resume';
import { Search, CheckCircle2, Layout, Sparkles, Filter, X } from 'lucide-react';

interface Props {
  selectedTemplateId?: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  onClose?: () => void;
}

const CATEGORIES = [
  'All',
  'Professional',
  'Executive',
  'Minimal',
  'Business',
  'Teacher',
  'Government',
  'Academic',
  'Creative',
  'Modern',
  'International',
];

export const TemplateGallery: React.FC<Props> = ({
  selectedTemplateId = 'classic',
  onSelectTemplate,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMeta | null>(null);

  const filtered = TEMPLATES_LIST.filter((tmpl) => {
    const matchesCategory = activeCategory === 'All' || tmpl.category === activeCategory;
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.recommendedFor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Categories Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates or industries..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tmpl) => {
          const isSelected = selectedTemplateId === tmpl.id;
          return (
            <div
              key={tmpl.id}
              className={`rounded-2xl border transition overflow-hidden flex flex-col justify-between bg-white shadow-sm hover:shadow-md ${
                isSelected ? 'ring-2 ring-indigo-600 border-indigo-600' : 'border-slate-200'
              }`}
            >
              {/* Visual Card Header Preview Area */}
              <div
                className="h-44 p-4 flex flex-col justify-between relative overflow-hidden transition"
                style={{
                  background:
                    tmpl.columns === 2
                      ? `linear-gradient(90deg, ${tmpl.primaryColor} 35%, #f8fafc 35%)`
                      : `linear-gradient(180deg, ${tmpl.primaryColor} 12%, #f8fafc 12%)`,
                }}
              >
                <div className="flex justify-between items-start z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/90 text-slate-800 shadow-xs">
                    {tmpl.category}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white shadow-xs">
                      <CheckCircle2 className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>

                {/* Abstract Layout Lines */}
                <div className="z-10 bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <div className="w-1/3 h-2 rounded bg-slate-800 mb-1.5" />
                  <div className="w-1/4 h-1.5 rounded bg-slate-400 mb-2" />
                  <div className="space-y-1">
                    <div className="w-full h-1 rounded bg-slate-200" />
                    <div className="w-5/6 h-1 rounded bg-slate-200" />
                    <div className="w-2/3 h-1 rounded bg-slate-200" />
                  </div>
                </div>
              </div>

              {/* Template Meta Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{tmpl.name}</h4>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                  <div className="text-[11px] text-slate-600 font-medium mb-4">
                    <span className="text-slate-400">Best for:</span> {tmpl.recommendedFor}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTemplate(tmpl.id);
                      if (onClose) onClose();
                    }}
                    className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm text-center"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
