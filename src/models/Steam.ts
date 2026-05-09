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
  price_overview?: SteamPriceOverview;
  categories?: SteamCategory[];
  screenshots?: SteamScreenshot[];
  release_date?: SteamReleaseDate;
}

export interface SteamAppDetailsResponse {
  [appId: string]: {
    success: boolean;
    data?: SteamAppDetailsData;
  }
}
