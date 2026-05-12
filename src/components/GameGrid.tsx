import React from 'react';
import type { Game } from '../models/Game';
import { Card } from './Card';
import { RefreshCw } from 'lucide-react';
import type { TableScopeType } from '../hooks/useGames';
import strings from '../strings.json';

interface GameGridProps {
  title: string;
  scope: TableScopeType;
  lastFetchedStr: string;
  games: Game[];
  onClickCard: (game: Game) => void;
  loadGamesData: (scope: TableScopeType) => void;
  wheelMode: 'idle' | 'picking' | 'result';
  wheelSelected: Set<number>;
  toggleWheelSelect: (game: Game) => void;
  attentionIds?: Set<number>;
}

export const GameGrid: React.FC<GameGridProps> = ({
  title,
  scope,
  lastFetchedStr,
  games,
  onClickCard,
  loadGamesData,
  wheelMode,
  wheelSelected,
  toggleWheelSelect,
  attentionIds,
}) => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 flex items-center">
        {title} 
        {lastFetchedStr && (
          <span className="text-xs font-normal text-gray-400 ml-2">
            ({strings.status.lastFetched} {lastFetchedStr})
          </span>
        )}
        <button 
          onClick={() => loadGamesData(scope)} 
          className="ml-2 hover:bg-gray-700 p-1.5 rounded-full transition-colors" 
          title="Force Refresh"
        >
          <RefreshCw size={16} className="text-gray-400 hover:text-white" />
        </button>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {games.map(game => (
          <Card 
            key={game.id} 
            game={game} 
            onClick={wheelMode === 'picking' ? toggleWheelSelect : onClickCard}
            isWheelPicking={wheelMode === 'picking'}
            isWheelSelected={wheelSelected.has(game.id)}
            showAttention={attentionIds?.has(game.id)}
          />
        ))}
      </div>
    </section>
  );
};
