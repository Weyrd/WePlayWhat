export type BadgeVariant = 'green' | 'blue' | 'purple' | 'gray';

export const BadgeType = {
  COOP: 'coop',
  OWNED: 'owned',
  NOT_OWNED: 'notOwned',
  REMOTE_PLAY: 'remotePlay',
} as const;

export type BadgeTypeAlias = typeof BadgeType[keyof typeof BadgeType];
