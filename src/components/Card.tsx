import React from 'react';
import type { Game } from '../models/Game';
import { Badge } from './Badge';
import { BadgeType } from '../models/Badge';
import strings from '../strings.json';

interface CardProps {
  game: Game;
  onClick: (game: Game) => void;
}

export const Card: React.FC<CardProps> = ({ game, onClick }) => {
  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform"
      onClick={() => onClick(game)}
    >
      <img 
        src={game.header_image} 
        alt={game.name} 
        className="w-full h-32 object-cover bg-gray-700" 
      />
      <div className="p-4">
        <h3 className="font-bold text-lg truncate mb-2">{game.name}</h3>
        <div className="flex flex-wrap gap-2 mb-3 h-5">
          {game.isCoop && <Badge type={BadgeType.COOP} />}
          {game.isRemotePlay && <Badge type={BadgeType.REMOTE_PLAY} />}
          {game.owned ? (
            <Badge type={BadgeType.OWNED} />
          ) : (
            <Badge type={BadgeType.NOT_OWNED} />
          )}
        </div>
        <div className="flex justify-between items-center text-sm font-medium h-6">
          {!game.owned && (
            <>
            <div className="flex items-center gap-2">
                <span className="text-white">{game.price_overview?.final_formatted || strings.price.free}</span>
                {(game.price_overview?.discount_percent || 0) > 0 && (
                  <span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-xs">
                   -{game.price_overview?.discount_percent}%
                  </span>
              )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};