'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, ArrowUp, RefreshCw, Flame, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { type MatchResult, type GoalEvent } from '@/lib/store';

type MatchdaySimulationProps = {
  result: MatchResult;
  onDraftAgain: () => void;
};

export function MatchdaySimulation({ result, onDraftAgain }: MatchdaySimulationProps) {
  const [currentMinute, setCurrentMinute] = useState(0);
  const [activeGoals, setActiveGoals] = useState<GoalEvent[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // 90 minute match scrub over 4.5 seconds
    const interval = setInterval(() => {
      setCurrentMinute((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setIsFinished(true);
          if (result.rank === 1) {
            confetti({ particleCount: 220, spread: 100, origin: { y: 0.6 } });
          }
          return 90;
        }
        return prev + 2;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [result]);

  // Track goals up to current minute
  useEffect(() => {
    const goalsToShow = result.goalEvents.filter((g) => g.minute <= currentMinute);
    setActiveGoals(goalsToShow);
  }, [currentMinute, result.goalEvents]);

  const ourGoals = activeGoals.filter((g) => g.team === 'Your Draft XI').length;
  const concededGoals = activeGoals.filter((g) => g.team !== 'Your Draft XI').length;

  return (
    <div className="space-y-6">
      {/* Live Match Engine Radar Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-6 shadow-2xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-400">
              <Zap size={14} className="animate-pulse text-cyan-300" />
              <span>{isFinished ? 'Full Time (90′)' : 'Simulating Matchday...'}</span>
            </div>
            <h2 className="mt-1 text-3xl font-black text-white sm:text-4xl">
              {result.leagueName} Campaign
            </h2>
          </div>

          {/* 90-Minute Clock Radar */}
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-20 flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 shadow-inner">
              <span className="text-xl font-black tracking-tighter text-cyan-300">
                {currentMinute}′
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
                {isFinished ? 'FT' : 'LIVE'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar (0 to 90 min) */}
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400"
            style={{ width: `${(currentMinute / 90) * 100}%` }}
          />
        </div>

        {/* Live Scorecard Banner */}
        <div className="mt-6 flex items-center justify-around rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Your Draft XI</p>
            <p className="text-4xl font-black text-white">{ourGoals}</p>
          </div>
          <div className="text-sm font-black text-slate-500 uppercase tracking-widest">VS</div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Rival Goals</p>
            <p className="text-4xl font-black text-white">{concededGoals}</p>
          </div>
        </div>
      </div>

      {/* Results & Live Table Grid */}
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Left Card: Final Standing */}
        <div className="flex flex-col justify-between rounded-[2rem] border border-amber-500/25 bg-gradient-to-b from-amber-500/10 via-slate-950 to-slate-950 p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
              <Trophy size={16} />
              <span>Table Standing</span>
            </div>

            <div className="my-5 flex items-baseline gap-3">
              <span className="text-6xl font-black text-white">#{result.rank}</span>
              <span className="text-sm font-bold text-slate-400">
                {result.rank === 1 ? '🏆 Champions!' : result.rank <= 3 ? 'Top 3 Finish' : 'Mid Table'}
              </span>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Record (W-D-L)</span>
                <span className="font-extrabold text-white">
                  {result.record.wins}W - {result.record.draws}D - {result.record.losses}L
                </span>
              </div>
              <div className="flex justify-between">
                <span>Points Total</span>
                <span className="font-extrabold text-cyan-300">{result.record.points} pts</span>
              </div>
              <div className="flex justify-between">
                <span>Goal Difference</span>
                <span className={`font-extrabold ${result.record.goalDifference >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.record.goalDifference > 0 ? `+${result.record.goalDifference}` : result.record.goalDifference}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onDraftAgain}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-extrabold text-slate-950 transition-all hover:bg-slate-200 active:scale-95 shadow-lg"
          >
            <RefreshCw size={16} /> Draft New Squad
          </button>
        </div>

        {/* Right Card: Full League Table */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-white">Standings Table</h3>
            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
              Season End
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Club</th>
                  <th className="p-3">P</th>
                  <th className="p-3">W</th>
                  <th className="p-3">D</th>
                  <th className="p-3">L</th>
                  <th className="p-3">GD</th>
                  <th className="p-3 text-right">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {result.table.map((row) => {
                  const isUs = row.club === 'Your Draft XI';
                  return (
                    <tr
                      key={row.club}
                      className={isUs ? 'bg-cyan-500/15 font-bold text-white shadow-inner' : 'text-slate-300 hover:bg-slate-900/40'}
                    >
                      <td className="p-3">{row.rank}</td>
                      <td className="p-3 flex items-center gap-2">
                        {isUs && <Flame size={14} className="text-amber-400" />}
                        <span>{row.club}</span>
                      </td>
                      <td className="p-3 text-slate-400">{row.played}</td>
                      <td className="p-3">{row.wins}</td>
                      <td className="p-3">{row.draws}</td>
                      <td className="p-3">{row.losses}</td>
                      <td className="p-3">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                      <td className="p-3 text-right font-black text-cyan-300">{row.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Goal Timeline Events */}
      {activeGoals.length > 0 && (
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/60 p-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Match Highlights Timeline ({activeGoals.length} Goals)
          </p>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <AnimatePresence>
              {activeGoals.map((event, idx) => (
                <motion.div
                  key={`${event.minute}-${event.scorer}-${idx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center justify-between rounded-xl border p-2.5 text-xs ${
                    event.team === 'Your Draft XI'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300'
                  }`}
                >
                  <span className="font-extrabold">⚽ {event.minute}′</span>
                  <span className="truncate font-semibold">{event.scorer}</span>
                  <span className="text-[10px] text-slate-400">{event.team === 'Your Draft XI' ? 'Draft XI' : 'Rival'}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
