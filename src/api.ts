import type { LocalGame, FetchedGame } from './types';

const CORS_PROXY = 'https://api.allorigins.win/get?url=';

export const fetchSteamData = async (game: LocalGame): Promise<FetchedGame> => {
  const steamUrl = `https://store.steampowered.com/app/${game.id}`;
  const dlCompareUrl = `https://www.dlcompare.fr/search?q=${encodeURIComponent(game.name)}`;
  const instantGamingUrl = `https://www.instant-gaming.com/en/search/?query=${encodeURIComponent(game.name)}`;
  
  const baseFetched: FetchedGame = {
    ...game,
    steamName: game.name,
    headerImage: `https://cdn.akamai.steamstatic.com/steam/apps/${game.id}/header.jpg`,
    screenshots: [],
    priceFormatted: null,
    discountPercent: 0,
    shortDescription: '',
    steamUrl,
    dlCompareUrl,
    instantGamingUrl,
    fetchStatus: 'loading',
    isCoop: game.coop || false,
  };

  try {
    const apiUrl = `https://store.steampowered.com/api/appdetails?appids=${game.id}&cc=fr&filters=basic,price_overview,screenshots,categories,release_date,developers`;
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(apiUrl)}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const proxyData = await response.json();
    const data = JSON.parse(proxyData.contents);
    
    const appData = data[game.id.toString()];
    if (!appData || !appData.success) {
      return { ...baseFetched, fetchStatus: 'error' };
    }

    const details = appData.data;
    
    const finalData: FetchedGame = {
      ...baseFetched,
      steamName: details.name || game.name,
      headerImage: details.header_image || baseFetched.headerImage,
      screenshots: details.screenshots?.map((s: any) => s.path_full) || [],
      priceFormatted: details.price_overview?.final_formatted || null,
      discountPercent: details.price_overview?.discount_percent || 0,
      shortDescription: details.short_description || '',
      developers: details.developers || [],
      releaseDate: details.release_date?.date || '',
      fetchStatus: 'success',
      isStale: false,
      isUpdating: false
    };

    // Save to Cache
    localStorage.setItem(`WPW_GAME_${game.id}`, JSON.stringify({
      timestamp: Date.now(),
      data: finalData
    }));

    return finalData;
  } catch (error) {
    console.error(`Failed to fetch data for ${game.name}:`, error);
    return { ...baseFetched, fetchStatus: 'error' };
  }
};