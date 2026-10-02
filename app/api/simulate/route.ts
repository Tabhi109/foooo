import { NextResponse } from 'next/server';
import { eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { leagues, players, teams } from '@/lib/schema';

function poissonRandom(lambda: number) {
  const L = Math.exp(-lambda);
  let product = 1;
  let count = 0;

  while (product > L) {
    product *= Math.random();
    count += 1;
  }

  return Math.max(0, count - 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildLeagueTable(entries: Array<{ club: string; wins: number; draws: number; losses: number; goalsFor: number; goalsAgainst: number; played: number; points: number; }>) {
  return [...entries]
    .map((entry) => ({
      ...entry,
      goalDifference: entry.goalsFor - entry.goalsAgainst,
    }))
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.club.localeCompare(b.club))
    .map((entry, index) => ({
      rank: index + 1,
      club: entry.club,
      played: entry.played,
      wins: entry.wins,
      draws: entry.draws,
      losses: entry.losses,
      goalsFor: entry.goalsFor,
      goalsAgainst: entry.goalsAgainst,
      goalDifference: entry.goalDifference,
      points: entry.points,
    }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leagueId, league_id: leagueIdSnake, playerIds, teamName } = body ?? {};
    const resolvedLeagueId = Number(leagueId ?? leagueIdSnake);
    const resolvedTeamName = (typeof teamName === 'string' && teamName.trim()) || 'Your Draft XI';

    if (!resolvedLeagueId || !Array.isArray(playerIds) || playerIds.length !== 11) {
      return NextResponse.json({ error: 'Expected 11 player IDs and a league_id.' }, { status: 400 });
    }

    const normalizedIds = playerIds.map((value: string | number) => Number(value)).filter((value) => Number.isFinite(value));
    if (normalizedIds.length !== 11) {
      return NextResponse.json({ error: 'One or more player IDs are invalid.' }, { status: 400 });
    }

    const leagueRows = await db.select().from(leagues).where(eq(leagues.id, resolvedLeagueId));
    const league = leagueRows[0];

    const draftPlayers = await db.select().from(players).where(inArray(players.id, normalizedIds));
    const teamRows = await db.select().from(teams).where(eq(teams.leagueId, resolvedLeagueId));

    const userRating = draftPlayers.reduce((sum, player) => sum + player.rating, 0) / draftPlayers.length;

    let fixtures: Array<{ club: string; wins: number; draws: number; losses: number; goalsFor: number; goalsAgainst: number; played: number; points: number }> = [
      { club: resolvedTeamName, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, played: 0, points: 0 },
    ];

    const opponents = teamRows.length > 0 ? teamRows : [
      { id: 101, leagueId: resolvedLeagueId, name: 'City', shortName: 'CIT', logoUrl: '', baseRating: 84 },
      { id: 102, leagueId: resolvedLeagueId, name: 'United', shortName: 'UNI', logoUrl: '', baseRating: 83 },
      { id: 103, leagueId: resolvedLeagueId, name: 'Rovers', shortName: 'ROV', logoUrl: '', baseRating: 82 },
      { id: 104, leagueId: resolvedLeagueId, name: 'Wolves', shortName: 'WOL', logoUrl: '', baseRating: 80 },
      { id: 105, leagueId: resolvedLeagueId, name: 'Athletic', shortName: 'ATH', logoUrl: '', baseRating: 81 },
    ];

    const eventLog: Array<{ minute: number; scorer: string; team: string; outcome: 'home' | 'away' }> = [];

    const opponentRecords = opponents.map((opponent) => ({
      club: opponent.name,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      played: 0,
      points: 0,
    }));

    const tableEntries = [{ club: resolvedTeamName, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, played: 0, points: 0 }, ...opponentRecords];

    for (let i = 0; i < opponents.length; i += 1) {
      const opponent = opponents[i];
      const enemyRating = opponent.baseRating ?? 80;
      const ourGoals = poissonRandom(clamp(0.8 + userRating / 25, 0.8, 2.2));
      const opponentGoals = poissonRandom(clamp(0.72 + enemyRating / 28, 0.75, 2.3));

      const entries = tableEntries.find((entry) => entry.club === resolvedTeamName);
      const rivalEntry = tableEntries.find((entry) => entry.club === opponent.name);

      if (!entries || !rivalEntry) continue;

      if (ourGoals > opponentGoals) {
        entries.wins += 1;
        rivalEntry.losses += 1;
        entries.points += 3;
      } else if (ourGoals < opponentGoals) {
        rivalEntry.wins += 1;
        entries.losses += 1;
        rivalEntry.points += 3;
      } else {
        entries.draws += 1;
        rivalEntry.draws += 1;
        entries.points += 1;
        rivalEntry.points += 1;
      }

      entries.played += 1;
      entries.goalsFor += ourGoals;
      entries.goalsAgainst += opponentGoals;
      rivalEntry.played += 1;
      rivalEntry.goalsFor += opponentGoals;
      rivalEntry.goalsAgainst += ourGoals;

      const goalCount = Math.max(ourGoals, opponentGoals);
      for (let minuteIndex = 0; minuteIndex < goalCount; minuteIndex += 1) {
        const minute = 12 + (minuteIndex * 17) + ((minuteIndex * 3) % 12);
        if (minuteIndex < ourGoals) {
          const scorer = draftPlayers[minuteIndex % draftPlayers.length]?.name || 'Attacker';
          eventLog.push({ minute: clamp(minute, 8, 90), scorer, team: resolvedTeamName, outcome: 'home' });
        }
        if (minuteIndex < opponentGoals) {
          const scorer = `${opponent.shortName || opponent.name} Star`;
          eventLog.push({ minute: clamp(minute + 4, 10, 90), scorer, team: opponent.name, outcome: 'away' });
        }
      }
    }

    fixtures = tableEntries;

    const table = buildLeagueTable(fixtures);
    const rank = table.findIndex((entry) => entry.club === resolvedTeamName) + 1;
    const currentRecord = table.find((entry) => entry.club === resolvedTeamName);

    return NextResponse.json({
      league: league?.name ?? 'League',
      userTeam: resolvedTeamName,
      rank: rank > 0 ? rank : 1,
      table,
      record: currentRecord
        ? {
            wins: currentRecord.wins,
            draws: currentRecord.draws,
            losses: currentRecord.losses,
            goalsFor: currentRecord.goalsFor,
            goalsAgainst: currentRecord.goalsAgainst,
            goalDifference: currentRecord.goalDifference,
            points: currentRecord.points,
          }
        : { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
      goalEvents: eventLog.sort((a, b) => a.minute - b.minute),
    });
  } catch (error) {
    const fallback = {
      league: 'League',
      rank: 1,
      table: [
        { rank: 1, club: 'Your Draft XI', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
      ],
      record: { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
      goalEvents: [],
      error: error instanceof Error ? error.message : 'Unknown simulation error',
    };

    return NextResponse.json(fallback, { status: 500 });
  }
}
