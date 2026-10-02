'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, RefreshCw, Flame, Shield, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { type MatchResult, type GoalEvent } from '@/lib/store';

type MatchdaySimulationProps = {
  result: MatchResult;
  teamName?: string;
  onDraftAgain: () => void;
};

export function MatchdaySimulation({ result, teamName = 'Your Draft XI', onDraftAgain }: MatchdaySimulationProps) {
  const [currentMinute, setCurrentMinute] = useState(0);
  const [activeGoals, setActiveGoals] = useState<GoalEvent[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const displayUserTeam = teamName || 'Your Draft XI';

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
    }, 85);

    return () => clearInterval(interval);
  }, [result]);

  // Track goals up to current minute
  useEffect(() => {
    const goalsToShow = result.goalEvents.filter((g) => g.minute <= currentMinute);
    setActiveGoals(goalsToShow);
  }, [currentMinute, result.goalEvents]);

  // Check user goals
  const ourGoals = activeGoals.filter((g) => g.team === displayUserTeam || g.team === 'Your Draft XI').length;
  const concededGoals = activeGoals.filter((g) => g.team !== displayUserTeam && g.team !== 'Your Draft XI').length;

  return (
    <div className="space-y-6">
      {/* Live Match Engine Radar Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600">
              <Zap size={14} className="animate-pulse text-emerald-500" />
              <span>{isFinished ? 'Full Time (90′)' : 'Simulating Season Matches...'}</span>
            </div>
            <h2 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">
              {result.leagueName} Campaign
            </h2>
          </div>

          {/* 90-Minute Clock Radar */}
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-24 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-inner">
              <span className="text-xl font-black tracking-tight text-slate-900">
                {currentMinute}′
              </span>
              <span className={`text-[9px] uppercase font-black tracking-widest ${isFinished ? 'text-emerald-600' : 'text-amber-600 animate-pulse'}`}>
                {isFinished ? 'FULL TIME' : 'SIMULATING'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar (0 to 90 min) */}
        <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"
            style={{ width: `${(currentMinute / 90) * 100}%` }}
          />
        </div>

        {/* Live Scorecard Banner */}
        <div className="mt-6 flex items-center justify-around rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <Shield size={13} className="text-emerald-600" />
              <p className="text-xs font-black uppercase tracking-wider text-emerald-800">{displayUserTeam}</p>
            </div>
            <p className="mt-1 text-4xl font-black text-slate-900">{ourGoals}</p>
          </div>

          <div className="flex flex-col items-center">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest text-slate-400 shadow-xs">
              VS
            </span>
          </div>

          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-rose-700">Rival Goals</p>
            <p className="mt-1 text-4xl font-black text-slate-900">{concededGoals}</p>
          </div>
        </div>
      </div>

      {/* Results & Live Table Grid */}
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Left Card: Final Standing */}
        <div className="flex flex-col justify-between rounded-[2.5rem] border border-amber-200 bg-gradient-to-b from-amber-50/50 via-white to-white p-6 shadow-xl shadow-amber-500/5">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-700">
              <Trophy size={16} className="text-amber-500" />
              <span>Final Standings</span>
            </div>

            <div className="my-5 flex items-baseline gap-3">
              <span className="text-6xl font-black text-slate-900">#{result.rank}</span>
              <span className="text-sm font-extrabold text-slate-600">
                {result.rank === 1 ? '🏆 Champions!' : result.rank <= 3 ? '🥈 Podium Finish' : 'Mid Table'}
              </span>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Club</span>
                <span className="font-black text-slate-900">{displayUserTeam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Record (W-D-L)</span>
                <span className="font-black text-slate-900">
                  {result.record.wins}W - {result.record.draws}D - {result.record.losses}L
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Points Total</span>
                <span className="font-black text-emerald-700">{result.record.points} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Goal Difference</span>
                <span className={`font-black ${result.record.goalDifference >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {result.record.goalDifference > 0 ? `+${result.record.goalDifference}` : result.record.goalDifference}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onDraftAgain}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white transition-all hover:bg-emerald-500 active:scale-95 shadow-md shadow-emerald-600/20"
          >
            <RefreshCw size={16} /> Draft New Squad
          </button>
        </div>

        {/* Right Card: Full League Table */}
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Standings Table</h3>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-800">
              Season Finish
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-wider text-slate-500 border-b border-slate-200">
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
              <tbody className="divide-y divide-slate-100 font-medium">
                {result.table.map((row) => {
                  const isUs = row.club === displayUserTeam || row.club === 'Your Draft XI';
                  return (
                    <tr
                      key={row.club}
                      className={
                        isUs
                          ? 'bg-emerald-50/80 font-black text-emerald-950 border-l-4 border-l-emerald-500'
                          : 'text-slate-700 hover:bg-slate-50'
                      }
                    >
                      <td className="p-3 font-black">{row.rank}</td>
                      <td className="p-3 flex items-center gap-2">
                        {isUs && <Flame size={14} className="text-amber-500" />}
                        <span className="truncate">{row.club}</span>
                      </td>
                      <td className="p-3 text-slate-400">{row.played}</td>
                      <td className="p-3">{row.wins}</td>
                      <td className="p-3">{row.draws}</td>
                      <td className="p-3">{row.losses}</td>
                      <td className="p-3 font-semibold text-slate-800">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="p-3 text-right font-black text-slate-900">{row.points}</td>
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
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40">
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Season Highlights Timeline ({activeGoals.length} Goals)
          </p>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <AnimatePresence>
              {activeGoals.map((event, idx) => {
                const isOurGoal = event.team === displayUserTeam || event.team === 'Your Draft XI';
                return (
                  <motion.div
                    key={`${event.minute}-${event.scorer}-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center justify-between rounded-xl border p-2.5 text-xs shadow-2xs ${
                      isOurGoal
                        ? 'border-emerald-200 bg-emerald-50/80 text-emerald-950 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-black text-slate-900">⚽ {event.minute}′</span>
                    <span className="truncate px-2 font-bold">{event.scorer}</span>
                    <span className={`text-[10px] font-black uppercase ${isOurGoal ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {isOurGoal ? 'Your XI' : 'Rival'}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
