import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Users, Columns, Share2, Gamepad2, Trophy, Cloud, SlidersHorizontal, User, SquareArrowOutUpRight, Tag, Zap, ExternalLink, ChevronLeft, ChevronRight, Award, type LucideIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Game } from '../models/Game';
import type { SteamDlcDetailsData } from '../models/Steam';
import strings from '../strings.json';
import { fetchDlcData } from '../services/steam';
import { Badge } from './Badge';
import { BadgeType } from '../models/Badge';
import { isGameFree } from '../utils/gameFlags';

interface GameDetailModalProps {
  game: Game;
  onClose: () => void;
}

const ModalTab = {
  OVERVIEW: 'overview',
  DLC: 'dlc',
  ACHIEVEMENTS: 'achievements',
} as const;

type ModalTab = typeof ModalTab[keyof typeof ModalTab];

const FEAT_MAP: Record<number, { label: string; icon: LucideIcon; highlight: boolean }> = {
  38: { label: 'Online co-op',     icon: Users,             highlight: true  },
  39: { label: 'Split screen',     icon: Columns,           highlight: false },
  44: { label: 'Remote Play',      icon: Share2,            highlight: false },
  28: { label: 'Full controller',  icon: Gamepad2,          highlight: true  },
  22: { label: 'Achievements',     icon: Trophy,            highlight: false },
  23: { label: 'Cloud saves',      icon: Cloud,             highlight: false },
  78: { label: 'Adj. difficulty',  icon: SlidersHorizontal, highlight: false },
   2: { label: 'Single-player',    icon: User,              highlight: false },
   1: { label: 'Multiplayer',      icon: Users,             highlight: false },
};

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, onClose }) => {
  const gameIsFree = isGameFree(game);
  const [imgIndex, setImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ModalTab>(ModalTab.OVERVIEW);
  const [dlcData, setDlcData] = useState<Record<string, SteamDlcDetailsData>>({});
  const [isDlcLoading, setIsDlcLoading] = useState(false);
  const thumbRefs = useRef<(HTMLImageElement | null)[]>([]);
  const dlcFetchedRef = useRef(false);

  const images: string[] = [];
  if (game.header_image) images.push(game.header_image);
  if (game.screenshots) {
    images.push(...game.screenshots.map(s => s.path_full));
  }

  const goTo = (i: number) => {
    let next = i % images.length;
    if (next < 0) next += images.length;
    setImgIndex(next);
  };

  useEffect(() => {
    if (thumbRefs.current[imgIndex]) {
      thumbRefs.current[imgIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [imgIndex]);

  const handleFetchDlc = useCallback(async () => {
    if (game.dlc && game.dlc.length > 0) {
      setIsDlcLoading(true);
      try {
        const data = await fetchDlcData(game.dlc);
        setDlcData(data);
      } catch {
        toast.error(strings.toasts.dlcFetchError);
      } finally {
        setIsDlcLoading(false);
      }
    }
  }, [game.dlc]);

  useEffect(() => {
    if (activeTab === ModalTab.DLC && Object.keys(dlcData).length === 0 && !dlcFetchedRef.current) {
      dlcFetchedRef.current = true;
      handleFetchDlc();
    }
  }, [activeTab, dlcData, handleFetchDlc]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const dlcCount = game.dlc?.length ?? 0;
  const achievementsTotal = game.achievements?.total ?? 0;
  const metacriticScore = game.metacritic?.score;

  const tabs: { id: ModalTab; label: string }[] = [
    { id: ModalTab.OVERVIEW, label: strings.modal.tabs.overview },
    { id: ModalTab.DLC,      label: `${strings.modal.tabs.dlc} (${dlcCount})` },
    { id: ModalTab.ACHIEVEMENTS, label: `${strings.modal.tabs.achievements} (${achievementsTotal})` },
  ];

  // Collect matching features preserving order keys if they exist in game
  const features = (game.categories || [])
    .filter(c => FEAT_MAP[c.id])
    .map(c => ({ id: c.id, ...FEAT_MAP[c.id] }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[#161b27] border border-[#2a2d3a] rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative group flex-none">
          {images.length > 0 ? (
            <img 
              src={images[imgIndex]} 
              alt={game.name} 
              className="w-full h-50 object-cover cursor-pointer" 
              onClick={() => goTo(imgIndex + 1)}
            />
          ) : (
            <div className="w-full h-50 bg-gray-800 animate-pulse flex items-center justify-center">
              <span className="text-gray-500 font-medium">{strings.status.loading}</span>
            </div>
          )}
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <button
                className="w-8 h-8 rounded-lg bg-[#161b27] border border-[#2a2d3a] flex items-center justify-center text-gray-400 hover:text-white transition-colors pointer-events-auto"
                onClick={(e) => { e.stopPropagation(); goTo(imgIndex - 1); }}
              >
                <ChevronLeft size={14} strokeWidth={2.5} />
              </button>
              <button
                className="w-8 h-8 rounded-lg bg-[#161b27] border border-[#2a2d3a] flex items-center justify-center text-gray-400 hover:text-white transition-colors pointer-events-auto"
                onClick={(e) => { e.stopPropagation(); goTo(imgIndex + 1); }}
              >
                <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
          <button
            className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-[#161b27] border border-[#2a2d3a] flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          
          {/* Image indicator dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all shadow-md ${i === imgIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbs Strip */}
        {images.length > 1 && (
          <div className="flex overflow-x-auto gap-2 px-4 py-2 bg-[#0d1117] flex-none scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {images.map((img, i) => (
              <img
                key={i}
                ref={(el) => { thumbRefs.current[i] = el; }}
                src={img}
                alt={`thumb-${i}`}
                className={`h-11.5 w-20 flex-none object-cover cursor-pointer transition-all ${
                  i === imgIndex ? 'border-[1.5px] border-violet-600 opacity-100' : 'opacity-50 hover:opacity-100'
                }`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
        
        <div className="px-4 pt-3 pb-4 overflow-y-auto flex-1 flex flex-col bg-[#0d1117]">
          {/* Title and Meta Row */}
          <div className="mb-3">
            <h2 className="text-xl font-bold text-slate-100">{game.name}</h2>
            
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 mt-1 min-h-5">
              {!game.lastFetched && !game.developers?.length ? (
                 <div className="h-3 w-32 bg-gray-700 animate-pulse rounded" />
              ) : (
                <>
                  {game.developers?.length ? <span>{game.developers.join(', ')}</span> : null}
                  {game.release_date?.date ? <span>· {game.release_date.date}</span> : null}
                </>
              )}
              
              <div className="flex items-center gap-1.5 ml-2">
                {game.owned && <Badge type={BadgeType.OWNED} />}
                {game.isRemotePlay && <Badge type={BadgeType.REMOTE_PLAY} />}
                {game.isDuo && <Badge type={BadgeType.DUO} />}
                {game.isFactory && <Badge type={BadgeType.FACTORY} />}
                {gameIsFree && <Badge type={BadgeType.FREE} />}
                {game.isAsiaApproved && <Badge type={BadgeType.ASIA_APPROVED} />}
              </div>
            </div>
          </div>
          
          {/* Tab Bar */}
          <div className="flex border-b border-[#1e2332] mt-3 mb-3">
            {tabs.map(({ id: tab, label }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-3 py-2 text-[12px] font-medium capitalize
                  border-b-2 -mb-px transition-colors duration-150
                  ${activeTab === tab 
                    ? 'text-violet-400 border-violet-500' 
                    : 'text-gray-500 border-transparent hover:text-gray-300'}
                `}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto mb-4">
            {activeTab === ModalTab.OVERVIEW && (
              <div>
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {/* Unified price + discount cell */}
                  {!game.owned && (
                    <div className="flex items-stretch bg-[#0d1117] border border-green-500/20 rounded-lg overflow-hidden">
                      {/* Left — prices */}
                      <div className="flex-1 flex flex-col items-center justify-center px-2.5 py-1.75 border-r border-green-500/15">
                        <span className="text-[13px] font-medium text-green-400 leading-none">
                          {gameIsFree
                            ? strings.price.free
                            : game.price_overview?.final_formatted || strings.price.unavailable}
                        </span>
                        {(game.price_overview?.discount_percent ?? 0) > 0 && (
                          <span className="text-[10px] text-gray-600 line-through leading-none mt-1">
                            {game.price_overview?.initial_formatted}
                          </span>
                        )}
                      </div>
                      {/* Right — discount */}
                      <div className="flex flex-col items-center justify-center px-3 py-1.75 bg-green-500/8">
                        <span className={`text-[13px] font-semibold leading-none ${(game.price_overview?.discount_percent ?? 0) > 0 ? 'text-green-400' : 'text-gray-600'}`}>
                          {(game.price_overview?.discount_percent ?? 0) > 0
                            ? `−${game.price_overview?.discount_percent}%`
                            : '—'}
                        </span>
                        <span className="text-[10px] text-gray-500 mt-1">Off</span>
                      </div>
                    </div>
                  )}

                  {/* Owned — single plain price cell */}
                  {game.owned && (
                    <div className="bg-[#0d1117] border border-[#1e2332] rounded-lg p-[7px_10px] text-center flex flex-col justify-center">
                      <span className="text-[13px] font-medium text-green-400">
                        {gameIsFree ? strings.price.free : (game.price_overview?.final_formatted || strings.price.unavailable)}
                      </span>
                    </div>
                  )}

                  {/* DLC */}
                  <div className="bg-[#0d1117] border border-[#1e2332] rounded-lg p-[7px_10px] text-center flex flex-col justify-center">
                    <span className="text-[13px] font-medium text-sky-300">{game.dlc?.length ?? '—'}</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">{strings.modal.stats.dlc}</span>
                  </div>

                  {/* Achievements */}
                  <div className="bg-[#0d1117] border border-[#1e2332] rounded-lg p-[7px_10px] text-center flex flex-col justify-center">
                    <span className="text-[13px] font-medium text-violet-300">{achievementsTotal || '—'}</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">{strings.modal.stats.achievements}</span>
                  </div>

                  {/* Metacritic */}
                  {game.metacritic?.url && metacriticScore ? (
                    <a
                      href={game.metacritic.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#0d1117] border border-[#1e2332] rounded-lg p-[7px_10px] text-center flex flex-col justify-center no-underline hover:border-emerald-500/40 transition-colors"
                    >
                      <span className="text-[13px] font-medium text-emerald-300 hover:text-emerald-200">
                        {metacriticScore}
                      </span>
                      <span className="text-[10px] text-gray-500 mt-0.5">{strings.modal.stats.metacritic}</span>
                    </a>
                  ) : (
                    <div className="bg-[#0d1117] border border-[#1e2332] rounded-lg p-[7px_10px] text-center flex flex-col justify-center">
                      <span className="text-[13px] font-medium text-gray-600">—</span>
                      <span className="text-[10px] text-gray-500 mt-0.5">{strings.modal.stats.metacritic}</span>
                    </div>
                  )}
                </div>

          {/* Description */}
          <div className="mb-3">
            {!game.lastFetched && !game.short_description ? (
              <div className="space-y-2 mt-2">
                <div className="h-3 bg-gray-700 animate-pulse rounded w-full"></div>
                <div className="h-3 bg-gray-700 animate-pulse rounded w-11/12"></div>
                <div className="h-3 bg-gray-700 animate-pulse rounded w-4/5"></div>
              </div>
            ) : (
              <p className="text-[12px] text-slate-400 leading-relaxed line-clamp-10" dangerouslySetInnerHTML={{ __html: game.short_description || strings.modal.noDescription }} />
            )}
          </div>

          {/* Genres */}
          {game.genres && game.genres.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{strings.modal.genres}</span>
                <div className="flex-1 h-px bg-[#1e2332]" />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {game.genres.map(genre => (
                  <div
                    key={genre.id}
                    className="flex items-center gap-1 px-2.5 py-0.75 rounded-full text-[11px] font-medium border bg-[#0d1117] text-slate-400 border-[#1e2332]"
                  >
                    {genre.description}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Features */}
          {features.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{strings.modal.features}</span>
                <div className="flex-1 h-px bg-[#1e2332]" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {features.map(f => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.id}
                      className={`flex items-center gap-1 px-2.5 py-0.75 rounded-full text-[11px] font-medium border ${
                        f.highlight
                          ? 'bg-violet-600/10 text-violet-400 border-violet-600/40'
                          : 'bg-[#0d1117] text-slate-400 border-[#1e2332]'
                      }`}
                    >
                      <Icon size={12} />
                      {f.label}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

            {activeTab === ModalTab.DLC && (
              <div className="flex flex-col">
                {(!game.dlc || game.dlc.length === 0) ? (
                  <div className="text-[12px] text-gray-500 py-4 text-center">{strings.modal.noDlcAvailable}</div>
                ) : isDlcLoading ? (
                  Array.from({ length: Math.min(game.dlc.length, 3) }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-[#1e2332] last:border-0">
                      <div className="h-10 w-18 rounded bg-gray-800 animate-pulse flex-none" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-700 animate-pulse rounded w-3/4" />
                        <div className="h-2.5 bg-gray-700 animate-pulse rounded w-1/4" />
                      </div>
                    </div>
                  ))
                ) : (
                  game.dlc.map(appId => {
                    const data = dlcData[appId];
                    if (!data) return null;
                    return (
                      <div key={appId} className="flex items-center gap-3 py-2 border-b border-[#1e2332] last:border-0">
                        <img src={data.header_image} className="h-10 w-18 rounded object-cover flex-none bg-gray-800" alt={data.name} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] text-slate-200 truncate pr-2">{data.name}</div>
                          <div className="text-[11px] text-green-400 mt-0.5">{data.is_free ? 'Free' : (data.price_overview?.final_formatted || '')}</div>
                        </div>
                        <a href={`https://store.steampowered.com/app/${appId}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white p-1">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === ModalTab.ACHIEVEMENTS && (
              <div className="flex flex-col">
                {achievementsTotal <= 0 ? (
                  <div className="text-[12px] text-gray-500 py-4 text-center">{strings.modal.noAchievementsAvailable}</div>
                ) : (
                  <>
                    <div className="text-[11px] text-gray-400 mb-2">
                      {strings.modal.achievementsTotal.replace('{count}', achievementsTotal.toString())}
                    </div>
                    {(game.achievements?.highlighted && game.achievements.highlighted.length > 0) ? (
                      game.achievements.highlighted.map((achievement) => (
                        <div key={achievement.path} className="flex items-center gap-3 py-2 border-b border-[#1e2332] last:border-0">
                          <img
                            src={achievement.path}
                            className="h-10 w-10 rounded object-cover flex-none bg-gray-800"
                            alt={achievement.localized_name || achievement.name}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] text-slate-200 truncate pr-2">
                              {achievement.localized_name || achievement.name}
                            </div>
                          </div>
                          <Award size={14} className="text-amber-300 flex-none" />
                        </div>
                      ))
                    ) : (
                      <div className="text-[12px] text-gray-500 py-4 text-center">{strings.modal.noAchievementsAvailable}</div>
                    )}
                  </>
                )}
              </div>
            )}

          </div>
          
          {/* Buttons Row */}
          <div className="flex gap-2 mt-auto pt-4">
            <a
              href={game.steamUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-[13px] font-medium text-white cursor-pointer no-underline select-none whitespace-nowrap bg-[#1a1f2e] border border-[#2a2d3a] hover:border-[#3a3f4a] transition-colors"
            >
              <SquareArrowOutUpRight size={14} className="shrink-0 text-[#2980d4]" />
              {strings.modal.buttons.openInSteam}
            </a>

            {!game.owned && (
              <>
                <a
                  href={game.dlCompareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-[13px] font-medium text-white cursor-pointer no-underline select-none whitespace-nowrap bg-[#1a1f2e] border border-[#2a2d3a] hover:border-[#3a3f4a] transition-colors"
                >
                  <Tag size={14} className="shrink-0 text-[#7c3aed]" />
                  {strings.modal.buttons.dlCompare}
                </a>

                <a
                  href={game.instantGamingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-[13px] font-medium text-white cursor-pointer no-underline select-none whitespace-nowrap bg-[#1a1f2e] border border-[#2a2d3a] hover:border-[#3a3f4a] transition-colors"
                >
                  <Zap size={14} className="shrink-0 text-[#d44e12]" />
                  {strings.modal.buttons.instantGaming}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
