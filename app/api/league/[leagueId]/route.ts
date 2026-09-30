import { eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leagues, players, teams } from '@/lib/schema';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ leagueId: string }> },
) {
  const { leagueId: rawLeagueId } = await params;
  const leagueId = Number(rawLeagueId);

  if (!Number.isFinite(leagueId)) {
    return NextResponse.json({ error: 'Invalid league id.' }, { status: 400 });
  }

  try {
    const [leagueRows, teamRows] = await Promise.all([
      db.select().from(leagues).where(eq(leagues.id, leagueId)),
      db.select().from(teams).where(eq(teams.leagueId, leagueId)),
    ]);

    const league = leagueRows[0] ?? null;
    const teamIds = teamRows.map((team) => team.id);
    const playerRows = teamIds.length > 0
      ? await db.select().from(players).where(inArray(players.teamId, teamIds))
      : [];

    return NextResponse.json({
      league,
      teams: teamRows.map((team) => ({
        ...team,
        id: Number(team.id),
        leagueId: Number(team.leagueId),
        logoUrl: team.logoUrl ?? null,
      })),
      players: playerRows.map((player) => ({
        ...player,
        id: String(player.id),
        teamId: Number(player.teamId),
        teamName: teamRows.find((team) => team.id === player.teamId)?.name ?? 'Club',
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load league context' },
      { status: 500 },
    );
  }
}
