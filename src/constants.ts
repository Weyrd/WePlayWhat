export const STEAM_APP_DETAILS_FILTERS = {
  BASIC: 'basic',
  PRICE_OVERVIEW: 'price_overview',
  SCREENSHOTS: 'screenshots',
  CATEGORIES: 'categories',
  RELEASE_DATE: 'release_date',
  DEVELOPERS: 'developers',
  GENRES: 'genres',
  ACHIEVEMENTS: 'achievements',
  METACRITIC: 'metacritic',
} as const;

export type SteamAppDetailsFilter =
  typeof STEAM_APP_DETAILS_FILTERS[keyof typeof STEAM_APP_DETAILS_FILTERS];

export const STEAM_APP_DETAILS_DEFAULT_FILTERS: readonly SteamAppDetailsFilter[] = [
  STEAM_APP_DETAILS_FILTERS.BASIC,
  STEAM_APP_DETAILS_FILTERS.PRICE_OVERVIEW,
  STEAM_APP_DETAILS_FILTERS.SCREENSHOTS,
  STEAM_APP_DETAILS_FILTERS.CATEGORIES,
  STEAM_APP_DETAILS_FILTERS.RELEASE_DATE,
  STEAM_APP_DETAILS_FILTERS.DEVELOPERS,
  STEAM_APP_DETAILS_FILTERS.GENRES,
  STEAM_APP_DETAILS_FILTERS.ACHIEVEMENTS,
  STEAM_APP_DETAILS_FILTERS.METACRITIC,
];

export const CONSTANTS = {
  // Local Data
  GAMES_JSON: '/games.json',

  // Steam API & Store
  STEAM_API_APP_DETAILS: (
    appId: number,
    filters: readonly SteamAppDetailsFilter[] = STEAM_APP_DETAILS_DEFAULT_FILTERS
  ) =>
    `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=fr&filters=${filters.join(',')}`,
  STEAM_STORE_PAGE: (appId: number) => `https://store.steampowered.com/app/${appId}`,
  STEAM_HEADER_IMAGE: (appId: number) => `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`,

  // Third-party stores/comparators
  DLCOMPARE_SEARCH: (gameName: string) => `https://www.dlcompare.fr/search?q=${encodeURIComponent(gameName)}`,
  INSTANT_GAMING_SEARCH: (gameName: string) => `https://www.instant-gaming.com/en/search/?query=${encodeURIComponent(gameName)}`,

  // Steam Explore
  STEAM_NEW_COOP_GAMES: 'https://store.steampowered.com/search/?tags=3841,3843,1685,7368,3859'
};
