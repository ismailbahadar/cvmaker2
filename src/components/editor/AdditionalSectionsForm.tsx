import React, { useState } from 'react';
import {
  Language,
  Certification,
  Project,
  Award,
  Hobby,
  ReferencesSection,
  CustomSection,
} from '../../types/resume';
import { Plus, Trash2, Globe, Award as AwardIcon, Heart, Users, FileText, Code } from 'lucide-react';

interface Props {
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  awards: Award[];
  hobbies: Hobby[];
  references: ReferencesSection;
  customSections: CustomSection[];
  onUpdateLanguages: (langs: Language[]) => void;
  onUpdateCertifications: (certs: Certification[]) => void;
  onUpdateProjects: (projs: Project[]) => void;
  onUpdateAwards: (awards: Award[]) => void;
  onUpdateHobbies: (hobbies: Hobby[]) => void;
  onUpdateReferences: (refs: ReferencesSection) => void;
  onUpdateCustomSections: (sects: CustomSection[]) => void;
}

export const AdditionalSectionsForm: React.FC<Props> = ({
  languages,
  certifications,
  projects,
  awards,
  hobbies,
  references,
  customSections,
  onUpdateLanguages,
  onUpdateCertifications,
  onUpdateProjects,
  onUpdateAwards,
  onUpdateHobbies,
  onUpdateReferences,
  onUpdateCustomSections,
}) => {
  const [activeTab, setActiveTab] = useState<'languages' | 'certs' | 'projects' | 'awards' | 'hobbies' | 'references' | 'custom'>('languages');

  // Languages Handlers
  const addLanguage = () => {
    onUpdateLanguages([
      ...languages,
      {
        id: `lang_${Date.now()}`,
        name: '',
        proficiency: 'Fluent',
      },
    ]);
  };

  const updateLanguage = (id: string, updates: Partial<Language>) => {
    onUpdateLanguages(languages.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const removeLanguage = (id: string) => {
    onUpdateLanguages(languages.filter((l) => l.id !== id));
  };

  // Projects Handlers
  const addProject = () => {
    onUpdateProjects([
      ...projects,
      {
        id: `proj_${Date.now()}`,
        title: '',
        description: '',
        date: '',
        technologies: [],
      },
    ]);
  };

  // Certifications Handlers
  const addCert = () => {
    onUpdateCertifications([
      ...certifications,
      {
        id: `cert_${Date.now()}`,
        name: '',
        organization: '',
        issueDate: '',
      },
    ]);
  };

  // Awards Handlers
  const addAward = () => {
    onUpdateAwards([
      ...awards,
      {
        id: `aw_${Date.now()}`,
        title: '',
        organization: '',
        date: '',
      },
    ]);
  };

  // Hobbies Handlers
  const [newHobby, setNewHobby] = useState('');
  const addHobby = () => {
    if (!newHobby.trim()) return;
    onUpdateHobbies([...hobbies, { id: `h_${Date.now()}`, name: newHobby.trim() }]);
    setNewHobby('');
  };

  // References Handlers
  const addReference = () => {
    onUpdateReferences({
      ...references,
      list: [
        ...references.list,
        {
          id: `ref_${Date.now()}`,
          name: '',
          title: '',
          organization: '',
          phone: '',
          email: '',
        },
      ],
    });
  };

  // Custom Sections Handlers
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const addCustomSection = () => {
    if (!newSectionTitle.trim()) return;
    onUpdateCustomSections([
      ...customSections,
      {
        id: `cs_${Date.now()}`,
        title: newSectionTitle.trim(),
        entries: [],
      },
    ]);
    setNewSectionTitle('');
  };

  const addCustomEntry = (sectionId: string) => {
    onUpdateCustomSections(
      customSections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              entries: [
                ...s.entries,
                { id: `entry_${Date.now()}`, title: '', description: '', date: '' },
              ],
            }
          : s
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('languages')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'languages'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Languages ({languages.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'projects'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Projects ({projects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('certs')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'certs'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Certifications ({certifications.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('references')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'references'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          References
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('awards')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'awards'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Awards ({awards.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hobbies')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'hobbies'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Hobbies ({hobbies.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'custom'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Custom Sections ({customSections.length})
        </button>
      </div>

      {/* 1. LANGUAGES */}
      {activeTab === 'languages' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h5 className="text-xs font-bold text-slate-700">Languages & Proficiency</h5>
            <button
              type="button"
              onClick={addLanguage}
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Language
            </button>
          </div>
          {languages.map((l) => (
            <div key={l.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-3">
              <input
                type="text"
                value={l.name}
                onChange={(e) => updateLanguage(l.id, { name: e.target.value })}
                placeholder="e.g. English, Urdu, Arabic"
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={l.proficiency}
                onChange={(e) => updateLanguage(l.id, { proficiency: e.target.value as any })}
                className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Elementary">Elementary</option>
                <option value="Beginner">Beginner</option>
              </select>
              <button
                type="button"
                onClick={() => removeLanguage(l.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 2. PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h5 className="text-xs font-bold text-slate-700">Projects & Key Work</h5>
            <button
              type="button"
              onClick={addProject}
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>
          {projects.map((p) => (
            <div key={p.id} className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={p.title}
                  onChange={(e) =>
                    onUpdateProjects(projects.map((item) => (item.id === p.id ? { ...item, title: e.target.value } : item)))
                  }
                  placeholder="Project Title"
                  className="w-2/3 px-3 py-1 text-xs font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => onUpdateProjects(projects.filter((item) => item.id !== p.id))}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                value={p.description}
                onChange={(e) =>
                  onUpdateProjects(projects.map((item) => (item.id === p.id ? { ...item, description: e.target.value } : item)))
                }
                placeholder="Brief summary of impact, architecture, or deliverables..."
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* 3. CERTIFICATIONS */}
      {activeTab === 'certs' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h5 className="text-xs font-bold text-slate-700">Certificates & Licenses</h5>
            <button
              type="button"
              onClick={addCert}
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Certificate
            </button>
          </div>
          {certifications.map((c) => (
            <div key={c.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2">
              <input
                type="text"
                value={c.name}
                onChange={(e) =>
                  onUpdateCertifications(certifications.map((item) => (item.id === c.id ? { ...item, name: e.target.value } : item)))
                }
                placeholder="Certificate Name"
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                value={c.organization}
                onChange={(e) =>
                  onUpdateCertifications(certifications.map((item) => (item.id === c.id ? { ...item, organization: e.target.value } : item)))
                }
                placeholder="Issuer"
                className="w-32 px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
              />
              <button
                type="button"
                onClick={() => onUpdateCertifications(certifications.filter((item) => item.id !== c.id))}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. REFERENCES */}
      {activeTab === 'references' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="radio"
                name="refType"
                checked={references.type === 'upon_request'}
                onChange={() => onUpdateReferences({ ...references, type: 'upon_request' })}
              />
              <span>References available upon request</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="radio"
                name="refType"
                checked={references.type === 'provided'}
                onChange={() => onUpdateReferences({ ...references, type: 'provided' })}
              />
              <span>List referee contacts</span>
            </label>
          </div>

          {references.type === 'provided' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Referee Details</span>
                <button
                  type="button"
                  onClick={addReference}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  + Add Referee
                </button>
              </div>
              {references.list.map((r) => (
                <div key={r.id} className="p-3 bg-white border border-slate-200 rounded-lg grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={r.name}
                    onChange={(e) =>
                      onUpdateReferences({
                        ...references,
                        list: references.list.map((item) => (item.id === r.id ? { ...item, name: e.target.value } : item)),
                      })
                    }
                    placeholder="Referee Full Name"
                    className="px-2 py-1 border border-slate-200 rounded"
                  />
                  <input
                    type="text"
                    value={r.title}
                    onChange={(e) =>
                      onUpdateReferences({
                        ...references,
                        list: references.list.map((item) => (item.id === r.id ? { ...item, title: e.target.value } : item)),
                      })
                    }
                    placeholder="Designation / Position"
                    className="px-2 py-1 border border-slate-200 rounded"
                  />
                  <input
                    type="text"
                    value={r.organization}
                    onChange={(e) =>
                      onUpdateReferences({
                        ...references,
                        list: references.list.map((item) => (item.id === r.id ? { ...item, organization: e.target.value } : item)),
                      })
                    }
                    placeholder="Organization / University"
                    className="px-2 py-1 border border-slate-200 rounded"
                  />
                  <input
                    type="text"
                    value={r.phone || ''}
                    onChange={(e) =>
                      onUpdateReferences({
                        ...references,
                        list: references.list.map((item) => (item.id === r.id ? { ...item, phone: e.target.value } : item)),
                      })
                    }
                    placeholder="Contact Number / Email"
                    className="px-2 py-1 border border-slate-200 rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. HOBBIES */}
      {activeTab === 'hobbies' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addHobby()}
              placeholder="e.g. Cricket, Book Reading, Calligraphy, Technology Research"
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
            />
            <button
              type="button"
              onClick={addHobby}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Add Interest
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((h) => (
              <span
                key={h.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg border border-slate-200"
              >
                <span>{h.name}</span>
                <button
                  type="button"
                  onClick={() => onUpdateHobbies(hobbies.filter((item) => item.id !== h.id))}
                  className="hover:text-rose-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 6. AWARDS */}
      {activeTab === 'awards' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h5 className="text-xs font-bold text-slate-700">Honors & Awards</h5>
            <button
              type="button"
              onClick={addAward}
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Award
            </button>
          </div>
          {awards.map((a) => (
            <div key={a.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-xs">
              <input
                type="text"
                value={a.title}
                onChange={(e) =>
                  onUpdateAwards(awards.map((item) => (item.id === a.id ? { ...item, title: e.target.value } : item)))
                }
                placeholder="Award Title (e.g. Best Teacher of the Year / Dean's List)"
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                value={a.organization}
                onChange={(e) =>
                  onUpdateAwards(awards.map((item) => (item.id === a.id ? { ...item, organization: e.target.value } : item)))
                }
                placeholder="Awarding Body"
                className="w-36 px-3 py-1.5 border border-slate-200 rounded-lg"
              />
              <button
                type="button"
                onClick={() => onUpdateAwards(awards.filter((item) => item.id !== a.id))}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 7. CUSTOM SECTIONS */}
      {activeTab === 'custom' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex gap-2">
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="e.g. Publications, Volunteer Work, Islamic Education, Conferences"
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
            />
            <button
              type="button"
              onClick={addCustomSection}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Create Section
            </button>
          </div>

          {customSections.map((cs) => (
            <div key={cs.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h5 className="text-xs font-bold text-slate-800">{cs.title}</h5>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addCustomEntry(cs.id)}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline"
                  >
                    + Add Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateCustomSections(customSections.filter((s) => s.id !== cs.id))}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {cs.entries.map((entry) => (
                <div key={entry.id} className="space-y-1.5 text-xs p-2 bg-slate-50 rounded-lg">
                  <input
                    type="text"
                    value={entry.title}
                    onChange={(e) => {
                      const updated = cs.entries.map((en) =>
                        en.id === entry.id ? { ...en, title: e.target.value } : en
                      );
                      onUpdateCustomSections(
                        customSections.map((s) => (s.id === cs.id ? { ...s, entries: updated } : s))
                      );
                    }}
                    placeholder="Entry Title / Role"
                    className="w-full px-2 py-1 border border-slate-200 rounded bg-white font-medium"
                  />
                  <textarea
                    rows={2}
                    value={entry.description || ''}
                    onChange={(e) => {
                      const updated = cs.entries.map((en) =>
                        en.id === entry.id ? { ...en, description: e.target.value } : en
                      );
                      onUpdateCustomSections(
                        customSections.map((s) => (s.id === cs.id ? { ...s, entries: updated } : s))
                      );
                    }}
                    placeholder="Details / Description..."
                    className="w-full px-2 py-1 border border-slate-200 rounded bg-white"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
