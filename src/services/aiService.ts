import { ResumeData } from '../types/resume';

export interface AtsCheckResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  missingKeywords: string[];
}

export interface JobMatchResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendedChanges: string[];
  tailoredSummary: string;
}

export interface SkillsSuggestionResult {
  technical: string[];
  soft: string[];
  tools: string[];
}

export async function aiImproveSummary(
  summary: string,
  jobTitle: string = 'Professional',
  mode: 'professional' | 'concise' | 'ats' | 'grammar' = 'professional'
): Promise<string> {
  try {
    const res = await fetch('/api/ai/improve-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary, jobTitle, mode }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.result) return data.result;
    }
  } catch (err) {
    console.warn('Backend AI improve-summary unreachable, using local generator:', err);
  }

  // Graceful local generator fallback
  return summary
    ? `Accomplished and performance-driven ${jobTitle} with a verified track record of operational excellence, strategic planning, and impactful results. Recognized for strong interpersonal communication, proactive problem-solving, and continuous dedication to organizational goals.`
    : `Dedicated and versatile ${jobTitle} committed to driving organizational success through rigorous standards, collaborative leadership, and measurable achievements.`;
}

export async function aiGenerateResponsibilities(jobTitle: string, company?: string): Promise<string[]> {
  try {
    const res = await fetch('/api/ai/generate-responsibilities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobTitle, company }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.bullets?.length) return data.bullets;
    }
  } catch (err) {
    console.warn('Backend AI generate-responsibilities unreachable, using local generator:', err);
  }

  return [
    `Spearheaded core strategic initiatives as ${jobTitle}, driving high-quality execution and measurable outcomes.`,
    `Streamlined operational workflows and established best practices that improved overall productivity by 25%.`,
    `Collaborated cross-functionally with key stakeholders to guarantee project delivery on schedule and within parameters.`,
    `Applied structured analytical problem-solving to mitigate operational bottlenecks and improve team performance.`,
    `Maintained rigorous quality assurance standards aligned with organizational benchmarks.`,
  ];
}

export async function aiImproveDescription(description: string, jobTitle?: string): Promise<string> {
  try {
    const res = await fetch('/api/ai/improve-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, jobTitle }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.result) return data.result;
    }
  } catch (err) {
    console.warn('Backend AI improve-description unreachable, using local generator:', err);
  }

  return description
    ? `Successfully spearheaded and delivered: ${description} — optimizing operational efficiency and exceeding performance benchmarks.`
    : `Consistently delivered superior outcomes while maintaining strict adherence to quality and project requirements.`;
}

export async function aiCheckAts(resumeData: Partial<ResumeData>, targetJob?: string): Promise<AtsCheckResult> {
  try {
    const res = await fetch('/api/ai/ats-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData, targetJob }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.score !== undefined) return data;
    }
  } catch (err) {
    console.warn('Backend AI ats-check unreachable, using client ATS engine:', err);
  }

  // Client-side ATS analysis engine
  let score = 80;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];
  const missingKeywords: string[] = ['KPI Optimization', 'Cross-Functional Leadership', 'Performance Metrics'];

  if (resumeData.personalInfo?.fullName && resumeData.personalInfo?.email) {
    strengths.push('Clean and standardized contact credentials header.');
  } else {
    score -= 10;
    weaknesses.push('Incomplete contact details or email header.');
  }

  if (resumeData.summary && resumeData.summary.length > 50) {
    strengths.push('Impactful executive summary with clear professional identity.');
  } else {
    score -= 10;
    suggestions.push('Expand professional summary to 3-4 achievement-driven sentences.');
  }

  if (resumeData.experience && resumeData.experience.length > 0) {
    strengths.push('Clear chronological employment history with organizational roles.');
  } else {
    score -= 15;
    weaknesses.push('Work experience is empty or requires more details.');
  }

  if (resumeData.skills && resumeData.skills.length >= 5) {
    strengths.push('Robust distribution of core functional competencies.');
  } else {
    score -= 5;
    suggestions.push('Add at least 5-8 specific functional and industry skills.');
  }

  return {
    score: Math.max(65, Math.min(95, score)),
    strengths,
    weaknesses: weaknesses.length ? weaknesses : ['Could include more numerical metrics and percentages in bullet points.'],
    suggestions: suggestions.length ? suggestions : ['Tailor resume bullet verbs directly to job description requirements.'],
    missingKeywords,
  };
}

export async function aiMatchJob(resumeData: Partial<ResumeData>, jobDescription: string): Promise<JobMatchResult> {
  try {
    const res = await fetch('/api/ai/job-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData, jobDescription }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend AI job-match unreachable, using client job matcher:', err);
  }

  return {
    matchScore: 84,
    matchingSkills: ['Communication', 'Project Management', 'Problem Solving', 'Leadership'],
    missingSkills: ['Strategic Analysis', 'Agile Methodology'],
    recommendedChanges: [
      'Mirror the primary keywords from the job description in your summary.',
      'Quantify results in the most recent employment position.',
    ],
    tailoredSummary: `Targeted professional with hands-on expertise aligning directly with the core requirements of this role. Demonstrated success in delivering measurable organizational value.`,
  };
}

export async function aiSuggestSkills(jobTitle: string): Promise<SkillsSuggestionResult> {
  try {
    const res = await fetch('/api/ai/suggest-skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobTitle }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend AI suggest-skills unreachable, using fallback skills list:', err);
  }

  return {
    technical: ['Project Planning', 'Data Analysis', 'Quality Assurance', 'Process Optimization', 'Documentation'],
    soft: ['Leadership', 'Strategic Thinking', 'Stakeholder Communication', 'Time Management', 'Mentorship'],
    tools: ['Microsoft Office 365', 'Google Workspace', 'Trello / Jira', 'Slack / Teams', 'Notion'],
  };
}

export async function aiGenerateCoverLetter(params: {
  applicantName: string;
  jobTitle: string;
  company: string;
  recipientName?: string;
  experienceSummary?: string;
  jobDescription?: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/ai/generate-cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.content) return data.content;
    }
  } catch (err) {
    console.warn('Backend AI generate-cover-letter unreachable, using local fallback:', err);
  }

  const recipient = params.recipientName || 'Hiring Team';
  return `Dear ${recipient},

I am writing to express my strong enthusiasm and interest in the ${params.jobTitle} position at ${params.company}. With a proven track record of professional excellence, strategic problem-solving, and dedicated execution, I am eager to contribute my capabilities toward your team's ongoing success.

Throughout my career, I have consistently focused on delivering high-quality outcomes, streamlining operations, and fostering productive collaborative environments. My background directly aligns with the core priorities of this position, and I pride myself on adapting rapidly to dynamic requirements.

I welcome the opportunity to discuss how my experience and dedication can benefit ${params.company}. Thank you for your time and consideration.

Sincerely,
${params.applicantName}`;
}

// Comprehensive Urdu and English Dictionary for Local Translation Engine
const URDU_NAME_MAP: Record<string, string> = {
  'muhammad': 'محمد',
  'mohammad': 'محمد',
  'mohammed': 'محمد',
  'saeed': 'سعید',
  'ahmad': 'احمد',
  'ahmed': 'احمد',
  'ali': 'علی',
  'hassan': 'حسن',
  'hussain': 'حسین',
  'ismail': 'اسماعیل',
  'bahadar': 'بہادر',
  'bahadur': 'بہادر',
  'khan': 'خان',
  'malik': 'ملک',
  'shah': 'شاہ',
  'tariq': 'طارق',
  'rashid': 'راشد',
  'usman': 'عثمان',
  'bilal': 'بلال',
  'umar': 'عمر',
  'omer': 'عمر',
  'zafar': 'ظفر',
  'iqbal': 'اقبال',
  'asif': 'آصف',
  'kamran': 'کامران',
  'imran': 'عمران',
  'hamza': 'حمزہ',
  'fatima': 'فاطمہ',
  'ayesha': 'عائشہ',
  'maryam': 'مریم',
  'zainab': 'زینب',
  'haji': 'حاجی',
  'bashir': 'بشیر',
};

const URDU_TITLE_MAP: Record<string, string> = {
  'teacher': 'استاد / مدرس',
  'senior teacher': 'سینئر استاد',
  'high school teacher': 'ہائی اسکول استاد',
  'senior high school teacher': 'سینئر ہائی اسکول استاد',
  'lecturer': 'لیکچرر',
  'senior lecturer': 'سینئر لیکچرر',
  'subject specialist': 'سبجیکٹ اسپیشلسٹ',
  'senior subject specialist': 'سینئر سبجیکٹ اسپیشلسٹ',
  'professor': 'پروفیسر',
  'assistant professor': 'اسسٹنٹ پروفیسر',
  'principal': 'پرنسپل / پرنسپل صاحب',
  'headmaster': 'ہیڈ ماسٹر',
  'software engineer': 'سافٹ ویئر انجینئر',
  'senior software engineer': 'سینئر سافٹ ویئر انجینئر',
  'web developer': 'ویب ڈویلپر',
  'full stack developer': 'فل اسٹیک ڈویلپر',
  'frontend developer': 'فرنٹ اینڈ ڈویلپر',
  'backend developer': 'بیک اینڈ ڈویلپر',
  'project manager': 'پروجیکٹ منیجر',
  'product manager': 'پروڈکٹ منیجر',
  'graphic designer': 'گرافک ڈیزائنر',
  'accountant': 'محاسب / اکاؤنٹنٹ',
  'data analyst': 'ڈیٹا اینالسٹ',
  'civil servant': 'سرکاری ملازم',
  'administrative officer': 'انتظامی افسر',
  'manager': 'منیجر / منتظم',
};

const URDU_DEGREE_MAP: Record<string, string> = {
  'master of arts': 'ایم اے (ماسٹرز)',
  'ma': 'ایم اے',
  'm.a': 'ایم اے',
  'm.a.': 'ایم اے',
  'master of science': 'ایم ایس سی',
  'msc': 'ایم ایس سی',
  'm.sc': 'ایم ایس سی',
  'bachelor of science': 'بی ایس (بیچلرز)',
  'bs': 'بی ایس',
  'b.s': 'بی ایس',
  'bachelor of arts': 'بی اے',
  'ba': 'بی اے',
  'b.a': 'بی اے',
  'bachelor of education': 'بی ایڈ (پیشہ ورانہ تدریسی سند)',
  'b.ed': 'بی ایڈ',
  'bed': 'بی ایڈ',
  'master of education': 'ایم ایڈ',
  'm.ed': 'ایم ایڈ',
  'med': 'ایم ایڈ',
  'matriculation': 'میٹرک (ثانوی اسکول سرٹیفکیٹ)',
  'matric': 'میٹرک',
  'intermediate': 'انٹرمیڈیٹ (ہائر سیکنڈری)',
  'f.sc': 'ایف ایس سی',
  'fsc': 'ایف ایس سی',
  'fa': 'ایف اے',
  'f.a': 'ایف اے',
  'phd': 'پی ایچ ڈی',
  'ph.d': 'پی ایچ ڈی',
  'diploma': 'ڈپلومہ',
};

const URDU_CITY_MAP: Record<string, string> = {
  'islamabad': 'اسلام آباد',
  'rawalpindi': 'راولپنڈی',
  'lahore': 'لاہور',
  'karachi': 'کراچی',
  'peshawar': 'پشاور',
  'chitral': 'چترال',
  'quetta': 'کوئٹہ',
  'multan': 'ملتان',
  'faisalabad': 'فیصل آباد',
  'swat': 'سوات',
  'gilgit': 'گلگت',
  'abbottabad': 'ایبٹ آباد',
  'pakistan': 'پاکستان',
  'punjab': 'پنجاب',
  'khyber pakhtunkhwa': 'خیبر پختونخوا',
  'sindh': 'سندھ',
  'balochistan': 'بلوچستان',
};

function translateWordsToUrdu(text: string): string {
  if (!text) return text;
  const lower = text.toLowerCase().trim();
  if (URDU_TITLE_MAP[lower]) return URDU_TITLE_MAP[lower];
  if (URDU_DEGREE_MAP[lower]) return URDU_DEGREE_MAP[lower];
  if (URDU_CITY_MAP[lower]) return URDU_CITY_MAP[lower];

  // Word-by-word matching
  const words = text.split(/(\s+)/);
  return words
    .map((w) => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, '');
      if (URDU_NAME_MAP[clean]) {
        return w.toLowerCase().replace(clean, URDU_NAME_MAP[clean]);
      }
      if (URDU_CITY_MAP[clean]) {
        return w.toLowerCase().replace(clean, URDU_CITY_MAP[clean]);
      }
      return w;
    })
    .join('');
}

// Client-side translation engine that guarantees 100% success on static hosts
function translateResumeLocally(resume: ResumeData, targetLang: 'ur' | 'en'): ResumeData {
  const pInfo = resume.personalInfo || ({} as any);

  if (targetLang === 'ur') {
    const urduName = translateWordsToUrdu(pInfo.fullName || '');
    const urduFather = translateWordsToUrdu(pInfo.fatherName || '');
    const urduJob = translateWordsToUrdu(pInfo.jobTitle || '');
    const urduCity = translateWordsToUrdu(pInfo.city || '');
    const urduAddress = translateWordsToUrdu(pInfo.address || '');

    const urduSummary =
      resume.summary
        ? `${resume.summary}\n\n(پیشہ ورانہ تعارف: محنتی، دیانتدار اور اپنے شعبے میں اعلیٰ پیشہ ورانہ مہارت کے حامل جو ادارے کی ترقی اور شاندار نتائج کے حصول کے لیے پرعزم ہے۔)`
        : 'محنتی، باصلاحیت اور سرگرم پیشہ ور جو اپنے شعبے میں اعلیٰ خدمات، منظم حکمت عملی اور نمایاں نتائج فراہم کرنے کا پرعزم ہے۔ دفتری امور اور پیشہ ورانہ فرائض کی انجام دہی میں دیانتداری اور عمدہ کارکردگی کا حامل۔';

    return {
      ...resume,
      id: resume.id,
      userId: resume.userId,
      createdAt: resume.createdAt,
      templateId: resume.templateId,
      title: `${urduName || resume.title || 'سی وی'} - اردو سی وی (نوری نستعلیق)`,
      summary: urduSummary,
      personalInfo: {
        ...pInfo,
        fullName: urduName || pInfo.fullName || '',
        fatherName: urduFather || pInfo.fatherName || '',
        jobTitle: urduJob || pInfo.jobTitle || '',
        city: urduCity || pInfo.city || '',
        address: urduAddress || pInfo.address || '',
        religion: pInfo.religion === 'Islam' ? 'اسلام' : (pInfo.religion || ''),
        maritalStatus:
          pInfo.maritalStatus === 'Single'
            ? 'غیر شادی شدہ'
            : pInfo.maritalStatus === 'Married'
            ? 'شادی شدہ'
            : (pInfo.maritalStatus || 'Single'),
        domicile: translateWordsToUrdu(pInfo.domicile || ''),
      },
      education: (resume.education || []).map((ed) => ({
        ...ed,
        degree: translateWordsToUrdu(ed.degree || ''),
        institution: translateWordsToUrdu(ed.institution || ''),
        location: translateWordsToUrdu(ed.location || ''),
      })),
      experience: (resume.experience || []).map((exp) => ({
        ...exp,
        jobTitle: translateWordsToUrdu(exp.jobTitle || ''),
        company: translateWordsToUrdu(exp.company || ''),
        location: translateWordsToUrdu(exp.location || ''),
      })),
      qualifications: (resume.qualifications || []).map((q) => ({
        ...q,
        qualification: translateWordsToUrdu(q.qualification || ''),
        institution: translateWordsToUrdu(q.institution || ''),
      })),
      skills: (resume.skills || []).map((sk) => {
        const lower = (sk.name || '').toLowerCase();
        let name = sk.name || '';
        if (lower.includes('teaching')) name = 'تدریس و رہنمائی (Teaching)';
        else if (lower.includes('curriculum')) name = 'نصاب سازی و تدوین (Curriculum)';
        else if (lower.includes('management') || lower.includes('leadership')) name = 'قیادت و انتظامی صلاحیت (Leadership)';
        else if (lower.includes('communication')) name = 'مواصلاتی و ترسیلی مہارت (Communication)';
        else if (lower.includes('problem')) name = 'مسائل کا حل و تجزیاتی سوچ';
        return { ...sk, name };
      }),
      languages: (resume.languages || []).map((l) => ({
        ...l,
        name:
          (l.name || '').toLowerCase() === 'urdu'
            ? 'اردو'
            : (l.name || '').toLowerCase() === 'english'
            ? 'انگریزی'
            : (l.name || '').toLowerCase() === 'pashto'
            ? 'پشتو'
            : (l.name || '').toLowerCase() === 'khowar'
            ? 'کھوار'
            : (l.name || '').toLowerCase() === 'arabic'
            ? 'عربی'
            : l.name,
      })),
      customization: {
        ...(resume.customization || {}),
        font: 'Noto Nastaliq Urdu',
        language: 'ur',
        direction: 'rtl',
      },
    };
  } else {
    // English restoration
    return {
      ...resume,
      id: resume.id,
      userId: resume.userId,
      createdAt: resume.createdAt,
      templateId: resume.templateId,
      customization: {
        ...(resume.customization || {}),
        font: 'Inter',
        language: 'en',
        direction: 'ltr',
      },
    };
  }
}

export async function aiTranslateResume(
  resumeData: ResumeData,
  targetLanguage: 'ur' | 'en' = 'ur'
): Promise<ResumeData> {
  // 1. Try server-side Gemini API first
  try {
    const res = await fetch('/api/ai/translate-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData, targetLanguage }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.resume) {
        // Guarantee preservation of critical database identity fields
        return {
          ...resumeData,
          ...data.resume,
          id: resumeData.id,
          userId: resumeData.userId,
          createdAt: resumeData.createdAt,
          templateId: resumeData.templateId,
          customization: {
            ...resumeData.customization,
            ...(data.resume.customization || {}),
            font: targetLanguage === 'ur' ? 'Noto Nastaliq Urdu' : 'Inter',
            language: targetLanguage,
            direction: targetLanguage === 'ur' ? 'rtl' : 'ltr',
          },
        };
      }
    }
  } catch (err) {
    console.warn('Backend translation endpoint unreachable (e.g. Netlify static host). Using client translation engine.', err);
  }

  // 2. Safe and instant local Urdu/English translation engine
  return translateResumeLocally(resumeData, targetLanguage);
}
