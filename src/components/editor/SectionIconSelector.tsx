import React, { useState } from 'react';
import { SECTION_ICON_OPTIONS } from '../../utils/sectionIcons';
import { Sparkles, Eye, EyeOff, Check, ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface Props {
  sectionKey: 'experience' | 'education' | 'skills' | 'summary' | 'qualifications';
  sectionTitle: string;
  currentIcon?: string;
  showSectionIcons?: boolean;
  onSelectIcon: (iconId: string) => void;
  onToggleShowIcons?: (show: boolean) => void;
}

export const SectionIconSelector: React.FC<Props> = ({
  sectionKey,
  sectionTitle,
  currentIcon,
  showSectionIcons = true,
  onSelectIcon,
  onToggleShowIcons,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const options = SECTION_ICON_OPTIONS[sectionKey] || [];
  
  // Default fallback if not customized
  const defaultIconId = {
    experience: 'briefcase',
    education: 'graduation-cap',
    skills: 'wrench',
    summary: 'sparkles',
    qualifications: 'award',
  }[sectionKey] || 'sparkles';

  const activeIconId = currentIcon || defaultIconId;
  const isIconDisabled = !showSectionIcons || activeIconId === 'none';

  // Find active option details
  const activeOption = options.find((o) => o.id === activeIconId) || options[0];
  const ActiveIconComponent = activeOption?.icon;

  return (
    <div className="bg-gradient-to-r from-indigo-50/70 via-slate-50 to-white border border-indigo-100/90 rounded-xl p-3 mb-4 shadow-2xs transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/10 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shrink-0">
            {ActiveIconComponent && !isIconDisabled ? (
              <ActiveIconComponent className="w-4 h-4 text-indigo-600" />
            ) : (
              <EyeOff className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h5 className="text-xs font-bold text-slate-800 tracking-tight">
                Section Icon & Visual Clarity
              </h5>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-100/70 text-indigo-700">
                {isIconDisabled ? 'Hidden' : activeOption?.label || 'Custom'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {isIconDisabled
                ? `Icons currently hidden for this section.`
                : `Select a custom icon to enhance visual hierarchy on your CV.`}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 shrink-0">
          {onToggleShowIcons && (
            <button
              type="button"
              onClick={() => onToggleShowIcons(!showSectionIcons)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition border ${
                showSectionIcons
                  ? 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              }`}
              title={showSectionIcons ? 'Hide icons across resume' : 'Show icons on resume'}
            >
              {showSectionIcons ? (
                <>
                  <Eye className="w-3 h-3 text-indigo-600" />
                  <span className="hidden sm:inline">Visible</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 text-slate-400" />
                  <span className="hidden sm:inline">Hidden</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white/80 transition"
            title={isOpen ? 'Collapse icon picker' : 'Expand icon picker'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Selectable Icon Pills Grid */}
      {isOpen && (
        <div className="mt-3 pt-2.5 border-t border-indigo-100/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Choose Icon for {sectionTitle}
            </span>
            <span className="text-[10px] text-slate-400">
              Live updates in preview
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {options.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = activeIconId === opt.id && showSectionIcons;
              const isNone = opt.id === 'none';

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    if (isNone) {
                      onSelectIcon('none');
                    } else {
                      if (!showSectionIcons && onToggleShowIcons) {
                        onToggleShowIcons(true);
                      }
                      onSelectIcon(opt.id);
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold ring-2 ring-indigo-400/30'
                      : isNone && activeIconId === 'none'
                      ? 'bg-slate-200 text-slate-700 border-slate-300 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px]">{opt.label}</span>
                  {isSelected && <Check className="w-3 h-3 stroke-[3] ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
