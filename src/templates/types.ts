import { ResumeData, PersonalInfo } from '../types/resume';

export interface TemplateProps {
  data: ResumeData;
}

export function getFontFamilyStyle(font?: string): React.CSSProperties {
  switch (font) {
    case 'Noto Nastaliq Urdu':
      return {
        fontFamily: '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Noore Huda", "Nafees Nastaleeq", serif',
        lineHeight: 2.2,
      };
    case 'Georgia':
      return { fontFamily: 'Georgia, "Times New Roman", serif' };
    case 'Roboto':
      return { fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif' };
    case 'Lato':
      return { fontFamily: '"Lato", -apple-system, BlinkMacSystemFont, sans-serif' };
    case 'Open Sans':
      return { fontFamily: '"Open Sans", -apple-system, BlinkMacSystemFont, sans-serif' };
    case 'Arial':
      return { fontFamily: 'Arial, Helvetica, sans-serif' };
    case 'Inter':
    default:
      return { fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' };
  }
}

export function getSpacingClassName(spacing?: 'compact' | 'normal' | 'spacious'): string {
  switch (spacing) {
    case 'compact':
      return 'space-y-3';
    case 'spacious':
      return 'space-y-6';
    case 'normal':
    default:
      return 'space-y-4';
  }
}

export function getPaddingClassName(margins?: 'narrow' | 'normal' | 'wide'): string {
  switch (margins) {
    case 'narrow':
      return 'p-6';
    case 'wide':
      return 'p-12';
    case 'normal':
    default:
      return 'p-8';
  }
}

export function getActiveParticulars(info: PersonalInfo, isUrdu: boolean = false): Array<{ label: string; value: string }> {
  const list: Array<{ label: string; value: string }> = [];
  if ((info.showFatherName !== false) && info.fatherName) {
    list.push({ label: isUrdu ? 'والد کا نام' : 'Father Name', value: info.fatherName });
  }
  if ((info.showCnic !== false) && info.cnic) {
    list.push({ label: isUrdu ? 'قومی شناختی کارڈ' : 'CNIC No', value: info.cnic });
  }
  if (info.showDob && info.dateOfBirth) {
    list.push({ label: isUrdu ? 'تاریخ پیدائش' : 'Date of Birth', value: info.dateOfBirth });
  }
  if (info.showReligion && info.religion) {
    list.push({ label: isUrdu ? 'مذہب' : 'Religion', value: info.religion });
  }
  if (info.showMaritalStatus && info.maritalStatus) {
    list.push({ label: isUrdu ? 'ازدواجی حیثیت' : 'Marital Status', value: info.maritalStatus });
  }
  if (info.showNationality && info.nationality) {
    list.push({ label: isUrdu ? 'قومیت' : 'Nationality', value: info.nationality });
  }
  if (info.showDomicile && info.domicile) {
    list.push({ label: isUrdu ? 'ڈومیسائل / ضلع' : 'Domicile / District', value: info.domicile });
  }
  return list;
}
