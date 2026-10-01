import { create } from 'zustand';
import {
  formationOrder,
  getFormationSlots,
  FORMATION_LINKS,
  type FormationName,
  type FormationSlot,
  type PositionCategory,
} from '@/lib/formations';

export type GameStage = 'SELECT_LEAGUE' | 'SPIN_FORMATION' | 'PITCH_DRAFT' | 'SIMULATION' | 'SUMMARY';

export type LeagueOption = {
  id: number;
  name: string;
  country: string;
  logoUrl: string | null;
};

export type ClubOption = {
  id: number;
  leagueId: number;
  name: string;
  shortName: string;
  logoUrl: string | null;
  baseRating: number;
};

export type DraftedPlayer = {
  id: string;
  name: string;
  position: string;
  category: PositionCategory;
  rating: number;
  nationality?: string;
  photoUrl?: string | null;
  teamId: number;
  teamName: string;
};

export type GoalEvent = {
  minute: number;
  scorer: string;
  team: string;
  outcome: 'home' | 'away';
};

export type MatchResult = {
  leagueName: string;
  rank: number;
  table: Array<{
    rank: number;
    club: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  }>;
  record: {
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  };
  goalEvents: GoalEvent[];
};

export type DraftSlot = FormationSlot & {
  playerId: string | null;
  player: DraftedPlayer | null;
};

export type ChemistryLink = {
  from: string;
  to: string;
  strength: 'strong' | 'medium' | 'weak' | 'none';
};

export function calculateChemistry(
  slots: DraftSlot[],
  formation: FormationName,
): { score: number; links: ChemistryLink[] } {
  const linksDef = FORMATION_LINKS[formation] || [];
  const slotMap = new Map(slots.map((s) => [s.id, s]));
  const evaluatedLinks: ChemistryLink[] = [];

  let totalPoints = 0;
  let possiblePoints = 0;

  for (const [fromId, toId] of linksDef) {
    const slotA = slotMap.get(fromId);
    const slotB = slotMap.get(toId);
    if (!slotA || !slotB) continue;

    possiblePoints += 3;

    if (!slotA.player || !slotB.player) {
      evaluatedLinks.push({ from: fromId, to: toId, strength: 'none' });
      continue;
    }

    const playerA = slotA.player;
    const playerB = slotB.player;

    const sameClub = playerA.teamId === playerB.teamId;
    const sameNation =
      Boolean(playerA.nationality) &&
      Boolean(playerB.nationality) &&
      playerA.nationality === playerB.nationality;

    if (sameClub) {
      totalPoints += 3;
      evaluatedLinks.push({ from: fromId, to: toId, strength: 'strong' });
    } else if (sameNation) {
      totalPoints += 2;
      evaluatedLinks.push({ from: fromId, to: toId, strength: 'medium' });
    } else {
      totalPoints += 1;
      evaluatedLinks.push({ from: fromId, to: toId, strength: 'weak' });
    }
  }

  const assignedCount = slots.filter((s) => s.player).length;
  if (assignedCount === 0 || possiblePoints === 0) {
    return { score: 0, links: evaluatedLinks };
  }

  const percentage = Math.round((totalPoints / possiblePoints) * 100);
  return { score: Math.min(100, Math.max(0, percentage)), links: evaluatedLinks };
}

const createDraftSlots = (formation: FormationName): DraftSlot[] =>
  getFormationSlots(formation).map((slot) => ({
    ...slot,
    playerId: null,
    player: null,
  }));

const initialState = {
  currentStage: 'SELECT_LEAGUE' as GameStage,
  selectedLeagueId: 0,
  formation: '4-3-3' as FormationName,
  draftRound: 1,
  leagueOptions: [] as LeagueOption[],
  clubOptions: [] as ClubOption[],
  clubRoster: [] as DraftedPlayer[],
  spinResult: null as ClubOption | null,
  rerollsRemaining: 2,
  activeSlotId: null as string | null,
  draftSlots: createDraftSlots('4-3-3'),
  rosterByClub: {} as Record<number, DraftedPlayer[]>,
  teamRating: 0,
  teamChemistry: 0,
  chemistryLinks: [] as ChemistryLink[],
  simulationResult: null as MatchResult | null,
  isLoading: false,
  error: null as string | null,
};

type GameStore = typeof initialState & {
  loadLeagues: () => Promise<void>;
  loadLeagueContext: (leagueId: number) => Promise<void>;
  setSelectedLeague: (leagueId: number) => Promise<void>;
  spinFormation: () => void;
  confirmFormation: () => void;
  spinClub: () => void;
  rerollClub: () => void;
  selectSlot: (slotId: string) => void;
  assignPlayerToSlot: (playerId: string, slotId: string) => void;
  finalizeDraft: () => void;
  runSimulation: () => Promise<void>;
  reset: () => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  loadLeagues: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/leagues');
      if (!response.ok) throw new Error('Unable to load leagues');
      const data = await response.json();
      const leagues = Array.isArray(data.leagues) ? data.leagues : data;
      set({ leagueOptions: leagues, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred while loading leagues',
      });
    }
  },

  loadLeagueContext: async (leagueId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/league/${leagueId}`);
      if (!response.ok) throw new Error('Unable to load league context');
      const data = await response.json();
      const teams = Array.isArray(data.teams) ? data.teams : [];
      const players = Array.isArray(data.players) ? data.players : [];
      const rosterByClub: Record<number, DraftedPlayer[]> = {};

      for (const team of teams) {
        const teamId = Number(team.id);
        rosterByClub[teamId] = players
          .filter((player: DraftedPlayer) => Number(player.teamId) === teamId)
          .map((player: DraftedPlayer) => ({
            ...player,
            id: String(player.id),
            teamId: Number(player.teamId),
          }));
      }

      set({
        selectedLeagueId: leagueId,
        clubOptions: teams,
        rosterByClub,
        clubRoster: [],
        spinResult: null,
        rerollsRemaining: 2,
        activeSlotId: null,
        draftRound: 1,
        teamRating: 0,
        teamChemistry: 0,
        chemistryLinks: [],
        draftSlots: createDraftSlots(get().formation),
        currentStage: 'SPIN_FORMATION',
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unable to load the selected league',
      });
    }
  },

  setSelectedLeague: async (leagueId) => {
    await get().loadLeagueContext(leagueId);
  },

  spinFormation: () => {
    const next = formationOrder[Math.floor(Math.random() * formationOrder.length)];
    set({
      formation: next,
      draftSlots: createDraftSlots(next),
      currentStage: 'SPIN_FORMATION',
      activeSlotId: null,
      spinResult: null,
      rerollsRemaining: 2,
      teamRating: 0,
      teamChemistry: 0,
      chemistryLinks: [],
    });
  },

  confirmFormation: () => {
    const { clubOptions, formation, rosterByClub } = get();
    if (clubOptions.length === 0) return;

    // Pick first random club for Round 1
    const firstClub = clubOptions[Math.floor(Math.random() * clubOptions.length)];
    const slots = createDraftSlots(formation);

    set({
      currentStage: 'PITCH_DRAFT',
      draftRound: 1,
      spinResult: firstClub,
      clubRoster: rosterByClub[firstClub.id] ?? [],
      rerollsRemaining: 2,
      activeSlotId: slots[0]?.id ?? null,
      draftSlots: slots,
      teamRating: 0,
      teamChemistry: 0,
      chemistryLinks: [],
    });
  },

  spinClub: () => {
    const { clubOptions, rosterByClub } = get();
    if (clubOptions.length === 0) return;
    const next = clubOptions[Math.floor(Math.random() * clubOptions.length)];
    set({
      spinResult: next,
      clubRoster: rosterByClub[next.id] ?? [],
    });
  },

  rerollClub: () => {
    const { clubOptions, rerollsRemaining, spinResult, rosterByClub } = get();
    if (rerollsRemaining <= 0 || clubOptions.length === 0) return;
    const eligible = clubOptions.filter((club) => club.id !== spinResult?.id);
    const next = eligible[Math.floor(Math.random() * Math.max(eligible.length, 1))] ?? clubOptions[0];

    set({
      spinResult: next,
      rerollsRemaining: rerollsRemaining - 1,
      clubRoster: rosterByClub[next.id] ?? [],
    });
  },

  selectSlot: (slotId) => {
    set({ activeSlotId: slotId });
  },

  assignPlayerToSlot: (playerId, slotId) => {
    const { draftSlots, clubRoster, formation, clubOptions, rosterByClub, draftRound } = get();
    const slot = draftSlots.find((entry) => entry.id === slotId);
    const player = clubRoster.find((candidate) => candidate.id === playerId);

    if (!slot || !player) return;

    const matchesSlot =
      player.category === slot.position ||
      (slot.position === 'DEF' && ['LB', 'CB', 'RB', 'LWB', 'RWB'].includes(player.position)) ||
      (slot.position === 'MID' && ['CM', 'CAM', 'LM', 'RM', 'DM'].includes(player.position)) ||
      (slot.position === 'FWD' && ['LW', 'RW', 'ST'].includes(player.position));

    if (!matchesSlot) return;

    const nextDraftSlots = draftSlots.map((entry) =>
      entry.id === slotId ? { ...entry, playerId, player } : entry,
    );

    // Calculate updated ratings & chemistry
    const assignedPlayers = nextDraftSlots.map((s) => s.player).filter(Boolean) as DraftedPlayer[];
    const nextRating =
      assignedPlayers.length > 0
        ? Math.round(assignedPlayers.reduce((acc, p) => acc + p.rating, 0) / assignedPlayers.length)
        : 0;

    const { score: nextChemistry, links } = calculateChemistry(nextDraftSlots, formation);

    const filledCount = assignedPlayers.length;

    if (filledCount < 11 && clubOptions.length > 0) {
      // Find next empty slot
      const nextEmptySlot = nextDraftSlots.find((s) => !s.playerId);
      // Spin next club for next round!
      const nextClub = clubOptions[Math.floor(Math.random() * clubOptions.length)];

      set({
        draftSlots: nextDraftSlots,
        draftRound: Math.min(11, draftRound + 1),
        teamRating: nextRating,
        teamChemistry: nextChemistry,
        chemistryLinks: links,
        spinResult: nextClub,
        clubRoster: rosterByClub[nextClub.id] ?? [],
        activeSlotId: nextEmptySlot?.id ?? null,
      });
    } else {
      // All 11 filled
      set({
        draftSlots: nextDraftSlots,
        teamRating: nextRating,
        teamChemistry: nextChemistry,
        chemistryLinks: links,
        activeSlotId: null,
      });
    }
  },

  finalizeDraft: () => {
    const hasFullSquad = get().draftSlots.filter((slot) => slot.playerId).length === 11;
    if (!hasFullSquad) return;
    set({ currentStage: 'SIMULATION' });
  },

  runSimulation: async () => {
    const { draftSlots, selectedLeagueId } = get();
    const playerIds = draftSlots
      .filter((slot) => slot.playerId)
      .map((slot) => Number(slot.playerId))
      .filter((value) => Number.isFinite(value));

    if (playerIds.length !== 11) return;

    set({ currentStage: 'SIMULATION', simulationResult: null, error: null });

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ league_id: selectedLeagueId, playerIds }),
      });

      if (!response.ok) {
        throw new Error('Simulation failed');
      }

      const payload = await response.json();
      set({ simulationResult: payload, currentStage: 'SUMMARY' });
    } catch (error) {
      set({
        currentStage: 'SUMMARY',
        error: error instanceof Error ? error.message : 'Simulation failed',
      });
    }
  },

  reset: () => {
    set({
      ...initialState,
      leagueOptions: get().leagueOptions,
      clubOptions: get().clubOptions,
      rosterByClub: get().rosterByClub,
      currentStage: 'SELECT_LEAGUE',
    });
  },
}));
