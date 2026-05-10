import type { Game } from '../../models/Game';
import strings from '../../strings.json';
import type { WheelMode } from './types';

interface Props {
  open: boolean;
  mode: WheelMode;
  onChangeMode: (mode: WheelMode) => void;
  pool: Game[];
  onRemoveFromPool: (id: number) => void;
}

export function SettingsPanel({ open, mode, onChangeMode, pool, onRemoveFromPool }: Props) {
  return (
    <div className="border-l border-[#1e2332] bg-[#080c12] flex-none overflow-hidden" style={{ width: open ? 200 : 0, transition: 'width 0.3s ease' }}>
      <div className="w-50 h-full flex flex-col p-4 gap-5">
        <div className="flex-none">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{strings.wheelModal.settings.mode}</p>
          <div className="flex flex-col gap-1.5">
            {(['wheel', 'cards'] as const).map(m => (
              <button
                key={m}
                onClick={() => onChangeMode(m)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                  mode === m ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300' : 'bg-[#0d1117] border border-[#1e2332] text-gray-400 hover:text-white'
                }`}
              >
                {m === 'wheel' ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v10l6 6" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="2" y="3" width="12" height="18" rx="2" />
                    <rect x="10" y="3" width="12" height="18" rx="2" />
                  </svg>
                )}
                {m === 'wheel' ? strings.wheelModal.settings.modeWheel : strings.wheelModal.settings.modeCards}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between mb-2 flex-none">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{strings.wheelModal.settings.pool}</p>
            <span className="text-[10px] text-gray-600">{pool.length}</span>
          </div>
          <div className="flex flex-col gap-0.5 overflow-y-auto flex-1 pr-0.5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2332 transparent' }}>
            {pool.map(g => (
              <div key={g.id} className="flex items-center gap-2 py-1 px-1 rounded group hover:bg-white/5">
                <img src={g.header_image} alt={g.name} className="w-8 h-5 object-cover rounded flex-none opacity-60" />
                <span className="text-[11px] text-gray-400 truncate flex-1">{g.name}</span>
                <button
                  onClick={() => onRemoveFromPool(g.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all flex-none p-0.5"
                  title={strings.wheelModal.settings.remove}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
