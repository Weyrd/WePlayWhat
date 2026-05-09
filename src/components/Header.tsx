import React from 'react';
import strings from '../strings.json';
import { CONSTANTS } from '../constants';

interface HeaderProps {
  search: string;
  setSearch: (v: string) => void;
  onlyDiscounted: boolean;
  setOnlyDiscounted: React.Dispatch<React.SetStateAction<boolean>>;
  handleWheelBtn: () => void;
  wheelBtnClass: string;
  wheelBtnLabel: string;
}

export const Header: React.FC<HeaderProps> = ({
  search,
  setSearch,
  onlyDiscounted,
  setOnlyDiscounted,
  handleWheelBtn,
  wheelBtnClass,
  wheelBtnLabel
}) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-md">
      <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Left: Brand */}
        <div className="flex justify-center md:justify-start flex-1 w-full md:w-auto">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {strings.appTitle}
          </h1>
        </div>

        {/* Center: Search Bar */}
        <div className="flex justify-center w-full md:absolute md:left-1/2 md:-translate-x-1/2 md:w-auto z-10">
          <div className="relative w-full md:w-64">
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder={strings.ui.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg pl-9 pr-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-nowrap justify-center md:justify-end items-center gap-2 lg:gap-4 whitespace-nowrap flex-1 w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={() => setOnlyDiscounted(v => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
              onlyDiscounted
                ? 'border-yellow-500/50 text-yellow-300 bg-yellow-500/10'
                : 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            {strings.ui.onlyDiscounted}
          </button>

          <button onClick={handleWheelBtn} className={wheelBtnClass}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2v20 M2 12h20 M4.93 4.93l14.14 14.14 M4.93 19.07l14.14-14.14" />
            </svg>
            {wheelBtnLabel}
          </button>

          <a 
            href={CONSTANTS.STEAM_NEW_COOP_GAMES}
            target="_blank"
            rel="noopener noreferrer"
            title={strings.ui.newCoopGamesTooltip}
            aria-label={strings.ui.newCoopGamesTooltip}
            className="flex items-center justify-center px-3 py-1.5 rounded-lg border text-sm transition-colors border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600 h-[34px]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
