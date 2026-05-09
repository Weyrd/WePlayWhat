export interface LocalGame {
  id: number;
  name: string;
  owned: boolean;
  coop?: boolean;
}

export interface FetchedGame extends LocalGame {
  steamName: string;
  headerImage: string;
  screenshots: string[];
  priceFormatted: string | null;
  discountPercent: number;
  shortDescription: string;
  steamUrl: string;
  dlCompareUrl: string;
  instantGamingUrl: string;
  fetchStatus: 'loading' | 'success' | 'error';
  isCoop: boolean;
  developers?: string[];
  releaseDate?: string;
  isStale?: boolean; // Indicates the cached data is > 24 hours old
  isUpdating?: boolean; // Indicates background fetch is in progress
}