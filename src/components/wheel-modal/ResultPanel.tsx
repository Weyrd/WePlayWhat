import type { Game } from '../../models/Game';
import strings from '../../strings.json';
import { isGameFree } from '../../utils/gameFlags';

interface Props {
  game: Game | null;
  onPlayAgain: () => void;
  onClose: () => void;
}

export function ResultPanel({ game, onPlayAgain, onClose }: Props) {
  const gameIsFree = game ? isGameFree(game) : false;
  const hasDiscount = (game?.price_overview?.discount_percent ?? 0) > 0;
  const dlcCount = game?.dlc?.length ?? 0;
  const achievementsTotal = game?.achievements?.total ?? 0;
  const metacriticScore = game?.metacritic?.score;

  return (
    <div
      className="border-r border-[#1e2332] bg-[#080c12] flex-none overflow-hidden"
      style={{ width: game ? 240 : 0, transition: 'width 0.35s ease' }}
    >
      <div className="w-60 h-full flex flex-col overflow-y-auto">
        {game && (
          <>
            {/* Full-bleed hero with gradient + title */}
            <div className="relative flex-none" style={{ height: 112 }}>
              <img
                src={game.header_image}
                alt={game.name}
                className="w-full h-full object-cover block"
              />
              {/* gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, #080c12 0%, rgba(8,12,18,0.35) 60%, transparent 100%)' }}
              />
              {/* badge */}
              <span
                className="absolute top-2 left-2 text-purple-400 font-semibold uppercase tracking-widest"
                style={{
                  fontSize: 9,
                  background: 'rgba(124,58,237,0.2)',
                  border: '0.5px solid rgba(124,58,237,0.4)',
                  borderRadius: 4,
                  padding: '2px 6px',
                  letterSpacing: '0.1em',
                }}
              >
                {strings.wheelModal.tonightsGame}
              </span>
              {/* title */}
              <h3
                className="absolute text-slate-100 font-bold leading-snug"
                style={{ bottom: 8, left: 10, right: 10, fontSize: 15 }}
              >
                {game.name}
              </h3>
            </div>

            {/* Stats row: DLC · Achievements · Metacritic */}
            <div
              className="flex-none grid grid-cols-3"
              style={{ gap: '1px', background: '#1e2332' }}
            >
              <div className="bg-[#080c12] py-2.5 text-center">
                <div className="text-sm font-bold text-sky-300 leading-none">{dlcCount || '—'}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-1">{strings.wheelModal.resultPanel.stats.dlc}</div>
              </div>
              <div className="bg-[#080c12] py-2.5 text-center">
                <div className="text-sm font-bold text-purple-300 leading-none">{achievementsTotal || '—'}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-1">{strings.wheelModal.resultPanel.stats.achievementsShort}</div>
              </div>
              <div className="bg-[#080c12] py-2.5 text-center">
                <div className="text-sm font-bold text-emerald-400 leading-none">{metacriticScore ?? '—'}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-1">{strings.wheelModal.resultPanel.stats.metacritic}</div>
              </div>
            </div>

            {/* Price row — only when not owned */}
            {!game.owned && (
              <div
                className="flex-none flex items-center justify-between px-3 py-2 border-t border-b border-[#1e2332]"
                style={{ background: '#0a0f18' }}
              >
                {gameIsFree ? (
                  <span className="text-sm font-bold text-green-400">{strings.price.free}</span>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-green-400">
                        {game.price_overview?.final_formatted ?? strings.price.unavailable}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] text-gray-500 line-through">
                          {game.price_overview?.initial_formatted}
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <span
                        className="text-white font-bold"
                        style={{ fontSize: 10, background: '#16a34a', borderRadius: 4, padding: '2px 5px' }}
                      >
                        −{game.price_overview?.discount_percent}%
                      </span>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Short description */}
            {game.short_description && (
              <p
                className="flex-none px-3 py-2.5 text-gray-500 border-b border-[#1e2332]"
                style={{
                  fontSize: 11,
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 10,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {game.short_description}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-1.5 p-3 mt-auto">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
              >
                {strings.wheelModal.letsPlay}
              </button>

              {/* Secondary links row */}
              <div className="flex gap-1.5">
                <a
                  href={`https://store.steampowered.com/app/${game.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-[#2a2d3a] bg-[#161b27] hover:border-[#3a3f4a] text-gray-400 hover:text-white transition-colors no-underline"
                  style={{ fontSize: 10 }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2980d4" strokeWidth={2}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                  </svg>
                  {strings.wheelModal.resultPanel.links.steam}
                </a>

                {!game.owned && (
                  <>
                    <a
                      href={game.dlCompareUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-[#2a2d3a] bg-[#161b27] hover:border-[#3a3f4a] text-gray-400 hover:text-white transition-colors no-underline"
                      style={{ fontSize: 10 }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth={2}>
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                      {strings.wheelModal.resultPanel.links.dlCompare}
                    </a>
                    <a
                      href={game.instantGamingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-[#2a2d3a] bg-[#161b27] hover:border-[#3a3f4a] text-gray-400 hover:text-white transition-colors no-underline"
                      style={{ fontSize: 10 }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#d44e12" strokeWidth={2}>
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      {strings.wheelModal.resultPanel.links.instantGamingShort}
                    </a>
                  </>
                )}
              </div>

              <button
                onClick={onPlayAgain}
                className="w-full py-1.5 rounded-lg border border-[#1e2332] bg-transparent text-gray-500 hover:text-gray-300 hover:border-[#2a2d3a] transition-colors"
                style={{ fontSize: 10 }}
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
