import React from 'react';
import {
  Briefcase,
  Building,
  TrendingUp,
  Laptop,
  Rocket,
  UserCheck,
  GraduationCap,
  BookOpen,
  Award,
  Bookmark,
  Wrench,
  Sparkles,
  Code,
  Cpu,
  Target,
  CheckCircle2,
  Zap,
  User,
  FileText,
  Compass,
  Lightbulb,
  Medal,
  Star,
  Shield,
  Globe,
  Languages,
  Folder,
  Terminal,
  Users,
  Phone,
} from 'lucide-react';

export interface IconOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export const SECTION_ICON_OPTIONS: Record<string, IconOption[]> = {
  experience: [
    { id: 'briefcase', label: 'Briefcase', icon: Briefcase },
    { id: 'building', label: 'Building', icon: Building },
    { id: 'trending-up', label: 'Growth', icon: TrendingUp },
    { id: 'laptop', label: 'Laptop', icon: Laptop },
    { id: 'rocket', label: 'Rocket', icon: Rocket },
    { id: 'user-check', label: 'Professional', icon: UserCheck },
    { id: 'none', label: 'No Icon', icon: () => null },
  ],
  education: [
    { id: 'graduation-cap', label: 'Cap', icon: GraduationCap },
    { id: 'book-open', label: 'Book', icon: BookOpen },
    { id: 'award', label: 'Degree', icon: Award },
    { id: 'bookmark', label: 'Bookmark', icon: Bookmark },
    { id: 'none', label: 'No Icon', icon: () => null },
  ],
  skills: [
    { id: 'wrench', label: 'Wrench', icon: Wrench },
    { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'cpu', label: 'Technology', icon: Cpu },
    { id: 'target', label: 'Target', icon: Target },
    { id: 'check-circle', label: 'Checkmark', icon: CheckCircle2 },
    { id: 'zap', label: 'Energy', icon: Zap },
    { id: 'none', label: 'No Icon', icon: () => null },
  ],
  summary: [
    { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
    { id: 'user', label: 'Profile', icon: User },
    { id: 'file-text', label: 'Document', icon: FileText },
    { id: 'compass', label: 'Compass', icon: Compass },
    { id: 'lightbulb', label: 'Idea', icon: Lightbulb },
    { id: 'none', label: 'No Icon', icon: () => null },
  ],
  qualifications: [
    { id: 'award', label: 'Medal', icon: Award },
    { id: 'check-circle', label: 'Certified', icon: CheckCircle2 },
    { id: 'star', label: 'Star', icon: Star },
    { id: 'shield', label: 'Badge', icon: Shield },
    { id: 'none', label: 'No Icon', icon: () => null },
  ],
};

const DEFAULT_ICONS: Record<string, string> = {
  experience: 'briefcase',
  education: 'graduation-cap',
  skills: 'wrench',
  summary: 'sparkles',
  qualifications: 'award',
  projects: 'book-open',
  languages: 'languages',
  references: 'users',
};

export function getSectionIcon(
  sectionKey: string,
  customIconId?: string,
  showIcons: boolean = true,
  color?: string,
  className: string = 'w-3.5 h-3.5'
): React.ReactNode {
  if (!showIcons) return null;

  const iconId = customIconId || DEFAULT_ICONS[sectionKey] || 'sparkles';
  if (iconId === 'none') return null;

  const options = SECTION_ICON_OPTIONS[sectionKey] || [];
  const found = options.find((o) => o.id === iconId);
  const IconComp = found ? found.icon : null;

  if (IconComp) {
    return <IconComp className={className} style={{ color }} />;
  }

  // Fallback map
  switch (iconId) {
    case 'briefcase':
      return <Briefcase className={className} style={{ color }} />;
    case 'building':
      return <Building className={className} style={{ color }} />;
    case 'trending-up':
      return <TrendingUp className={className} style={{ color }} />;
    case 'laptop':
      return <Laptop className={className} style={{ color }} />;
    case 'rocket':
      return <Rocket className={className} style={{ color }} />;
    case 'graduation-cap':
      return <GraduationCap className={className} style={{ color }} />;
    case 'book-open':
      return <BookOpen className={className} style={{ color }} />;
    case 'award':
      return <Award className={className} style={{ color }} />;
    case 'wrench':
      return <Wrench className={className} style={{ color }} />;
    case 'code':
      return <Code className={className} style={{ color }} />;
    case 'cpu':
      return <Cpu className={className} style={{ color }} />;
    case 'target':
      return <Target className={className} style={{ color }} />;
    case 'check-circle':
      return <CheckCircle2 className={className} style={{ color }} />;
    case 'user':
      return <User className={className} style={{ color }} />;
    case 'file-text':
      return <FileText className={className} style={{ color }} />;
    case 'star':
      return <Star className={className} style={{ color }} />;
    case 'languages':
      return <Languages className={className} style={{ color }} />;
    case 'users':
      return <Users className={className} style={{ color }} />;
    case 'sparkles':
    default:
      return <Sparkles className={className} style={{ color }} />;
  }
}
