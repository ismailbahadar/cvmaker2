import React, { useState } from 'react';
import { Education } from '../../types/resume';
import { SectionIconSelector } from './SectionIconSelector';
import { Plus, Trash2, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';

interface Props {
  education: Education[];
  onChange: (edu: Education[]) => void;
  sectionIcon?: string;
  showSectionIcons?: boolean;
  onSelectIcon?: (iconId: string) => void;
  onToggleShowIcons?: (show: boolean) => void;
}

const COMMON_DEGREES = [
  'SSC / Matriculation (Science / Arts)',
  'HSSC / Intermediate (FSc Pre-Engineering / Pre-Medical / ICS / FA)',
  'B.Sc / BA (2 Years)',
  'BS / B.Sc (Hons) (4 Years)',
  'M.Sc / MA (2 Years)',
  'MS / MPhil',
  'Ph.D',
  'B.Ed / M.Ed',
  'Associate Degree / Diploma',
  'Shahadat-ul-Alimiyyah / Islamic Education',
];

export const EducationForm: React.FC<Props> = ({
  education,
  onChange,
  sectionIcon,
  showSectionIcons = true,
  onSelectIcon,
  onToggleShowIcons,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(education[0]?.id || null);

  const addEducation = () => {
    const newEntry: Education = {
      id: `edu_${Date.now()}`,
      degree: '',
      institution: '',
      location: '',
      startYear: '',
      endYear: '',
      grade: '',
      major: '',
    };
    onChange([...education, newEntry]);
    setExpandedId(newEntry.id);
  };

  const updateEntry = (id: string, updates: Partial<Education>) => {
    onChange(education.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeEntry = (id: string) => {
    onChange(education.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {onSelectIcon && (
        <SectionIconSelector
          sectionKey="education"
          sectionTitle="Education"
          currentIcon={sectionIcon}
          showSectionIcons={showSectionIcons}
          onSelectIcon={onSelectIcon}
          onToggleShowIcons={onToggleShowIcons}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-700">Academic Background</h4>
          <p className="text-xs text-slate-500">Add degrees, board certifications, and educational credentials.</p>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-2">No education entries added yet.</p>
          <button
            type="button"
            onClick={addEducation}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            + Add degree or qualification
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {education.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
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
                        {item.degree || 'Untitled Degree'}
                        {item.institution ? ` • ${item.institution}` : ''}
                      </h5>
                      <span className="text-[10px] text-slate-500">
                        {item.endYear ? `Class of ${item.endYear}` : 'Year'}
                        {item.grade ? ` • ${item.grade}` : ''}
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

                {isExpanded && (
                  <div className="p-4 space-y-3 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Degree / Certificate Name *</label>
                        <input
                          type="text"
                          value={item.degree}
                          onChange={(e) => updateEntry(item.id, { degree: e.target.value })}
                          list="degrees-list"
                          placeholder="e.g. M.Sc Physics / BS Computer Science / FSc Pre-Engineering"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                        <datalist id="degrees-list">
                          {COMMON_DEGREES.map((d, i) => (
                            <option key={i} value={d} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">University / Board / Institution *</label>
                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) => updateEntry(item.id, { institution: e.target.value })}
                          placeholder="e.g. Quaid-i-Azam University / BISE Rawalpindi"
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Major / Subject / Specialization</label>
                        <input
                          type="text"
                          value={item.major || ''}
                          onChange={(e) => updateEntry(item.id, { major: e.target.value })}
                          placeholder="e.g. Applied Physics / Mathematics / Pre-Engineering"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Grade / CGPA / Marks / Division</label>
                        <input
                          type="text"
                          value={item.grade || ''}
                          onChange={(e) => updateEntry(item.id, { grade: e.target.value })}
                          placeholder="e.g. 3.8/4.0 CGPA or 1st Division / Grade A+"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Start Year (Optional)</label>
                        <input
                          type="text"
                          value={item.startYear || ''}
                          onChange={(e) => updateEntry(item.id, { startYear: e.target.value })}
                          placeholder="e.g. 2018"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Completion Year *</label>
                        <input
                          type="text"
                          value={item.endYear}
                          onChange={(e) => updateEntry(item.id, { endYear: e.target.value })}
                          placeholder="e.g. 2022"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    </div>

                    {/* Delete entry action */}
                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeEntry(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Delete this education credential"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Education</span>
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
