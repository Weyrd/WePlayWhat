import React from 'react';
import type { Game } from '../models/Game';
import { Badge } from './Badge';
import { BadgeType } from '../models/Badge';
import strings from '../strings.json';
import { isGameFree } from '../utils/gameFlags';

interface CardProps {
  game: Game;
  onClick: (game: Game) => void;
  isWheelPicking?: boolean;
  isWheelSelected?: boolean;
  showAttention?: boolean;
  showFresh?: boolean;
}

export const Card: React.FC<CardProps> = ({
  game,
  onClick,
  isWheelPicking = false,
  isWheelSelected = false,
  showAttention = false,
  showFresh = false,
}) => {
  const gameIsFree = isGameFree(game);
  const ringClass = isWheelSelected
    ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900'
    : isWheelPicking
    ? 'ring-1 ring-purple-500/30 cursor-copy'
    : '';
  const cornerAccentClass = showAttention
    ? 'bg-[radial-gradient(circle_at_bottom_left,rgba(248,113,113,0.22),transparent_70%)]'
    : showFresh
    ? 'bg-[radial-gradient(circle_at_bottom_left,rgba(52,211,153,0.22),transparent_70%)]'
    : '';

  return (
    <div
      className={`bg-[#161b27] border border-[#2a2d3a] rounded-lg overflow-hidden cursor-pointer hover:border-violet-600/50 transition-colors relative ${ringClass}`}
      onClick={() => onClick(game)}
    >
      {cornerAccentClass && (
        <span className={`absolute bottom-0 left-0 h-9 w-9 pointer-events-none ${cornerAccentClass}`} />
      )}
      {isWheelPicking && (
        <div className={`absolute top-2 left-2 w-5 h-5 rounded-lg flex items-center justify-center border transition-colors z-10 ${
          isWheelSelected
            ? 'bg-purple-500 border-purple-400'
            : 'bg-gray-900/70 border-gray-500'
        }`}>
          {isWheelSelected && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      )}
      {game.header_image ? (
        <img 
          src={game.header_image} 
          alt={game.name} 
          className="w-full h-32 object-cover bg-gray-700" 
        />
      ) : (
        <div className="w-full h-32 bg-linear-to-br from-emerald-900/30 via-slate-900 to-slate-950 flex items-center justify-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
            {strings.ui.nonSteamLabel}
          </span>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-bold text-lg truncate mb-2">{game.name}</h3>
        <div className="flex justify-between items-center text-sm font-medium">
          {!game.owned && (
            <div className="flex items-center gap-2 mb-3">
              {(game.price_overview?.discount_percent || 0) > 0 ? (
                // Tag badge: prices left + discount right
                <div className="inline-flex items-stretch rounded overflow-hidden border border-green-500/25">
                  {/* Left segment — current + original price */}
                  <div className="flex flex-col justify-center gap-0.5 px-2 py-1 bg-green-500/10">
                    <span className="text-green-400 text-sm font-semibold leading-none">
                      {game.price_overview?.final_formatted}
                    </span>
                    <span className="text-gray-500 text-[10px] line-through leading-none">
                      {game.price_overview?.initial_formatted}
                    </span>
                  </div>
                  {/* Right segment — discount % */}
                  <div className="flex items-center px-2 py-1 bg-green-500/20 border-l border-green-500/25">
                    <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">
                      −{game.price_overview?.discount_percent}%
                    </span>
                  </div>
                </div>
              ) : gameIsFree ? (
                // Free badge — matches FREE badge style
                <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-400/10 border border-sky-400/25">
                  {strings.price.free}
                </span>
              ) : (
                // Plain price — no discount
                <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider text-gray-400 bg-gray-400/10 border border-gray-400/20">
                  {game.price_overview?.final_formatted || strings.price.unavailable}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {game.owned ? (
            <Badge type={BadgeType.OWNED} />
          ) : (
            <Badge type={BadgeType.NOT_OWNED} />
          )}
          {game.isRemotePlay && <Badge type={BadgeType.REMOTE_PLAY} />}
          {game.isDuo && <Badge type={BadgeType.DUO} />}
          {game.isFactory && <Badge type={BadgeType.FACTORY} />}
          {game.isToBeReviewed && <Badge type={BadgeType.TBR} />}
          {game.isMeh && <Badge type={BadgeType.MEH} />}
          {game.isGreatPotential && <Badge type={BadgeType.GP} />}
          {game.owned && gameIsFree && <Badge type={BadgeType.FREE} />}
          {game.isAsiaApproved && <Badge type={BadgeType.ASIA_APPROVED} />}
        </div>
      </div>
    </div>
  );
};
