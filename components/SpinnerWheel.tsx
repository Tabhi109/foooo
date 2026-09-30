import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export type SpinnerWheelHandle = {
  spin: () => void;
};

type SpinnerWheelProps<T> = {
  items: T[];
  getLabel: (item: T) => string;
  onStop: (item: T) => void;
};

export const SpinnerWheel = forwardRef<SpinnerWheelHandle, SpinnerWheelProps<any>>(
  ({ items, getLabel, onStop }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);

    const segments = useMemo(() => {
      if (items.length === 0) return [];
      return items.map((item, index) => {
        const angle = (360 / items.length) * index;
        const textAngle = angle + 360 / items.length / 2;
        return {
          item,
          angle,
          textAngle,
          label: getLabel(item),
        };
      });
    }, [items, getLabel]);

    useImperativeHandle(ref, () => ({
      spin: () => {
        if (typeof window === 'undefined') return;

        const targetIndex = Math.floor(Math.random() * items.length);
        const anglePerSegment = 360 / items.length;
        const extraTurns = 7 + Math.random() * 2;
        const targetRotation = rotation + extraTurns * 360 + (360 - ((targetIndex + 0.5) * anglePerSegment));

        setIsSpinning(true);
        setRotation(targetRotation);

        const timeout = window.setTimeout(() => {
          setIsSpinning(false);
          onStop(items[targetIndex]);
        }, 4200);

        return () => window.clearTimeout(timeout);
      },
    }));

    return (
      <div className="relative mx-auto mt-2 flex h-[280px] w-[280px] items-center justify-center">
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4.2, ease: [0.12, 0.82, 0.22, 1] }}
          className="relative h-[240px] w-[240px] rounded-full border-[10px] border-slate-800 bg-slate-900 shadow-[0_25px_60px_rgba(8,15,20,0.8)]"
          style={{
            background: items.length
              ? `conic-gradient(from 0deg, #0f172a 0deg  ${360 / items.length}deg, #1d4ed8 ${360 / items.length}deg ${2 * (360 / items.length)}deg, #0f172a ${2 * (360 / items.length)}deg ${3 * (360 / items.length)}deg, #1e293b ${3 * (360 / items.length)}deg 360deg)`
              : '#0f172a',
          }}
        >
          {segments.map(({ item, textAngle, label }) => {
            const rad = (textAngle * Math.PI) / 180;
            const x = 50 + Math.cos(rad) * 34;
            const y = 50 + Math.sin(rad) * 34;
            return (
              <div
                key={`${label}-${item.id ?? label}`}
                className="wheel-segment"
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%) rotate(90deg)' }}
              >
                {label}
              </div>
            );
          })}

          <div className="absolute inset-6 rounded-full border border-slate-700 bg-slate-950/80" />
          <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-cyan-300 bg-slate-950 text-sm font-black text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.5)]">
            {isSpinning ? '...' : 'GO'}
          </div>
        </motion.div>

        <div className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[14px] border-b-[26px] border-x-transparent border-b-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]" />
      </div>
    );
  },
);

SpinnerWheel.displayName = 'SpinnerWheel';
