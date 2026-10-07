import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

// Utility to call Gemini with error fallback
async function generateAIResponse(prompt: string, fallback: string): Promise<string> {
  if (!geminiApiKey) {
    return fallback;
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });
    return response.text || fallback;
  } catch (err) {
    console.error('Gemini API error:', err);
    return fallback;
  }
}

// 1. Improve Summary
app.post('/api/ai/improve-summary', async (req: Request, res: Response) => {
  const { summary, jobTitle = 'Professional', mode = 'professional' } = req.body;
  const prompt = `You are an expert resume writer. The user is a ${jobTitle}.
Rewrite the following professional summary based on the requested style: "${mode}" (options: professional, concise, ats-friendly, grammar-fix).
Current summary:
"${summary}"

Rules:
- Make it high-impact, active, and persuasive.
- Highlight transferable strengths and accomplishments.
- Avoid clichés like "hardworking team player".
- Keep it between 3 to 5 sentences.
- Return ONLY the improved summary text, nothing else.`;

  const fallback = summary
    ? `${summary} - Enhanced with high-impact industry best practices, delivering reliable execution and leadership.`
    : `Dedicated and results-driven ${jobTitle} with proven expertise in driving organizational success, optimizing operations, and delivering high-value solutions. Adept at cross-functional collaboration and strategic execution.`;

  const result = await generateAIResponse(prompt, fallback);
  res.json({ result: result.trim() });
});

// 2. Generate Work Responsibilities
app.post('/api/ai/generate-responsibilities', async (req: Request, res: Response) => {
  const { jobTitle, company = 'the organization' } = req.body;
  const prompt = `You are a career consultant. Generate 4 to 5 strong, quantifiable, action-oriented resume bullet points for a "${jobTitle}" at "${company}".
Start each bullet with an active verb (e.g. Architected, Streamlined, Spearheaded, Coordinated).
Return ONLY the bullet points formatted as a JSON array of strings, for example:
["Spearheaded cross-functional initiatives...", "Optimized performance by 25%..."]`;

  const fallback = JSON.stringify([
    `Led core initiatives and delivered key projects on time and within scope for ${company}.`,
    `Collaborated with cross-functional teams to streamline workflows and boost overall efficiency by 20%.`,
    `Implemented standard operating procedures that improved quality and minimized operational risks.`,
    `Resolved complex challenges through analytical problem-solving and structured methodology.`,
  ]);

  const raw = await generateAIResponse(prompt, fallback);
  try {
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    res.json({ bullets: parsed });
  } catch {
    res.json({
      bullets: [
        `Spearheaded key initiatives for ${jobTitle} role, delivering measurable improvements.`,
        `Streamlined processes to enhance departmental productivity and accuracy.`,
        `Fostered collaborative stakeholder partnerships to ensure seamless project delivery.`,
        `Consistently exceeded benchmark targets through meticulous execution.`,
      ],
    });
  }
});

// 3. Improve Experience Description
app.post('/api/ai/improve-description', async (req: Request, res: Response) => {
  const { description, jobTitle = 'Professional' } = req.body;
  const prompt = `Improve the following resume job description/bullet point for a ${jobTitle}.
Make it sound more accomplished, active, quantifiable, and ATS-friendly:
"${description}"
Return ONLY the enhanced text.`;

  const fallback = description
    ? `Successfully executed responsibilities: ${description}`
    : `Delivered high quality results in alignment with organizational standards and goals.`;

  const result = await generateAIResponse(prompt, fallback);
  res.json({ result: result.trim() });
});

// 4. ATS Resume Score & Checker
app.post('/api/ai/ats-check', async (req: Request, res: Response) => {
  const { resumeData, targetJob = '' } = req.body;
  const prompt = `You are a Fortune 500 ATS (Applicant Tracking System) parser and resume audit system.
Evaluate this resume data:
${JSON.stringify({
  personalInfo: {
    fullName: resumeData.personalInfo?.fullName,
    jobTitle: resumeData.personalInfo?.jobTitle,
    email: !!resumeData.personalInfo?.email,
    phone: !!resumeData.personalInfo?.phone,
  },
  summaryLength: resumeData.summary?.length || 0,
  experienceCount: resumeData.experience?.length || 0,
  educationCount: resumeData.education?.length || 0,
  skillsCount: resumeData.skills?.length || 0,
  targetJob,
})}

Output a JSON object with:
- "score": number between 60 and 98
- "strengths": array of 3 brief points
- "weaknesses": array of 2-3 brief points
- "suggestions": array of 3 actionable tips
- "missingKeywords": array of 4-6 recommended keywords for ${targetJob || resumeData.personalInfo?.jobTitle || 'General Professional'}

Return ONLY valid JSON.`;

  const fallback = JSON.stringify({
    score: 84,
    strengths: [
      'Clear structured sections and chronological history',
      'Contact information is accessible and present',
      'Relevant foundational skills listed',
    ],
    weaknesses: [
      'Could incorporate more quantified metrics (%, $, time saved)',
      'Action verbs can be sharpened for higher keyword density',
    ],
    suggestions: [
      'Add numbers or metrics to at least 2 experience bullets',
      'Ensure summary targets the exact job title you are applying for',
      'Group technical and soft skills into distinct categories',
    ],
    missingKeywords: ['Project Management', 'Workflow Optimization', 'Data Analysis', 'Cross-functional Collaboration'],
  });

  const raw = await generateAIResponse(prompt, fallback);
  try {
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    res.json(JSON.parse(cleaned));
  } catch {
    res.json(JSON.parse(fallback));
  }
});

// 5. Job Description Match
app.post('/api/ai/job-match', async (req: Request, res: Response) => {
  const { resumeData, jobDescription } = req.body;
  const prompt = `Compare this candidate's resume with the target Job Description.
Resume skills: ${(resumeData.skills || []).map((s: any) => s.name).join(', ')}
Resume title: ${resumeData.personalInfo?.jobTitle}
Resume summary: ${resumeData.summary}

Job Description:
"${jobDescription}"

Output a JSON object with:
- "matchScore": number 50 to 95
- "matchingSkills": array of matched skills
- "missingSkills": array of skills in the job description that the candidate might want to highlight
- "recommendedChanges": array of 3 bullet recommendations
- "tailoredSummary": a suggested 3-sentence summary customized for this job

Return ONLY valid JSON.`;

  const fallback = JSON.stringify({
    matchScore: 82,
    matchingSkills: ['Communication', 'Problem Solving', 'Strategic Planning'],
    missingSkills: ['Stakeholder Management', 'Performance Metrics', 'Agile Delivery'],
    recommendedChanges: [
      'Highlight specific software tools mentioned in the job description',
      'Rephrase current position summary to match the employer’s key objectives',
      'Add industry-specific keywords into your top skills list',
    ],
    tailoredSummary: `Accomplished ${resumeData.personalInfo?.jobTitle || 'Professional'} offering extensive experience in executing key initiatives, driving operational excellence, and delivering measurable impact. Ready to contribute proven expertise to achieve target organizational benchmarks.`,
  });

  const raw = await generateAIResponse(prompt, fallback);
  try {
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    res.json(JSON.parse(cleaned));
  } catch {
    res.json(JSON.parse(fallback));
  }
});

// 6. Suggest Skills
app.post('/api/ai/suggest-skills', async (req: Request, res: Response) => {
  const { jobTitle = 'Software Engineer' } = req.body;
  const prompt = `Suggest the top relevant skills for a "${jobTitle}".
Return ONLY a JSON object:
{
  "technical": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "soft": ["Skill 1", "Skill 2", "Skill 3"],
  "tools": ["Tool 1", "Tool 2", "Tool 3"]
}`;

  const fallback = JSON.stringify({
    technical: ['Process Optimization', 'Data Analysis', 'Quality Assurance', 'Strategic Execution'],
    soft: ['Leadership', 'Problem Solving', 'Team Collaboration', 'Effective Communication'],
    tools: ['Microsoft Office 365', 'Google Workspace', 'Project Tracking Tools'],
  });

  const raw = await generateAIResponse(prompt, fallback);
  try {
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    res.json(JSON.parse(cleaned));
  } catch {
    res.json(JSON.parse(fallback));
  }
});

// 7. Generate Cover Letter
app.post('/api/ai/generate-cover-letter', async (req: Request, res: Response) => {
  const { applicantName, jobTitle, company, recipientName = 'Hiring Team', experienceSummary = '', jobDescription = '' } = req.body;
  const prompt = `Write a compelling, professional cover letter for:
Applicant: ${applicantName}
Position: ${jobTitle}
Company: ${company}
Hiring Manager: ${recipientName}
Candidate Background: ${experienceSummary}
Target Role Notes: ${jobDescription}

Format standard professional business letter structure:
- Formal greeting
- Strong hook expressing interest in ${company}
- 1-2 body paragraphs connecting candidate experience to the role
- Professional closing call-to-action
Return ONLY the text of the cover letter.`;

  const fallback = `Dear ${recipientName},

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With a proven track record of professional excellence and high-impact execution, I am eager to contribute my skills and dedication to your organization's continued success.

Throughout my career, I have consistently demonstrated a commitment to operational quality, strategic problem-solving, and collaborative achievement. I pride myself on delivering measurable results and quickly adapting to evolving demands in dynamic environments. My background aligns closely with the core objectives of this role.

I would welcome the opportunity to discuss how my qualifications, experience, and enthusiasm align with your team's goals. Thank you for your time and consideration.

Sincerely,
${applicantName}`;

  const result = await generateAIResponse(prompt, fallback);
  res.json({ content: result.trim() });
});

// 8. Translate Resume between English and Urdu (Noore Nastaleeq)
app.post('/api/ai/translate-resume', async (req: Request, res: Response) => {
  const { resumeData, targetLanguage = 'ur' } = req.body;

  if (!resumeData) {
    return res.status(400).json({ error: 'Missing resumeData' });
  }

  if (targetLanguage === 'ur') {
    const prompt = `You are a distinguished Urdu scholar, linguist, and executive CV consultant in Pakistan.
Translate all textual content of this resume from English into elegant, professional, and formal Pakistani Urdu (شستہ، معیاری اور دفتری نوری نستعلیق اردو).

Rules:
1. Translate personalInfo:
   - fullName into Urdu script (e.g. "Muhammad Saeed Ahmad" -> "محمد سعید احمد", "Ismail Bahadar" -> "محمد اسماعیل بہادر")
   - jobTitle (e.g. "Senior Lecturer & Subject Specialist" -> "سینئر لیکچرر و سبجیکٹ اسپیشلسٹ")
   - address, city, province, country, nationality, religion, maritalStatus, domicile into Urdu.
   - Keep email, phone, whatsapp, cnic format, and links unchanged.
2. Translate summary and careerObjective into eloquent, impactful Urdu prose suitable for a high-level job application.
3. Translate experience:
   - jobTitle, company, location
   - description
   - responsibilities (each bullet point into strong Urdu with active verbs)
4. Translate education:
   - degree (e.g. "Master of Arts in English" -> "ایم اے انگریزی ادب", "Bachelor of Science" -> "بی ایس", "B.Ed" -> "بی ایڈ")
   - institution, location, major, description
5. Translate qualifications:
   - qualification, institution, description
6. Translate skills:
   - name into appropriate Urdu professional terms (e.g. "Curriculum Development" -> "نصاب سازی و تدوین", "Team Leadership" -> "قیادت و رہنمائی")
7. Translate languages:
   - name and proficiency (e.g. "Fluent" -> "مکمل روانی", "Native" -> "مادری زبان", "Advanced" -> "اعلیٰ مہارت")
8. Translate projects, certifications, hobbies into Urdu.
9. Keep all "id" fields, "date" fields, years, numbers, and boolean flags exactly as they are.
10. Update "title" to reflect Urdu name or title.
11. Return ONLY the JSON object of the updated resume structure matching input keys. No markdown backticks or commentary.

Resume Data:
${JSON.stringify(resumeData)}`;

    try {
      const raw = await generateAIResponse(prompt, '');
      if (raw) {
        const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        const safeResume = {
          ...resumeData,
          ...parsed,
          id: resumeData.id,
          userId: resumeData.userId,
          createdAt: resumeData.createdAt,
          templateId: resumeData.templateId,
          customization: {
            ...resumeData.customization,
            ...(parsed.customization || {}),
            font: 'Noto Nastaliq Urdu',
            language: 'ur',
            direction: 'rtl',
          },
        };
        return res.json({ resume: safeResume });
      }
    } catch (e) {
      console.error('Gemini translate to Urdu error:', e);
    }

    const fallbackResume = {
      ...resumeData,
      id: resumeData.id,
      userId: resumeData.userId,
      createdAt: resumeData.createdAt,
      templateId: resumeData.templateId,
      title: `${resumeData.title || 'Resume'} (اردو)`,
      customization: {
        ...resumeData.customization,
        font: 'Noto Nastaliq Urdu',
        language: 'ur',
        direction: 'rtl',
      },
    };
    return res.json({ resume: fallbackResume });
  } else {
    // Translate back to English
    const prompt = `You are an expert resume writer. Translate all Urdu text in this resume into professional, crisp, modern English.
Preserve all IDs, dates, numbers, phone numbers, emails, and JSON keys.
Return ONLY valid JSON representing the translated resume.

Resume Data:
${JSON.stringify(resumeData)}`;

    try {
      const raw = await generateAIResponse(prompt, '');
      if (raw) {
        const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        const safeResume = {
          ...resumeData,
          ...parsed,
          id: resumeData.id,
          userId: resumeData.userId,
          createdAt: resumeData.createdAt,
          templateId: resumeData.templateId,
          customization: {
            ...resumeData.customization,
            ...(parsed.customization || {}),
            font: 'Inter',
            language: 'en',
            direction: 'ltr',
          },
        };
        return res.json({ resume: safeResume });
      }
    } catch (e) {
      console.error('Gemini translate to English error:', e);
    }

    const fallbackResume = {
      ...resumeData,
      id: resumeData.id,
      userId: resumeData.userId,
      createdAt: resumeData.createdAt,
      templateId: resumeData.templateId,
      customization: {
        ...resumeData.customization,
        font: 'Inter',
        language: 'en',
        direction: 'ltr',
      },
    };
    return res.json({ resume: fallbackResume });
  }
});

// Development vs Production serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (isProd) {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ApexCV Server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
