'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
  RotateCcw,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { FootballPitch } from '@/components/FootballPitch';
import { PlayerRosterModal } from '@/components/PlayerRosterModal';
import { DraftReel } from '@/components/DraftReel';
import { MatchdaySimulation } from '@/components/MatchdaySimulation';
import { SpinnerWheel, type SpinnerWheelHandle } from '@/components/SpinnerWheel';
import { formationOrder, getFormationSlots } from '@/lib/formations';
import { useGameStore } from '@/lib/store';

const getLeagueBadge = (name: string) => {
  if (name.includes('Premier')) return { code: 'ENG', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' };
  if (name.includes('Liga')) return { code: 'ESP', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' };
  if (name.includes('Serie')) return { code: 'ITA', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' };
  if (name.includes('Bundesliga')) return { code: 'GER', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' };
  return { code: 'INT', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' };
};

export default function HomePage() {
  const {
    selectedLeagueId,
    leagueOptions,
    clubOptions,
    clubRoster,
    currentStage,
    formation,
    draftRound,
    spinResult,
    draftSlots,
    rerollsRemaining,
    activeSlotId,
    teamRating,
    teamChemistry,
    chemistryLinks,
    simulationResult,
    isLoading,
    error,
    loadLeagues,
    setSelectedLeague,
    spinFormation,
    confirmFormation,
    rerollClub,
    assignPlayerToSlot,
    selectSlot,
    finalizeDraft,
    runSimulation,
    reset,
  } = useGameStore();

  const [showRoster, setShowRoster] = useState(false);
  const formationWheelRef = useRef<SpinnerWheelHandle>(null);

  useEffect(() => {
    void loadLeagues();
  }, [loadLeagues]);

  useEffect(() => {
    if (currentStage === 'SIMULATION' && draftSlots.filter((slot) => slot.playerId).length === 11) {
      void runSimulation();
    }
  }, [currentStage, draftSlots, runSimulation]);

  const selectedLeague = useMemo(
    () => leagueOptions.find((league) => league.id === selectedLeagueId) ?? null,
    [leagueOptions, selectedLeagueId],
  );

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

  const handleFormationSpin = () => {
    formationWheelRef.current?.spin();
  };

  const getChemistryColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 40) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-slate-400 border-slate-700 bg-slate-900/60';
  };

  return (
    <main className="mx-auto max-w-5xl px-3.5 py-4 text-slate-100 sm:px-6 md:py-6">
      {/* Top Header */}
      <header className="mb-5 flex flex-col gap-3 border-b border-slate-800/80 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-300">
              <Sparkles size={10} /> Golazo XI Draft
            </span>
            {currentStage !== 'SELECT_LEAGUE' && (
              <button
                onClick={() => reset()}
                className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-2.5 py-0.5 text-[9px] font-semibold text-slate-400 hover:text-white transition"
              >
                <RotateCcw size={10} /> Restart
              </button>
            )}
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            foooo <span className="text-emerald-400">draft</span>
          </h1>
        </div>

        {/* Live HUD Stats */}
        {selectedLeague && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1">
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">League</span>
              <p className="font-extrabold text-white text-xs">{selectedLeague.name}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1">
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Shape</span>
              <p className="font-extrabold text-white text-xs">{formation}</p>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-300">
              <span className="text-[8px] font-bold uppercase tracking-wider text-amber-400/80">OVR</span>
              <p className="font-black text-xs">{teamRating > 0 ? teamRating : '—'}</p>
            </div>

            <div className={`rounded-xl border px-2.5 py-1 ${getChemistryColor(teamChemistry)}`}>
              <span className="text-[8px] font-bold uppercase tracking-wider opacity-80">Chem</span>
              <p className="font-black text-xs">{teamChemistry}%</p>
            </div>

            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-cyan-300">
              <span className="text-[8px] font-bold uppercase tracking-wider text-cyan-400/80">Squad</span>
              <p className="font-black text-xs">{filledSlots}/11</p>
            </div>
          </div>
        )}
      </header>

      {error && (
        <div className="mb-5 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          {error}
        </div>
      )}

      {/* STAGE 1: SELECT LEAGUE */}
      {currentStage === 'SELECT_LEAGUE' && (
        <section className="grid gap-5 md:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-5 shadow-2xl">
            <div className="mb-4 flex items-center gap-2.5">
              <ShieldCheck className="text-cyan-400" size={20} />
              <div>
                <h2 className="text-xl font-black text-white">Select Competition</h2>
                <p className="text-xs text-slate-400">Choose a league to draft from</p>
              </div>
            </div>

            {isLoading ? (
              <p className="py-8 text-center text-xs text-slate-400">Loading leagues...</p>
            ) : (
              <div className="grid gap-2.5 sm:grid-cols-2">
                {leagueOptions.map((league) => {
                  const badge = getLeagueBadge(league.name);
                  return (
                    <button
                      key={league.id}
                      onClick={() => void setSelectedLeague(league.id)}
                      className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-left transition-all duration-150 hover:border-emerald-400/80 hover:bg-slate-800/80 active:scale-98"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-black text-xs tracking-wider ${badge.color}`}>
                        {badge.code}
                      </div>
                      <div className="truncate">
                        <p className="font-extrabold text-sm text-white group-hover:text-emerald-300 truncate">
                          {league.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{league.country}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Minimal Rules Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 via-slate-950 to-slate-950 p-5 shadow-xl">
            <div>
              <div className="mb-3 flex items-center gap-2 text-emerald-300">
                <Trophy size={16} />
                <span className="text-xs font-black uppercase tracking-widest">How to Play</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">1</span>
                  <span><strong>Select a league</strong> with authentic superstar rosters.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">2</span>
                  <span><strong>Spin for a formation</strong> (4-3-3, 4-4-2, 3-5-2, 4-2-3-1).</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">3</span>
                  <span><strong>11-Round Draft</strong>: Each round a club is drawn. Pick 1 player for an open slot.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">4</span>
                  <span><strong>Build Chemistry</strong>: Green lines connect club and nation links!</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-[11px] text-slate-400">
              ⚡ 2 skip tokens available if you draw a difficult club!
            </div>
          </div>
        </section>
      )}

      {/* STAGE 2: SPIN FORMATION */}
      {currentStage === 'SPIN_FORMATION' && selectedLeague && (
        <section className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Stage 2</p>
                <h2 className="text-xl font-black text-white">Tactical Shape</h2>
              </div>
              <button
                onClick={handleFormationSpin}
                className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400 px-3.5 py-1.5 text-xs font-black text-slate-950 hover:bg-cyan-300 transition"
              >
                <Zap size={13} /> Spin
              </button>
            </div>

            <SpinnerWheel
              ref={formationWheelRef}
              items={formationOrder}
              getLabel={(item) => item}
              onStop={(item) => {
                useGameStore.setState({
                  formation: item,
                  draftSlots: getFormationSlots(item).map((slot) => ({
                    ...slot,
                    playerId: null,
                    player: null,
                  })),
                });
              }}
            />

            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
              <span className="text-slate-400">Selected Shape</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-black text-emerald-300">
                {formation}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-2xl">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-300">
                <CheckCircle2 size={15} />
                <span>Ready to Draft</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-2.5">
                  <span className="text-slate-400">League</span>
                  <span className="font-extrabold text-white">{selectedLeague.name}</span>
                </div>
                <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-2.5">
                  <span className="text-slate-400">Clubs in Pool</span>
                  <span className="font-extrabold text-white">{clubOptions.length} Clubs</span>
                </div>
                <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-2.5">
                  <span className="text-slate-400">Formation</span>
                  <span className="font-extrabold text-emerald-400">{formation}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => confirmFormation()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 active:scale-98 shadow-md"
            >
              Start 11-Round Draft <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* STAGE 3: PITCH DRAFT */}
      {currentStage === 'PITCH_DRAFT' && selectedLeague && (
        <section className="space-y-5">
          <div className="grid gap-5 md:grid-cols-[1.3fr_0.9fr]">
            {/* Tactical Pitch */}
            <div className="flex flex-col items-center rounded-3xl border border-slate-800/80 bg-slate-950/70 p-3 sm:p-4 shadow-2xl">
              <div className="mb-2 flex w-full items-center justify-between px-2">
                <div>
                  <h3 className="text-base font-black text-white">{formation} Tactical Board</h3>
                  <p className="text-[11px] text-slate-400">Tap open circles to place player</p>
                </div>
                {filledSlots === 11 && (
                  <button
                    onClick={() => finalizeDraft()}
                    className="flex items-center gap-1.5 rounded-full bg-cyan-400 px-3.5 py-1.5 text-xs font-black text-slate-950 hover:bg-cyan-300 animate-pulse"
                  >
                    Simulate <ArrowRight size={13} />
                  </button>
                )}
              </div>

              <FootballPitch
                formation={formation}
                draftSlots={draftSlots}
                chemistryLinks={chemistryLinks}
                activeSlotId={activeSlotId}
                onSlotClick={handleSlotClick}
              />
            </div>

            {/* Right Side: Drawn Club Reel & Controls */}
            <div className="space-y-3">
              <DraftReel
                currentRound={draftRound}
                club={spinResult}
                clubRoster={clubRoster}
                draftSlots={draftSlots}
                rerollsRemaining={rerollsRemaining}
                onReroll={rerollClub}
                onSlotSelect={handleSlotClick}
              />

              {/* Club Roster Preview */}
              {spinResult && (
                <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-4 shadow-xl">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-extrabold text-white">
                      {spinResult.name} Squad
                    </p>
                    <span className="text-[10px] text-slate-500">{clubRoster.length} Players</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {clubRoster.slice(0, 6).map((player) => {
                      const isDrafted = draftSlots.some((s) => s.playerId === player.id);
                      return (
                        <div
                          key={player.id}
                          className={`rounded-xl border p-2 text-xs ${
                            isDrafted
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                              : 'border-slate-800 bg-slate-900/50 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="truncate">{player.name.split(' ').pop()}</span>
                            <span className="text-amber-400 text-xs font-black">{player.rating}</span>
                          </div>
                          <p className="text-[10px] text-slate-400">{player.position} • {player.nationality?.slice(0, 3)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Mobile Floating Action Bar */}
          {filledSlots === 11 && (
            <div className="sticky bottom-4 z-40 rounded-2xl border border-cyan-400/40 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-cyan-300">11/11 Players Drafted!</p>
                  <p className="text-[11px] text-slate-400">OVR: {teamRating} | Chem: {teamChemistry}%</p>
                </div>
                <button
                  onClick={() => finalizeDraft()}
                  className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-cyan-300 shadow-md"
                >
                  Simulate <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* STAGE 4 & 5: SIMULATION ENGINE & RESULTS */}
      {(currentStage === 'SIMULATION' || currentStage === 'SUMMARY') && (
        <section>
          {simulationResult ? (
            <MatchdaySimulation result={simulationResult} onDraftAgain={reset} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-center shadow-2xl">
              <Zap size={28} className="animate-spin text-cyan-400 mb-3" />
              <h3 className="text-xl font-black text-white">Simulating Matchday</h3>
              <p className="mt-1 text-xs text-slate-400">Running Poisson fixture engine across {selectedLeague?.name}...</p>
            </div>
          )}
        </section>
      )}

      {/* Roster Assignment Modal */}
      <PlayerRosterModal
        open={showRoster && Boolean(activeSlot)}
        title={activeSlot ? `Assign ${activeSlot.label}` : 'Assign Player'}
        players={clubRoster}
        activeSlot={activeSlot}
        clubName={spinResult?.name}
        onAssign={handleAssign}
        onClose={() => setShowRoster(false)}
      />
    </main>
  );
}
