'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
  RotateCcw,
  CheckCircle2,
  Shield,
  Dices,
  Flame,
} from 'lucide-react';
import { FootballPitch } from '@/components/FootballPitch';
import { PlayerRosterModal } from '@/components/PlayerRosterModal';
import { DraftReel } from '@/components/DraftReel';
import { MatchdaySimulation } from '@/components/MatchdaySimulation';
import { FormationTray } from '@/components/FormationTray';
import { formationOrder, getFormationSlots } from '@/lib/formations';
import { useGameStore } from '@/lib/store';

const RANDOM_NAMES = [
  'Abhi FC',
  'Titan Rovers',
  'Vanguard United',
  'Apex SC',
  'Phoenix City',
  'Mavericks XI',
  'Olympus FC',
  'Stallions Athletic',
  'Dynasty FC',
  'Red Star FC',
];

const getLeagueBadge = (name: string) => {
  if (name.includes('Premier')) return { code: 'ENG', color: 'border-purple-200 bg-purple-50 text-purple-700' };
  if (name.includes('Liga')) return { code: 'ESP', color: 'border-amber-200 bg-amber-50 text-amber-800' };
  if (name.includes('Serie')) return { code: 'ITA', color: 'border-blue-200 bg-blue-50 text-blue-700' };
  if (name.includes('Bundesliga')) return { code: 'GER', color: 'border-rose-200 bg-rose-50 text-rose-700' };
  return { code: 'INT', color: 'border-emerald-200 bg-emerald-50 text-emerald-800' };
};

export default function HomePage() {
  const {
    teamName,
    setTeamName,
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
    selectedPlayerForPlacement,
    setSelectedPlayerForPlacement,
    teamRating,
    teamChemistry,
    chemistryLinks,
    simulationResult,
    isLoading,
    error,
    loadLeagues,
    setSelectedLeague,
    confirmFormation,
    spinClub,
    rerollClub,
    assignPlayerToSlot,
    selectSlot,
    finalizeDraft,
    runSimulation,
    reset,
  } = useGameStore();

  const [inputName, setInputName] = useState(teamName || 'Abhi FC');
  const [showRoster, setShowRoster] = useState(false);

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

  const handleRandomizeName = () => {
    const nextName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    setInputName(nextName);
  };

  const handleStartFranchise = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = inputName.trim() || 'Abhi FC';
    setTeamName(finalName);
  };

  const handleSlotClick = (slotId: string) => {
    // If a player from the reel is already selected, drop them into this slot
    if (selectedPlayerForPlacement) {
      assignPlayerToSlot(selectedPlayerForPlacement.id, slotId);
      setSelectedPlayerForPlacement(null);
      return;
    }

    // Otherwise open the roster modal for this specific slot
    selectSlot(slotId);
    setShowRoster(true);
  };

  const handleAssignFromModal = (playerId: string, slotId: string) => {
    assignPlayerToSlot(playerId, slotId);
    setShowRoster(false);
  };

  const handleDropPlayer = (playerId: string, slotId: string) => {
    assignPlayerToSlot(playerId, slotId);
    setSelectedPlayerForPlacement(null);
  };

  const getChemistryColor = (score: number) => {
    if (score >= 70) return 'text-emerald-700 border-emerald-300 bg-emerald-50';
    if (score >= 40) return 'text-amber-800 border-amber-300 bg-amber-50';
    return 'text-slate-600 border-slate-200 bg-slate-100';
  };

  return (
    <main className="mx-auto max-w-5xl px-3.5 py-4 text-slate-800 sm:px-6 md:py-6">
      {/* Top Header */}
      <header className="mb-5 flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-100 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800">
              <Sparkles size={11} className="text-emerald-600" /> foooo XI Draft
            </span>

            {teamName && (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                <Shield size={10} className="text-emerald-600" /> {teamName}
              </span>
            )}

            {currentStage !== 'ENTER_NAME' && currentStage !== 'SELECT_LEAGUE' && (
              <button
                onClick={() => reset()}
                className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 transition active:scale-95"
              >
                <RotateCcw size={10} /> Restart
              </button>
            )}
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            foooo <span className="text-emerald-600">draft</span>
          </h1>
        </div>

        {/* Live HUD Stats */}
        {selectedLeague && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1">
              <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">League</span>
              <p className="font-black text-slate-900 text-xs">{selectedLeague.name}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1">
              <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Shape</span>
              <p className="font-black text-emerald-700 text-xs">{formation}</p>
            </div>

            <div className="rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1 text-amber-900">
              <span className="text-[8px] font-black uppercase tracking-wider text-amber-700">OVR</span>
              <p className="font-black text-xs">{teamRating > 0 ? teamRating : '—'}</p>
            </div>

            <div className={`rounded-xl border px-2.5 py-1 ${getChemistryColor(teamChemistry)}`}>
              <span className="text-[8px] font-black uppercase tracking-wider opacity-80">Chem</span>
              <p className="font-black text-xs">{teamChemistry}%</p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
              <span className="text-[8px] font-black uppercase tracking-wider text-emerald-600">Squad</span>
              <p className="font-black text-xs">{filledSlots}/11</p>
            </div>
          </div>
        )}
      </header>

      {error && (
        <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800 font-semibold shadow-xs">
          {error}
        </div>
      )}

      {/* STAGE 0: ENTER FRANCHISE NAME */}
      {currentStage === 'ENTER_NAME' && (
        <section className="mx-auto max-w-xl py-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-100">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm">
                <Shield size={28} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Name Your Franchise</h2>
              <p className="mt-1 text-xs text-slate-500">
                Build your dream tactical XI and compete for the league championship.
              </p>
            </div>

            <form onSubmit={handleStartFranchise} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">
                  Club / Team Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="e.g. Abhi FC, Galacticos XI"
                    maxLength={24}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleRandomizeName}
                    title="Randomize club name"
                    className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-200 active:scale-95"
                  >
                    <Dices size={16} className="text-emerald-600" />
                    <span className="hidden sm:inline">Random</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-500 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <Sparkles size={13} className="text-emerald-600" />
                  <span>Interactive Draft Rules:</span>
                </div>
                <p>• Horizontal formation carousel with instant spin.</p>
                <p>• 11 rounds of club draws with mid-draft club spinning.</p>
                <p>• Method 1: Tap slot, Method 2: Tap player, Method 3: Drag & drop!</p>
                <p>• Full season Poisson matchday simulation with goal timeline.</p>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 active:scale-98"
              >
                Enter Draft Arena <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </section>
      )}

      {/* STAGE 1: SELECT LEAGUE */}
      {currentStage === 'SELECT_LEAGUE' && (
        <section className="grid gap-5 md:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-100">
            <div className="mb-4 flex items-center gap-2.5">
              <ShieldCheck className="text-emerald-600" size={22} />
              <div>
                <h2 className="text-xl font-black text-slate-900">Select Competition</h2>
                <p className="text-xs text-slate-500">Pick a domestic league with real rosters & ratings</p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <Zap size={20} className="animate-spin text-emerald-600 mx-auto mb-2" />
                Loading leagues...
              </div>
            ) : (
              <div className="grid gap-2.5 sm:grid-cols-2">
                {leagueOptions.map((league) => {
                  const badge = getLeagueBadge(league.name);
                  return (
                    <button
                      key={league.id}
                      onClick={() => void setSelectedLeague(league.id)}
                      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-left transition-all duration-150 hover:border-emerald-500 hover:bg-emerald-50/40 hover:shadow-sm active:scale-98"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-black text-xs tracking-wider ${badge.color}`}>
                        {badge.code}
                      </div>
                      <div className="truncate">
                        <p className="font-black text-sm text-slate-900 group-hover:text-emerald-950 truncate">
                          {league.name}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-500">{league.country}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Minimal Rules Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-100">
            <div>
              <div className="mb-3 flex items-center gap-2 text-emerald-700">
                <Trophy size={16} className="text-emerald-600" />
                <span className="text-xs font-black uppercase tracking-wider">Draft Strategy</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-800">1</span>
                  <span><strong>Select Competition</strong>: Verified top European leagues with authentic stars.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-800">2</span>
                  <span><strong>Horizontal Formation Spin</strong>: Carousel tray with 6 verified shapes.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-800">3</span>
                  <span><strong>11-Round Draft</strong>: Draw a club every round or spin for another club.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-800">4</span>
                  <span><strong>Triple Placement</strong>: Click slot, click player, or drag-and-drop!</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-2.5 text-[11px] font-bold text-emerald-800">
              ⚡ 2 Skip Tokens available to reroll difficult clubs!
            </div>
          </div>
        </section>
      )}

      {/* STAGE 2: SPIN FORMATION (HORIZONTAL TRAY) */}
      {currentStage === 'SPIN_FORMATION' && selectedLeague && (
        <section className="grid gap-5 md:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-100 flex flex-col justify-center">
            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Step 2 • Formation</span>
              <h2 className="text-xl font-black text-slate-900">Choose or Spin Your Tactical Shape</h2>
              <p className="text-xs text-slate-500">Tap any formation card or hit Spin Formation to randomly rotate.</p>
            </div>

            <FormationTray
              selectedFormation={formation}
              onSelect={(fmt) => {
                useGameStore.setState({
                  formation: fmt,
                  draftSlots: getFormationSlots(fmt).map((slot) => ({
                    ...slot,
                    playerId: null,
                    player: null,
                  })),
                });
              }}
            />
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-100">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Franchise Summary</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="text-slate-500 font-medium">Franchise</span>
                  <span className="font-black text-slate-900">{teamName || 'Your XI'}</span>
                </div>
                <div className="flex justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="text-slate-500 font-medium">League</span>
                  <span className="font-black text-slate-900">{selectedLeague.name}</span>
                </div>
                <div className="flex justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="text-slate-500 font-medium">Clubs in Pool</span>
                  <span className="font-black text-slate-900">{clubOptions.length} Clubs</span>
                </div>
                <div className="flex justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="text-slate-500 font-medium">Active Formation</span>
                  <span className="font-black text-emerald-700">{formation}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => confirmFormation()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500 active:scale-98"
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
            {/* Tactical Pitch Container */}
            <div className="flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xl shadow-slate-100">
              <div className="mb-2 flex w-full items-center justify-between px-2">
                <div>
                  <h3 className="text-base font-black text-slate-900">{formation} Tactical Board</h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    {selectedPlayerForPlacement
                      ? `Tap a pulsing position to place ${selectedPlayerForPlacement.name}`
                      : 'Tap slot, tap player, or drag-and-drop to place'}
                  </p>
                </div>
                {filledSlots === 11 && (
                  <button
                    onClick={() => finalizeDraft()}
                    className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500 animate-pulse"
                  >
                    Simulate Season <ArrowRight size={13} />
                  </button>
                )}
              </div>

              <FootballPitch
                formation={formation}
                draftSlots={draftSlots}
                chemistryLinks={chemistryLinks}
                activeSlotId={activeSlotId}
                selectedPlayerForPlacement={selectedPlayerForPlacement}
                onSlotClick={handleSlotClick}
                onDropPlayer={handleDropPlayer}
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
                selectedPlayerForPlacement={selectedPlayerForPlacement}
                onSelectPlayer={(player) => setSelectedPlayerForPlacement(player)}
                onSpinClub={() => spinClub()}
                onReroll={rerollClub}
                onSlotSelect={handleSlotClick}
              />

              {/* Club Roster Preview */}
              {spinResult && (
                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-black text-slate-900">
                      {spinResult.name} Available Roster
                    </p>
                    <span className="text-[10px] font-bold text-slate-400">{clubRoster.length} Players</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {clubRoster.slice(0, 6).map((player) => {
                      const isDrafted = draftSlots.some((s) => s.playerId === player.id);
                      return (
                        <div
                          key={player.id}
                          className={`rounded-xl border p-2 text-xs ${
                            isDrafted
                              ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950 font-bold'
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="truncate">{player.name.split(' ').pop()}</span>
                            <span className="text-amber-700 text-xs font-black">{player.rating}</span>
                          </div>
                          <p className="text-[10px] font-semibold text-slate-400">
                            {player.position} • {player.nationality?.slice(0, 3)}
                          </p>
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
            <div className="sticky bottom-4 z-40 rounded-2xl border border-emerald-200 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-emerald-800">11/11 Starting XI Complete!</p>
                  <p className="text-[11px] font-semibold text-slate-500">
                    OVR: {teamRating} | Chem: {teamChemistry}%
                  </p>
                </div>
                <button
                  onClick={() => finalizeDraft()}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500"
                >
                  Simulate Season <ArrowRight size={14} />
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
            <MatchdaySimulation
              result={simulationResult}
              teamName={teamName || 'Your Draft XI'}
              onDraftAgain={reset}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xl shadow-slate-100">
              <Zap size={28} className="animate-spin text-emerald-600 mb-3" />
              <h3 className="text-xl font-black text-slate-900">Simulating Season Campaign</h3>
              <p className="mt-1 text-xs text-slate-500">
                Running 380-match Poisson fixture engine for {teamName || 'Your XI'} across {selectedLeague?.name}...
              </p>
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
        draftSlots={draftSlots}
        clubName={spinResult?.name}
        onAssign={handleAssignFromModal}
        onClose={() => setShowRoster(false)}
      />
    </main>
  );
}
