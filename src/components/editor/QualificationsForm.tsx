import React, { useState } from 'react';
import { ProfessionalQualification } from '../../types/resume';
import { SectionIconSelector } from './SectionIconSelector';
import { Plus, Trash2, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  qualifications: ProfessionalQualification[];
  onChange: (qualifications: ProfessionalQualification[]) => void;
  sectionIcon?: string;
  showSectionIcons?: boolean;
  onSelectIcon?: (iconId: string) => void;
  onToggleShowIcons?: (show: boolean) => void;
}

const COMMON_QUALIFICATIONS = [
  'Bachelor of Education (B.Ed)',
  'Master of Education (M.Ed)',
  'Associate Degree in Education (ADE)',
  'Certified Public Accountant (CPA)',
  'ACCA Affiliate / Member',
  'Post Graduate Diploma (PGD)',
  'Project Management Professional (PMP)',
  'Microsoft Certified Educator (MCE)',
  'IELTS / TOEFL Instructor Certificate',
  'Certified Information Systems Auditor (CISA)',
];

export const QualificationsForm: React.FC<Props> = ({
  qualifications,
  onChange,
  sectionIcon,
  showSectionIcons = true,
  onSelectIcon,
  onToggleShowIcons,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(qualifications[0]?.id || null);

  const addQualification = () => {
    const newEntry: ProfessionalQualification = {
      id: `qual_${Date.now()}`,
      qualification: '',
      institution: '',
      year: '',
      grade: '',
      description: '',
    };
    onChange([...qualifications, newEntry]);
    setExpandedId(newEntry.id);
  };

  const updateEntry = (id: string, updates: Partial<ProfessionalQualification>) => {
    onChange(qualifications.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeEntry = (id: string) => {
    onChange(qualifications.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {onSelectIcon && (
        <SectionIconSelector
          sectionKey="qualifications"
          sectionTitle="Qualifications & Teaching Diplomas"
          currentIcon={sectionIcon}
          showSectionIcons={showSectionIcons}
          onSelectIcon={onSelectIcon}
          onToggleShowIcons={onToggleShowIcons}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-700">Professional Qualifications & Teaching Diplomas</h4>
          <p className="text-xs text-slate-500">
            Dedicated section for B.Ed, M.Ed, Teaching Certificates, Professional Diplomas & Training.
          </p>
        </div>
        <button
          type="button"
          onClick={addQualification}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Qualification</span>
        </button>
      </div>

      {qualifications.length === 0 ? (
        <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
          <Award className="w-7 h-7 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-2">No professional qualifications added yet.</p>
          <button
            type="button"
            onClick={addQualification}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            + Add B.Ed, M.Ed, or Professional Diploma
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {qualifications.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="px-4 py-3 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between cursor-pointer transition select-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">
                        {item.qualification || 'Untitled Qualification'}
                      </h5>
                      <span className="text-[10px] text-slate-500">
                        {item.institution ? `${item.institution} • ` : ''}
                        {item.year || 'Year'}
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Qualification Title *</label>
                        <input
                          type="text"
                          value={item.qualification}
                          onChange={(e) => updateEntry(item.id, { qualification: e.target.value })}
                          list="qual-list"
                          placeholder="e.g. Bachelor of Education (B.Ed) / Master of Education (M.Ed)"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                        <datalist id="qual-list">
                          {COMMON_QUALIFICATIONS.map((q, i) => (
                            <option key={i} value={q} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Awarding Body / University *</label>
                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) => updateEntry(item.id, { institution: e.target.value })}
                          placeholder="e.g. Allama Iqbal Open University (AIOU)"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Year of Passing *</label>
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => updateEntry(item.id, { year: e.target.value })}
                          placeholder="e.g. 2016"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Grade / Division / Marks</label>
                        <input
                          type="text"
                          value={item.grade || ''}
                          onChange={(e) => updateEntry(item.id, { grade: e.target.value })}
                          placeholder="e.g. 1st Division / Grade A"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Key Subjects</label>
                        <textarea
                          rows={2}
                          value={item.description || ''}
                          onChange={(e) => updateEntry(item.id, { description: e.target.value })}
                          placeholder="e.g. Educational Planning, Curriculum Design, Assessment Methodologies..."
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
                        title="Delete this qualification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Qualification</span>
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
