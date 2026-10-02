'use client';

import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, Shield, Disc3, GripVertical, CheckCircle2 } from 'lucide-react';
import { type ClubOption, type DraftSlot, type DraftedPlayer } from '@/lib/store';

type DraftReelProps = {
  currentRound: number;
  club: ClubOption | null;
  clubRoster: DraftedPlayer[];
  draftSlots: DraftSlot[];
  selectedPlayerForPlacement: DraftedPlayer | null;
  rerollsRemaining: number;
  onSpinClub: () => void;
  onReroll: () => void;
  onSelectPlayer: (player: DraftedPlayer) => void;
  onSlotSelect: (slotId: string) => void;
};

export function DraftReel({
  currentRound,
  club,
  clubRoster,
  draftSlots,
  selectedPlayerForPlacement,
  rerollsRemaining,
  onSpinClub,
  onReroll,
  onSelectPlayer,
  onSlotSelect,
}: DraftReelProps) {
  if (!club) return null;

  // Filter open slots
  const openSlots = draftSlots.filter((slot) => !slot.playerId);

  // Set of already drafted player IDs to strictly prevent duplicates
  const draftedIds = new Set(draftSlots.map((s) => s.playerId).filter(Boolean));

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      {/* Top Controls: Round Counter & Spin Button */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 items-center rounded-full bg-slate-900 px-3 text-xs font-black uppercase tracking-wider text-white shadow-sm">
            Pick {currentRound} of 11
          </span>
          <span className="text-xs font-bold text-slate-400">
            {openSlots.length} slots left
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Spin Next Club Button */}
          <button
            type="button"
            onClick={onSpinClub}
            className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100 hover:border-emerald-500 active:scale-95"
            title="Spin another club from competition"
          >
            <Disc3 size={13} className="text-emerald-600 animate-spin" />
            <span>Spin Club</span>
          </button>

          {/* Skip/Reroll Token */}
          <button
            type="button"
            onClick={onReroll}
            disabled={rerollsRemaining <= 0}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw size={11} className={rerollsRemaining > 0 ? 'text-amber-500' : 'text-slate-400'} />
            <span>Skip ({rerollsRemaining})</span>
          </button>
        </div>
      </div>

      {/* Drawn Club Header */}
      <motion.div
        key={club.id}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="my-3.5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-col items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 shadow-sm">
            <Shield size={15} className="text-emerald-600 mb-0.5" />
            <span className="text-[9px] font-black uppercase">{club.shortName}</span>
          </div>

          <div>
            <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-600">
              <Sparkles size={10} /> Active Club
            </div>
            <h4 className="text-base font-black tracking-tight text-slate-900">{club.name}</h4>
          </div>
        </div>

        <div className="text-right">
          <span className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-black text-slate-700 shadow-xs">
            OVR {club.baseRating}
          </span>
        </div>
      </motion.div>

      {/* Player Roster for this Club: Tap or Drag to Pitch */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Available Players (Tap or Drag to Pitch):
          </p>
          {selectedPlayerForPlacement && (
            <span className="text-[10px] font-extrabold text-amber-600 animate-pulse">
              Tap matching position on pitch!
            </span>
          )}
        </div>

        <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
          {clubRoster.map((player) => {
            const isDrafted = draftedIds.has(player.id);
            const isSelected = selectedPlayerForPlacement?.id === player.id;

            return (
              <div
                key={player.id}
                draggable={!isDrafted}
                onDragStart={(e) => {
                  if (isDrafted) return;
                  e.dataTransfer.setData('text/plain', player.id);
                  e.dataTransfer.setData('player-id', player.id);
                  onSelectPlayer(player);
                }}
                onClick={() => {
                  if (!isDrafted) onSelectPlayer(player);
                }}
                className={`group flex items-center justify-between rounded-xl border p-2.5 transition-all select-none ${
                  isDrafted
                    ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                    : isSelected
                    ? 'border-2 border-amber-500 bg-amber-50/80 shadow-sm cursor-pointer'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50 cursor-grab active:cursor-grabbing shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GripVertical size={13} className={isDrafted ? 'text-slate-300' : 'text-slate-400 group-hover:text-slate-600'} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-black ${isDrafted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {player.name}
                      </p>
                      {isDrafted && (
                        <span className="flex items-center gap-0.5 rounded bg-slate-200 px-1 py-0.2 text-[8px] font-black text-slate-500">
                          <CheckCircle2 size={8} /> DRAFTED
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400">
                      <span className="text-cyan-600 font-extrabold uppercase">{player.position}</span> • {player.nationality}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-black text-amber-600">
                    {player.rating}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
