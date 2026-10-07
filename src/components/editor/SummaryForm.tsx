import React, { useState } from 'react';
import { aiImproveSummary } from '../../services/aiService';
import { SectionIconSelector } from './SectionIconSelector';
import { Sparkles, Loader2, Check, RefreshCw } from 'lucide-react';

interface Props {
  summary: string;
  careerObjective?: string;
  jobTitle?: string;
  onChange: (summary: string, careerObjective?: string) => void;
  sectionIcon?: string;
  showSectionIcons?: boolean;
  onSelectIcon?: (iconId: string) => void;
  onToggleShowIcons?: (show: boolean) => void;
}

export const SummaryForm: React.FC<Props> = ({
  summary,
  careerObjective,
  jobTitle,
  onChange,
  sectionIcon,
  showSectionIcons = true,
  onSelectIcon,
  onToggleShowIcons,
}) => {
  const [loading, setLoading] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  const handleAiImprove = async (mode: 'professional' | 'concise' | 'ats' | 'grammar') => {
    setShowAiMenu(false);
    setLoading(true);
    setAiSuccessMsg('');
    try {
      const improved = await aiImproveSummary(summary, jobTitle, mode);
      onChange(improved, careerObjective);
      setAiSuccessMsg(`Enhanced with ${mode.toUpperCase()} tone!`);
      setTimeout(() => setAiSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('AI assistant could not complete request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {onSelectIcon && (
        <SectionIconSelector
          sectionKey="summary"
          sectionTitle="Professional Summary"
          currentIcon={sectionIcon}
          showSectionIcons={showSectionIcons}
          onSelectIcon={onSelectIcon}
          onToggleShowIcons={onToggleShowIcons}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-700">Professional Summary</h4>
          <p className="text-xs text-slate-500">
            Write 3–5 sentences highlighting your core competencies and accomplishments.
          </p>
        </div>

        {/* AI Action Menu */}
        <div className="relative">
          <button
            type="button"
            disabled={loading}
            onClick={() => setShowAiMenu(!showAiMenu)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
            <span>Improve with AI</span>
          </button>

          {showAiMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 text-xs">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Style
              </div>
              <button
                type="button"
                onClick={() => handleAiImprove('professional')}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
              >
                👔 Make Professional & Active
              </button>
              <button
                type="button"
                onClick={() => handleAiImprove('concise')}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
              >
                ✂️ Make Concise & Direct
              </button>
              <button
                type="button"
                onClick={() => handleAiImprove('ats')}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
              >
                🎯 Optimize for ATS Algorithms
              </button>
              <button
                type="button"
                onClick={() => handleAiImprove('grammar')}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
              >
                ✨ Fix Grammar & Polish Flow
              </button>
            </div>
          )}
        </div>
      </div>

      {aiSuccessMsg && (
        <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <Check className="w-3.5 h-3.5" />
          <span>{aiSuccessMsg}</span>
        </div>
      )}

      <textarea
        rows={5}
        value={summary || ''}
        onChange={(e) => onChange(e.target.value, careerObjective)}
        placeholder="e.g. Dedicated and results-driven Senior High School Teacher with 10+ years of classroom experience. Specializing in physics and mathematics instruction..."
        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white leading-relaxed"
      />

      {/* Career Objective (Optional) */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Career Objective (Recommended for Fresh Graduates & Career Changers)
        </label>
        <textarea
          rows={3}
          value={careerObjective || ''}
          onChange={(e) => onChange(summary, e.target.value)}
          placeholder="e.g. Ambitious graduate seeking an entry-level position to apply academic foundation and technical skills in a fast-paced environment."
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
      </div>
    </div>
  );
};
