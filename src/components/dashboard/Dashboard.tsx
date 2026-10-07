import React, { useState } from 'react';
import { ResumeData, UserProfile, TemplateId } from '../../types/resume';
import { TEMPLATES_LIST } from '../../data/templatesMeta';
import { SAMPLE_PROFILES, createEmptyResume } from '../../data/sampleProfiles';
import { saveResume, deleteResume, duplicateResume } from '../../services/resumeService';
import { downloadResumePDF } from '../../services/pdfService';
import { downloadResumeWord } from '../../services/wordService';
import { TemplateGallery } from '../templates/TemplateGallery';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  Download,
  Eye,
  Edit3,
  Sparkles,
  Layout,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  GraduationCap,
  Award,
  ChevronRight,
  Shield,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface Props {
  user: UserProfile;
  resumes: ResumeData[];
  onOpenResume: (resume: ResumeData) => void;
  onOpenCoverLetters: () => void;
  onOpenAdmin: () => void;
  onRefresh: () => void;
}

export const Dashboard: React.FC<Props> = ({
  user,
  resumes,
  onOpenResume,
  onOpenCoverLetters,
  onOpenAdmin,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'resumes' | 'templates'>('resumes');
  const [isCreating, setIsCreating] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [resumeToDelete, setResumeToDelete] = useState<ResumeData | null>(null);
  const [isDeletingResume, setIsDeletingResume] = useState(false);

  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.personalInfo?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = async (templateId: TemplateId = 'classic') => {
    setIsCreating(true);
    try {
      const newResume = createEmptyResume(user.userId, 'Untitled Resume');
      newResume.templateId = templateId;
      await saveResume(newResume);
      await onRefresh();
      onOpenResume(newResume);
    } catch (err) {
      console.error(err);
      alert('Failed to create resume.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLoadSample = async (profileKey: keyof typeof SAMPLE_PROFILES) => {
    setIsCreating(true);
    try {
      const sample = SAMPLE_PROFILES[profileKey](user.userId);
      await saveResume(sample);
      await onRefresh();
      onOpenResume(sample);
    } catch (err) {
      console.error(err);
      alert('Failed to load sample profile.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDuplicate = async (r: ResumeData) => {
    try {
      const dup = await duplicateResume(user.userId, r);
      await onRefresh();
    } catch (err) {
      console.error(err);
      alert('Could not duplicate resume.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!resumeToDelete) return;
    setIsDeletingResume(true);
    try {
      await deleteResume(user.userId, resumeToDelete.id);
      setResumeToDelete(null);
      await onRefresh();
    } catch (err) {
      console.error('Error deleting resume:', err);
      // Still refresh to update local state if cached
      await onRefresh();
      setResumeToDelete(null);
    } finally {
      setIsDeletingResume(false);
    }
  };

  const handleDirectDownload = async (resume: ResumeData) => {
    setDownloadingId(resume.id);
    onOpenResume(resume);
    setDownloadingId(null);
  };

  const handleDirectWordDownload = async (resume: ResumeData) => {
    setDownloadingId(resume.id);
    try {
      const filename = `${resume.personalInfo?.fullName || resume.title}_CV.docx`.replace(/\s+/g, '_');
      await downloadResumeWord(resume, filename);
    } catch (err) {
      console.error(err);
      alert('Could not download Word document.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Metrics
  const totalResumes = resumes.length;
  const avgCompletion = totalResumes
    ? Math.round(resumes.reduce((acc, r) => acc + (r.completionPercentage || 0), 0) / totalResumes)
    : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-300 mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Career Suite</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Welcome back, {user.displayName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 sm:mb-6">
            Build ATS-optimized resumes, tailor content with Google Gemini AI, and export
            pixel-perfect PDFs designed to pass recruiter screens.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              disabled={isCreating}
              onClick={() => handleCreateNew()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition disabled:opacity-50 min-h-[44px]"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Create New Resume</span>
            </button>

            <button
              type="button"
              onClick={onOpenCoverLetters}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/10 transition min-h-[44px]"
            >
              <FileText className="w-4 h-4" />
              <span>Cover Letters Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Resumes
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-800">{totalResumes}</span>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Avg. Completion
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-indigo-600">{avgCompletion}%</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Pro Templates
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-800">{TEMPLATES_LIST.length} Active</span>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Account Status
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200 truncate">
              {user.role === 'admin' ? 'Super Admin' : 'Free Plan'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Start Sample Profiles */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Quick Start with Sample Profiles</h3>
            <p className="text-xs text-slate-500">
              Clone a pre-filled, professional profile with authentic industry content.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            disabled={isCreating}
            onClick={() => handleLoadSample('urduCV')}
            className="p-3 rounded-xl border border-emerald-300 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 transition text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition font-bold text-xs">
              اردو
            </div>
            <h4 className="text-xs font-bold text-emerald-950">اردو سی وی (نوری نستعلیق)</h4>
            <span className="text-[10px] text-emerald-700 font-medium block">Urdu CV • Noore Nastaleeq</span>
          </button>

          <button
            type="button"
            disabled={isCreating}
            onClick={() => handleLoadSample('teacher')}
            className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 transition text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Teacher & Educator</h4>
            <span className="text-[10px] text-slate-500 block">B.Ed / M.Ed & Pedagogy</span>
          </button>

          <button
            type="button"
            disabled={isCreating}
            onClick={() => handleLoadSample('developer')}
            className="p-3 rounded-xl border border-slate-200 hover:border-sky-600 hover:bg-sky-50/30 transition text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Briefcase className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Full Stack Developer</h4>
            <span className="text-[10px] text-slate-500 block">TypeScript, React, Cloud</span>
          </button>

          <button
            type="button"
            disabled={isCreating}
            onClick={() => handleLoadSample('accountant')}
            className="p-3 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Financial Accountant</h4>
            <span className="text-[10px] text-slate-500 block">IFRS, Tax, SAP, Auditing</span>
          </button>

          <button
            type="button"
            disabled={isCreating}
            onClick={() => handleLoadSample('freshGrad')}
            className="p-3 rounded-xl border border-slate-200 hover:border-purple-600 hover:bg-purple-50/30 transition text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Fresh Graduate</h4>
            <span className="text-[10px] text-slate-500 block">Internships & Honors</span>
          </button>

          <button
            type="button"
            disabled={isCreating}
            onClick={() => handleLoadSample('businessManager')}
            className="p-3 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/30 transition text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Operations Director</h4>
            <span className="text-[10px] text-slate-500 block">Executive & P&L Mgmt</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('resumes')}
            className={`text-sm font-bold pb-2 border-b-2 transition ${
              activeTab === 'resumes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Resumes ({resumes.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`text-sm font-bold pb-2 border-b-2 transition ${
              activeTab === 'templates'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Template Gallery ({TEMPLATES_LIST.length})
          </button>
        </div>

        {activeTab === 'resumes' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resumes..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        )}
      </div>

      {/* TAB 1: RESUMES GRID */}
      {activeTab === 'resumes' ? (
        <div>
          {filteredResumes.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No resumes found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? `No resumes match "${searchQuery}".`
                  : 'Start by creating your first resume or cloning a sample profile.'}
              </p>
              <button
                type="button"
                onClick={() => handleCreateNew()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow transition hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Resume</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => {
                const tmpl = TEMPLATES_LIST.find((t) => t.id === resume.templateId) || TEMPLATES_LIST[0];
                return (
                  <div
                    key={resume.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                  >
                    {/* Card Header & Preview Accent */}
                    <div
                      onClick={() => onOpenResume(resume)}
                      className="h-32 p-4 cursor-pointer relative overflow-hidden flex flex-col justify-between transition group-hover:opacity-95"
                      style={{
                        background: `linear-gradient(135deg, ${tmpl.primaryColor}15 0%, #ffffff 100%)`,
                        borderBottom: `2px solid ${tmpl.primaryColor}30`,
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 shadow-2xs border border-slate-200">
                          {tmpl.name}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                          <span>{resume.completionPercentage || 0}% Complete</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                          {resume.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {resume.personalInfo?.fullName || 'Untitled Candidate'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-1">
                      <div
                        className="bg-indigo-600 h-full transition-all"
                        style={{ width: `${resume.completionPercentage || 0}%` }}
                      />
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 bg-white space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(resume.updatedAt || resume.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenResume(resume)}
                          className="py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs transition flex items-center justify-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenResume(resume)}
                          className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-rose-600" />
                          <span>PDF</span>
                        </button>

                        <button
                          type="button"
                          disabled={downloadingId === resume.id}
                          onClick={() => handleDirectWordDownload(resume)}
                          className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 border border-blue-200 disabled:opacity-50"
                          title="Download Word (.docx)"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Word</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleDuplicate(resume)}
                          className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Duplicate</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setResumeToDelete(resume)}
                          className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md transition flex items-center gap-1"
                          title="Delete resume"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: TEMPLATE GALLERY */
        <TemplateGallery
          onSelectTemplate={(tmplId) => handleCreateNew(tmplId)}
        />
      )}

      {/* In-app Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!resumeToDelete}
        title="Delete Resume"
        itemName={resumeToDelete?.title}
        message={`Are you sure you want to permanently delete "${resumeToDelete?.title || 'this resume'}"? This action cannot be undone.`}
        isDeleting={isDeletingResume}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!isDeletingResume) setResumeToDelete(null);
        }}
      />
    </div>
  );
};
