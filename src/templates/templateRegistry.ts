import React from 'react';
import { TemplateId } from '../types/resume';
import { TemplateProps } from './types';
import { ProfessionalClassic } from './ProfessionalClassic';
import { ModernExecutive } from './ModernExecutive';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  component: React.ComponentType<TemplateProps>;
}

// Data-driven registry mapping template IDs to their dedicated renderer components
export const TEMPLATE_REGISTRY: Record<TemplateId, React.ComponentType<TemplateProps>> = {
  classic: ProfessionalClassic,
  executive: ModernExecutive,
  // When minimal, elegant-black, government, academic are selected, they can use ProfessionalClassic or specialized configurations
  minimal: ProfessionalClassic,
  government: ProfessionalClassic,
  'elegant-black': ProfessionalClassic,
  academic: ProfessionalClassic,
  // When corporate, creative, two-column, teacher, international are selected, they leverage the ModernExecutive dual-column architecture
  corporate: ModernExecutive,
  creative: ModernExecutive,
  teacher: ModernExecutive,
  'two-column': ModernExecutive,
  international: ModernExecutive,
};

export function getTemplateRenderer(templateId: TemplateId): React.ComponentType<TemplateProps> {
  return TEMPLATE_REGISTRY[templateId] || ProfessionalClassic;
}
