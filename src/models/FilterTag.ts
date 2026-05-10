export const FilterTag = {
  DUO: 'Duo',
  REMOTE_PLAY: 'Remote Play',
  OWNED: 'Owned',
  FREE: 'Free',
} as const;

export type FilterTagAlias = typeof FilterTag[keyof typeof FilterTag];
