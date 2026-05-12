export const FilterTag = {
  DUO: 'Duo',
  REMOTE_PLAY: 'Remote Play',
  OWNED: 'Owned',
  ASIA_APPROVED: 'Asia 👍',
  FACTORY: 'Factory',
  FREE: 'Free',
} as const;

export type FilterTagAlias = typeof FilterTag[keyof typeof FilterTag];
