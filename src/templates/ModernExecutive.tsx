import React from 'react';
import { TemplateProps, getActiveParticulars, getSpacingClassName } from './types';
import { getSectionIcon } from '../utils/sectionIcons';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const ModernExecutive: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, customization } = data;
  const primaryColor = customization?.primaryColor || '#0f172a';
  const isUrdu =
    customization?.font === 'Noto Nastaliq Urdu' ||
    customization?.language === 'ur' ||
    customization?.direction === 'rtl';

  const particulars = getActiveParticulars(personalInfo, isUrdu);
  const spacingClass = getSpacingClassName(customization?.spacing);

  const photoShapeClass =
    customization?.photoShape === 'circle'
      ? 'rounded-full'
      : customization?.photoShape === 'rounded'
      ? 'rounded-xl'
      : 'rounded-none';

  return (
    <div
      dir={isUrdu ? 'rtl' : 'ltr'}
      className={`w-full bg-white text-slate-800 min-h-[297mm] flex flex-col ${isUrdu ? 'font-nastaliq text-right' : ''}`}
    >
      {/* 1. Commanding Executive Top Banner */}
      <div
        className="px-8 py-6 text-white flex justify-between items-center shadow-sm"
        style={{ backgroundColor: primaryColor }}
      >
        <div className={`space-y-1.5 flex-1 ${isUrdu ? 'pl-6' : 'pr-6'}`}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">
            {isUrdu ? 'پیشہ ورانہ کوائف نامہ (سی وی)' : 'Executive Curriculum Vitae'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
            {personalInfo.fullName || (isUrdu ? 'محمد اسماعیل' : 'Muhammad Saeed Ahmad')}
          </h1>
          <p className="text-sm font-semibold tracking-wide text-white/90">
            {personalInfo.jobTitle || (isUrdu ? 'سینئر ڈائریکٹر و سبجیکٹ اسپیشلسٹ' : 'Senior Director & Subject Specialist')}
          </p>

          {/* Quick contact strip */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/80 pt-1">
            {personalInfo.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-white/60 shrink-0" />
                <span dir="ltr">{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-white/60 shrink-0" />
                <span dir="ltr">{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.showWhatsapp && personalInfo.whatsapp && (
              <span className="flex items-center gap-1.5 font-bold text-emerald-300">
                <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded font-mono">WA</span>
                <span dir="ltr">{personalInfo.whatsapp}</span>
              </span>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-white/60 shrink-0" />
                <span>{[personalInfo.address, personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
              </span>
            )}
          </div>
        </div>

        {/* Profile Avatar */}
        {customization?.showPhoto && personalInfo.photoUrl && (
          <div className={`shrink-0 ${isUrdu ? 'pr-2' : 'pl-2'}`}>
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className={`w-24 h-24 object-cover border-2 border-white/30 shadow-md ${photoShapeClass}`}
            />
          </div>
        )}
      </div>

      {/* 2. Executive Dual-Column Body */}
      <div className="flex-1 flex min-h-0">
        {/* SIDEBAR COLUMN (34%) */}
        <div className={`w-[34%] bg-slate-50 ${isUrdu ? 'border-l' : 'border-r'} border-slate-200 p-6 space-y-5`}>
          {/* Online Presence */}
          {(personalInfo.linkedIn || personalInfo.portfolioUrl) && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-200 pb-1">
                {isUrdu ? 'آن لائن پروفائلز' : 'Profiles'}
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                {personalInfo.linkedIn && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate" dir="ltr">{personalInfo.linkedIn}</span>
                  </div>
                )}
                {personalInfo.portfolioUrl && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate" dir="ltr">{personalInfo.portfolioUrl}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Biographical Particulars (Pakistani / Official fields) */}
          {particulars.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-200 pb-1">
                {isUrdu ? 'ذاتی کوائف' : 'Particulars'}
              </h3>
              <div className="space-y-2 text-xs">
                {particulars.map((item, idx) => (
                  <div key={idx} className="bg-white p-2 rounded border border-slate-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {item.label}
                    </span>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Skills & Competencies */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1 mb-2">
                {getSectionIcon('skills', customization?.sectionIcons?.skills, customization?.showSectionIcons !== false, primaryColor)}
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {isUrdu ? 'مہارتیں و صلاحیتیں' : 'Core Competencies'}
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <div className="flex justify-between font-semibold text-slate-800 mb-0.5">
                      <span>{s.name}</span>
                      {customization?.showSkillPercentages && (
                        <span className="text-[10px] text-slate-500">{s.level * 20}%</span>
                      )}
                    </div>
                    {customization?.showSkillPercentages && (
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.level * 20}%`,
                            backgroundColor: primaryColor,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-200 pb-1">
                {isUrdu ? 'زبانیں' : 'Languages'}
              </h3>
              <div className="space-y-1.5 text-xs">
                {data.languages.map((l) => (
                  <div key={l.id} className="flex justify-between items-center bg-white p-1.5 rounded border border-slate-200/60">
                    <span className="font-bold text-slate-800">{l.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-200 pb-1">
                {isUrdu ? 'اسناد و سرٹیفکیٹس' : 'Certifications'}
              </h3>
              <div className="space-y-1.5 text-xs">
                {data.certifications.map((c) => (
                  <div key={c.id} className="bg-white p-2 rounded border border-slate-200/80">
                    <span className="font-bold text-slate-800 block">{c.name}</span>
                    <span className="text-[10px] text-slate-500">{c.organization} {c.issueDate ? `(${c.issueDate})` : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies / Interests */}
          {data.hobbies && data.hobbies.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-200 pb-1">
                {isUrdu ? 'مشاغل و دلچسپیاں' : 'Interests'}
              </h3>
              <div className="flex flex-wrap gap-1">
                {data.hobbies.map((h) => (
                  <span key={h.id} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium">
                    {h.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MAIN COLUMN (66%) */}
        <div className={`w-[66%] p-8 ${spacingClass}`}>
          {/* Executive Summary */}
          {data.summary && (
            <div>
              <div className="flex items-center gap-1.5 border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>
                {getSectionIcon('summary', customization?.sectionIcons?.summary, customization?.showSectionIcons !== false, primaryColor)}
                <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                  {isUrdu ? 'پیشہ ورانہ تعارف و خلاصہ' : 'Executive Summary'}
                </h2>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                {data.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 border-b-2 pb-1 mb-3" style={{ borderColor: primaryColor }}>
                {getSectionIcon('experience', customization?.sectionIcons?.experience, customization?.showSectionIcons !== false, primaryColor)}
                <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                  {isUrdu ? 'کام کا تجربہ' : 'Executive Work Experience'}
                </h2>
              </div>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id} className={`text-xs relative ${isUrdu ? 'pr-3 border-r-2' : 'pl-3 border-l-2'} border-slate-200`}>
                    <div className="flex justify-between items-baseline font-bold text-slate-800">
                      <span className="text-xs font-bold text-slate-900">{exp.jobTitle}</span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {exp.startDate} - {exp.isCurrent ? (isUrdu ? 'تاحال' : 'Present') : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600 mb-1">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </div>
                    {exp.description && (
                      <p className="text-slate-600 text-[11px] mb-1 leading-snug">{exp.description}</p>
                    )}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px] pl-1">
                        {exp.responsibilities.map((r, i) => (
                          <li key={i} className="leading-snug">{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Qualifications (B.Ed, M.Ed, Diplomas) */}
          {data.qualifications && data.qualifications.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 border-b-2 pb-1 mb-2.5" style={{ borderColor: primaryColor }}>
                {getSectionIcon('qualifications', customization?.sectionIcons?.qualifications, customization?.showSectionIcons !== false, primaryColor)}
                <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                  {isUrdu ? 'پیشہ ورانہ اسناد و قابلیت' : 'Professional Qualifications'}
                </h2>
              </div>
              <div className="space-y-2 text-xs">
                {data.qualifications.map((q) => (
                  <div key={q.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{q.qualification}</span>
                      <span className="text-[11px] text-slate-500 font-normal">{q.year}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {q.institution} {q.grade ? (isUrdu ? `• گریڈ: ${q.grade}` : `• Grade: ${q.grade}`) : ''}
                    </div>
                    {q.description && <p className="text-[10px] text-slate-500 mt-0.5">{q.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 border-b-2 pb-1 mb-2.5" style={{ borderColor: primaryColor }}>
                {getSectionIcon('education', customization?.sectionIcons?.education, customization?.showSectionIcons !== false, primaryColor)}
                <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                  {isUrdu ? 'تعلیمی قابلیت' : 'Academic Credentials'}
                </h2>
              </div>
              <div className="space-y-2.5 text-xs">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{edu.degree}</span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {edu.startYear ? `${edu.startYear} - ` : ''}{edu.endYear}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px] flex justify-between">
                      <span>{edu.institution} {edu.location ? `• ${edu.location}` : ''}</span>
                      {edu.grade && <span className="font-semibold text-slate-700">{edu.grade}</span>}
                    </div>
                    {edu.major && (
                      <p className="text-[10px] text-slate-500">
                        {isUrdu ? `مضمون: ${edu.major}` : `Major: ${edu.major}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Projects */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 border-b-2 pb-1 mb-2.5" style={{ borderColor: primaryColor }}>
                {getSectionIcon('projects', customization?.sectionIcons?.projects, customization?.showSectionIcons !== false, primaryColor)}
                <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                  {isUrdu ? 'نمایاں پروجیکٹس' : 'Strategic Projects & Initiatives'}
                </h2>
              </div>
              <div className="space-y-2 text-xs">
                {data.projects.map((p) => (
                  <div key={p.id}>
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{p.title}</span>
                      <span className="text-[11px] text-slate-500 font-normal">{p.date}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{p.description}</p>
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.technologies.map((t, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {data.references && (
            <div>
              <div className="border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>
                <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                  {isUrdu ? 'حوالہ جات' : 'References'}
                </h2>
              </div>
              {data.references.type === 'upon_request' ? (
                <p className="text-xs text-slate-600 italic">
                  {isUrdu ? 'حوالہ جات بوقت ضرورت پیش کیے جائیں گے۔' : 'Available upon executive request.'}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {data.references.list.map((r) => (
                    <div key={r.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="font-bold text-slate-800">{r.name}</div>
                      <div className="text-[11px] text-slate-600">{r.title} • {r.organization}</div>
                      {r.phone && <div className="text-[10px] text-slate-500">Tel: {r.phone}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections.map((cs) => (
                <div key={cs.id}>
                  <div className="border-b-2 pb-1 mb-2" style={{ borderColor: primaryColor }}>
                    <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                      {cs.title}
                    </h2>
                  </div>
                  <div className="space-y-2 text-xs">
                    {cs.entries.map((entry) => (
                      <div key={entry.id}>
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{entry.title}</span>
                          {entry.date && <span className="text-[11px] text-slate-500 font-normal">{entry.date}</span>}
                        </div>
                        {entry.subtitle && <div className="text-[11px] text-slate-600">{entry.subtitle}</div>}
                        {entry.description && <p className="text-slate-600 text-[11px] mt-0.5">{entry.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Footer Branding */}
          <div className="pt-6 mt-8 border-t border-slate-200 text-center">
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Designed and developed by Ismail Bahadar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
