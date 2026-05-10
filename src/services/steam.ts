import type { LocalGame, Game } from '../models/Game';
import type { SteamAppDetailsResponse, SteamDlcDetailsResponse, SteamDlcDetailsData } from '../models/Steam';
import { CONSTANTS, STEAM_APP_DETAILS_FILTERS } from '../constants';
import { fetchProxy } from '../fetcher';

const GAME_DETAILS_FILTERS = [
  STEAM_APP_DETAILS_FILTERS.BASIC,
  STEAM_APP_DETAILS_FILTERS.PRICE_OVERVIEW,
  STEAM_APP_DETAILS_FILTERS.SCREENSHOTS,
  STEAM_APP_DETAILS_FILTERS.CATEGORIES,
  STEAM_APP_DETAILS_FILTERS.RELEASE_DATE,
  STEAM_APP_DETAILS_FILTERS.DEVELOPERS,
  STEAM_APP_DETAILS_FILTERS.GENRES,
  STEAM_APP_DETAILS_FILTERS.ACHIEVEMENTS,
  STEAM_APP_DETAILS_FILTERS.METACRITIC,
] as const;

const DLC_DETAILS_FILTERS = [
  STEAM_APP_DETAILS_FILTERS.BASIC,
  STEAM_APP_DETAILS_FILTERS.PRICE_OVERVIEW,
] as const;

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
    isDuo: game.duo || false,
  };

  try {
    const apiUrl = CONSTANTS.STEAM_API_APP_DETAILS(game.id, GAME_DETAILS_FILTERS);

    const data = await fetchProxy<SteamAppDetailsResponse>(apiUrl);
    if (!data || typeof data !== "object") {
      throw new Error("Invalid Steam response format");
    }

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

export const fetchDlcData = async (dlcIds: number[]): Promise<Record<string, SteamDlcDetailsData>> => {
  const results: Record<string, SteamDlcDetailsData> = {};

  await Promise.all(dlcIds.map(async (appId) => {
    try {
      const data = await fetchProxy<SteamDlcDetailsResponse>(
        CONSTANTS.STEAM_API_APP_DETAILS(appId, DLC_DETAILS_FILTERS)
      );
      if (data[appId]?.success && data[appId]?.data) {
        results[appId] = data[appId].data;
      }
    } catch (e) {
      console.error(`Failed to fetch DLC data for appId ${appId}:`, e);
    }
  }));

  return results;
};
