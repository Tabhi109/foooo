import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

type SlotLike = {
  id: string;
  label: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
};

type PlayerLike = {
  id: string;
  name: string;
  position: string;
  rating: number;
  category: 'GK' | 'DEF' | 'MID' | 'FWD';
};

type PlayerRosterModalProps = {
  open: boolean;
  title: string;
  players: PlayerLike[];
  activeSlot: SlotLike | null;
  onAssign: (playerId: string, slotId: string) => void;
  onClose: () => void;
};

function matchesSlot(player: PlayerLike, slot: SlotLike | null) {
  if (!slot) return true;

  if (slot.position === 'GK') return player.position === 'GK';
  if (slot.position === 'DEF') return ['LB', 'CB', 'RB'].includes(player.position);
  if (slot.position === 'MID') return ['CM', 'CAM', 'LM', 'RM', 'DM'].includes(player.position);
  if (slot.position === 'FWD') return ['LW', 'RW', 'ST'].includes(player.position);
  return true;
}

export function PlayerRosterModal({
  open,
  title,
  players,
  activeSlot,
  onAssign,
  onClose,
}: PlayerRosterModalProps) {
  const recommendedPlayers = players.filter((player) => matchesSlot(player, activeSlot));
  const rosterToShow = recommendedPlayers.length > 0 ? recommendedPlayers : players;

  return (
    <AnimatePresence>
      {open && activeSlot ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-3"
        >
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 170, damping: 22 }}
            className="w-full max-w-2xl rounded-t-[2rem] border border-slate-700 bg-slate-950 p-4 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Roster</p>
                <h3 className="text-xl font-bold text-white">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-200 transition hover:border-slate-500"
                aria-label="Close roster"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
              Best fits for {activeSlot.label} ({activeSlot.position})
            </div>

            <div className="space-y-2">
              {rosterToShow.map((player) => (
                <button
                  key={player.id}
                  onClick={() => onAssign(player.id, activeSlot.id)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-left transition hover:border-cyan-400 hover:bg-slate-800"
                >
                  <div>
                    <p className="font-semibold text-white">{player.name}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{player.position}</p>
                  </div>
                  <div className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-xs font-semibold text-amber-200">
                    {player.rating}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
