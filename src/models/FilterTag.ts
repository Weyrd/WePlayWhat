export const FilterTag = {
  COOP: 'Co-op',
  REMOTE_PLAY: 'Remote Play',
  OWNED: 'Owned',
  FREE: 'Free',
} as const;

export type FilterTagAlias = typeof FilterTag[keyof typeof FilterTag];
