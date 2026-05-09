export const CONSTANTS = {
  // Local Data
  GAMES_JSON: '/games.json',

  // Steam API & Store
  STEAM_API_APP_DETAILS: (appId: number, filters: string = 'basic,price_overview,screenshots,categories,release_date,developers') => 
    `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=fr&filters=${filters}`,
  STEAM_STORE_PAGE: (appId: number) => `https://store.steampowered.com/app/${appId}`,
  STEAM_HEADER_IMAGE: (appId: number) => `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`,

  // Third-party stores/comparators
  DLCOMPARE_SEARCH: (gameName: string) => `https://www.dlcompare.fr/search?q=${encodeURIComponent(gameName)}`,
  INSTANT_GAMING_SEARCH: (gameName: string) => `https://www.instant-gaming.com/en/search/?query=${encodeURIComponent(gameName)}`
};
