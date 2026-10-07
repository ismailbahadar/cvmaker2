import React from 'react';
import { ResumeCustomization, TemplateId } from '../../types/resume';
import { TEMPLATES_LIST } from '../../data/templatesMeta';
import { SECTION_ICON_OPTIONS } from '../../utils/sectionIcons';
import { Palette, Type, Layout, Sliders, Image, Check, CheckCircle2, Sparkles, Smile, Globe, Loader2 } from 'lucide-react';

interface Props {
  customization: ResumeCustomization;
  activeTemplateId: TemplateId;
  onChangeCustomization: (custom: ResumeCustomization) => void;
  onChangeTemplate: (templateId: TemplateId) => void;
  onTranslateToUrdu?: () => void;
  onTranslateToEnglish?: () => void;
  isTranslating?: boolean;
}

const COLOR_PALETTE = [
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Executive Obsidian', hex: '#0f172a' },
  { name: 'Charcoal Slate', hex: '#334155' },
  { name: 'Emerald Green', hex: '#047857' },
  { name: 'Crimson Red', hex: '#b91c1c' },
  { name: 'Persian Teal', hex: '#0d9488' },
  { name: 'Royal Violet', hex: '#7c3aed' },
  { name: 'Pitch Black', hex: '#000000' },
];

const FONTS: Array<{ id: ResumeCustomization['font']; label: string; isUrdu?: boolean }> = [
  { id: 'Inter', label: 'Inter' },
  { id: 'Roboto', label: 'Roboto' },
  { id: 'Open Sans', label: 'Open Sans' },
  { id: 'Lato', label: 'Lato' },
  { id: 'Georgia', label: 'Georgia' },
  { id: 'Arial', label: 'Arial' },
  { id: 'Noto Nastaliq Urdu', label: 'نوری نستعلیق (Urdu)', isUrdu: true },
];

export const CustomizationPanel: React.FC<Props> = ({
  customization,
  activeTemplateId,
  onChangeCustomization,
  onChangeTemplate,
  onTranslateToUrdu,
  onTranslateToEnglish,
  isTranslating,
}) => {
  const update = (field: keyof ResumeCustomization, value: any) => {
    onChangeCustomization({ ...customization, [field]: value });
  };

  const isUrduMode =
    customization.font === 'Noto Nastaliq Urdu' ||
    customization.language === 'ur' ||
    customization.direction === 'rtl';

  return (
    <div className="space-y-6">
      {/* 1. Template Selector */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layout className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Choose Template</h4>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Switch templates anytime. Your resume content is always preserved across all styles.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {TEMPLATES_LIST.map((tmpl) => {
            const isSelected = activeTemplateId === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onChangeTemplate(tmpl.id)}
                className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {tmpl.category}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 leading-tight mb-1">{tmpl.name}</h5>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: tmpl.primaryColor }}
                  />
                  <span className="text-[9px] text-slate-500 font-medium">
                    {tmpl.columns === 1 ? 'Single Col' : 'Two Col'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Scheme */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Accent Color</h4>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {COLOR_PALETTE.map((c) => {
            const isSelected = customization.primaryColor.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.hex}
                type="button"
                onClick={() => update('primaryColor', c.hex)}
                className={`w-7 h-7 rounded-full transition flex items-center justify-center relative shadow-sm ${
                  isSelected ? 'scale-110 ring-2 ring-indigo-500 ring-offset-2' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </button>
            );
          })}
          {/* Custom color input */}
          <div className="flex items-center gap-1.5 ml-2 border border-slate-200 rounded-lg px-2 py-1 bg-white">
            <span className="text-[10px] text-slate-500 font-medium">Custom:</span>
            <input
              type="color"
              value={customization.primaryColor}
              onChange={(e) => update('primaryColor', e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* 3. Typography */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Typography Font</h4>
          </div>
          {customization.font === 'Noto Nastaliq Urdu' && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              نوری نستعلیق فعال
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FONTS.map((font) => {
            const isSelected = customization.font === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => {
                  if (font.id === 'Noto Nastaliq Urdu') {
                    onChangeCustomization({
                      ...customization,
                      font: 'Noto Nastaliq Urdu',
                      language: 'ur',
                      direction: 'rtl',
                    });
                  } else {
                    onChangeCustomization({
                      ...customization,
                      font: font.id,
                      language: customization.language || 'en',
                      direction: customization.direction || 'ltr',
                    });
                  }
                }}
                className={`px-2.5 py-2 text-xs rounded-xl border transition text-center flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className={font.isUrdu ? 'font-nastaliq text-xs font-bold' : 'font-medium'}>
                  {font.label}
                </span>
                {font.isUrdu && (
                  <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">Urdu Nastaleeq</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3b. Document Language & Layout Direction */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Language & Layout Direction (زبان و سمت)
          </h4>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Switch between English (Left-to-Right) and authentic Urdu (Right-to-Left with Noor-e-Nastaleeq).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              onChangeCustomization({
                ...customization,
                language: 'en',
                direction: 'ltr',
                font: customization.font === 'Noto Nastaliq Urdu' ? 'Inter' : customization.font,
              });
            }}
            className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
              !isUrduMode
                ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <span className="text-xs font-bold text-slate-800 block">English (LTR)</span>
              <span className="text-[10px] text-slate-500">Standard Left-to-Right layout</span>
            </div>
            {!isUrduMode && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeCustomization({
                ...customization,
                language: 'ur',
                direction: 'rtl',
                font: 'Noto Nastaliq Urdu',
              });
            }}
            className={`p-3 rounded-xl border text-right transition flex items-center justify-between ${
              isUrduMode
                ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            {isUrduMode && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <div className="ml-auto">
              <span className="text-xs font-bold text-emerald-950 font-nastaliq block">اردو (نوری نستعلیق RTL)</span>
              <span className="text-[10px] text-emerald-700">دائیں سے بائیں • نستعلیق اسلوب</span>
            </div>
          </button>
        </div>

        {/* AI Translation Assistant Box */}
        {(onTranslateToUrdu || onTranslateToEnglish) && (
          <div className="mt-3.5 p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Language Translation (Google Gemini)</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                AI Powered
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Convert your entire CV from English into formal, elegant Urdu (Noor-e-Nastaleeq) or back to English.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {onTranslateToUrdu && (
                <button
                  type="button"
                  disabled={isTranslating}
                  onClick={onTranslateToUrdu}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isTranslating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>انگریزی سی وی کو اردو میں بدلیں</span>
                </button>
              )}
              {onTranslateToEnglish && (
                <button
                  type="button"
                  disabled={isTranslating}
                  onClick={onTranslateToEnglish}
                  className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isTranslating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Translate to English</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Spacing & Margins */}
      <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Section Spacing
          </label>
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
            {(['compact', 'normal', 'spacious'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update('spacing', s)}
                className={`flex-1 py-1.5 capitalize rounded-md font-medium transition ${
                  customization.spacing === s ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Page Margins
          </label>
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
            {(['narrow', 'normal', 'wide'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update('margins', m)}
                className={`flex-1 py-1.5 capitalize rounded-md font-medium transition ${
                  customization.margins === m ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Photo Controls */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Photo Display</h4>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={customization.showPhoto}
              onChange={(e) => update('showPhoto', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {customization.showPhoto && (
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
            {(['circle', 'rounded', 'square'] as const).map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => update('photoShape', shape)}
                className={`flex-1 py-1.5 capitalize rounded-md font-medium transition ${
                  customization.photoShape === shape
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 6. Section Icons Customizer */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Section Icons & Visual Clarity
            </h4>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={customization.showSectionIcons !== false}
              onChange={(e) => update('showSectionIcons', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Select or toggle custom icons for Experience, Education, and Skills to enhance visual clarity and hierarchy.
        </p>

        {customization.showSectionIcons !== false && (
          <div className="space-y-4 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
            {/* Work Experience Icon */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                Work Experience Icon
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SECTION_ICON_OPTIONS.experience.map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = (customization.sectionIcons?.experience || 'briefcase') === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        const current = customization.sectionIcons || {};
                        update('sectionIcons', { ...current, experience: opt.id });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Academic Education Icon */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                Academic Education Icon
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SECTION_ICON_OPTIONS.education.map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = (customization.sectionIcons?.education || 'graduation-cap') === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        const current = customization.sectionIcons || {};
                        update('sectionIcons', { ...current, education: opt.id });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skills Icon */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                Skills & Competencies Icon
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SECTION_ICON_OPTIONS.skills.map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = (customization.sectionIcons?.skills || 'wrench') === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        const current = customization.sectionIcons || {};
                        update('sectionIcons', { ...current, skills: opt.id });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary Icon */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                Summary Icon
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SECTION_ICON_OPTIONS.summary.map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = (customization.sectionIcons?.summary || 'sparkles') === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        const current = customization.sectionIcons || {};
                        update('sectionIcons', { ...current, summary: opt.id });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. ATS Friendly Resume Mode */}
      <div className="pt-4 border-t border-slate-200 p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-950 block">ATS-Friendly Mode</span>
            <span className="text-[11px] text-emerald-700">
              Simplifies layout hierarchy and ensures maximum machine-readability for automated HR systems.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={customization.atsMode}
              onChange={(e) => update('atsMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
