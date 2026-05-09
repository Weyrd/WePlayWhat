import type { SteamAppDetailsData } from './Steam';

export interface LocalGame {
  id: number;
  name: string;
  owned: boolean;
  coop?: boolean;
}

export type Game = LocalGame & Partial<SteamAppDetailsData> & {
  steamUrl: string;
  dlCompareUrl: string;
  instantGamingUrl: string;
  isCoop: boolean;
  isRemotePlay?: boolean;
  lastFetched?: number;
};
