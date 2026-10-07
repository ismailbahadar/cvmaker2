import React, { useState } from 'react';
import { ResumeData } from '../../types/resume';
import { aiCheckAts, aiMatchJob, AtsCheckResult, JobMatchResult } from '../../services/aiService';
import { X, Sparkles, CheckCircle, AlertTriangle, Lightbulb, Loader2, Target, ArrowRight } from 'lucide-react';

interface Props {
  resumeData: ResumeData;
  isOpen: boolean;
  onClose: () => void;
}

export const AtsModal: React.FC<Props> = ({ resumeData, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'jobMatch'>('audit');
  const [loading, setLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsCheckResult | null>(null);
  
  // Job Match State
  const [jobDescription, setJobDescription] = useState('');
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(null);

  if (!isOpen) return null;

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await aiCheckAts(resumeData, resumeData.personalInfo?.jobTitle);
      setAtsResult(res);
    } catch (err) {
      console.error(err);
      alert('Could not complete ATS check.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunJobMatch = async () => {
    if (!jobDescription.trim()) {
      alert('Please paste the job description first.');
      return;
    }
    setLoading(true);
    try {
      const res = await aiMatchJob(resumeData, jobDescription);
      setJobMatchResult(res);
    } catch (err) {
      console.error(err);
      alert('Could not analyze job description.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">AI ATS & Resume Scanner</h3>
              <p className="text-xs text-slate-500">Applicant Tracking System audit & role targeting</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-white px-5 pt-3 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`pb-2 border-b-2 transition ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📊 Overall ATS Score & Audit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jobMatch')}
            className={`pb-2 border-b-2 transition ${
              activeTab === 'jobMatch'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🎯 Job Description Matcher
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'audit' ? (
            <div>
              {!atsResult ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Analyze Your Resume with AI</h4>
                  <p className="text-slate-500 max-w-md mx-auto text-xs">
                    Our AI scans keyword density, section structuring, action verbs, and formatting
                    to evaluate ATS readability and pass-rates.
                  </p>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleRunAudit}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Run ATS Compatibility Scan</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Score banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900 to-indigo-800 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">
                        ATS Readiness Score
                      </span>
                      <h4 className="text-2xl font-black">{atsResult.score} / 100</h4>
                      <p className="text-[11px] text-indigo-100 mt-0.5">
                        {atsResult.score >= 85
                          ? '🌟 Excellent ATS compatibility! High probability of passing recruiter filters.'
                          : '⚠️ Good baseline, but can be improved with target keywords and metrics.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleRunAudit}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition"
                    >
                      {loading ? 'Re-scanning...' : 'Re-scan'}
                    </button>
                  </div>

                  {/* Missing Keywords */}
                  {atsResult.missingKeywords && atsResult.missingKeywords.length > 0 && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <Target className="w-4 h-4" />
                        <span>Recommended Keywords to Add:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {atsResult.missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-white border border-amber-200 text-amber-900 rounded-md font-medium text-[11px]"
                          >
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <CheckCircle className="w-4 h-4" />
                        <span>Strengths</span>
                      </div>
                      <ul className="space-y-1.5 text-emerald-800">
                        {atsResult.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-rose-900">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Areas to Improve</span>
                      </div>
                      <ul className="space-y-1.5 text-rose-800">
                        {atsResult.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Actionable Recommendations</span>
                    </div>
                    <ul className="space-y-2 text-slate-700">
                      {atsResult.suggestions.map((sug, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {i + 1}
                          </span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Paste the Target Job Description
                </label>
                <p className="text-slate-500 mb-2">
                  Paste the job posting requirements from LinkedIn, Rozee.pk, or Indeed to see keyword alignment.
                </p>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job responsibilities, required qualifications, and tools here..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleRunJobMatch}
                className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                <span>Calculate Job Match Alignment</span>
              </button>

              {jobMatchResult && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-indigo-900 text-white rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-300">Match Compatibility</span>
                      <h4 className="text-2xl font-black">{jobMatchResult.matchScore}% Match</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <span className="font-bold text-emerald-900 block mb-1">Matching Keywords</span>
                      <div className="flex flex-wrap gap-1">
                        {jobMatchResult.matchingSkills.map((ms, idx) => (
                          <span key={idx} className="bg-white text-emerald-800 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-200">
                            ✓ {ms}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <span className="font-bold text-amber-900 block mb-1">Missing Keywords</span>
                      <div className="flex flex-wrap gap-1">
                        {jobMatchResult.missingSkills.map((ms, idx) => (
                          <span key={idx} className="bg-white text-amber-800 px-2 py-0.5 rounded text-[10px] font-medium border border-amber-200">
                            + {ms}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {jobMatchResult.tailoredSummary && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="font-bold text-slate-800 block mb-1">
                        Recommended Summary for this Application:
                      </span>
                      <p className="text-slate-700 leading-relaxed italic">{jobMatchResult.tailoredSummary}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
