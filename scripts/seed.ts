import { config } from 'dotenv';
import { db } from '../lib/db';
import { leagues, players, teams } from '../lib/schema';

config({ path: '.env.local' });

const leagueTemplates = [
  { name: 'Premier League', country: 'England', logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=200&q=80' },
  { name: 'La Liga', country: 'Spain', logoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=200&q=80' },
  { name: 'Serie A', country: 'Italy', logoUrl: 'https://images.unsplash.com/photo-1530904578637-59d47a1e7e4b?auto=format&fit=crop&w=200&q=80' },
  { name: 'Bundesliga', country: 'Germany', logoUrl: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=200&q=80' },
  { name: 'International', country: 'World', logoUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=200&q=80' },
];

const leagueTeams = {
  'Premier League': [
    { name: 'Manchester City', shortName: 'MCI', logoUrl: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=120&q=80', baseRating: 89 },
    { name: 'Arsenal', shortName: 'ARS', logoUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=120&q=80', baseRating: 87 },
    { name: 'Liverpool', shortName: 'LIV', logoUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=120&q=80', baseRating: 85 },
    { name: 'Chelsea', shortName: 'CHE', logoUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=120&q=80', baseRating: 82 },
    { name: 'Tottenham', shortName: 'TOT', logoUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=120&q=80', baseRating: 81 },
  ],
  'La Liga': [
    { name: 'Real Madrid', shortName: 'RMA', logoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=120&q=80', baseRating: 90 },
    { name: 'Barcelona', shortName: 'BAR', logoUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?auto=format&fit=crop&w=120&q=80', baseRating: 88 },
    { name: 'Atletico Madrid', shortName: 'ATM', logoUrl: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=120&q=80', baseRating: 86 },
    { name: 'Sevilla', shortName: 'SEV', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80', baseRating: 81 },
    { name: 'Valencia', shortName: 'VAL', logoUrl: 'https://images.unsplash.com/photo-1541534401786-2077eed87a74?auto=format&fit=crop&w=120&q=80', baseRating: 79 },
  ],
  'Serie A': [
    { name: 'Juventus', shortName: 'JUV', logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=120&q=80', baseRating: 84 },
    { name: 'Inter Milan', shortName: 'INT', logoUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?auto=format&fit=crop&w=120&q=80', baseRating: 86 },
    { name: 'AC Milan', shortName: 'MIL', logoUrl: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=120&q=80', baseRating: 83 },
    { name: 'Napoli', shortName: 'NAP', logoUrl: 'https://images.unsplash.com/photo-1530904578637-59d47a1e7e4b?auto=format&fit=crop&w=120&q=80', baseRating: 82 },
    { name: 'Roma', shortName: 'ROM', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80', baseRating: 81 },
  ],
  Bundesliga: [
    { name: 'Bayern Munich', shortName: 'BAY', logoUrl: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=120&q=80', baseRating: 88 },
    { name: 'Borussia Dortmund', shortName: 'BVB', logoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=120&q=80', baseRating: 86 },
    { name: 'RB Leipzig', shortName: 'RBL', logoUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=120&q=80', baseRating: 83 },
    { name: 'Bayer Leverkusen', shortName: 'LEV', logoUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=120&q=80', baseRating: 82 },
    { name: 'Union Berlin', shortName: 'UNB', logoUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=120&q=80', baseRating: 80 },
  ],
  International: [
    { name: 'Brazil', shortName: 'BRA', logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=120&q=80', baseRating: 90 },
    { name: 'Argentina', shortName: 'ARG', logoUrl: 'https://images.unsplash.com/photo-1541534401786-2077eed87a74?auto=format&fit=crop&w=120&q=80', baseRating: 89 },
    { name: 'France', shortName: 'FRA', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80', baseRating: 88 },
    { name: 'Spain', shortName: 'ESP', logoUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=120&q=80', baseRating: 87 },
    { name: 'Portugal', shortName: 'POR', logoUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?auto=format&fit=crop&w=120&q=80', baseRating: 85 },
  ],
} as const;

const rosterTemplates = [
  { position: 'GK', category: 'GK' },
  { position: 'LB', category: 'DEF' },
  { position: 'CB', category: 'DEF' },
  { position: 'CB', category: 'DEF' },
  { position: 'RB', category: 'DEF' },
  { position: 'CM', category: 'MID' },
  { position: 'CM', category: 'MID' },
  { position: 'CAM', category: 'MID' },
  { position: 'LW', category: 'FWD' },
  { position: 'RW', category: 'FWD' },
  { position: 'ST', category: 'FWD' },
] as const;

const firstNames = {
  GK: ['Alisson', 'Ederson', 'Mendy', 'Kepa', 'Casteels', 'Onana', 'Szczesny', 'Oblak', 'Lloris', 'Courtois'],
  DEF: ['Theo', 'Ruben', 'Joao', 'Marcos', 'Aitor', 'Giorgio', 'Virgil', 'Kyle', 'Ezri', 'Dayot'],
  MID: ['Pedri', 'Frenkie', 'Declan', 'Rodri', 'Luka', 'Alex', 'Bellingham', 'Mateo', 'Jude', 'Enzo'],
  FWD: ['Vinicius', 'Mbappe', 'Lewandowski', 'Salah', 'Ferran', 'Haaland', 'Son', 'Neymar', 'Lautaro', 'Morata'],
} as const;

const lastNames = ['Silva', 'Martinez', 'Alonso', 'Ramos', 'Pogba', 'Bellingham', 'Muller', 'Santos', 'Fernandez', 'Gonzalez'];

function generateRoster(teamName: string, teamRating: number) {
  return rosterTemplates.map((slot, index) => {
    const pool = firstNames[slot.category as keyof typeof firstNames];
    const firstName = pool[index % pool.length];
    const lastName = lastNames[(teamRating + index) % lastNames.length];
    const rating = Math.max(75, Math.min(93, teamRating - 7 + (index % 5) + (slot.category === 'FWD' ? 1 : 0)));

    return {
      name: `${firstName} ${lastName}`,
      teamName,
      position: slot.position,
      category: slot.category,
      rating,
      photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=80',
    };
  });
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required before running the seed script.');
  }

  console.log('Seeding football data...');

  await db.delete(players);
  await db.delete(teams);
  await db.delete(leagues);

  const insertedLeagues = await db.insert(leagues).values([...leagueTemplates]).returning({ id: leagues.id, name: leagues.name });
  const leagueLookup = new Map(insertedLeagues.map((league) => [league.name, league.id]));

  const teamInsertRows: Array<{ leagueId: number; name: string; shortName: string; logoUrl: string | null; baseRating: number }> = [];
  for (const [leagueName, teamsInLeague] of Object.entries(leagueTeams)) {
    const leagueId = leagueLookup.get(leagueName);
    if (!leagueId) continue;
    for (const team of teamsInLeague) {
      teamInsertRows.push({
        leagueId,
        name: team.name,
        shortName: team.shortName,
        logoUrl: team.logoUrl,
        baseRating: team.baseRating,
      });
    }
  }

  const insertedTeams = await db.insert(teams).values(teamInsertRows).returning({ id: teams.id, name: teams.name, leagueId: teams.leagueId });
  const teamLookup = new Map(insertedTeams.map((team) => [`${team.leagueId}:${team.name}`, team.id]));

  const playerInsertRows: Array<{
    teamId: number;
    name: string;
    position: 'GK' | 'LB' | 'CB' | 'RB' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST';
    category: 'GK' | 'DEF' | 'MID' | 'FWD';
    rating: number;
    photoUrl: string | null;
  }> = [];

  for (const [leagueName, teamsInLeague] of Object.entries(leagueTeams)) {
    const leagueId = leagueLookup.get(leagueName);
    if (!leagueId) continue;

    for (const team of teamsInLeague) {
      const teamId = teamLookup.get(`${leagueId}:${team.name}`);
      if (!teamId) continue;

      const roster = generateRoster(team.name, team.baseRating);
      for (const player of roster) {
        playerInsertRows.push({
          teamId,
          name: player.name,
          position: player.position as 'GK' | 'LB' | 'CB' | 'RB' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST',
          category: player.category as 'GK' | 'DEF' | 'MID' | 'FWD',
          rating: player.rating,
          photoUrl: player.photoUrl,
        });
      }
    }
  }

  await db.insert(players).values(playerInsertRows);

  console.log(`Seed complete: ${insertedLeagues.length} leagues, ${insertedTeams.length} teams, ${playerInsertRows.length} players.`);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
