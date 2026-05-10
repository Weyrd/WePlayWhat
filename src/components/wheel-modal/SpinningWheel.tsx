import { useCallback, useEffect, useRef, useState } from 'react';
import type { Game } from '../../models/Game';
import strings from '../../strings.json';

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M${cx},${cy} L${s.x},${s.y} A${r},${r} 0 ${large},1 ${e.x},${e.y} Z`;
}

interface Props {
  games: Game[];
  onWinner: (game: Game) => void;
}

export function SpinningWheel({ games, onWinner }: Props) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Game | null>(null);
  const animRef = useRef<number | null>(null);
  const startRotRef = useRef(0);

  const SIZE = 320;
  const LABEL_MARGIN = 80;
  const TOTAL = SIZE + LABEL_MARGIN * 2;
  const CX = TOTAL / 2;
  const CY = TOTAL / 2;
  const R = SIZE / 2 - 4;
  const TICK_START = R + 6;
  const TICK_END = R + 22;
  const LABEL_R = R + 30;

  const n = games.length;
  const sliceDeg = 360 / n;
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

  const spin = useCallback(() => {
    if (spinning) return;
    setWinner(null);
    setSpinning(true);

    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const randomAngle = Math.random() * 360;
    const target = startRotRef.current + 360 * extraSpins + randomAngle;
    const duration = 4000 + Math.random() * 1000;
    const startTime = performance.now();
    const startRot = startRotRef.current;

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const current = startRot + (target - startRot) * easeOut(t);
      setRotation(current);
      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        const finalRotation = target;
        setRotation(finalRotation);
        startRotRef.current = finalRotation;
        setSpinning(false);

        // Pointer is at top. Find which slice is under it.
        const pointerLocal = (((-finalRotation) % 360) + 360) % 360;
        const winnerIdx = Math.floor(pointerLocal / sliceDeg) % n;

        setWinner(games[winnerIdx]);
        onWinner(games[winnerIdx]);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  }, [spinning, games, n, sliceDeg, onWinner]);

  useEffect(() => () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  const fontSize = Math.max(9, Math.min(13, 140 / n));
  const maxChars = Math.max(8, Math.floor(200 / n));

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: TOTAL, height: TOTAL }}>
        {/* Pointer */}
        <div
          className="absolute z-20"
          style={{ top: LABEL_MARGIN - 6, left: '50%', transform: 'translateX(-50%)' }}
        >
          <div className="w-4 h-4 bg-white rounded-sm rotate-45 border-2 border-[#161b27] shadow-lg" />
        </div>

        <svg
          width={TOTAL}
          height={TOTAL}
          style={{
            transform: `translateZ(0) rotate(${rotation}deg)`,
            transition: 'none',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          } as React.CSSProperties}
        >
          <defs>
            {games.map((g) => (
              <pattern
                key={g.id}
                id={`slice-img-${g.id}`}
                patternUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={TOTAL}
                height={TOTAL}
              >
                <image
                  href={g.header_image}
                  x={CX - R}
                  y={CY - R}
                  width={R * 2}
                  height={R * 2}
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            ))}
          </defs>

          {games.map((g, i) => {
            const startDeg = i * sliceDeg;
            const endDeg = (i + 1) * sliceDeg;
            const midDeg = startDeg + sliceDeg / 2;
            const isWin = winner?.id === g.id;

            const tickOuter = polarToXY(CX, CY, TICK_END, midDeg);
            const tickInner = polarToXY(CX, CY, TICK_START, midDeg);
            const labelPos = polarToXY(CX, CY, LABEL_R, midDeg);

            const label = g.name.length > maxChars ? `${g.name.slice(0, maxChars - 1)}…` : g.name;

            return (
              <g key={g.id}>
                <path
                  d={slicePath(CX, CY, R, startDeg, endDeg)}
                  fill={`url(#slice-img-${g.id})`}
                  opacity={isWin ? 1 : 0.86}
                />

                {isWin && (
                  <path
                    d={slicePath(CX, CY, R, startDeg, endDeg)}
                    fill="rgba(139,92,246,0.32)"
                    stroke="#a78bfa"
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                  />
                )}

                <path
                  d={slicePath(CX, CY, R, startDeg, endDeg)}
                  fill="none"
                  stroke="rgba(0,0,0,0.7)"
                  strokeWidth={1.5}
                />

                <line
                  x1={tickInner.x} y1={tickInner.y}
                  x2={tickOuter.x} y2={tickOuter.y}
                  stroke={isWin ? '#a78bfa' : 'rgba(255,255,255,0.45)'}
                  strokeWidth={isWin ? 2 : 1}
                />

                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  fontWeight={isWin ? '700' : '500'}
                  fill={isWin ? '#c4b5fd' : 'rgba(255,255,255,0.8)'}
                  style={{
                    // Counter-rotate by the current wheel rotation so text stays upright
                    transform: `rotate(${-rotation}deg)`,
                    transformOrigin: `${labelPos.x}px ${labelPos.y}px`,
                    filter: 'drop-shadow(0 0 3px rgba(0,0,0,1)) drop-shadow(0 1px 2px rgba(0,0,0,1))',
                  }}
                >
                  {label}
                </text>
              </g>
            );
          })}

          <circle cx={CX} cy={CY} r={22} fill="#161b27" stroke="#7c3aed" strokeWidth={1.5} />
          <circle cx={CX} cy={CY} r={8} fill="#7c3aed" />
        </svg>

        <div
          className="absolute pointer-events-none"
          style={{
            top: LABEL_MARGIN,
            left: LABEL_MARGIN,
            width: SIZE,
            height: SIZE,
            borderRadius: '50%',
            border: '2px solid rgba(139,92,246,0.3)',
          }}
        />
      </div>

      <div style={{ height: 40 }} className="flex flex-col items-center justify-center">
        {winner && (
          <>
            <span className="text-[10px] text-purple-400 uppercase tracking-widest font-semibold">{strings.wheelModal.tonightsGame}</span>
            <span className="text-sm font-bold text-white truncate max-w-70">{winner.name}</span>
          </>
        )}
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="px-8 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
      >
        {spinning ? strings.wheelModal.buttons.spinning : winner ? strings.wheelModal.buttons.spinAgain : strings.wheelModal.buttons.spin}
      </button>
    </div>
  );
}
