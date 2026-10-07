import React, { useState } from 'react';
import { Skill, SkillCategory } from '../../types/resume';
import { aiSuggestSkills } from '../../services/aiService';
import { SectionIconSelector } from './SectionIconSelector';
import { Plus, Trash2, Sparkles, Loader2, Check } from 'lucide-react';

interface Props {
  skills: Skill[];
  jobTitle?: string;
  showSkillPercentages: boolean;
  onToggleSkillPercentages: (val: boolean) => void;
  onChange: (skills: Skill[]) => void;
  sectionIcon?: string;
  showSectionIcons?: boolean;
  onSelectIcon?: (iconId: string) => void;
  onToggleShowIcons?: (show: boolean) => void;
}

const CATEGORIES: SkillCategory[] = ['Technical', 'Professional', 'Soft', 'Computer', 'Language'];

export const SkillsForm: React.FC<Props> = ({
  skills,
  jobTitle = '',
  showSkillPercentages,
  onToggleSkillPercentages,
  onChange,
  sectionIcon,
  showSectionIcons = true,
  onSelectIcon,
  onToggleShowIcons,
}) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Technical');
  const [loadingAi, setLoadingAi] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  const addSkill = (name?: string, category?: SkillCategory) => {
    const val = (name || newSkillName).trim();
    if (!val) return;
    const newEntry: Skill = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: val,
      level: 4,
      category: category || newSkillCategory,
      showLevel: true,
    };
    onChange([...skills, newEntry]);
    if (!name) setNewSkillName('');
    setSuggestedSkills(suggestedSkills.filter((s) => s !== val));
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const updateSkillLevel = (id: string, level: number) => {
    onChange(skills.map((s) => (s.id === id ? { ...s, level } : s)));
  };

  const handleAiSuggest = async () => {
    if (!jobTitle) {
      alert('Please enter a Job Title in Personal Info first.');
      return;
    }
    setLoadingAi(true);
    try {
      const res = await aiSuggestSkills(jobTitle);
      const combined = [...res.technical, ...res.soft, ...res.tools];
      // Filter out already added skills
      const existingNames = new Set(skills.map((s) => s.name.toLowerCase()));
      const filtered = combined.filter((s) => !existingNames.has(s.toLowerCase()));
      setSuggestedSkills(filtered);
    } catch (err) {
      console.error(err);
      alert('Could not suggest skills.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-4">
      {onSelectIcon && (
        <SectionIconSelector
          sectionKey="skills"
          sectionTitle="Skills & Competencies"
          currentIcon={sectionIcon}
          showSectionIcons={showSectionIcons}
          onSelectIcon={onSelectIcon}
          onToggleShowIcons={onToggleShowIcons}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-700">Skills & Competencies</h4>
          <p className="text-xs text-slate-500">Add technical proficiencies and soft skills.</p>
        </div>
        <button
          type="button"
          disabled={loadingAi}
          onClick={handleAiSuggest}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg shadow-sm transition disabled:opacity-50"
        >
          {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
          <span>Suggest Skills with AI</span>
        </button>
      </div>

      {/* Toggle skill percentages setting */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-800 block">Skill Ratings & Progress Bars</span>
          <span className="text-[11px] text-slate-500">
            Professional recruiters often recommend disabling subjective percentage bars.
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showSkillPercentages}
            onChange={(e) => onToggleSkillPercentages(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {/* AI Suggestions Pill Bar */}
      {suggestedSkills.length > 0 && (
        <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
          <span className="text-[11px] font-bold text-indigo-900 block mb-2">
            💡 Recommended for {jobTitle}:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedSkills.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addSkill(s, 'Technical')}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white text-indigo-800 border border-indigo-200 rounded-lg transition shadow-2xs font-medium"
              >
                <Plus className="w-3 h-3" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Add Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="e.g. Physics Pedagogy, TypeScript, Financial Auditing..."
          className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
        <select
          value={newSkillCategory}
          onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
          className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => addSkill()}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
        >
          Add
        </button>
      </div>

      {/* Skills list */}
      <div className="space-y-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-xs hover:border-slate-300 transition"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">{skill.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                {skill.category}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {showSkillPercentages && (
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={skill.level}
                    onChange={(e) => updateSkillLevel(skill.id, parseInt(e.target.value))}
                    className="w-20 accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 w-8">{skill.level * 20}%</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-md transition"
                title="Delete skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
