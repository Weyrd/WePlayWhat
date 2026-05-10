import { useEffect, useState } from 'react';
import type { Game } from '../models/Game';
import strings from '../strings.json';
import { CardShuffle } from './wheel-modal/CardShuffle';
import { ResultPanel } from './wheel-modal/ResultPanel';
import { SettingsPanel } from './wheel-modal/SettingsPanel';
import { SpinningWheel } from './wheel-modal/SpinningWheel';
import type { WheelMode } from './wheel-modal/types';

interface Props {
  games: Game[];
  onClose: () => void;
}

export function WheelModal({ games: initialGames, onClose }: Props) {
  const [mode, setMode] = useState<WheelMode>('cards');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Game | null>(null);
  const [pool, setPool] = useState<Game[]>(initialGames);
  const [round, setRound] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const removeFromPool = (id: number) => {
    setPool(prev => prev.filter(g => g.id !== id));
    setCurrentWinner(prev => (prev?.id === id ? null : prev));
  };

  const handlePlayAgain = () => {
    setCurrentWinner(null);
    setRound(r => r + 1);
  };

  if (pool.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="bg-[#0d1117] border border-[#1e2332] rounded-2xl p-8 text-center" onClick={e => e.stopPropagation()}>
          <p className="text-gray-400 text-sm mb-4">{strings.wheelModal.emptyPool}</p>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm">{strings.wheelModal.close}</button>
        </div>
      </div>
    );
  }

  const poolKey = pool.map(g => g.id).join(',');
  const hasResult = currentWinner !== null;
  const modalWidth = 560 + (hasResult ? 240 : 0) + (sidebarOpen ? 200 : 0);
  const poolCountLabel = (pool.length === 1
    ? strings.wheelModal.poolCountInPool_single
    : strings.wheelModal.poolCountInPool_plural).replace('{count}', String(pool.length));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative bg-[#0d1117] border border-[#1e2332] rounded-2xl shadow-2xl flex overflow-hidden"
        style={{ width: modalWidth, maxHeight: '92vh', transition: 'width 0.35s ease' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Result panel */}
        <ResultPanel
          game={currentWinner}
          onPlayAgain={handlePlayAgain}
          onClose={onClose}
        />

        {/* Main area */}
        <div className="flex-1 flex flex-col p-6 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4 flex-none">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">{poolCountLabel}</p>
              <h2 className="text-lg font-bold text-white">
                {mode === 'wheel' ? strings.wheelModal.titleWheel : strings.wheelModal.titleCards}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(o => !o)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  sidebarOpen
                    ? 'bg-purple-600/20 border-purple-500/40 text-purple-400'
                    : 'bg-[#161b27] border-[#2a2d3a] text-gray-400 hover:text-white'
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[#161b27] border border-[#2a2d3a] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
            {mode === 'wheel' ? (
              <SpinningWheel key={`${poolKey}-${round}`} games={pool} onWinner={setCurrentWinner} />
            ) : (
              <CardShuffle key={`${poolKey}-${round}`} games={pool} onWinner={setCurrentWinner} />
            )}
          </div>
        </div>

        {/* Settings */}
        <SettingsPanel
          open={sidebarOpen}
          mode={mode}
          onChangeMode={setMode}
          pool={pool}
          onRemoveFromPool={removeFromPool}
        />
      </div>
    </div>
  );
}
