import React from 'react';
import type { FetchedGame } from '../types';
import { Badge } from './Badge';

interface CardProps {
  game: FetchedGame;
  onClick: (game: FetchedGame) => void;
}

export const Card: React.FC<CardProps> = ({ game, onClick }) => {
  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform"
      onClick={() => onClick(game)}
    >
      <img 
        src={game.headerImage} 
        alt={game.steamName} 
        className="w-full h-32 object-cover bg-gray-700" 
      />
      <div className="p-4">
        <h3 className="font-bold text-lg truncate mb-2">{game.steamName}</h3>
        <div className="flex flex-wrap gap-2 mb-3 h-5">
          {game.isCoop && <Badge variant="blue">Co-op</Badge>}
          {game.owned && <Badge variant="green">Owned</Badge>}
        </div>
        <div className="flex justify-between items-center text-sm font-medium h-6">
          {!game.owned && (
            <>
              {game.fetchStatus === 'loading' ? (
                <span className="text-gray-400">Loading...</span>
              ) : game.fetchStatus === 'error' && !game.priceFormatted ? (
                <span className="text-gray-400">Price Unavailable</span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-white">{game.priceFormatted || 'Free'}</span>
                  {game.discountPercent > 0 && (
                    <span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-xs">
                      -{game.discountPercent}%
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};