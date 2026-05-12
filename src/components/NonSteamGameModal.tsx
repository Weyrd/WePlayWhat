import React from 'react';
import type { Game } from '../models/Game';
import { Badge } from './Badge';
import { BadgeType } from '../models/Badge';
import strings from '../strings.json';

interface NonSteamGameModalProps {
  game: Game;
  onClose: () => void;
}

export const NonSteamGameModal: React.FC<NonSteamGameModalProps> = ({ game, onClose }) => {
  const externalUrl = game.externalUrl || '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#161b27] border border-[#2a2d3a] rounded-xl overflow-hidden shadow-2xl max-w-xl w-full"
        onClick={e => e.stopPropagation()}
      >
        {game.header_image ? (
          <img
            src={game.header_image}
            alt={game.name}
            className="w-full h-44 object-cover bg-gray-800"
          />
        ) : (
          <div className="w-full h-44 bg-linear-to-br from-emerald-900/30 via-slate-900 to-slate-950 flex items-center justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
              {strings.ui.nonSteamLabel}
            </span>
          </div>
        )}

        <div className="px-4 pt-4 pb-5 bg-[#0d1117]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/70">
                {strings.ui.nonSteamLabel}
              </div>
              <h2 className="text-xl font-bold text-slate-100">{game.name}</h2>
            </div>
            <button
              className="w-8 h-8 rounded-lg bg-[#161b27] border border-[#2a2d3a] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              onClick={e => { e.stopPropagation(); onClose(); }}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {game.owned ? (
              <Badge type={BadgeType.OWNED} />
            ) : (
              <Badge type={BadgeType.NOT_OWNED} />
            )}
            {game.isDuo && <Badge type={BadgeType.DUO} />}
            {game.isFactory && <Badge type={BadgeType.FACTORY} />}
            {game.isToBeReviewed && <Badge type={BadgeType.TBR} />}
            {game.isMeh && <Badge type={BadgeType.MEH} />}
            {game.isGreatPotential && <Badge type={BadgeType.GP} />}
            {game.isAsiaApproved && <Badge type={BadgeType.ASIA_APPROVED} />}
          </div>

          {externalUrl && (
            <div className="mt-4">
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors border-emerald-500/40 text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 3h7v7" />
                  <path d="M10 14 21 3" />
                  <path d="M21 14v7h-7" />
                  <path d="M3 10V3h7" />
                </svg>
                Open site
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
