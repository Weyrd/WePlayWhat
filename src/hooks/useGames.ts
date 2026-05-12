import { useState, useCallback, useRef, useEffect } from 'react';
import type { LocalGame, Game } from '../models/Game';
import { fetchSteamData } from '../services/steam';
import { CONSTANTS } from '../constants';
import strings from '../strings.json';
import toast from 'react-hot-toast';

export const TableScope = {
  OWNED: 'owned',
  NOT_OWNED: 'notOwned'
} as const;

export type TableScopeType = typeof TableScope[keyof typeof TableScope];

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const hasInitialized = useRef(false);

  const loadGamesData = useCallback(async (scope?: TableScopeType) => {
    try {
      const res = await fetch(CONSTANTS.GAMES_JSON);
      const localGames: LocalGame[] = await res.json();
      
      const initialGames: Game[] = localGames.map(game => {
        const isNonSteam = game.non_steam || false;
        const externalUrl = game.external_url || '';
        const nonSteamImage = game.image_url || '';
        const base: Game = {
          ...game,
          header_image: isNonSteam ? (nonSteamImage || undefined) : CONSTANTS.STEAM_HEADER_IMAGE(game.id),
          steamUrl: isNonSteam ? '' : CONSTANTS.STEAM_STORE_PAGE(game.id),
          dlCompareUrl: isNonSteam ? '' : CONSTANTS.DLCOMPARE_SEARCH(game.name),
          instantGamingUrl: isNonSteam ? '' : CONSTANTS.INSTANT_GAMING_SEARCH(game.name),
          isDuo: game.duo || false,
          isAsiaApproved: game.asia_approved || false,
          isFactory: game.factory || false,
          isToBeReviewed: game.to_be_reviewed || false,
          isMeh: game.meh || false,
          isNonSteam,
          externalUrl
        };

        const isTargetScope = scope === TableScope.OWNED ? game.owned : scope === TableScope.NOT_OWNED ? !game.owned : false;

        if (isTargetScope) {
           return base; // Skip cache if forced for scope
        }

        const cached = localStorage.getItem(`WPW_GAME_${game.id}`);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            
            const dataToUse = parsed.data || parsed;
            return { ...base, ...dataToUse };
          } catch {
             // ignore parse error 
          }
        }
        return base;
      });
      
      setGames(initialGames);

      const toFetch = initialGames.filter(g => {
        const isTargetScope = scope === TableScope.OWNED ? g.owned : scope === TableScope.NOT_OWNED ? !g.owned : false;
        return !g.isNonSteam && (isTargetScope || (!g.short_description && !g.lastFetched));
      });
      
      if (toFetch.length > 0) {
        toast(strings.toasts.refreshing, { icon: '🔄', id: 'refresh-toast' });
      }

      let updatedCount = 0;

      for (const game of toFetch) {
        const fetched = await fetchSteamData(game);
        setGames(prev => prev.map(g => (g.id === game.id ? fetched : g)));
        updatedCount++;
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      if (updatedCount > 0) {
        toast.success(strings.toasts.updated.replace('{count}', updatedCount.toString()), { id: 'refresh-toast' });
      }
    } catch {
      console.error("Error loading games.json");
    }
  }, []);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadGamesData();
    }
  }, [loadGamesData]);

  return { games, loadGamesData };
}
