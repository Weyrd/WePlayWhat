
export const BadgeType = {
  DUO: 'duo',
  OWNED: 'owned',
  NOT_OWNED: 'notOwned',
  REMOTE_PLAY: 'remotePlay',
  FREE: 'free',
  ASIA_APPROVED: 'asiaApproved',
  FACTORY: 'factory',
  TBR: 'tbr',
  MEH: 'meh',
} as const;

export type BadgeTypeAlias = typeof BadgeType[keyof typeof BadgeType];
