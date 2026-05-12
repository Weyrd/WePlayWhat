export const FilterTag = {
  DUO: 'Duo',
  REMOTE_PLAY: 'Remote Play',
  OWNED: 'Owned',
  STEAM_GAME: 'Steam Game',
  ASIA_APPROVED: 'Asia 👍',
  FACTORY: 'Factory',
  TBR: 'TBR',
  MEH: 'Meh ~',
  FREE: 'Free',
} as const;

export type FilterTagAlias = typeof FilterTag[keyof typeof FilterTag];
