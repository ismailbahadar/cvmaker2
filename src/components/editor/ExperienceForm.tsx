import React, { useState } from 'react';
import { WorkExperience } from '../../types/resume';
import { aiGenerateResponsibilities, aiImproveDescription } from '../../services/aiService';
import { SectionIconSelector } from './SectionIconSelector';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Loader2, GripVertical } from 'lucide-react';

interface Props {
  experience: WorkExperience[];
  onChange: (exp: WorkExperience[]) => void;
  sectionIcon?: string;
  showSectionIcons?: boolean;
  onSelectIcon?: (iconId: string) => void;
  onToggleShowIcons?: (show: boolean) => void;
}

export const ExperienceForm: React.FC<Props> = ({
  experience,
  onChange,
  sectionIcon,
  showSectionIcons = true,
  onSelectIcon,
  onToggleShowIcons,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id || null);
  const [loadingAiId, setLoadingAiId] = useState<string | null>(null);

  const addExperience = () => {
    const newEntry: WorkExperience = {
      id: `exp_${Date.now()}`,
      jobTitle: '',
      company: '',
      location: '',
      employmentType: 'Full-time',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      responsibilities: [],
    };
    onChange([...experience, newEntry]);
    setExpandedId(newEntry.id);
  };

  const updateEntry = (id: string, updates: Partial<WorkExperience>) => {
    onChange(experience.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeEntry = (id: string) => {
    onChange(experience.filter((item) => item.id !== id));
  };

  const handleGenerateBullets = async (item: WorkExperience) => {
    if (!item.jobTitle) {
      alert('Please fill in the Job Title first so AI can generate relevant bullet points.');
      return;
    }
    setLoadingAiId(item.id);
    try {
      const generated = await aiGenerateResponsibilities(item.jobTitle, item.company);
      const currentBullets = item.responsibilities || [];
      updateEntry(item.id, { responsibilities: [...currentBullets, ...generated] });
    } catch (err) {
      console.error(err);
      alert('Could not generate bullet points. Please try again.');
    } finally {
      setLoadingAiId(null);
    }
  };

  const handleImproveDescription = async (item: WorkExperience) => {
    if (!item.description) {
      alert('Please write a brief description first to improve.');
      return;
    }
    setLoadingAiId(item.id);
    try {
      const improved = await aiImproveDescription(item.description, item.jobTitle);
      updateEntry(item.id, { description: improved });
    } catch (err) {
      console.error(err);
      alert('Could not improve description.');
    } finally {
      setLoadingAiId(null);
    }
  };

  const handleAddResponsibilityBullet = (id: string) => {
    const item = experience.find((e) => e.id === id);
    if (item) {
      const list = item.responsibilities || [];
      updateEntry(id, { responsibilities: [...list, ''] });
    }
  };

  const handleUpdateResponsibilityBullet = (id: string, index: number, value: string) => {
    const item = experience.find((e) => e.id === id);
    if (item) {
      const list = [...(item.responsibilities || [])];
      list[index] = value;
      updateEntry(id, { responsibilities: list });
    }
  };

  const handleRemoveResponsibilityBullet = (id: string, index: number) => {
    const item = experience.find((e) => e.id === id);
    if (item) {
      const list = (item.responsibilities || []).filter((_, i) => i !== index);
      updateEntry(id, { responsibilities: list });
    }
  };

  return (
    <div className="space-y-4">
      {onSelectIcon && (
        <SectionIconSelector
          sectionKey="experience"
          sectionTitle="Work Experience"
          currentIcon={sectionIcon}
          showSectionIcons={showSectionIcons}
          onSelectIcon={onSelectIcon}
          onToggleShowIcons={onToggleShowIcons}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-700">Employment History</h4>
          <p className="text-xs text-slate-500">Showcase your relevant roles, achievements, and impact.</p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center">
          <p className="text-xs text-slate-500 mb-2">No work experience added yet.</p>
          <button
            type="button"
            onClick={addExperience}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            + Add your first work experience
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {experience.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                {/* Header bar */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="px-4 py-3 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between cursor-pointer transition select-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">
                        {item.jobTitle || 'Untitled Position'}
                        {item.company ? ` at ${item.company}` : ''}
                      </h5>
                      <span className="text-[10px] text-slate-500">
                        {item.startDate || 'Start Date'} - {item.isCurrent ? 'Present' : item.endDate || 'End Date'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEntry(item.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Form fields */}
                {isExpanded && (
                  <div className="p-4 space-y-4 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title *</label>
                        <input
                          type="text"
                          value={item.jobTitle}
                          onChange={(e) => updateEntry(item.id, { jobTitle: e.target.value })}
                          placeholder="e.g. Senior Teacher / Full Stack Engineer"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization *</label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => updateEntry(item.id, { company: e.target.value })}
                          placeholder="e.g. Army Public School / Google"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={item.location || ''}
                          onChange={(e) => updateEntry(item.id, { location: e.target.value })}
                          placeholder="e.g. Islamabad, Pakistan"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Type</label>
                        <select
                          value={item.employmentType || 'Full-time'}
                          onChange={(e) => updateEntry(item.id, { employmentType: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                          <option value="Freelance">Freelance</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                        <input
                          type="text"
                          value={item.startDate}
                          onChange={(e) => updateEntry(item.id, { startDate: e.target.value })}
                          placeholder="e.g. Aug 2019 or 2019-08"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                        <input
                          type="text"
                          disabled={item.isCurrent}
                          value={item.isCurrent ? 'Present' : item.endDate}
                          onChange={(e) => updateEntry(item.id, { endDate: e.target.value })}
                          placeholder="e.g. Present or Dec 2023"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-slate-100"
                        />
                        <label className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!item.isCurrent}
                            onChange={(e) => updateEntry(item.id, { isCurrent: e.target.checked })}
                            className="rounded text-indigo-600"
                          />
                          <span>I currently work here</span>
                        </label>
                      </div>
                    </div>

                    {/* Role Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">Role Overview</label>
                        <button
                          type="button"
                          disabled={loadingAiId === item.id}
                          onClick={() => handleImproveDescription(item)}
                          className="text-[11px] text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
                        >
                          {loadingAiId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          <span>Polish with AI</span>
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => updateEntry(item.id, { description: e.target.value })}
                        placeholder="Brief overview of department, team, or scope of responsibility..."
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>

                    {/* Action-Oriented Bullet Points */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-700">Key Achievements & Responsibilities</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={loadingAiId === item.id}
                            onClick={() => handleGenerateBullets(item)}
                            className="px-2 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md flex items-center gap-1"
                          >
                            {loadingAiId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            <span>AI Generate Bullets</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddResponsibilityBullet(item.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
                          >
                            + Add Bullet
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {(item.responsibilities || []).map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs">•</span>
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => handleUpdateResponsibilityBullet(item.id, bIdx, e.target.value)}
                              placeholder="e.g. Increased student pass rate by 15% through customized revision workshops."
                              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveResponsibilityBullet(item.id, bIdx)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delete entry action */}
                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeEntry(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Delete this position"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Position</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
