export interface SteamPriceOverview {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
  initial_formatted: string;
  final_formatted: string;
}

export interface SteamCategory {
  id: number;
  description: string;
}

export interface SteamScreenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

export interface SteamReleaseDate {
  coming_soon: boolean;
  date: string;
}

export interface SteamGenre {
  id: string;
  description: string;
}

export interface SteamMetacritic {
  score: number;
  url: string;
}

export interface SteamAchievementItem {
  icon: string;
  name: string;
  localized_name: string;
  path: string;
}

export interface SteamAchievements {
  total: number;
  highlighted?: SteamAchievementItem[];
}

export interface SteamAppDetailsData {
  type: string;
  name: string;
  steam_appid: number;
  is_free: boolean;
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  supported_languages: string;
  header_image: string;
  developers: string[];
  dlc?: number[];
  price_overview?: SteamPriceOverview;
  categories?: SteamCategory[];
  genres?: SteamGenre[];
  screenshots?: SteamScreenshot[];
  release_date?: SteamReleaseDate;
  achievements?: SteamAchievements;
  metacritic?: SteamMetacritic;
}

export interface SteamAppDetailsResponse {
  [appId: string]: {
    success: boolean;
    data?: SteamAppDetailsData;
  }
}

export interface SteamFullGame {
  appid: string;
  name: string;
}

export interface SteamDlcDetailsData {
  type: string;
  name: string;
  steam_appid: number;
  required_age?: number;
  is_free: boolean;
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  supported_languages: string;
  header_image: string;
  capsule_image?: string;
  capsule_imagev5?: string;
  website?: string;
  price_overview?: SteamPriceOverview;
  fullgame?: SteamFullGame;
  legal_notice?: string;
}

export interface SteamDlcDetailsResponse {
  [appId: string]: {
    success: boolean;
    data?: SteamDlcDetailsData;
  }
}
