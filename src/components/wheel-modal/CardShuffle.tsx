import { useCallback, useEffect, useRef, useState } from 'react';
import type { Game } from '../../models/Game';
import strings from '../../strings.json';

type CardPhase = 'spread' | 'collecting' | 'shuffling' | 'fanning' | 'facedown' | 'picked';

interface CardPos {
  x: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  zIndex: number;
  faceUp: boolean;
}

interface Props {
  games: Game[];
  onWinner: (game: Game) => void;
}

const FAN_EDGE_PADDING_PCT = 16;

function buildFan(n: number): CardPos[] {
  return Array.from({ length: n }, (_, i) => {
    const spread = Math.min(6.5, 160 / n);
    const totalSpread = spread * (n - 1);
    const rotation = -totalSpread / 2 + i * spread;
    const x = n === 1
      ? 50
      : FAN_EDGE_PADDING_PCT + (i / (n - 1)) * (100 - FAN_EDGE_PADDING_PCT * 2);
    return { x, rotation, offsetX: 0, offsetY: 0, zIndex: i, faceUp: true };
  });
}

function buildDeck(n: number): CardPos[] {
  return Array.from({ length: n }, (_, i) => ({
    x: 50,
    rotation: (Math.random() - 0.5) * 12,
    offsetX: (Math.random() - 0.5) * 6,
    offsetY: 0,
    zIndex: i,
    faceUp: true,
  }));
}

export function CardShuffle({ games, onWinner }: Props) {
  const MAX = 20;
  const displayGames = games.slice(0, MAX);
  const n = displayGames.length;

  const [phase, setPhase] = useState<CardPhase>('spread');
  const [cards, setCards] = useState<CardPos[]>(() => buildFan(n));
  const [suggestedIdx, setSuggestedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const CARD_W = 64;
  const CARD_H = 96;

  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => () => clearAllTimers(), []);

  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
  };

  const isAnimating = ['collecting', 'shuffling', 'fanning'].includes(phase);

  const startShuffle = useCallback(() => {
    if (isAnimating) return;
    clearAllTimers();
    setSuggestedIdx(null);
    setPickedIdx(null);
    setHoveredIdx(null);

    // Flip all cards face-up in their current positions first
    setCards(prev => prev.map(c => ({ ...c, faceUp: true })));

    // If cards were face-down, wait for the flip before collecting
    const flipDelay = phase === 'spread' ? 0 : 420;

    later(() => {
      // 1. Collect into a deck at center
      setPhase('collecting');
      setCards(buildDeck(n));

      later(() => {
        // 2. Shuffle ticks (rapid jiggle while stacked)
        setPhase('shuffling');
        let tick = 0;
        intervalRef.current = setInterval(() => {
          tick++;
          setCards(prev => prev.map(c => ({
            ...c,
            offsetX: (Math.random() - 0.5) * 28,
            offsetY: (Math.random() - 0.5) * 14,
            rotation: (Math.random() - 0.5) * 22,
            zIndex: Math.floor(Math.random() * n),
          })));

          if (tick >= 8) {
            clearInterval(intervalRef.current!);

            // Brief settle + hide while still stacked before fanning
            later(() => {
              setCards(buildDeck(n).map(c => ({ ...c, faceUp: false })));
            }, 60);

            later(() => {
              // 3. Fan out already face-down
              setPhase('fanning');
              setCards(buildFan(n).map(c => ({ ...c, faceUp: false })));

              later(() => {
                // 4. Ready — highlight a suggested card
                setSuggestedIdx(Math.floor(Math.random() * n));
                setPhase('facedown');
              }, 620);
            }, 260);
          }
        }, 110);
      }, 560);
    }, flipDelay);
  }, [phase, n, isAnimating]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== 'facedown' || pickedIdx !== null) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const centers = cards.map(c => {
      const baseCenter = (c.x / 100) * rect.width + c.offsetX;
      const rad = (c.rotation * Math.PI) / 180;
      // Visual center shifts with card tilt because rotation origin is bottom center.
      const rotationCenterShift = Math.sin(rad) * (CARD_H * 0.5);
      return baseCenter + rotationCenterShift;
    });

    let closestIdx = 0;
    let closestDist = Number.POSITIVE_INFINITY;

    for (let i = 0; i < n; i++) {
      const centerX = centers[i];
      if (centerX === undefined) continue;
      const dist = Math.abs(mouseX - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }

    setHoveredIdx(closestIdx);
  }, [phase, pickedIdx, n, cards, CARD_H]);

  const handleMouseLeave = useCallback(() => setHoveredIdx(null), []);

  const pickCard = useCallback((idx: number) => {
    if (phase !== 'facedown' || pickedIdx !== null) return;
    setPickedIdx(idx);
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, faceUp: true } : c));
    setPhase('picked');
    onWinner(displayGames[idx]);
  }, [phase, pickedIdx, displayGames, onWinner]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        ref={containerRef}
        className="relative w-full select-none"
        style={{ height: CARD_H + 60, overflow: 'visible' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {displayGames.map((game, i) => {
          const c = cards[i] ?? { x: 50, rotation: 0, offsetX: 0, offsetY: 0, zIndex: i, faceUp: true };

          const isSuggested = phase === 'facedown' && i === suggestedIdx && pickedIdx === null;
          const isPicked = pickedIdx === i;
          const isHovOnly = hoveredIdx === i && phase === 'facedown' && pickedIdx === null && i !== suggestedIdx;
          const glowing = isSuggested || isPicked;

          const lift =
            isPicked ? 40 :
            isSuggested ? 28 :
            isHovOnly ? 14 :
            0;

          const posTrans =
            phase === 'collecting' ? 'transform 0.5s ease' :
            phase === 'shuffling'  ? 'transform 0.1s ease' :
            phase === 'fanning'    ? 'transform 0.52s cubic-bezier(0.34, 1.2, 0.64, 1)' :
            'transform 0.15s ease, box-shadow 0.15s ease';

          return (
            <div
              key={game.id}
              onClick={() => pickCard(i)}
              style={{
                position: 'absolute',
                left: `calc(${c.x}% - ${CARD_W / 2}px)`,
                bottom: 0,
                width: CARD_W,
                height: CARD_H,
                transform: `translateX(${c.offsetX}px) translateY(${c.offsetY - lift}px) rotate(${c.rotation}deg)`,
                transformOrigin: 'bottom center',
                transition: posTrans,
                cursor: phase === 'facedown' && pickedIdx === null ? 'pointer' : 'default',
                zIndex: c.zIndex,
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: glowing
                  ? '0 0 28px 6px rgba(139,92,246,0.65), 0 8px 24px rgba(0,0,0,0.7)'
                  : isHovOnly
                    ? '0 0 14px 3px rgba(139,92,246,0.25), 0 4px 16px rgba(0,0,0,0.5)'
                    : '0 4px 12px rgba(0,0,0,0.45)',
                border: glowing ? '1.5px solid #a78bfa' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Flip container */}
              <div style={{
                width: '100%', height: '100%', position: 'relative',
                transformStyle: 'preserve-3d',
                transform: c.faceUp ? 'rotateY(0deg)' : 'rotateY(180deg)',
                transition: 'transform 0.4s ease',
              }}>
                {/* Front face */}
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
                  <img src={game.header_image} alt={game.name} className="w-full h-full object-cover" />
                  {isPicked && <div className="absolute inset-0 bg-purple-500/20" />}
                </div>
                {/* Back face */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #0f0c29 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    position: 'absolute', inset: 4,
                    border: `1px solid ${isSuggested ? 'rgba(167,139,250,0.55)' : 'rgba(124,58,237,0.3)'}`,
                    borderRadius: 5,
                  }} />
                  {isSuggested && (
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: 7,
                      background: 'radial-gradient(circle at center, rgba(124,58,237,0.22) 0%, transparent 70%)',
                    }} />
                  )}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: `1px solid ${isSuggested ? 'rgba(167,139,250,0.8)' : 'rgba(124,58,237,0.5)'}`,
                    background: isSuggested ? 'rgba(124,58,237,0.15)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke={isSuggested ? '#c4b5fd' : '#7c3aed'} strokeWidth={1.5}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* Fixed-height status — no layout shift */}
      <div style={{ height: 40 }} className="flex flex-col items-center justify-center text-center">
        {phase === 'spread' && (
          <p className="text-xs text-gray-500">{strings.wheelModal.cards.statusSpread}</p>
        )}
        {isAnimating && (
          <p className="text-xs text-purple-400 animate-pulse">{strings.wheelModal.buttons.shuffling}</p>
        )}
        {phase === 'facedown' && pickedIdx === null && (
          <p className="text-xs text-gray-400">{strings.wheelModal.cards.statusFaceDown}</p>
        )}
        {phase === 'picked' && pickedIdx !== null && (
          <>
            <span className="text-[10px] text-purple-400 uppercase tracking-widest font-semibold">{strings.wheelModal.tonightsGame}</span>
            <span className="text-sm font-bold text-white truncate max-w-95">
              {displayGames[pickedIdx]?.name}
            </span>
          </>
        )}
      </div>

      <button
        onClick={startShuffle}
        disabled={isAnimating}
        className="px-8 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
      >
        {isAnimating ? strings.wheelModal.buttons.shuffling : phase === 'spread' ? strings.wheelModal.buttons.shuffle : strings.wheelModal.buttons.shuffleAgain}
      </button>
    </div>
  );
}
