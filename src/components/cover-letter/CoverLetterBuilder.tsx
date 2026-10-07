import React, { useState } from 'react';
import { CoverLetterData } from '../../types/resume';
import { aiGenerateCoverLetter } from '../../services/aiService';
import { saveCoverLetter, deleteCoverLetter } from '../../services/resumeService';
import { downloadResumePDF, printResume } from '../../services/pdfService';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import {
  Sparkles,
  Download,
  Printer,
  Trash2,
  Plus,
  Loader2,
  FileText,
  Building,
  User,
  ArrowLeft,
} from 'lucide-react';

interface Props {
  userId: string;
  coverLetters: CoverLetterData[];
  onBack: () => void;
  onRefresh: () => void;
}

export const CoverLetterBuilder: React.FC<Props> = ({
  userId,
  coverLetters,
  onBack,
  onRefresh,
}) => {
  const [selectedCl, setSelectedCl] = useState<CoverLetterData | null>(
    coverLetters[0] || null
  );
  const [mobileTab, setMobileTab] = useState<'list' | 'edit' | 'preview'>(
    coverLetters.length > 0 ? 'edit' : 'list'
  );
  const [loadingAi, setLoadingAi] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [clToDelete, setClToDelete] = useState<CoverLetterData | null>(null);
  const [isDeletingCl, setIsDeletingCl] = useState(false);

  const createNew = () => {
    const newCl: CoverLetterData = {
      id: `cl_${Date.now()}`,
      userId,
      title: 'New Cover Letter',
      applicantName: 'Muhammad Saeed Ahmad',
      applicantEmail: 'saeed.ahmad@example.com',
      applicantPhone: '+92 300 1234567',
      recipientName: 'Hiring Team',
      recipientTitle: 'Head of Human Resources',
      company: 'Army Public College',
      jobTitle: 'Senior Subject Specialist',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      content:
        'Dear Hiring Team,\n\nI am writing to express my eager interest in the Senior Subject Specialist role at Army Public College. With a proven commitment to academic excellence, pedagogy, and student mentorship, I look forward to contributing to your esteemed institution.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSelectedCl(newCl);
    setMobileTab('edit');
    saveCoverLetter(newCl).then(onRefresh);
  };

  const updateSelected = (updates: Partial<CoverLetterData>) => {
    if (!selectedCl) return;
    const updated = { ...selectedCl, ...updates, updatedAt: new Date().toISOString() };
    setSelectedCl(updated);
    setIsSaving(true);
    saveCoverLetter(updated)
      .then(() => setIsSaving(false))
      .catch((e) => console.error(e));
  };

  const handleGenerateAI = async () => {
    if (!selectedCl) return;
    setLoadingAi(true);
    try {
      const generated = await aiGenerateCoverLetter({
        applicantName: selectedCl.applicantName,
        jobTitle: selectedCl.jobTitle,
        company: selectedCl.company,
        recipientName: selectedCl.recipientName,
        jobDescription: 'Seeking an experienced professional dedicated to excellence.',
      });
      updateSelected({ content: generated });
    } catch (err) {
      console.error(err);
      alert('Could not generate cover letter with AI.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleConfirmDeleteCl = async () => {
    if (!clToDelete) return;
    setIsDeletingCl(true);
    try {
      await deleteCoverLetter(userId, clToDelete.id);
      if (selectedCl?.id === clToDelete.id) {
        setSelectedCl(null);
      }
      setClToDelete(null);
      await onRefresh();
    } catch (err) {
      console.error(err);
      setClToDelete(null);
      await onRefresh();
    } finally {
      setIsDeletingCl(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <h1 className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[140px] sm:max-w-none">
            Cover Letter Studio
          </h1>
        </div>

        {selectedCl && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              disabled={loadingAi}
              onClick={handleGenerateAI}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
              title="Generate with AI"
            >
              {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
              <span className="hidden sm:inline">Write with AI</span>
              <span className="sm:hidden">AI</span>
            </button>
            <button
              type="button"
              onClick={printResume}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => downloadResumePDF('cover-letter-preview', `${selectedCl.title}.pdf`)}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>
        )}
      </header>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex bg-white border-b border-slate-200 text-xs font-bold shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1 border-b-2 transition ${
            mobileTab === 'list'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
              : 'border-transparent text-slate-500'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Letters ({coverLetters.length})</span>
        </button>
        {selectedCl && (
          <>
            <button
              type="button"
              onClick={() => setMobileTab('edit')}
              className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1 border-b-2 transition ${
                mobileTab === 'edit'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
                  : 'border-transparent text-slate-500'
              }`}
            >
              <span>Edit Form</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('preview')}
              className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1 border-b-2 transition ${
                mobileTab === 'preview'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
                  : 'border-transparent text-slate-500'
              }`}
            >
              <span>Preview</span>
            </button>
          </>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar list */}
        <div
          className={`w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-col shrink-0 ${
            mobileTab === 'list' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Letters</h2>
            <button
              type="button"
              onClick={createNew}
              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1 text-xs font-bold"
              title="New Letter"
            >
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto">
            {coverLetters.map((cl) => (
              <div
                key={cl.id}
                onClick={() => {
                  setSelectedCl(cl);
                  setMobileTab('edit');
                }}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                  selectedCl?.id === cl.id
                    ? 'border-indigo-600 bg-indigo-50/50 font-bold text-indigo-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="truncate mr-2">
                  <span className="block truncate">{cl.title}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{cl.company}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setClToDelete(cl);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete cover letter"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {coverLetters.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No letters created yet.</p>
            )}
          </div>
        </div>

        {/* Editor Form & Live Preview */}
        {selectedCl ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Form */}
            <div
              className={`w-full md:w-1/2 p-4 sm:p-6 bg-white overflow-y-auto border-r border-slate-200 space-y-4 ${
                mobileTab === 'edit' ? 'block' : 'hidden md:block'
              }`}
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={selectedCl.title}
                  onChange={(e) => updateSelected({ title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={selectedCl.applicantName}
                    onChange={(e) => updateSelected({ applicantName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Position</label>
                  <input
                    type="text"
                    value={selectedCl.jobTitle}
                    onChange={(e) => updateSelected({ jobTitle: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Company</label>
                  <input
                    type="text"
                    value={selectedCl.company}
                    onChange={(e) => updateSelected({ company: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hiring Manager Name</label>
                  <input
                    type="text"
                    value={selectedCl.recipientName}
                    onChange={(e) => updateSelected({ recipientName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Letter Content</label>
                <textarea
                  rows={12}
                  value={selectedCl.content}
                  onChange={(e) => updateSelected({ content: e.target.value })}
                  className="w-full p-3 text-xs border border-slate-200 rounded-lg font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:hidden pt-2">
                <button
                  type="button"
                  onClick={() => setMobileTab('preview')}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Preview Letter →
                </button>
              </div>
            </div>

            {/* Live A4 Cover Letter Preview */}
            <div
              className={`w-full md:w-1/2 p-3 sm:p-6 bg-slate-200/80 overflow-y-auto flex flex-col items-center ${
                mobileTab === 'preview' ? 'flex' : 'hidden md:flex'
              }`}
            >
              <div className="w-full max-w-[210mm] bg-white shadow-xl p-6 sm:p-12 text-slate-800 text-xs sm:text-sm space-y-6 flex flex-col justify-between my-2 rounded-lg sm:rounded-none">
                <div id="cover-letter-preview">
                  {/* Sender Header */}
                  <div className="border-b-2 border-slate-900 pb-4 mb-6">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">{selectedCl.applicantName}</h2>
                    <p className="text-xs text-indigo-700 font-bold uppercase tracking-wider">{selectedCl.jobTitle}</p>
                    <div className="text-[11px] sm:text-xs text-slate-500 mt-2 flex flex-wrap gap-2 sm:gap-4">
                      {selectedCl.applicantEmail && <span>{selectedCl.applicantEmail}</span>}
                      {selectedCl.applicantPhone && <span>• {selectedCl.applicantPhone}</span>}
                    </div>
                  </div>

                  {/* Date & Recipient */}
                  <div className="space-y-1 text-xs text-slate-600 mb-6">
                    <div className="font-semibold text-slate-800 mb-3">{selectedCl.date}</div>
                    <div className="font-bold text-slate-800">{selectedCl.recipientName}</div>
                    <div>{selectedCl.recipientTitle}</div>
                    <div className="font-medium text-slate-700">{selectedCl.company}</div>
                  </div>

                  {/* Body Text */}
                  <div className="text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line text-justify">
                    {selectedCl.content}
                  </div>

                  {/* Sign off */}
                  <div className="pt-6 border-t border-slate-100 text-xs text-slate-700 mt-6">
                    <p>Sincerely,</p>
                    <p className="font-bold text-slate-900 mt-3">{selectedCl.applicantName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <FileText className="w-12 h-12 mb-3 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700 mb-1">Select or Create a Cover Letter</h3>
            <p className="text-xs max-w-sm mb-4">
              Write targeted, job-winning cover letters matching your resume in seconds using AI assistance.
            </p>
            <button
              type="button"
              onClick={createNew}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow"
            >
              + Create First Cover Letter
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!clToDelete}
        title="Delete Cover Letter"
        itemName={clToDelete?.title}
        message={`Are you sure you want to permanently delete "${clToDelete?.title || 'this cover letter'}"? This action cannot be undone.`}
        isDeleting={isDeletingCl}
        onConfirm={handleConfirmDeleteCl}
        onClose={() => {
          if (!isDeletingCl) setClToDelete(null);
        }}
      />
    </div>
  );
};
