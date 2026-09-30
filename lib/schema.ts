import { pgEnum, pgTable, serial, text, integer, index, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const positionEnum = pgEnum('position', ['GK', 'LB', 'CB', 'RB', 'CM', 'CAM', 'LW', 'RW', 'ST']);
export const categoryEnum = pgEnum('category', ['GK', 'DEF', 'MID', 'FWD']);

export const leagues = pgTable(
  'leagues',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    country: text('country').notNull(),
    logoUrl: text('logo_url'),
  },
  (table) => ({
    nameIdx: index('league_name_idx').on(table.name),
    countryIdx: index('league_country_idx').on(table.country),
  }),
);

export const teams = pgTable(
  'teams',
  {
    id: serial('id').primaryKey(),
    leagueId: integer('league_id')
      .notNull()
      .references(() => leagues.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    shortName: varchar('short_name', { length: 12 }).notNull(),
    logoUrl: text('logo_url'),
    baseRating: integer('base_rating').notNull().default(75),
  },
  (table) => ({
    leagueIdx: index('team_league_idx').on(table.leagueId),
    nameIdx: index('team_name_idx').on(table.name),
  }),
);

export const players = pgTable(
  'players',
  {
    id: serial('id').primaryKey(),
    teamId: integer('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    position: positionEnum('position').notNull(),
    category: categoryEnum('category').notNull(),
    rating: integer('rating').notNull(),
    photoUrl: text('photo_url'),
  },
  (table) => ({
    teamIdx: index('player_team_idx').on(table.teamId),
    ratingIdx: index('player_rating_idx').on(table.rating),
    categoryIdx: index('player_category_idx').on(table.category),
  }),
);

export const leaguesRelations = relations(leagues, ({ many }) => ({
  teams: many(teams),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  league: one(leagues, {
    fields: [teams.leagueId],
    references: [leagues.id],
  }),
  players: many(players),
}));

export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
}));
