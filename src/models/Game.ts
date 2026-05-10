import type { SteamAppDetailsData } from './Steam';

export interface LocalGame {
  id: number;
  name: string;
  owned: boolean;
  duo?: boolean;
}

export type Game = LocalGame & Partial<SteamAppDetailsData> & {
  steamUrl: string;
  dlCompareUrl: string;
  instantGamingUrl: string;
  isDuo: boolean;
  isRemotePlay?: boolean;
  lastFetched?: number;
};
