import React from 'react';
import { ResumeData } from '../types/resume';
import { getFontFamilyStyle } from './types';
import { getTemplateRenderer } from './templateRegistry';

export interface TemplateEngineProps {
  data: ResumeData;
  scale?: number;
  id?: string;
}

export const TemplateEngine: React.FC<TemplateEngineProps> = ({
  data,
  scale = 1,
  id = 'resume-preview-document',
}) => {
  const isUrdu =
    data.customization?.font === 'Noto Nastaliq Urdu' ||
    data.customization?.language === 'ur' ||
    data.customization?.direction === 'rtl';

  const fontStyle = getFontFamilyStyle(data.customization?.font);
  const TemplateComponent = getTemplateRenderer(data.templateId);

  const isScaled = scale !== 1;

  return (
    <div
      style={
        isScaled
          ? {
              width: `${Math.round(794 * scale)}px`,
              minHeight: `${Math.round(1123 * scale)}px`,
            }
          : undefined
      }
      className="relative mx-auto flex justify-center print:w-full print:h-auto print:min-h-0"
    >
      <div
        id={id}
        dir={isUrdu ? 'rtl' : 'ltr'}
        style={{
          ...fontStyle,
          width: '794px',
          minHeight: '1123px',
          transform: isScaled ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
        }}
        className={`bg-white text-slate-800 shadow-2xl transition-all relative print:shadow-none print:w-full print:m-0 print:transform-none ${
          isUrdu ? 'font-nastaliq text-right' : ''
        }`}
      >
        <TemplateComponent data={data} />
      </div>
    </div>
  );
};
