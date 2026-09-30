import { motion } from 'framer-motion';
import { cn } from '@/lib/utility';
import { FORMATIONS, type FormationName, type FormationSlot } from '@/lib/formations';

export type PlayerCard = {
  id: string;
  name: string;
  position: string;
  rating: number;
  category: 'GK' | 'DEF' | 'MID' | 'FWD';
  teamName: string;
};

type FootballPitchProps = {
  formation: FormationName;
  draftSlots: Array<FormationSlot & { playerId: string | null }>;
  players: PlayerCard[];
  activeSlotId: string | null;
  onSlotClick: (slotId: string) => void;
};

export function FootballPitch({ formation, draftSlots, players, activeSlotId, onSlotClick }: FootballPitchProps) {
  const slots = FORMATIONS[formation];

  return (
    <div className="pitch-surface relative mx-auto h-[680px] w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-slate-900 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_55%)]" />
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/30" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/30" />
      <div className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
      <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/10" />

      {slots.map((slot) => {
        const player = players.find((candidate) => candidate.id === draftSlots.find((draftSlot) => draftSlot.id === slot.id)?.playerId);
        const isActive = activeSlotId === slot.id;
        const assigned = Boolean(player);

        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSlotClick(slot.id)}
            className={cn(
              'group absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-2 transition',
              assigned
                ? 'border-emerald-500/40 bg-slate-950/85 text-white shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                : 'border-dashed border-cyan-300/50 bg-slate-950/45 text-slate-100',
              isActive && 'ring-2 ring-cyan-300 ring-offset-2 ring-offset-slate-900',
            )}
            style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: assigned ? '140px' : '88px' }}
          >
            <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-300">
              <span>{slot.label}</span>
              {assigned && (
                <span className="rounded-full border border-amber-300/20 bg-amber-200/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-200">
                  {player?.rating}
                </span>
              )}
            </div>

            {player ? (
              <div className="mt-2 space-y-1 text-left">
                <p className="truncate text-[10px] font-bold leading-tight">{player.name}</p>
                <p className="text-[9px] uppercase tracking-[0.14em] text-slate-400">{player.position}</p>
              </div>
            ) : (
              <div className="mt-2 text-[9px] uppercase tracking-[0.16em] text-cyan-200">Open slot</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
