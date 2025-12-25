'use client';

import * as React from 'react';

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;

  /** 0..100 */
  initial?: number;

  /** Auto sweep until user interacts */
  autoDemo?: boolean;

  /** Tailwind aspect ratio: e.g. "aspect-[4/5]" or "aspect-square" */
  aspectClassName?: string;

  className?: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Before',
  afterAlt = 'After',
  beforeLabel = 'Selfie',
  afterLabel = 'AI Generated',
  initial = 50,
  autoDemo = true,
  aspectClassName = 'aspect-[4/5]',
  className = '',
}: BeforeAfterSliderProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [value, setValue] = React.useState(initial);
  const [interacted, setInteracted] = React.useState(false);

  // Auto demo sweep (stops on any interaction)
  React.useEffect(() => {
    if (!autoDemo || interacted) return;

    let raf = 0;
    const start = performance.now();

    const tick = (t: number) => {
      const s = (t - start) / 1000;
      // oscillate between 30 and 70
      const v = 50 + Math.sin(s * 1.2) * 20;
      setValue(Math.max(0, Math.min(100, v)));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoDemo, interacted]);

  const setFromClientX = React.useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setValue(Math.max(0, Math.min(100, pct)));
    },
    []
  );

  const onPointerDown = (e: React.PointerEvent) => {
    setInteracted(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if ((e.buttons ?? 0) === 0) return;
    setFromClientX(e.clientX);
  };

  const clipStyle: React.CSSProperties = {
    clipPath: `inset(0 ${100 - value}% 0 0)`,
    WebkitClipPath: `inset(0 ${100 - value}% 0 0)`,
  };

  return (
    <div
      ref={ref}
      className={[
        'relative w-full overflow-hidden rounded-2xl bg-muted shadow-[0_10px_30px_rgba(0,0,0,0.12)]',
        aspectClassName,
        className,
      ].join(' ')}
      aria-label="Before/After image comparison"
    >
      {/* After (base) */}
      <img
        src={afterSrc}
        alt={afterAlt}
        className="absolute inset-0 h-full w-full select-none object-cover"
        draggable={false}
      />

      {/* Before (clipped overlay) */}
      <img
        src={beforeSrc}
        alt={beforeAlt}
        className="absolute inset-0 h-full w-full select-none object-cover"
        style={clipStyle}
        draggable={false}
      />

      {/* Labels */}
      <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
        {beforeLabel}
      </div>
      <div className="absolute right-4 top-4 rounded-full bg-violet-600/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        {afterLabel}
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 h-full w-[2px] bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
        style={{ left: `calc(${value}% - 1px)` }}
        aria-hidden="true"
      />

      {/* Handle */}
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => setInteracted(true)}
        onPointerCancel={() => setInteracted(true)}
        className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white/85 backdrop-blur hover:bg-white"
        style={{ left: `${value}%`, cursor: 'ew-resize' }}
        aria-label="Drag to compare"
      >
        <span className="text-lg leading-none">↔</span>
      </button>

      {/* Keyboard accessible range */}
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(value)}
        onChange={(e) => {
          setInteracted(true);
          setValue(Number(e.target.value));
        }}
        className="absolute inset-0 h-full w-full opacity-0"
        aria-label="Comparison slider"
      />
    </div>
  );
}
