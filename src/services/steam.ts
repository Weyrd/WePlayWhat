import type { LocalGame, Game } from '../models/Game';
import type { SteamAppDetailsResponse } from '../models/Steam';
import { CONSTANTS } from '../constants';
import { fetchProxy } from '../fetcher';

export const fetchSteamData = async (
  game: LocalGame
): Promise<Game> => {
  const steamUrl = CONSTANTS.STEAM_STORE_PAGE(game.id);
  const dlCompareUrl = CONSTANTS.DLCOMPARE_SEARCH(game.name);
  const instantGamingUrl = CONSTANTS.INSTANT_GAMING_SEARCH(game.name);
  
  const baseFetched: Game = {
    ...game,
    header_image: CONSTANTS.STEAM_HEADER_IMAGE(game.id),
    steamUrl,
    dlCompareUrl,
    instantGamingUrl,
    isCoop: game.coop || false,
  };

  try {
    const apiUrl = CONSTANTS.STEAM_API_APP_DETAILS(game.id, 'basic,price_overview,screenshots,categories,release_date,developers');
    
    const data = await fetchProxy<SteamAppDetailsResponse>(apiUrl);
    
    const appData = data[game.id.toString()];
    if (!appData || !appData.success || !appData.data) {
      return { ...baseFetched, lastFetched: Date.now() };
    }

    const details = appData.data;
    
    // Check if any category description is exactly "Remote Play Together"
    const isRemotePlay = details.categories?.some(cat => 
      cat.description.toLowerCase() === 'remote play together'
    ) || false;

    const finalData: Game = {
      ...baseFetched,
      ...details,
      isRemotePlay,
      lastFetched: Date.now(),
    };

    localStorage.setItem(`WPW_GAME_${game.id}`, JSON.stringify(finalData));

    return finalData;
  } catch (error) {
    console.error(`Failed to fetch data for ${game.name}:`, error);
    return { ...baseFetched, lastFetched: Date.now() };
  }
};