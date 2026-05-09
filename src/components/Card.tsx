import React from 'react';
import type { Game } from '../models/Game';
import { Badge } from './Badge';
import { BadgeType } from '../models/Badge';
import strings from '../strings.json';

interface CardProps {
  game: Game;
  onClick: (game: Game) => void;
  isWheelPicking?: boolean;
  isWheelSelected?: boolean;
}

export const Card: React.FC<CardProps> = ({ game, onClick, isWheelPicking = false, isWheelSelected = false }) => {
  const ringClass = isWheelSelected
    ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900'
    : isWheelPicking
    ? 'ring-1 ring-purple-500/30 cursor-copy'
    : '';

  return (
    <div 
      className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform relative ${ringClass}`}
      onClick={() => onClick(game)}
    >
      {isWheelPicking && (
        <div className={`absolute top-2 right-2 w-5 h-5 rounded flex items-center justify-center border transition-colors z-10 ${
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
      <img 
        src={game.header_image} 
        alt={game.name} 
        className="w-full h-32 object-cover bg-gray-700" 
      />
      <div className="p-4">
        <h3 className="font-bold text-lg truncate mb-2">{game.name}</h3>
        <div className="flex justify-between items-center text-sm font-medium mb-3">
          {!game.owned && (
            <div className="flex items-center gap-2">
              <span className="text-white">{game.price_overview?.final_formatted || strings.price.free}</span>
              {(game.price_overview?.discount_percent || 0) > 0 && (
                <span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-xs">
                 -{game.price_overview?.discount_percent}%
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
          {game.isCoop && <Badge type={BadgeType.COOP} />}
        </div>
      </div>
    </div>
  );
};