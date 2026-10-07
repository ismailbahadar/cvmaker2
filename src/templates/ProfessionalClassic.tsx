import React from 'react';
import { TemplateProps, getActiveParticulars, getPaddingClassName, getSpacingClassName } from './types';
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
} from 'lucide-react';

export const ProfessionalClassic: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, customization } = data;
  const primaryColor = customization?.primaryColor || '#1e3a8a';
  const isUrdu =
    customization?.font === 'Noto Nastaliq Urdu' ||
    customization?.language === 'ur' ||
    customization?.direction === 'rtl';

  const particulars = getActiveParticulars(personalInfo, isUrdu);

  const paddingClass = getPaddingClassName(customization?.margins);
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
      className={`w-full bg-white text-slate-800 ${paddingClass} ${spacingClass} ${isUrdu ? 'font-nastaliq text-right' : ''}`}
    >
      {/* 1. Header Section */}
      <div className="border-b-2 pb-4 flex justify-between items-start" style={{ borderColor: primaryColor }}>
        <div className={`space-y-1.5 flex-1 ${isUrdu ? 'pl-4' : 'pr-4'}`}>
          <h1
            className="text-2xl sm:text-3xl font-black tracking-tight leading-none"
            style={{ color: primaryColor }}
          >
            {personalInfo.fullName || (isUrdu ? 'محمد اسماعیل' : 'Muhammad Saeed Ahmad')}
          </h1>
          <p className="text-sm font-bold tracking-wide uppercase text-slate-600">
            {personalInfo.jobTitle || (isUrdu ? 'سینئر پروفیشنل و مدرس' : 'Senior Professional / Educator')}
          </p>

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
            {personalInfo.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span dir="ltr">{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span dir="ltr">{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.showWhatsapp && personalInfo.whatsapp && (
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <span className="text-[10px] bg-emerald-100 px-1 py-0.2 rounded font-mono">WA</span>
                <span dir="ltr">{personalInfo.whatsapp}</span>
              </span>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{[personalInfo.address, personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
              </span>
            )}
            {personalInfo.linkedIn && (
              <span className="flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span dir="ltr">{personalInfo.linkedIn}</span>
              </span>
            )}
            {personalInfo.portfolioUrl && (
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span dir="ltr">{personalInfo.portfolioUrl}</span>
              </span>
            )}
          </div>
        </div>

        {/* Profile Photo */}
        {customization?.showPhoto && personalInfo.photoUrl && (
          <div className={`shrink-0 ${isUrdu ? 'pr-2' : 'pl-2'}`}>
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className={`w-24 h-24 object-cover border-2 shadow-sm ${photoShapeClass}`}
              style={{ borderColor: primaryColor }}
            />
          </div>
        )}
      </div>

      {/* 2. Biographical Particulars (Pakistani / Official CV data) */}
      {particulars.length > 0 && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
          {particulars.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {item.label}
              </span>
              <span className="font-semibold text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* 3. Professional Summary */}
      {data.summary && (
        <div>
          <div className="flex items-center gap-1.5 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
            {getSectionIcon('summary', customization?.sectionIcons?.summary, customization?.showSectionIcons !== false, primaryColor)}
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              {isUrdu ? 'پیشہ ورانہ خلاصہ / تعارف' : 'Professional Summary'}
            </h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {data.summary}
          </p>
        </div>
      )}

      {/* Career Objective (if present) */}
      {data.careerObjective && (
        <div>
          <div className="flex items-center gap-1.5 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
            {getSectionIcon('summary', customization?.sectionIcons?.summary, customization?.showSectionIcons !== false, primaryColor)}
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              {isUrdu ? 'پیشہ ورانہ مقصد' : 'Career Objective'}
            </h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {data.careerObjective}
          </p>
        </div>
      )}

      {/* 4. Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 border-b pb-1 mb-2.5" style={{ borderColor: `${primaryColor}40` }}>
            {getSectionIcon('experience', customization?.sectionIcons?.experience, customization?.showSectionIcons !== false, primaryColor)}
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              {isUrdu ? 'کام کا تجربہ' : 'Work Experience'}
            </h2>
          </div>
          <div className="space-y-3.5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-800">
                  <span className="text-xs font-bold">{exp.jobTitle}</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {exp.startDate} - {exp.isCurrent ? (isUrdu ? 'تاحال' : 'Present') : exp.endDate}
                  </span>
                </div>
                <div className="text-slate-600 font-medium text-[11px] mb-1">
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

      {/* 5. Professional Qualifications & Teaching Diplomas (B.Ed, M.Ed) */}
      {data.qualifications && data.qualifications.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
            {getSectionIcon('qualifications', customization?.sectionIcons?.qualifications, customization?.showSectionIcons !== false, primaryColor)}
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              {isUrdu ? 'پیشہ ورانہ اسناد و قابلیت' : 'Professional Qualifications & Teaching Certifications'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {data.qualifications.map((q) => (
              <div key={q.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{q.qualification}</span>
                  <span className="text-[11px] text-slate-500 font-normal">{q.year}</span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">{q.institution}</div>
                {q.grade && (
                  <div className="text-[10px] text-slate-500">
                    {isUrdu ? `گریڈ / ڈویژن: ${q.grade}` : `Grade / Division: ${q.grade}`}
                  </div>
                )}
                {q.description && <p className="text-[10px] text-slate-600 mt-0.5">{q.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Education */}
      {data.education && data.education.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 border-b pb-1 mb-2.5" style={{ borderColor: `${primaryColor}40` }}>
            {getSectionIcon('education', customization?.sectionIcons?.education, customization?.showSectionIcons !== false, primaryColor)}
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              {isUrdu ? 'تعلیمی قابلیت' : 'Academic Education'}
            </h2>
          </div>
          <div className="space-y-2.5">
            {data.education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-800">
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

      {/* 7. Skills */}
      {data.skills && data.skills.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
            {getSectionIcon('skills', customization?.sectionIcons?.skills, customization?.showSectionIcons !== false, primaryColor)}
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              {isUrdu ? 'مہارتیں و صلاحیتیں' : 'Skills & Core Competencies'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s) => (
              <span
                key={s.id}
                className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium"
              >
                {s.name}
                {customization?.showSkillPercentages && ` (${s.level * 20}%)`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 8. Languages */}
      {data.languages && data.languages.length > 0 && (
        <div>
          <div className="border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              {isUrdu ? 'زبانیں' : 'Languages'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            {data.languages.map((l) => (
              <div key={l.id} className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800">{l.name}:</span>
                <span className="text-slate-600">{l.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. Projects */}
      {data.projects && data.projects.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
            <BookOpen className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              {isUrdu ? 'نمایاں پروجیکٹس' : 'Projects'}
            </h2>
          </div>
          <div className="space-y-2">
            {data.projects.map((p) => (
              <div key={p.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{p.title}</span>
                  <span className="text-[11px] text-slate-500 font-normal">{p.date}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{p.description}</p>
                {p.technologies && p.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.technologies.map((t, i) => (
                      <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
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

      {/* 10. Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div>
          <div className="border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              {isUrdu ? 'سرٹیفکیٹس و کورسز' : 'Certifications'}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {data.certifications.map((c) => (
              <div key={c.id} className="p-2 bg-slate-50 border border-slate-200 rounded">
                <div className="font-bold text-slate-800">{c.name}</div>
                <div className="text-[11px] text-slate-600">{c.organization} • {c.issueDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. References */}
      {data.references && (
        <div>
          <div className="border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
              {isUrdu ? 'حوالہ جات' : 'References'}
            </h2>
          </div>
          {data.references.type === 'upon_request' ? (
            <p className="text-xs text-slate-600 italic">
              {isUrdu ? 'حوالہ جات بوقت ضرورت پیش کیے جائیں گے۔' : 'Furnished upon request.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {data.references.list.map((r) => (
                <div key={r.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-800">{r.name}</div>
                  <div className="text-[11px] text-slate-600">{r.title} • {r.organization}</div>
                  {r.phone && <div className="text-[10px] text-slate-500">Phone: {r.phone}</div>}
                  {r.email && <div className="text-[10px] text-slate-500">Email: {r.email}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 12. Custom Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <>
          {data.customSections.map((cs) => (
            <div key={cs.id}>
              <div className="border-b pb-1 mb-2" style={{ borderColor: `${primaryColor}40` }}>
                <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                  {cs.title}
                </h2>
              </div>
              <div className="space-y-2">
                {cs.entries.map((entry) => (
                  <div key={entry.id} className="text-xs">
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
  );
};
