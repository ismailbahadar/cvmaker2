export type TemplateId =
  | 'classic'
  | 'executive'
  | 'minimal'
  | 'corporate'
  | 'academic'
  | 'creative'
  | 'teacher'
  | 'government'
  | 'two-column'
  | 'elegant-black'
  | 'international';

export type SkillCategory = 'Technical' | 'Soft' | 'Professional' | 'Computer' | 'Language';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  photoUrl?: string;
  
  // Optional / Pakistan-specific & international fields
  fatherName?: string;
  cnic?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  maritalStatus?: string;
  religion?: string;
  domicile?: string;
  district?: string;
  linkedIn?: string;
  portfolioUrl?: string;

  // Visibility flags
  showFatherName?: boolean;
  showCnic?: boolean;
  showDob?: boolean;
  showReligion?: boolean;
  showMaritalStatus?: boolean;
  showGender?: boolean;
  showNationality?: boolean;
  showDomicile?: boolean;
  showWhatsapp?: boolean;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  employmentType?: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string;
  responsibilities?: string[];
  achievements?: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startYear?: string;
  endYear: string;
  grade?: string;
  percentage?: string;
  major?: string;
  description?: string;
}

export interface ProfessionalQualification {
  id: string;
  qualification: string;
  institution: string;
  year: string;
  grade?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1 to 5 or percentage
  category: SkillCategory;
  showLevel?: boolean;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
  reading?: string;
  writing?: string;
  speaking?: string;
  listening?: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  role?: string;
  organization?: string;
  date?: string;
  description: string;
  technologies?: string[];
  link?: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  date?: string;
  description?: string;
}

export interface Hobby {
  id: string;
  name: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  organization: string;
  phone?: string;
  email?: string;
}

export interface ReferencesSection {
  type: 'upon_request' | 'provided';
  list: ReferenceItem[];
}

export interface CustomSectionEntry {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  entries: CustomSectionEntry[];
}

export interface ResumeCustomization {
  primaryColor: string; // hex color
  font: 'Inter' | 'Roboto' | 'Open Sans' | 'Lato' | 'Georgia' | 'Arial' | 'Noto Nastaliq Urdu';
  layout: 'one-column' | 'two-column';
  spacing: 'compact' | 'normal' | 'spacious';
  margins: 'narrow' | 'normal' | 'wide';
  fontSize: 'small' | 'normal' | 'large';
  showPhoto: boolean;
  photoShape: 'circle' | 'square' | 'rounded';
  showSkillPercentages: boolean;
  atsMode: boolean;
  showSectionIcons?: boolean;
  sectionIcons?: Record<string, string>;
  language?: 'en' | 'ur';
  direction?: 'ltr' | 'rtl';
}

export interface ResumeData {
  id: string;
  userId: string;
  title: string;
  templateId: TemplateId;
  personalInfo: PersonalInfo;
  summary: string;
  careerObjective?: string;
  experience: WorkExperience[];
  education: Education[];
  qualifications: ProfessionalQualification[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  awards: Award[];
  hobbies: Hobby[];
  references: ReferencesSection;
  customSections: CustomSection[];
  sectionOrder: string[];
  customization: ResumeCustomization;
  completionPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetterData {
  id: string;
  userId: string;
  title: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantAddress?: string;
  recipientName: string;
  recipientTitle: string;
  company: string;
  companyAddress?: string;
  jobTitle: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  subscription: 'free' | 'pro';
  defaultLanguage?: string;
  defaultTemplate?: TemplateId;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  category: string;
  description: string;
  columns: 1 | 2;
  recommendedFor: string;
  primaryColor: string;
}
