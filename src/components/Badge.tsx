import React from 'react';
import { BadgeType, type BadgeTypeAlias } from '../models/Badge';
import strings from '../strings.json';

interface BadgeProps {
  type: BadgeTypeAlias;
}

export const Badge: React.FC<BadgeProps> = ({ type }) => {
  const badgeConfig = {
    [BadgeType.COOP]: {
      className: "text-blue-400 bg-blue-400/10 border border-blue-400/20",
      label: strings.badges.coop
    },
    [BadgeType.OWNED]: {
      className: "text-green-400 bg-green-400/10 border border-green-400/20",
      label: strings.badges.owned
    },
    [BadgeType.NOT_OWNED]: {
      className: "text-gray-400 bg-gray-400/10 border border-gray-400/20",
      label: strings.badges.notOwned
    },
    [BadgeType.REMOTE_PLAY]: {
      className: "text-purple-400 bg-purple-400/10 border border-purple-400/20",
      label: strings.badges.remotePlay
    }
  };

  const config = badgeConfig[type];

  if (!config) return null;

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
};