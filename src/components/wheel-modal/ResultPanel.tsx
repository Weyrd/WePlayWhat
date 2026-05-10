import type { Game } from '../../models/Game';
import strings from '../../strings.json';

interface Props {
  game: Game | null;
  onPlayAgain: () => void;
  onClose: () => void;
}

export function ResultPanel({ game, onPlayAgain, onClose }: Props) {
  return (
    <div
      className="border-r border-[#1e2332] bg-[#080c12] flex-none overflow-hidden"
      style={{ width: game ? 240 : 0, transition: 'width 0.35s ease' }}
    >
      <div className="w-60 h-full flex flex-col p-4">
        {game && (
          <>
            <p className="text-[10px] text-purple-400 uppercase tracking-widest font-semibold mb-3 flex-none">
              {strings.wheelModal.tonightsGame}
            </p>

            <div className="flex-none rounded-lg overflow-hidden border border-[#1e2332] mb-3">
              <img
                src={game.header_image}
                alt={game.name}
                className="w-full object-cover"
                style={{ aspectRatio: '460/215' }}
              />
            </div>

            <h3 className="text-white font-bold text-sm leading-snug flex-none">{game.name}</h3>

            <div className="flex flex-col gap-2 mt-auto pt-4">
              <button
                onClick={onClose}
                className="w-full px-3 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors"
              >
                {strings.wheelModal.letsPlay}
              </button>
              <a
                href={`https://store.steampowered.com/app/${game.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#161b27] border border-[#2a2d3a] hover:border-[#3a3f4a] text-gray-300 hover:text-white text-sm transition-colors no-underline"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2980d4" strokeWidth={2}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
                {strings.wheelModal.buttons.openInSteam}
              </a>
              <button
                onClick={onPlayAgain}
                className="w-full px-3 py-2 rounded-lg bg-[#161b27] border border-[#2a2d3a] hover:border-[#3a3f4a] text-gray-400 hover:text-white text-sm transition-colors"
              >
                {strings.wheelModal.buttons.tryAgain}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
