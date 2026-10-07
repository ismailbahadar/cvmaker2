import React, { useState } from 'react';
import { TEMPLATES_LIST } from '../../data/templatesMeta';
import {
  Sparkles,
  FileText,
  Download,
  Target,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Briefcase,
  Star,
  Users,
} from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  onExploreTemplates: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<Props> = ({
  onGetStarted,
  onExploreTemplates,
  onLogin,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Will my resume pass Applicant Tracking Systems (ATS)?',
      a: 'Yes! All resume templates are engineered with clean HTML semantic structure, standard headings, and selectable typography that ATS algorithms can easily parse without formatting corruption.',
    },
    {
      q: 'Can I create Pakistani format CVs with Father Name and CNIC?',
      a: 'Absolutely. We offer dedicated toggles for Father Name, CNIC, Date of Birth, Domicile, Religion, and Marital Status, specifically designed for Pakistan Civil Services, FPSC, Army Public Schools, and regional jobs.',
    },
    {
      q: 'How does the Google Gemini AI assistant help?',
      a: 'Our integrated Gemini 3.8 Flash model rewrites weak summaries, converts simple job duties into quantifiable achievement bullet points, suggests industry-standard skills, and scores your resume against any pasted job posting.',
    },
    {
      q: 'Can I download as PDF and print directly?',
      a: 'Yes. You can download crisp, vector-sharp A4 PDFs at any time, or print directly using our standard print stylesheets.',
    },
    {
      q: 'Will I lose my information if I switch templates?',
      a: 'Never. In Professional AI Resume & CV Builder, resume content is completely decoupled from template rendering. You can switch between all 11+ templates seamlessly with zero data loss.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navigation Header */}
      <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20 text-xs">
            CV
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-slate-900 block leading-tight">
              Professional <span className="text-indigo-600">Resume & CV Builder</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
              AI-Powered Career Suite
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#templates" className="hover:text-indigo-600 transition">Templates</a>
          <a href="#features" className="hover:text-indigo-600 transition">Features</a>
          <a href="#ai" className="hover:text-indigo-600 transition">AI Assistant</a>
          <a href="#pricing" className="hover:text-indigo-600 transition">Pricing</a>
          <a href="#faq" className="hover:text-indigo-600 transition">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLogin}
            className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 transition"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={onGetStarted}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
          >
            <span>Create My Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 sm:px-12 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen AI Resume & CV Builder</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          Create a Professional Resume{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">
            in Minutes
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Build a polished, job-ready CV with 11+ professional templates, AI writing assistance,
          ATS algorithm scoring, and instant pixel-perfect PDF export.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/25 transition flex items-center justify-center gap-2"
          >
            <span>Create My Resume Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onExploreTemplates}
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 shadow-sm transition"
          >
            Explore 11+ Templates
          </button>
        </div>

        {/* Feature Highlights Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-200/60 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">ATS Friendly</span>
              <span className="text-[11px] text-slate-500">98% pass compatibility</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Gemini AI Inside</span>
              <span className="text-[11px] text-slate-500">Bullet & summary writer</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Instant PDF & Print</span>
              <span className="text-[11px] text-slate-500">A4 standard dimensions</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Civil & Teacher CVs</span>
              <span className="text-[11px] text-slate-500">CNIC, B.Ed & particulars</span>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATES PREVIEW SHOWCASE */}
      <section id="templates" className="py-16 bg-white border-y border-slate-200 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
              Engineered For Every Industry
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
              11+ Original Professional Templates
            </h2>
            <p className="text-sm text-slate-500">
              Switch designs in one click without losing a single word of your resume.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES_LIST.slice(0, 6).map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={onGetStarted}
                className="group rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition cursor-pointer bg-slate-50/50 flex flex-col justify-between"
              >
                <div
                  className="h-44 p-4 flex flex-col justify-between"
                  style={{
                    background:
                      tmpl.columns === 2
                        ? `linear-gradient(90deg, ${tmpl.primaryColor} 30%, #ffffff 30%)`
                        : `linear-gradient(180deg, ${tmpl.primaryColor} 12%, #ffffff 12%)`,
                  }}
                >
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white shadow-2xs text-slate-800 self-start">
                    {tmpl.category}
                  </span>
                  <div className="bg-white/90 p-3 rounded-lg border border-slate-200 text-left">
                    <div className="w-1/3 h-2 rounded bg-slate-800 mb-1" />
                    <div className="w-1/4 h-1.5 rounded bg-slate-400 mb-2" />
                    <div className="w-full h-1 rounded bg-slate-200 mb-1" />
                    <div className="w-3/4 h-1 rounded bg-slate-200" />
                  </div>
                </div>

                <div className="p-5 bg-white">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{tmpl.name}</h4>
                  <p className="text-xs text-slate-500 mb-3">{tmpl.description}</p>
                  <span className="text-xs font-bold text-indigo-600 group-hover:underline flex items-center gap-1">
                    <span>Use this template</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              type="button"
              onClick={onExploreTemplates}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              Browse All 11+ Templates →
            </button>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
            Professional AI Resume & CV Builder
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
            Everything You Need To Win Interviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Gemini AI Resume Writer</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Stuck writing your summary or bullets? Click "Improve with AI" to generate
              action-oriented sentences starting with high-impact verbs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Live ATS Score & Matcher</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste the job description of your dream role. Our ATS scanner compares keyword density
              and gives you an exact percentage match with suggestions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Pakistan & Regional Fields</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Designed for local Pakistani job markets and international roles. Show or hide Father Name,
              CNIC, B.Ed/M.Ed credentials, Domicile, and Religion anytime.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-16 bg-white border-y border-slate-200 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Simple, Transparent Plans
            </h2>
            <p className="text-xs text-slate-500">
              Start completely free today. Upgrade anytime for advanced career tooling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Starter Plan
                </span>
                <div className="text-3xl font-black text-slate-900 mb-4">$0 / Free</div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">✓ Unlimited Resumes & Editing</li>
                  <li className="flex items-center gap-2">✓ Access to Standard Templates</li>
                  <li className="flex items-center gap-2">✓ Instant High-Quality PDF Downloads</li>
                  <li className="flex items-center gap-2">✓ Real-Time Autosave to Cloud</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={onGetStarted}
                className="w-full mt-8 py-3 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition"
              >
                Get Started Free
              </button>
            </div>

            <div className="p-8 rounded-3xl border-2 border-indigo-600 bg-white shadow-xl relative flex flex-col justify-between">
              <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
                Most Popular
              </span>
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-2">
                  Apex Pro
                </span>
                <div className="text-3xl font-black text-slate-900 mb-4">
                  $4.99 <span className="text-xs text-slate-400 font-normal">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">✓ All 11+ Premium Resume Templates</li>
                  <li className="flex items-center gap-2">✓ Unlimited Gemini AI Writing & Bullet Rewrites</li>
                  <li className="flex items-center gap-2">✓ Complete ATS Compatibility Audit & Job Matcher</li>
                  <li className="flex items-center gap-2">✓ Cover Letter Studio with AI Generation</li>
                  <li className="flex items-center gap-2">✓ Custom Typography & Advanced Color Palettes</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={onGetStarted}
                className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                Unlock Pro Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 px-6 sm:px-12 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-black text-slate-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between font-bold text-xs text-slate-800 hover:bg-slate-50 transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs py-12 px-6 sm:px-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              CV
            </div>
            <span className="font-bold text-white text-sm">Professional AI Resume & CV Builder</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>100% Original Code & SaaS Layouts</span>
            <span>•</span>
            <span>Google Cloud Firestore</span>
            <span>•</span>
            <span>Gemini AI 3.8 Flash</span>
          </div>

          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Professional AI Resume & CV Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
