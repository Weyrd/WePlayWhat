import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'blue' | 'purple' | 'gray';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray' }) => {
  const variants = {
    green: "text-green-400 bg-green-400/10 border border-green-400/20",
    blue: "text-blue-400 bg-blue-400/10 border border-blue-400/20",
    purple: "text-purple-400 bg-purple-400/10 border border-purple-400/20",
    gray: "text-gray-400 bg-gray-400/10 border border-gray-400/20"
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
};