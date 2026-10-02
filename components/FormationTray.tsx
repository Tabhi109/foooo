'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Check, Sparkles } from 'lucide-react';
import { formationOrder, type FormationName } from '@/lib/formations';

type FormationTrayProps = {
  selectedFormation: FormationName;
  onSelect: (formation: FormationName) => void;
};

export function FormationTray({ selectedFormation, onSelect }: FormationTrayProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    let counter = 0;
    const totalSteps = 20 + Math.floor(Math.random() * 10);
    const speed = 70;

    const interval = setInterval(() => {
      counter += 1;
      const randomIndex = Math.floor(Math.random() * formationOrder.length);
      const chosen = formationOrder[randomIndex];
      onSelect(chosen);

      if (counter >= totalSteps) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, speed);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Horizontal Carousel Tray */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto no-scrollbar py-3 px-1 flex items-center justify-start sm:justify-center gap-3 snap-x snap-mandatory"
      >
        {formationOrder.map((fmt) => {
          const isSelected = selectedFormation === fmt;

          return (
            <motion.button
              key={fmt}
              type="button"
              onClick={() => onSelect(fmt)}
              disabled={isSpinning}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`relative flex shrink-0 snap-center flex-col items-center justify-center rounded-2xl p-4 transition-all duration-200 outline-none w-28 sm:w-32 ${
                isSelected
                  ? 'border-2 border-emerald-500 bg-white shadow-[0_12px_28px_rgba(16,185,129,0.22)] ring-4 ring-emerald-500/10'
                  : 'border border-slate-200 bg-white/90 shadow-sm hover:border-slate-300 hover:bg-white text-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2.5 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                  <Check size={11} strokeWidth={3} />
                </div>
              )}

              <span className={`text-base font-black tracking-tight ${isSelected ? 'text-emerald-600' : 'text-slate-800'}`}>
                {fmt}
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Formation
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Spin Formation Button */}
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl active:scale-95 disabled:opacity-50"
        >
          <Zap size={14} className={isSpinning ? 'animate-spin text-amber-400' : 'text-amber-400'} />
          <span>{isSpinning ? 'Spinning Shapes...' : 'Spin Formation'}</span>
        </button>
      </div>
    </div>
  );
}
