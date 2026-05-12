import type { SteamAppDetailsData } from './Steam';

export interface LocalGame {
  id: number;
  name: string;
  owned: boolean;
  free?: boolean;
  duo?: boolean;
  asia_approved?: boolean;
  factory?: boolean;
  to_be_reviewed?: boolean;
  meh?: boolean;
  non_steam?: boolean;
  external_url?: string;
  image_url?: string;
}

export type Game = LocalGame & Partial<SteamAppDetailsData> & {
  steamUrl: string;
  dlCompareUrl: string;
  instantGamingUrl: string;
  isDuo: boolean;
  isAsiaApproved: boolean;
  isFactory: boolean;
  isToBeReviewed: boolean;
  isMeh: boolean;
  isNonSteam: boolean;
  externalUrl?: string;
  isRemotePlay?: boolean;
  lastFetched?: number;
};
