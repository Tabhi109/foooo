'use client';

import { useMemo, useRef, useState } from 'react';
import { ArrowRight, CircleDollarSign, ShieldCheck, Sparkles, Trophy, Zap } from 'lucide-react';
import { FootballPitch } from '@/components/FootballPitch';
import { PlayerRosterModal } from '@/components/PlayerRosterModal';
import { SpinnerWheel, type SpinnerWheelHandle } from '@/components/SpinnerWheel';
import { getClubRoster, useGameStore } from '@/lib/store';

export default function HomePage() {
  const {
    selectedLeagueId,
    leagueOptions,
    currentStage,
    formation,
    spinResult,
    draftSlots,
    rerollsRemaining,
    activeSlotId,
    setSelectedLeague,
    spinFormation,
    spinClub,
    rerollClub,
    assignPlayerToSlot,
    selectSlot,
    finalizeDraft,
  } = useGameStore();

  const [showRoster, setShowRoster] = useState(false);
  const wheelRef = useRef<SpinnerWheelHandle>(null);

  const selectedLeague = leagueOptions.find((league) => league.id === selectedLeagueId) ?? leagueOptions[0];
  const clubRoster = useMemo(() => (spinResult ? getClubRoster(spinResult.id) : []), [spinResult]);

  const activeSlot = draftSlots.find((slot) => slot.id === activeSlotId) ?? null;
  const filledSlots = draftSlots.filter((slot) => slot.playerId).length;

  const handleSlotClick = (slotId: string) => {
    selectSlot(slotId);
    setShowRoster(true);
  };

  const handleAssign = (playerId: string, slotId: string) => {
    assignPlayerToSlot(playerId, slotId);
    setShowRoster(false);
  };

  const leagueCards = leagueOptions.map((league) => (
    <button
      key={league.id}
      onClick={() => setSelectedLeague(league.id)}
      className="group flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-3 text-left transition hover:border-cyan-400 hover:bg-slate-800"
    >
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-slate-800">
        <img src={league.logoUrl} alt={league.name} className="h-full w-full object-cover" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{league.name}</p>
        <p className="text-xs text-slate-400">{league.country}</p>
      </div>
    </button>
  ));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 text-slate-100 md:px-8">
      <div className="mb-8 flex flex-col gap-5 border-b border-slate-800 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
            <Sparkles size={12} /> Free-to-play draft
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">foooo</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">League</div>
            <div className="font-medium text-white">{selectedLeague.name}</div>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Formation</div>
            <div className="font-medium text-white">{formation}</div>
          </div>
        </div>
      </div>

      {currentStage === 'SELECT_LEAGUE' && (
        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-glow">
            <div className="mb-5 flex items-center gap-3">
              <ShieldCheck className="text-cyan-300" />
              <h2 className="text-2xl font-bold text-white">Select a league</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">{leagueCards}</div>
          </div>

          <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/10 p-6">
            <div className="mb-4 flex items-center gap-3 text-emerald-300">
              <Trophy size={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Draft loop</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex gap-3"><span className="text-cyan-300">1.</span> Choose a league</li>
              <li className="flex gap-3"><span className="text-cyan-300">2.</span> Spin for a formation</li>
              <li className="flex gap-3"><span className="text-cyan-300">3.</span> Draft an 11-man XI from a spun club</li>
              <li className="flex gap-3"><span className="text-cyan-300">4.</span> Simulate a season and get your table rank</li>
            </ul>
          </div>
        </section>
      )}

      {currentStage === 'SPIN_FORMATION' && (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Stage 2</p>
                <h2 className="text-2xl font-bold text-white">Formation spin</h2>
              </div>
              <button
                onClick={spinFormation}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                <Zap size={16} /> Spin
              </button>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
                <span>Current format</span>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-300">{formation}</span>
              </div>
              <p className="text-sm text-slate-400">Each spin determines the tactical shape you must draft into.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <div className="mb-4 flex items-center gap-2 text-cyan-300">
              <CircleDollarSign size={18} />
              <span className="text-xs uppercase tracking-[0.24em]">League snapshot</span>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <span>League</span>
                <span className="font-semibold text-white">{selectedLeague.name}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <span>Country</span>
                <span>{selectedLeague.country}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <span>Available rerolls</span>
                <span>{rerollsRemaining}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {currentStage === 'PITCH_DRAFT' && (
        <section className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.2fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stage 3</p>
                  <h2 className="text-xl font-bold text-white">Club spin</h2>
                </div>
                <button
                  onClick={() => wheelRef.current?.spin()}
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Spin club
                </button>
              </div>
              <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
                <span>Rerolls</span>
                <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-1 text-cyan-300">{rerollsRemaining}/2</span>
              </div>

              <SpinnerWheel
                ref={wheelRef}
                items={useGameStore.getState().clubOptions.filter((club) => club.leagueId === selectedLeagueId)}
                getLabel={(club) => club.shortName}
                onStop={(club) => {
                  useGameStore.setState({ spinResult: club });
                }}
              />

              {spinResult && (
                <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-800">
                      <img src={spinResult.logoUrl} alt={spinResult.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Spun club</p>
                      <p className="font-semibold text-white">{spinResult.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={rerollClub}
                    disabled={rerollsRemaining <= 0}
                    className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reroll
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pitch draft</p>
                  <h2 className="text-xl font-bold text-white">{formation} setup</h2>
                </div>
                <button
                  onClick={finalizeDraft}
                  disabled={filledSlots < 11}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Simulate <ArrowRight size={16} />
                </button>
              </div>

              <FootballPitch
                formation={formation}
                draftSlots={draftSlots}
                players={clubRoster}
                activeSlotId={activeSlotId}
                onSlotClick={handleSlotClick}
              />
            </div>
          </div>

          {spinResult && (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Club roster</p>
                  <h3 className="text-xl font-bold text-white">{spinResult.name}</h3>
                </div>
                <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  {filledSlots}/11 assigned
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {clubRoster.map((player) => {
                  const isAssigned = draftSlots.some((slot) => slot.playerId === player.id);
                  return (
                    <div
                      key={player.id}
                      className={`rounded-2xl border p-3 transition ${
                        isAssigned ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100' : 'border-slate-800 bg-slate-900/50 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{player.name}</p>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{player.position}</p>
                        </div>
                        <div className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-200">
                          {player.rating}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      <PlayerRosterModal
        open={showRoster && Boolean(activeSlot)}
        title={activeSlot ? `Assign ${activeSlot.label}` : 'Assign player'}
        players={clubRoster}
        activeSlot={activeSlot}
        onAssign={handleAssign}
        onClose={() => setShowRoster(false)}
      />
    </main>
  );
}
