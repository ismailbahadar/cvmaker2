import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, TemplateId, ResumeCustomization } from '../../types/resume';
import { saveResume, deleteResume, calculateCompletion } from '../../services/resumeService';
import { downloadResumePDF, printResume } from '../../services/pdfService';
import { downloadResumeWord } from '../../services/wordService';
import { ResumeRenderer } from '../preview/ResumeRenderer';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { QualificationsForm } from './QualificationsForm';
import { SkillsForm } from './SkillsForm';
import { AdditionalSectionsForm } from './AdditionalSectionsForm';
import { CustomizationPanel } from './CustomizationPanel';
import { AtsModal } from '../modals/AtsModal';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { aiTranslateResume } from '../../services/aiService';
import {
  ArrowLeft,
  Download,
  Printer,
  Trash2,
  Sparkles,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  Loader2,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  Layers,
  Palette,
  Eye,
  Edit3,
  Globe,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface Props {
  initialData: ResumeData;
  onBack: () => void;
}

type ActiveSection =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'qualifications'
  | 'skills'
  | 'additional'
  | 'customization';

export const ResumeEditor: React.FC<Props> = ({ initialData, onBack }) => {
  const [data, setData] = useState<ResumeData>(initialData);
  const [activeSection, setActiveSection] = useState<ActiveSection>('personal');
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [zoomScale, setZoomScale] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return Math.min(0.85, Math.max(0.35, Math.round(((window.innerWidth - 32) / 794) * 100) / 100));
    }
    return 0.85;
  });
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeletingResume, setIsDeletingResume] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationMessage, setTranslationMessage] = useState<string>('');
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isUrduMode =
    data.customization?.font === 'Noto Nastaliq Urdu' ||
    data.customization?.language === 'ur' ||
    data.customization?.direction === 'rtl';

  const handleTranslate = async (targetLang: 'ur' | 'en') => {
    setIsTranslating(true);
    setTranslationMessage(
      targetLang === 'ur'
        ? 'سی وی کو نوری نستعلیق اردو میں تبدیل کیا جا رہا ہے...'
        : 'Converting CV to English...'
    );

    try {
      const translated = await aiTranslateResume(data, targetLang);
      const safeMerged: ResumeData = {
        ...data,
        ...translated,
        id: data.id,
        userId: data.userId,
        createdAt: data.createdAt,
        templateId: data.templateId,
        customization: {
          ...data.customization,
          ...(translated.customization || {}),
          font: targetLang === 'ur' ? 'Noto Nastaliq Urdu' : 'Inter',
          language: targetLang,
          direction: targetLang === 'ur' ? 'rtl' : 'ltr',
        },
      };
      setData(safeMerged);
      setIsSaving(true);
      try {
        await saveResume(safeMerged);
      } catch (saveErr) {
        console.warn('Autosave after translation warning:', saveErr);
      }
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(timeStr);
    } catch (err) {
      console.warn('Translation completed with fallback layout switch:', err);
      // Guarantee language and font switch without interrupting the user
      const fallbackData: ResumeData = {
        ...data,
        customization: {
          ...data.customization,
          font: targetLang === 'ur' ? 'Noto Nastaliq Urdu' : 'Inter',
          language: targetLang,
          direction: targetLang === 'ur' ? 'rtl' : 'ltr',
        },
      };
      setData(fallbackData);
      setIsSaving(true);
      try {
        await saveResume(fallbackData);
      } catch (saveErr) {
        console.warn('Save fallback warning:', saveErr);
      }
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(timeStr);
    } finally {
      setIsTranslating(false);
      setTranslationMessage('');
    }
  };

  const handleDeleteResume = async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setIsDeletingResume(true);
    try {
      await deleteResume(data.userId, data.id);
      setIsConfirmDeleteOpen(false);
      onBack();
    } catch (err) {
      console.error('Error deleting resume:', err);
      setIsConfirmDeleteOpen(false);
      onBack();
    } finally {
      setIsDeletingResume(false);
    }
  };

  // Debounced Autosave
  const handleDataChange = (updated: ResumeData) => {
    setData(updated);
    setIsSaving(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveResume(updated);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(timeStr);
      } catch (err) {
        console.error('Autosave error:', err);
      } finally {
        setIsSaving(false);
      }
    }, 1200);
  };

  const completion = calculateCompletion(data);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const filename = `${data.personalInfo.fullName || 'Resume'}_CV.pdf`.replace(/\s+/g, '_');
      await downloadResumePDF('resume-preview-document', filename);
    } catch (err) {
      console.error(err);
      alert('Could not generate PDF. Please try Print -> Save as PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadWord = async () => {
    setIsDownloadingWord(true);
    try {
      const filename = `${data.personalInfo.fullName || 'Resume'}_CV.docx`.replace(/\s+/g, '_');
      await downloadResumeWord(data, filename);
    } catch (err) {
      console.error(err);
      alert('Could not generate Word document. Please try again.');
    } finally {
      setIsDownloadingWord(false);
    }
  };

  const handleUpdateSectionIcon = (sectionKey: string, iconId: string) => {
    handleDataChange({
      ...data,
      customization: {
        ...data.customization,
        sectionIcons: {
          ...(data.customization.sectionIcons || {}),
          [sectionKey]: iconId,
        },
      },
    });
  };

  const handleToggleShowSectionIcons = (show: boolean) => {
    handleDataChange({
      ...data,
      customization: {
        ...data.customization,
        showSectionIcons: show,
      },
    });
  };

  const navItems: { id: ActiveSection; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'personal', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
    { id: 'summary', label: 'Summary', icon: <FileText className="w-4 h-4" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4" />, count: data.experience.length },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" />, count: data.education.length },
    { id: 'qualifications', label: 'Qualifications & B.Ed', icon: <Award className="w-4 h-4" />, count: data.qualifications?.length || 0 },
    { id: 'skills', label: 'Skills', icon: <Wrench className="w-4 h-4" />, count: data.skills.length },
    { id: 'additional', label: 'More Sections', icon: <Layers className="w-4 h-4" /> },
    { id: 'customization', label: 'Design & Templates', icon: <Palette className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="h-5 w-px bg-slate-200" />

          {/* Title Editor */}
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={data.title}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              onChange={(e) => handleDataChange({ ...data, title: e.target.value })}
              className="text-sm font-bold text-slate-800 px-2 py-0.5 border border-indigo-400 rounded focus:outline-none"
            />
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-1.5 cursor-pointer group"
              title="Click to rename"
            >
              <h1 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition truncate max-w-[180px] sm:max-w-xs">
                {data.title}
              </h1>
              <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
            </div>
          )}

          {/* Save Status */}
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400 pl-2">
            {isSaving ? (
              <span className="flex items-center gap-1 text-amber-600">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <Check className="w-3 h-3" /> Saved {lastSavedTime}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Completion pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-slate-50 rounded-full border border-slate-200 text-xs">
            <span className="text-[11px] font-semibold text-slate-500">Score:</span>
            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-indigo-700">{completion}%</span>
          </div>

          {/* AI Language Convert Button */}
          <button
            type="button"
            disabled={isTranslating}
            onClick={() => handleTranslate(isUrduMode ? 'en' : 'ur')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition border disabled:opacity-50 ${
              isUrduMode
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500 shadow-2xs'
            }`}
            title={isUrduMode ? 'Translate CV back to English' : 'Translate entire CV to Urdu with Noor-e-Nastaleeq font'}
          >
            {isTranslating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            <span className={isUrduMode ? '' : 'font-nastaliq'}>
              {isUrduMode ? 'To English' : 'اردو میں بدلیں (AI)'}
            </span>
          </button>

          {/* ATS Modal trigger */}
          <button
            type="button"
            onClick={() => setIsAtsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">ATS Checker</span>
          </button>

          {/* Print CV */}
          <button
            type="button"
            onClick={printResume}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="Print CV"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Delete CV */}
          <button
            type="button"
            onClick={() => setIsConfirmDeleteOpen(true)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Delete this CV"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Download Word (.docx) */}
          <button
            type="button"
            disabled={isDownloadingWord}
            onClick={handleDownloadWord}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition disabled:opacity-50"
            title="Download editable Microsoft Word (.docx) CV"
          >
            {isDownloadingWord ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-blue-600" />
            )}
            <span>Word (.docx)</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            disabled={isDownloading}
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
            title="Download PDF"
          >
            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>PDF (.pdf)</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Toggle */}
      <div className="md:hidden flex bg-white border-b border-slate-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 transition ${
            mobileTab === 'edit'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
              : 'border-transparent text-slate-500'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 transition ${
            mobileTab === 'preview'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
              : 'border-transparent text-slate-500'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live A4 Preview</span>
        </button>
      </div>

      {/* Main Workspace: Left Editor (42%) / Right Preview (58%) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: EDIT CONTROLS */}
        <div
          className={`w-full md:w-[42%] lg:w-[40%] bg-white border-r border-slate-200 flex flex-col overflow-hidden ${
            mobileTab === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Section Navigation Tabs */}
          <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 px-3 bg-slate-50/60 shrink-0">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Section Form Container */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeSection === 'personal' && (
              <PersonalInfoForm
                data={data.personalInfo}
                onChange={(personalInfo) => handleDataChange({ ...data, personalInfo })}
              />
            )}

            {activeSection === 'summary' && (
              <SummaryForm
                summary={data.summary}
                careerObjective={data.careerObjective}
                jobTitle={data.personalInfo?.jobTitle}
                onChange={(summary, careerObjective) => handleDataChange({ ...data, summary, careerObjective })}
                sectionIcon={data.customization.sectionIcons?.summary}
                showSectionIcons={data.customization.showSectionIcons !== false}
                onSelectIcon={(iconId) => handleUpdateSectionIcon('summary', iconId)}
                onToggleShowIcons={handleToggleShowSectionIcons}
              />
            )}

            {activeSection === 'experience' && (
              <ExperienceForm
                experience={data.experience}
                onChange={(experience) => handleDataChange({ ...data, experience })}
                sectionIcon={data.customization.sectionIcons?.experience}
                showSectionIcons={data.customization.showSectionIcons !== false}
                onSelectIcon={(iconId) => handleUpdateSectionIcon('experience', iconId)}
                onToggleShowIcons={handleToggleShowSectionIcons}
              />
            )}

            {activeSection === 'education' && (
              <EducationForm
                education={data.education}
                onChange={(education) => handleDataChange({ ...data, education })}
                sectionIcon={data.customization.sectionIcons?.education}
                showSectionIcons={data.customization.showSectionIcons !== false}
                onSelectIcon={(iconId) => handleUpdateSectionIcon('education', iconId)}
                onToggleShowIcons={handleToggleShowSectionIcons}
              />
            )}

            {activeSection === 'qualifications' && (
              <QualificationsForm
                qualifications={data.qualifications || []}
                onChange={(qualifications) => handleDataChange({ ...data, qualifications })}
                sectionIcon={data.customization.sectionIcons?.qualifications}
                showSectionIcons={data.customization.showSectionIcons !== false}
                onSelectIcon={(iconId) => handleUpdateSectionIcon('qualifications', iconId)}
                onToggleShowIcons={handleToggleShowSectionIcons}
              />
            )}

            {activeSection === 'skills' && (
              <SkillsForm
                skills={data.skills}
                jobTitle={data.personalInfo?.jobTitle}
                showSkillPercentages={data.customization.showSkillPercentages}
                onToggleSkillPercentages={(showSkillPercentages) =>
                  handleDataChange({
                    ...data,
                    customization: { ...data.customization, showSkillPercentages },
                  })
                }
                onChange={(skills) => handleDataChange({ ...data, skills })}
                sectionIcon={data.customization.sectionIcons?.skills}
                showSectionIcons={data.customization.showSectionIcons !== false}
                onSelectIcon={(iconId) => handleUpdateSectionIcon('skills', iconId)}
                onToggleShowIcons={handleToggleShowSectionIcons}
              />
            )}

            {activeSection === 'additional' && (
              <AdditionalSectionsForm
                languages={data.languages}
                certifications={data.certifications}
                projects={data.projects}
                awards={data.awards}
                hobbies={data.hobbies}
                references={data.references}
                customSections={data.customSections}
                onUpdateLanguages={(languages) => handleDataChange({ ...data, languages })}
                onUpdateCertifications={(certifications) => handleDataChange({ ...data, certifications })}
                onUpdateProjects={(projects) => handleDataChange({ ...data, projects })}
                onUpdateAwards={(awards) => handleDataChange({ ...data, awards })}
                onUpdateHobbies={(hobbies) => handleDataChange({ ...data, hobbies })}
                onUpdateReferences={(references) => handleDataChange({ ...data, references })}
                onUpdateCustomSections={(customSections) => handleDataChange({ ...data, customSections })}
              />
            )}

            {activeSection === 'customization' && (
              <CustomizationPanel
                customization={data.customization}
                activeTemplateId={data.templateId}
                onChangeCustomization={(customization) => handleDataChange({ ...data, customization })}
                onChangeTemplate={(templateId) => handleDataChange({ ...data, templateId })}
                onTranslateToUrdu={() => handleTranslate('ur')}
                onTranslateToEnglish={() => handleTranslate('en')}
                isTranslating={isTranslating}
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE A4 PREVIEW */}
        <div
          className={`w-full md:w-[58%] lg:w-[60%] bg-slate-200/80 overflow-y-auto flex flex-col items-center p-6 ${
            mobileTab === 'edit' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Preview Toolbar */}
          <div className="bg-white/90 backdrop-blur-xs border border-slate-300/80 rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-3 mb-6 shrink-0 z-10 sticky top-0 text-xs font-semibold text-slate-700">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              A4 Format (210 × 297 mm)
            </span>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoomScale(Math.max(0.5, zoomScale - 0.1))}
                className="p-1 hover:bg-slate-100 rounded text-slate-600 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-mono text-[11px]">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomScale(Math.min(1.4, zoomScale + 0.1))}
                className="p-1 hover:bg-slate-100 rounded text-slate-600 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            <button
              type="button"
              onClick={() => setZoomScale(0.8)}
              className="text-[11px] hover:text-indigo-600 transition"
            >
              Fit
            </button>
            <button
              type="button"
              onClick={() => setZoomScale(1.0)}
              className="text-[11px] hover:text-indigo-600 transition"
            >
              100%
            </button>
          </div>

          {/* Render A4 Document */}
          <div className="w-full flex justify-center pb-12">
            <ResumeRenderer data={data} scale={zoomScale} />
          </div>
        </div>
      </div>

      {/* ATS Check Modal */}
      <AtsModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        resumeData={data}
      />

      {/* Delete Resume Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        title="Delete Resume"
        itemName={data.title}
        message={`Are you sure you want to permanently delete "${data.title}"? You will be returned to the dashboard and this action cannot be undone.`}
        isDeleting={isDeletingResume}
        onConfirm={handleDeleteResume}
        onClose={() => {
          if (!isDeletingResume) setIsConfirmDeleteOpen(false);
        }}
      />

      {/* AI Translating Loading Overlay */}
      {isTranslating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                AI Language Translation
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {translationMessage || 'Translating your CV with Google Gemini AI...'}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs text-slate-600 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Formatting Noor-e-Nastaleeq & RTL Layout...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
