import strings from '../strings.json';

export const FilterTag = {
  DUO: strings.badges.duo,
  REMOTE_PLAY: strings.badges.remotePlay,
  OWNED: strings.badges.owned,
  STEAM_GAME: strings.tags.steamGame,
  ASIA_APPROVED: strings.badges.asiaApproved,
  FACTORY: strings.badges.factory,
  TBR: strings.badges.tbr,
  MEH: strings.badges.meh,
  FREE: strings.badges.free,
} as const;

export type FilterTagAlias = typeof FilterTag[keyof typeof FilterTag];
