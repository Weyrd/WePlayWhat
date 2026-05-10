import type React from 'react';
import type { TagFilter, TagState } from '../App';
import strings from '../strings.json';

interface Props {
  genres: TagFilter[];
  onCycle: (label: string) => void;
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
  ignore: 'border-gray-600 text-gray-400 bg-transparent hover:border-gray-400 hover:text-gray-200',
  include: 'border-green-500 text-green-400 bg-green-500/10',
  exclude: 'border-red-500 text-red-400 bg-red-500/10',
  only: 'border-blue-400 text-blue-300 bg-blue-500/10',
};

export function GenreFilterBar({ genres, onCycle }: Props) {
  if (genres.length === 0) return null;

  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{strings.tags.genresTitle}</span>
        <div className="flex gap-2 flex-wrap flex-1">
          {genres.map(genre => (
            <button
              key={genre.label}
              onClick={() => onCycle(genre.label)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1 text-xs sm:text-sm border transition-all cursor-pointer select-none font-medium ${STATE_CLASS[genre.state]}`}
              aria-label={`${genre.label}: ${genre.state}`}
            >
              {STATE_ICON[genre.state]}
              {genre.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
