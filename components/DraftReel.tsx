'use client';

import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, Shield } from 'lucide-react';
import { type ClubOption, type DraftSlot, type DraftedPlayer } from '@/lib/store';

type DraftReelProps = {
  currentRound: number;
  club: ClubOption | null;
  clubRoster: DraftedPlayer[];
  draftSlots: DraftSlot[];
  rerollsRemaining: number;
  onReroll: () => void;
  onSlotSelect: (slotId: string) => void;
};

export function DraftReel({
  currentRound,
  club,
  clubRoster,
  draftSlots,
  rerollsRemaining,
  onReroll,
  onSlotSelect,
}: DraftReelProps) {
  if (!club) return null;

  // Filter open slots
  const openSlots = draftSlots.filter((slot) => !slot.playerId);

  // Group eligible players from this club matching open slots
  const eligiblePlayers = clubRoster.filter((player) =>
    openSlots.some(
      (slot) =>
        player.category === slot.position ||
        (slot.position === 'DEF' && ['LB', 'CB', 'RB', 'LWB', 'RWB'].includes(player.position)) ||
        (slot.position === 'MID' && ['CM', 'CAM', 'LM', 'RM', 'DM'].includes(player.position)) ||
        (slot.position === 'FWD' && ['LW', 'RW', 'ST'].includes(player.position)),
    ),
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-5 shadow-2xl">
      {/* Top Round & Reroll Status */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 items-center rounded-full bg-cyan-500/10 px-2.5 text-xs font-black uppercase tracking-wider text-cyan-300 border border-cyan-500/20">
            Pick {currentRound} of 11
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {openSlots.length} left
          </span>
        </div>

        <button
          onClick={onReroll}
          disabled={rerollsRemaining <= 0}
          className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-400 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RefreshCw size={12} className={rerollsRemaining > 0 ? 'text-cyan-400' : 'text-slate-500'} />
          <span>Skip ({rerollsRemaining})</span>
        </button>
      </div>

      {/* Drawn Club Card Hero - Minimal Tactical Shield */}
      <motion.div
        key={club.id}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="my-4 flex items-center justify-between gap-4 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-3.5"
      >
        <div className="flex items-center gap-3.5">
          {/* Tactical Club Crest Badge */}
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/20 to-slate-900 shadow">
            <Shield size={16} className="text-emerald-400 mb-0.5" />
            <span className="text-[10px] font-black uppercase tracking-tight text-white">{club.shortName}</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-400">
              <Sparkles size={10} /> Drawn Club
            </div>
            <h4 className="text-base font-black tracking-tight text-white">{club.name}</h4>
            <p className="text-xs text-slate-400">Club OVR {club.baseRating}</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="rounded-xl border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-xs font-black text-amber-300">
            {eligiblePlayers.length} Fits
          </span>
        </div>
      </motion.div>

      {/* Recommended Open Slots for this Club */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Tap a position to fill:
        </p>
        <div className="flex flex-wrap gap-2">
          {openSlots.map((slot) => {
            const hasDirectFit = eligiblePlayers.some(
              (p) =>
                p.category === slot.position ||
                (slot.position === 'DEF' && ['LB', 'CB', 'RB', 'LWB', 'RWB'].includes(p.position)) ||
                (slot.position === 'MID' && ['CM', 'CAM', 'LM', 'RM', 'DM'].includes(p.position)) ||
                (slot.position === 'FWD' && ['LW', 'RW', 'ST'].includes(p.position)),
            );

            return (
              <button
                key={slot.id}
                onClick={() => onSlotSelect(slot.id)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                  hasDirectFit
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200 hover:border-emerald-400 hover:bg-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <span>{slot.label}</span>
                <span className="text-[9px] font-normal uppercase opacity-70">({slot.position})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
