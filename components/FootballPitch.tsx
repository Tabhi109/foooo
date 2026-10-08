'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utility';
import { type FormationName } from '@/lib/formations';
import { type DraftSlot, type ChemistryLink, type DraftedPlayer } from '@/lib/store';

type FootballPitchProps = {
  formation: FormationName;
  draftSlots: DraftSlot[];
  chemistryLinks: ChemistryLink[];
  activeSlotId: string | null;
  selectedPlayerForPlacement: DraftedPlayer | null;
  onSlotClick: (slotId: string) => void;
  onDropPlayer?: (playerId: string, slotId: string) => void;
};

export function FootballPitch({
  formation,
  draftSlots,
  chemistryLinks,
  activeSlotId,
  selectedPlayerForPlacement,
  onSlotClick,
  onDropPlayer,
}: FootballPitchProps) {
  const slotMap = new Map(draftSlots.map((s) => [s.id, s]));

  // Check if a slot is ideal for the currently selected player (Method 2 & 3)
  const isSlotEligibleForSelectedPlayer = (slot: DraftSlot) => {
    if (!selectedPlayerForPlacement) return false;
    if (slot.playerId) return false; // already occupied

    const p = selectedPlayerForPlacement;
    return (
      p.category === slot.position ||
      (slot.position === 'DEF' && ['LB', 'CB', 'RB', 'LWB', 'RWB'].includes(p.position)) ||
      (slot.position === 'MID' && ['CM', 'CAM', 'LM', 'RM', 'DM'].includes(p.position)) ||
      (slot.position === 'FWD' && ['LW', 'RW', 'ST'].includes(p.position))
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    const playerId = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('player-id');
    if (playerId && onDropPlayer) {
      onDropPlayer(playerId, slotId);
    }
  };

  return (
    <div className="relative mx-auto h-[460px] sm:h-[600px] w-full max-w-[420px] select-none overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border-2 border-emerald-600/30 bg-gradient-to-b from-[#064232] via-[#053326] to-[#03231a] p-2 sm:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
      {/* Stadium Light Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.14),_transparent_65%)]" />

      {/* Grass Striping Texture */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <div className="h-full w-full bg-[repeating-linear-gradient(0deg,_transparent,_transparent_35px,_rgba(0,0,0,0.35)_35px,_rgba(0,0,0,0.35)_70px)]" />
      </div>

      {/* SVG Chalk Lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="0.6" floodColor="#34d399" />
          </filter>
          <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="0.6" floodColor="#fbbf24" />
          </filter>
        </defs>

        {/* Boundary */}
        <rect x="5" y="4" width="90" height="92" rx="2" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="0.5" />

        {/* Halfway line & Center Circle */}
        <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.32)" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="11" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="0.8" fill="rgba(255,255,255,0.5)" />

        {/* Top Penalty Box */}
        <rect x="25" y="4" width="50" height="15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        <rect x="36" y="4" width="28" height="6" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
        <path d="M 40 19 A 10 10 0 0 0 60 19" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />

        {/* Bottom Penalty Box */}
        <rect x="25" y="81" width="50" height="15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        <rect x="36" y="90" width="28" height="6" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
        <path d="M 40 81 A 10 10 0 0 1 60 81" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />

        {/* Chemistry Link Lines */}
        {chemistryLinks.map((link) => {
          const slotA = slotMap.get(link.from);
          const slotB = slotMap.get(link.to);
          if (!slotA || !slotB) return null;

          let strokeColor = 'rgba(255, 255, 255, 0.15)';
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
        const isEligibleTarget = isSlotEligibleForSelectedPlayer(slot);

        return (
          <button
            key={slot.id}
            type="button"
            data-slot-id={slot.id}
            onClick={() => onSlotClick(slot.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, slot.id)}
            className={cn(
              'group absolute -translate-x-1/2 -translate-y-1/2 rounded-xl transition-all duration-150 outline-none',
              isAssigned ? 'z-20 hover:scale-105' : 'z-10 hover:scale-110',
              isActive && 'z-30 ring-4 ring-cyan-400 ring-offset-2 ring-offset-[#064232]',
              isEligibleTarget && 'z-30 ring-4 ring-amber-400 ring-offset-2 ring-offset-[#064232] animate-target-pulse',
            )}
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          >
            {isAssigned && player ? (
              /* Minimal High-Contrast Tactical Chip (No photos) */
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative flex w-[60px] sm:w-[78px] flex-col items-center rounded-lg sm:rounded-xl border border-amber-400/60 bg-white p-1 sm:p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
              >
                {/* Top Row: OVR & Slot Position */}
                <div className="flex w-full items-center justify-between border-b border-slate-100 pb-0.5 text-[8px] sm:text-[9px] font-black leading-none">
                  <span className="text-amber-600 font-black">{player.rating}</span>
                  <span className="rounded bg-slate-900 px-0.5 sm:px-1 py-[1px] sm:py-0.5 text-[6px] sm:text-[7px] font-black tracking-tight text-white">
                    {slot.label}
                  </span>
                </div>

                {/* Player Surname in Bold High-Contrast Font */}
                <p className="my-0.5 sm:my-1 w-full truncate text-center text-[9px] sm:text-[10px] font-black uppercase tracking-tight text-slate-900">
                  {player.name.split(' ').pop()}
                </p>

                {/* Bottom Row: Club & Nation Tag */}
                <div className="flex w-full items-center justify-between border-t border-slate-100 pt-0.5 text-[6px] sm:text-[7px] font-extrabold text-slate-500">
                  <span className="truncate max-w-[26px] sm:max-w-[34px]">{player.teamName?.slice(0, 4) || 'CLUB'}</span>
                  <span className="text-emerald-600 uppercase">{player.nationality?.slice(0, 3) || 'NAT'}</span>
                </div>
              </motion.div>
            ) : (
              /* Open Slot Tactical Ring with Drop Zone */
              <div
                className={cn(
                  'flex h-10 w-10 sm:h-11 sm:w-11 flex-col items-center justify-center rounded-full border-2 border-dashed transition-all',
                  isEligibleTarget
                    ? 'border-amber-400 bg-amber-400/35 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)] ring-2 ring-amber-300'
                    : isActive
                    ? 'border-cyan-300 bg-cyan-500/30 text-white shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                    : 'border-white/40 bg-slate-950/50 text-white hover:border-cyan-300 hover:bg-slate-950/70',
                )}
              >
                <span className="text-[10px] font-black tracking-tight leading-none">{slot.label}</span>
                <span className="text-[6.5px] font-black uppercase tracking-widest text-emerald-300 mt-0.5">
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
