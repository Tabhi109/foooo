'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utility';
import { type FormationName } from '@/lib/formations';
import { type DraftSlot, type ChemistryLink } from '@/lib/store';

type FootballPitchProps = {
  formation: FormationName;
  draftSlots: DraftSlot[];
  chemistryLinks: ChemistryLink[];
  activeSlotId: string | null;
  onSlotClick: (slotId: string) => void;
};

export function FootballPitch({
  formation,
  draftSlots,
  chemistryLinks,
  activeSlotId,
  onSlotClick,
}: FootballPitchProps) {
  const slotMap = new Map(draftSlots.map((s) => [s.id, s]));

  return (
    <div className="relative mx-auto h-[620px] w-full max-w-[430px] select-none overflow-hidden rounded-[2rem] border border-emerald-500/25 bg-gradient-to-b from-[#063327] via-[#052b21] to-[#042018] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
      {/* Stadium Floodlight Radials */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.04),_transparent_70%)]" />

      {/* Turf Striping */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <div className="h-full w-full bg-[repeating-linear-gradient(0deg,_transparent,_transparent_35px,_rgba(0,0,0,0.3)_35px,_rgba(0,0,0,0.3)_70px)]" />
      </div>

      {/* Pitch Chalk Lines SVG */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="0.6" floodColor="#10b981" />
          </filter>
          <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="0.6" floodColor="#f59e0b" />
          </filter>
        </defs>

        {/* Boundary */}
        <rect x="5" y="4" width="90" height="92" rx="2" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" />

        {/* Halfway line & Center Circle */}
        <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="11" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="0.8" fill="rgba(255,255,255,0.4)" />

        {/* Top Penalty Box (Opponent End) */}
        <rect x="25" y="4" width="50" height="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <rect x="36" y="4" width="28" height="6" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
        <path d="M 40 19 A 10 10 0 0 0 60 19" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

        {/* Bottom Penalty Box (Our GK End) */}
        <rect x="25" y="81" width="50" height="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <rect x="36" y="90" width="28" height="6" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
        <path d="M 40 81 A 10 10 0 0 1 60 81" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

        {/* Corner Arcs */}
        <path d="M 5 6 A 2 2 0 0 0 7 4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <path d="M 95 6 A 2 2 0 0 1 93 4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <path d="M 5 94 A 2 2 0 0 1 7 96" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <path d="M 95 94 A 2 2 0 0 0 93 96" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

        {/* Chemistry Link Lines */}
        {chemistryLinks.map((link) => {
          const slotA = slotMap.get(link.from);
          const slotB = slotMap.get(link.to);
          if (!slotA || !slotB) return null;

          let strokeColor = 'rgba(100, 116, 139, 0.25)';
          let strokeWidth = '0.4';
          let filter = '';
          let strokeDasharray = '1 1';

          if (link.strength === 'strong') {
            strokeColor = '#10b981';
            strokeWidth = '0.9';
            filter = 'url(#greenGlow)';
            strokeDasharray = 'none';
          } else if (link.strength === 'medium') {
            strokeColor = '#f59e0b';
            strokeWidth = '0.8';
            filter = 'url(#amberGlow)';
            strokeDasharray = 'none';
          } else if (link.strength === 'weak') {
            strokeColor = '#94a3b8';
            strokeWidth = '0.5';
            strokeDasharray = 'none';
          }

          return (
            <line
              key={`${link.from}-${link.to}`}
              x1={slotA.x}
              y1={slotA.y}
              x2={slotB.x}
              y2={slotB.y}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              filter={filter}
            />
          );
        })}
      </svg>

      {/* Formation Slots */}
      {draftSlots.map((slot) => {
        const player = slot.player;
        const isActive = activeSlotId === slot.id;
        const isAssigned = Boolean(player);

        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSlotClick(slot.id)}
            className={cn(
              'group absolute -translate-x-1/2 -translate-y-1/2 rounded-xl transition-all duration-200 outline-none',
              isAssigned
                ? 'z-20 scale-100 hover:scale-105'
                : 'z-10 hover:scale-110',
              isActive && 'z-30 ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#063327]',
            )}
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          >
            {isAssigned && player ? (
              /* Golazo FUT-Style Compact Shield Card */
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative flex w-[70px] flex-col items-center rounded-xl border border-amber-400/40 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950 p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:w-[78px]"
              >
                {/* Top Badge: Rating & Position */}
                <div className="flex w-full items-center justify-between px-0.5 text-[10px] font-black leading-none">
                  <span className="text-amber-400">{player.rating}</span>
                  <span className="rounded bg-slate-800/80 px-1 py-0.5 text-[8px] font-bold tracking-tight text-slate-300">
                    {slot.label}
                  </span>
                </div>

                {/* Player Photo Portrait */}
                <div className="my-1 h-9 w-9 overflow-hidden rounded-full border border-amber-400/30 bg-slate-800 shadow-inner">
                  <img
                    src={player.photoUrl || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=150&q=80'}
                    alt={player.name}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                {/* Player Name */}
                <p className="w-full truncate text-center text-[9px] font-extrabold tracking-tight text-white">
                  {player.name.split(' ').pop()}
                </p>

                {/* Nation & Club Line */}
                <div className="mt-0.5 flex w-full items-center justify-center gap-1 text-[7px] text-slate-400">
                  <span className="truncate font-semibold uppercase">{player.nationality?.slice(0, 3) || 'NAT'}</span>
                </div>
              </motion.div>
            ) : (
              /* Open Slot Tactical Ring */
              <div
                className={cn(
                  'flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 border-dashed transition-all',
                  isActive
                    ? 'border-cyan-300 bg-cyan-500/25 text-white shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                    : 'border-white/35 bg-slate-950/60 text-slate-200 hover:border-cyan-300 hover:bg-slate-950/80',
                )}
              >
                <span className="text-[11px] font-black tracking-tight">{slot.label}</span>
                <span className="text-[7px] font-semibold uppercase tracking-widest text-emerald-300">
                  {slot.position}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
