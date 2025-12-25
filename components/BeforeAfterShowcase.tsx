'use client';

import * as React from 'react';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';

export type BeforeAfterPair = {
  id: string;
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** thumbnail image (optional). If not provided, afterSrc is used. */
  thumbSrc?: string;
};

type BeforeAfterShowcaseProps = {
  items: BeforeAfterPair[];
  /** ms */
  autoPlayMs?: number;
  /** autoplay enabled */
  autoPlay?: boolean;
  /** 0..items.length-1 */
  initialIndex?: number;
  aspectClassName?: string; // e.g. "aspect-[4/5]"
  className?: string;

  // passed through to slider
  sliderAutoDemo?: boolean;
};

export function BeforeAfterShowcase({
  items,
  autoPlayMs = 4500,
  autoPlay = true,
  initialIndex = 0,
  aspectClassName = 'aspect-[4/5]',
  className = '',
  sliderAutoDemo = true,
}: BeforeAfterShowcaseProps) {
  const [index, setIndex] = React.useState(() =>
    Math.max(0, Math.min(initialIndex, Math.max(0, items.length - 1)))
  );
  const [paused, setPaused] = React.useState(false);

  const current = items[index];

  const go = React.useCallback(
    (next: number) => {
      if (!items.length) return;
      const n = (next + items.length) % items.length;
      setIndex(n);
    },
    [items.length]
  );

  const next = React.useCallback(() => go(index + 1), [go, index]);
  const prev = React.useCallback(() => go(index - 1), [go, index]);

  // Autoplay slideshow (pauses on user interaction)
  React.useEffect(() => {
    if (!autoPlay || paused || items.length <= 1) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, autoPlayMs);
    return () => window.clearInterval(t);
  }, [autoPlay, autoPlayMs, paused, items.length]);

  // Keyboard support
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setPaused(true);
        next();
      }
      if (e.key === 'ArrowLeft') {
        setPaused(true);
        prev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  if (!items.length) return null;

  return (
    <div className={['w-full', className].join(' ')}>
      <div
        className="relative"
        onPointerDown={() => setPaused(true)}
        onMouseEnter={() => setPaused(true)}
        onTouchStart={() => setPaused(true)}
      >
        {/* Slider */}
        <BeforeAfterSlider
          beforeSrc={current.beforeSrc}
          afterSrc={current.afterSrc}
          beforeLabel={current.beforeLabel ?? 'Before'}
          afterLabel={current.afterLabel ?? 'After'}
          autoDemo={sliderAutoDemo}
          aspectClassName={aspectClassName}
        />

        {/* Prev/Next buttons (subtle, optional) */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                setPaused(true);
                prev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 backdrop-blur hover:bg-white shadow"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>

            <button
              type="button"
              onClick={() => {
                setPaused(true);
                next();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 backdrop-blur hover:bg-white shadow"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails bar */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex-1 overflow-x-auto">
          <div className="flex items-center gap-2 px-1 pb-1">
            {items.map((it, i) => {
              const active = i === index;
              const thumb = it.thumbSrc ?? it.afterSrc;

              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => {
                    setPaused(true);
                    setIndex(i);
                  }}
                  className={[
                    'relative shrink-0 rounded-full p-[2px] transition',
                    active ? 'bg-violet-500' : 'bg-white/0',
                  ].join(' ')}
                  aria-label={`Select example ${i + 1}`}
                >
                  <span
                    className={[
                      'block h-11 w-11 overflow-hidden rounded-full ring-2',
                      active ? 'ring-violet-500' : 'ring-white/70',
                    ].join(' ')}
                  >
                    <img
                      src={thumb}
                      alt=""
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Refresh / resume autoplay */}
        <button
          type="button"
          onClick={() => setPaused(false)}
          className="shrink-0 rounded-full bg-white/80 p-2 backdrop-blur hover:bg-white shadow"
          aria-label="Resume slideshow"
          title="Resume slideshow"
        >
          <RefreshCw className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {/* Optional tiny hint */}
      <div className="mt-2 text-xs text-slate-500">
        Tip: drag the slider • use thumbnails to switch • press ← / → to navigate
      </div>
    </div>
  );
}
