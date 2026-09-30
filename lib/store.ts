import { create } from 'zustand';
import { formationOrder, getFormationSlots, type FormationName, type FormationSlot, type PositionCategory } from '@/lib/formations';

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
};

const createDraftSlots = (formation: FormationName): DraftSlot[] =>
  getFormationSlots(formation).map((slot) => ({
    ...slot,
    playerId: null,
  }));

const initialState = {
  currentStage: 'SELECT_LEAGUE' as GameStage,
  selectedLeagueId: 0,
  formation: '4-3-3' as FormationName,
  leagueOptions: [] as LeagueOption[],
  clubOptions: [] as ClubOption[],
  clubRoster: [] as DraftedPlayer[],
  spinResult: null as ClubOption | null,
  rerollsRemaining: 2,
  activeSlotId: null as string | null,
  draftSlots: createDraftSlots('4-3-3'),
  rosterByClub: {} as Record<number, DraftedPlayer[]>,
  simulationResult: null as MatchResult | null,
  isLoading: false,
  error: null as string | null,
};

type GameStore = typeof initialState & {
  loadLeagues: () => Promise<void>;
  loadLeagueContext: (leagueId: number) => Promise<void>;
  setSelectedLeague: (leagueId: number) => Promise<void>;
  spinFormation: () => void;
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
        clubRoster: rosterByClub[teams[0]?.id ?? 0] ?? [],
        spinResult: null,
        rerollsRemaining: 2,
        activeSlotId: null,
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
    });
  },
  spinClub: () => {
    const { clubOptions } = get();
    if (clubOptions.length === 0) return;
    const next = clubOptions[Math.floor(Math.random() * clubOptions.length)];
    set({
      spinResult: next,
      currentStage: 'PITCH_DRAFT',
      rerollsRemaining: 2,
      activeSlotId: get().draftSlots[0]?.id ?? null,
      clubRoster: get().rosterByClub[next.id] ?? [],
    });
  },
  rerollClub: () => {
    const { clubOptions, rerollsRemaining, spinResult } = get();
    if (rerollsRemaining <= 0 || clubOptions.length === 0) return;
    const eligible = clubOptions.filter((club) => club.id !== spinResult?.id);
    const next = eligible[Math.floor(Math.random() * Math.max(eligible.length, 1))] ?? clubOptions[0];
    set({
      spinResult: next,
      rerollsRemaining: rerollsRemaining - 1,
      activeSlotId: get().draftSlots[0]?.id ?? null,
      clubRoster: get().rosterByClub[next.id] ?? [],
    });
  },
  selectSlot: (slotId) => {
    set({ activeSlotId: slotId });
  },
  assignPlayerToSlot: (playerId, slotId) => {
    const { draftSlots, clubRoster, spinResult } = get();
    const slot = draftSlots.find((entry) => entry.id === slotId);
    const player = clubRoster.find((candidate) => candidate.id === playerId);

    if (!slot || !player || !spinResult) return;

    const matchesSlot =
      player.category === slot.position ||
      (slot.position === 'DEF' && ['LB', 'CB', 'RB'].includes(player.position)) ||
      (slot.position === 'MID' && ['CM', 'CAM', 'LM', 'RM', 'DM'].includes(player.position)) ||
      (slot.position === 'FWD' && ['LW', 'RW', 'ST'].includes(player.position));

    if (!matchesSlot) return;

    const nextDraftSlots = draftSlots.map((entry) =>
      entry.id === slotId ? { ...entry, playerId } : entry,
    );

    set({ draftSlots: nextDraftSlots, activeSlotId: slotId });
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

export const getClubRoster = (clubId: number): DraftedPlayer[] => {
  const store = useGameStore.getState();
  return store.rosterByClub[clubId] ?? [];
};

export const getAvailableSlots = (formation: FormationName): DraftSlot[] =>
  createDraftSlots(formation);
