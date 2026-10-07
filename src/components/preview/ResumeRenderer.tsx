import React from 'react';
import { ResumeData } from '../../types/resume';
import { TemplateEngine } from '../../templates/TemplateEngine';

interface ResumeRendererProps {
  data: ResumeData;
  scale?: number;
  id?: string;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({
  data,
  scale = 1,
  id = 'resume-preview-document',
}) => {
  return <TemplateEngine data={data} scale={scale} id={id} />;
};
