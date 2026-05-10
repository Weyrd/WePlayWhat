import React from 'react';
import type { TagFilter, TagState } from '../App';
import strings from '../strings.json';

interface Props {
  tags: TagFilter[];
  onCycle: (label: string) => void;
  showLegend?: boolean;
}

const STATE_ICON: Record<TagState, React.ReactNode> = {
  ignore: null,
  include: (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  exclude: (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  only: (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

const STATE_CLASS: Record<TagState, string> = {
  ignore:  'border-gray-600 text-gray-400 bg-transparent hover:border-gray-400 hover:text-gray-200',
  include: 'border-green-500 text-green-400 bg-green-500/10',
  exclude: 'border-red-500 text-red-400 bg-red-500/10',
  only:    'border-blue-400 text-blue-300 bg-blue-500/10',
};

// Using a dynamic getter to pull strings safely
const getLegendItems = () => [
  { state: 'ignore' as TagState,  label: strings.tags.legend.neutral,  desc: strings.tags.legend.ignored         },
  { state: 'include' as TagState, label: strings.tags.legend.include,  desc: strings.tags.legend.mustHave       },
  { state: 'exclude' as TagState, label: strings.tags.legend.exclude,  desc: strings.tags.legend.hidden          },
  { state: 'only' as TagState,    label: strings.tags.legend.only,     desc: strings.tags.legend.showExclusively },
];

const LEGEND_STATE_CONFIG: Record<TagState, {
  colorClass: string;
  borderClass: string;
  bgClass: string;
  hoverBorderClass: string;
  hoverBgClass: string;
  icon: React.ReactNode;
}> = {
  ignore: {
    colorClass: 'text-[#94A3B8]',
    borderClass: 'border-[#94A3B8]/20',
    bgClass: 'bg-[#94A3B8]/10',
    hoverBorderClass: 'group-hover:border-[#94A3B8]/40',
    hoverBgClass: 'group-hover:bg-[#94A3B8]/20',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="4 4">
        <circle cx="12" cy="12" r="9" />
      </svg>
    )
  },
  include: {
    colorClass: 'text-[#22C55E]',
    borderClass: 'border-[#22C55E]/40',
    bgClass: 'bg-[#22C55E]/10',
    hoverBorderClass: 'group-hover:border-[#22C55E]/70',
    hoverBgClass: 'group-hover:bg-[#22C55E]/20',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
  },
  exclude: {
    colorClass: 'text-[#EF4444]',
    borderClass: 'border-[#EF4444]/40',
    bgClass: 'bg-[#EF4444]/10',
    hoverBorderClass: 'group-hover:border-[#EF4444]/70',
    hoverBgClass: 'group-hover:bg-[#EF4444]/20',
    icon: (
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
       </svg>
    )
  },
  only: {
    colorClass: 'text-[#3B82F6]',
    borderClass: 'border-[#3B82F6]/40',
    bgClass: 'bg-[#3B82F6]/10',
    hoverBorderClass: 'group-hover:border-[#3B82F6]/70',
    hoverBgClass: 'group-hover:bg-[#3B82F6]/20',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
};

export function TagFilterBar({ tags, onCycle, showLegend = true }: Props) {
  const legendItems = getLegendItems();
  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div
        className="border-b border-gray-700/60 overflow-hidden transition-all duration-200 ease-out"
        style={{ maxHeight: showLegend ? 64 : 0, opacity: showLegend ? 1 : 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-x-6 gap-y-2 flex-wrap">
          {legendItems.map(({ state, label, desc }, index) => {
            const conf = LEGEND_STATE_CONFIG[state];
            return (
              <React.Fragment key={state}>
                {index > 0 && (
                  <div className="w-px h-6 bg-white/8 mx-2 hidden sm:block"></div>
                )}
                <div className="group flex items-center gap-2 cursor-pointer transition-all duration-180 ease-in-out">
                  <div className={`flex items-center justify-center transition-all duration-180 ease-in-out ${conf.colorClass}`}>
                    {React.cloneElement(conf.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { width: 16, height: 16 })}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-[#F8FAFC] leading-none">{label}</span>
                    <span className="text-[11px] font-normal text-[#94A3B8] leading-none">{desc}</span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{strings.tags.title}</span>
        <div className="flex gap-2 flex-wrap flex-1">
          {tags.map(tag => (
            <button
              key={tag.label}
              onClick={() => onCycle(tag.label)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1 text-xs sm:text-sm border transition-all cursor-pointer select-none font-medium ${STATE_CLASS[tag.state]}`}
              aria-label={`${tag.label}: ${tag.state}`}
            >
              {STATE_ICON[tag.state]}
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
