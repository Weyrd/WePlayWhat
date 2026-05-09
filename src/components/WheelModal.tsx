// components/WheelModal.tsx
import { useEffect } from 'react';
import type { Game } from '../models/Game';
import strings from '../strings.json';

interface Props {
  winner: Game;
  totalCount: number;
  onPickAgain: () => void;
  onClose: () => void;
}

export function WheelModal({ winner, totalCount, onPickAgain, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-800 border border-gray-600 rounded-2xl p-8 text-center max-w-sm w-full mx-4 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mx-auto mb-5">
          <svg
            width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="#a78bfa" strokeWidth={1.5}
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{strings.wheelModal.tonightsGame}</p>
        {winner.header_image && (
          <img
            src={winner.header_image}
            alt={winner.name}
            className="w-full rounded-lg mb-4 object-cover h-28"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <h2 className="text-xl font-bold text-white mb-1">{winner.name}</h2>
        <p className="text-sm text-gray-400 mb-6">
          {totalCount === 1 
            ? strings.wheelModal.randomlyPicked_single 
            : strings.wheelModal.randomlyPicked_plural.replace('{count}', totalCount.toString())}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onPickAgain}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 text-sm transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            {strings.wheelModal.pickAgain}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
          >
            {strings.wheelModal.letsPlay}
          </button>
        </div>
      </div>
    </div>
  );
}
