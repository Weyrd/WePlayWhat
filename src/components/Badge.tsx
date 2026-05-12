import React from 'react';
import { BadgeType, type BadgeTypeAlias } from '../models/Badge';
import strings from '../strings.json';

interface BadgeProps {
  type: BadgeTypeAlias;
}

export const Badge: React.FC<BadgeProps> = ({ type }) => {
  const badgeConfig = {
    [BadgeType.DUO]: {
      className: "text-orange-400 bg-orange-400/10 border border-orange-400/25",
      label: strings.badges.duo
    },
    [BadgeType.OWNED]: {
      className: "text-green-400 bg-green-500/10 border border-green-500/25",
      label: strings.badges.owned
    },
    [BadgeType.NOT_OWNED]: {
      className: "text-gray-400 bg-gray-400/10 border border-gray-400/20",
      label: strings.badges.notOwned
    },
    [BadgeType.REMOTE_PLAY]: {
      className: "text-violet-400 bg-violet-500/10 border border-violet-500/25",
      label: strings.badges.remotePlay
    },
    [BadgeType.FREE]: {
      className: "text-sky-400 bg-sky-400/10 border border-sky-400/25",
      label: strings.badges.free
    },
    [BadgeType.ASIA_APPROVED]: {
      className: "text-pink-400 bg-pink-400/10 border border-pink-400/25",
      label: strings.badges.asiaApproved
    },
    [BadgeType.FACTORY]: {
      className: "text-amber-500 bg-amber-500/10 border border-amber-500/25",
      label: strings.badges.factory
    },
    [BadgeType.TBR]: {
      className: "text-yellow-300 bg-yellow-400/10 border border-yellow-400/25",
      label: strings.badges.tbr
    },
    [BadgeType.MEH]: {
      className: "text-zinc-300 bg-zinc-400/10 border border-zinc-400/25",
      label: strings.badges.meh
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