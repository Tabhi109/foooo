'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, ShieldAlert, Sparkles } from 'lucide-react';
import { type DraftedPlayer } from '@/lib/store';

type SlotLike = {
  id: string;
  label: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
};

type PlayerRosterModalProps = {
  open: boolean;
  title: string;
  players: DraftedPlayer[];
  activeSlot: SlotLike | null;
  clubName?: string;
  onAssign: (playerId: string, slotId: string) => void;
  onClose: () => void;
};

function matchesSlot(player: DraftedPlayer, slot: SlotLike | null) {
  if (!slot) return true;

  if (slot.position === 'GK') return player.position === 'GK';
  if (slot.position === 'DEF') return ['LB', 'CB', 'RB', 'LWB', 'RWB'].includes(player.position);
  if (slot.position === 'MID') return ['CM', 'CAM', 'LM', 'RM', 'DM'].includes(player.position);
  if (slot.position === 'FWD') return ['LW', 'RW', 'ST'].includes(player.position);
  return true;
}

export function PlayerRosterModal({
  open,
  title,
  players,
  activeSlot,
  clubName,
  onAssign,
  onClose,
}: PlayerRosterModalProps) {
  const recommendedPlayers = players.filter((player) => matchesSlot(player, activeSlot));
  const otherPlayers = players.filter((player) => !matchesSlot(player, activeSlot));

  return (
    <AnimatePresence>
      {open && activeSlot ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 p-0 sm:items-center sm:p-4 backdrop-blur-sm">
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 25 }}
            className="relative z-10 w-full max-w-lg rounded-t-[2.5rem] border border-slate-700/80 bg-slate-950 p-5 shadow-2xl sm:rounded-[2rem]"
          >
            {/* Modal Header */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                  <Sparkles size={11} /> Draft Pick
                </span>
                <h3 className="mt-1 text-xl font-black tracking-tight text-white">
                  {title}
                </h3>
                {clubName && (
                  <p className="text-xs font-semibold text-slate-400">Available from {clubName}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                aria-label="Close roster"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Player List */}
            <div className="max-h-[55vh] space-y-2.5 overflow-y-auto pr-1">
              {recommendedPlayers.length === 0 ? (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-center">
                  <ShieldAlert className="mx-auto mb-2 text-amber-300" size={24} />
                  <p className="text-sm font-semibold text-amber-200">No natural {activeSlot.label} ({activeSlot.position}) in this club</p>
                  <p className="mt-1 text-xs text-slate-400">Try selecting another position on the pitch or reroll this club.</p>
                </div>
              ) : (
                recommendedPlayers.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => onAssign(player.id, activeSlot.id)}
                    className="group flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-left transition-all duration-150 hover:border-cyan-400/80 hover:bg-slate-800/90 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                  >
                    <div className="flex items-center gap-3">
                      {/* Player Avatar */}
                      <div className="h-11 w-11 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow">
                        <img
                          src={player.photoUrl || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=150&q=80'}
                          alt={player.name}
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <p className="font-extrabold text-white group-hover:text-cyan-200">{player.name}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-bold uppercase tracking-wider text-cyan-400">{player.position}</span>
                          <span>•</span>
                          <span>{player.nationality || 'World'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Overall Rating Badge */}
                    <div className="flex h-10 w-10 flex-col items-center justify-center rounded-xl border border-amber-400/40 bg-gradient-to-b from-amber-400/20 to-amber-500/10 text-amber-300">
                      <span className="text-sm font-black leading-none">{player.rating}</span>
                      <span className="text-[7px] font-bold uppercase tracking-wider text-amber-400/80">OVR</span>
                    </div>
                  </button>
                ))
              )}

              {/* Other players section if user wants to see */}
              {otherPlayers.length > 0 && (
                <div className="pt-2">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Other positions from {clubName || 'club'}
                  </p>
                  <div className="space-y-1.5 opacity-60">
                    {otherPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/30 px-3 py-2 text-xs text-slate-400"
                      >
                        <span>{player.name} ({player.position})</span>
                        <span className="font-semibold text-slate-300">{player.rating}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
