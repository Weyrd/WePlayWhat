
export const BadgeType = {
  COOP: 'coop',
  OWNED: 'owned',
  NOT_OWNED: 'notOwned',
  REMOTE_PLAY: 'remotePlay',
  FREE: 'free',
} as const;

export type BadgeTypeAlias = typeof BadgeType[keyof typeof BadgeType];
