'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { type DraftedPlayer, type DraftSlot } from '@/lib/store';

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
  draftSlots?: DraftSlot[];
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
  draftSlots = [],
  clubName,
  onAssign,
  onClose,
}: PlayerRosterModalProps) {
  const draftedIds = new Set(draftSlots.map((s) => s.playerId).filter(Boolean));
  const recommendedPlayers = players.filter((player) => matchesSlot(player, activeSlot));
  const otherPlayers = players.filter((player) => !matchesSlot(player, activeSlot));

  return (
    <AnimatePresence>
      {open && activeSlot ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4 backdrop-blur-sm">
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="relative z-10 w-full max-w-md rounded-t-[2rem] border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-[2rem]"
          >
            {/* Modal Header */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  <Sparkles size={11} className="text-emerald-600" /> Slot Selection
                </span>
                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                  {title}
                </h3>
                {clubName && (
                  <p className="text-xs font-semibold text-slate-500">Available from {clubName}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 active:scale-95"
                aria-label="Close roster"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Player List without photos */}
            <div className="max-h-[55vh] space-y-2.5 overflow-y-auto pr-1">
              {recommendedPlayers.length === 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
                  <ShieldAlert className="mx-auto mb-2 text-amber-600" size={24} />
                  <p className="text-sm font-bold text-amber-900">No {activeSlot.label} ({activeSlot.position}) in this club</p>
                  <p className="mt-1 text-xs text-amber-700">Select another open slot on the pitch or spin/reroll this club.</p>
                </div>
              ) : (
                recommendedPlayers.map((player) => {
                  const isDrafted = draftedIds.has(player.id);
                  return (
                    <button
                      key={player.id}
                      disabled={isDrafted}
                      onClick={() => !isDrafted && onAssign(player.id, activeSlot.id)}
                      className={`group flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all duration-150 ${
                        isDrafted
                          ? 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                          : 'border-slate-200 bg-slate-50 hover:border-emerald-500 hover:bg-emerald-50/50 hover:shadow-sm active:scale-98'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-black ${isDrafted ? 'text-slate-500' : 'text-slate-900 group-hover:text-emerald-950'}`}>
                            {player.name}
                          </p>
                          {isDrafted && (
                            <span className="flex items-center gap-0.5 rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-600">
                              <CheckCircle2 size={10} /> Drafted
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-extrabold uppercase text-emerald-700">{player.position}</span>
                          <span>•</span>
                          <span>{player.nationality || 'World'}</span>
                        </div>
                      </div>

                      {/* Overall Rating Badge */}
                      <div className="flex h-11 w-11 flex-col items-center justify-center rounded-xl border border-amber-300 bg-amber-50 text-amber-800 shadow-sm">
                        <span className="text-base font-black leading-none">{player.rating}</span>
                        <span className="text-[7px] font-black uppercase tracking-wider text-amber-700">OVR</span>
                      </div>
                    </button>
                  );
                })
              )}

              {/* Other players section */}
              {otherPlayers.length > 0 && (
                <div className="pt-2">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Other positions from {clubName || 'club'}
                  </p>
                  <div className="space-y-1.5 opacity-60">
                    {otherPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
                      >
                        <span>{player.name} ({player.position})</span>
                        <span className="font-bold text-slate-800">{player.rating}</span>
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
