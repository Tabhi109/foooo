import { config } from 'dotenv';
config();

import { db } from '../lib/db';
import { leagues, players, teams } from '../lib/schema';

type PlayerSeed = {
  name: string;
  position: 'GK' | 'LB' | 'CB' | 'RB' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST';
  category: 'GK' | 'DEF' | 'MID' | 'FWD';
  rating: number;
  nationality: string;
  photoUrl: string;
};

const leagueTemplates = [
  { name: 'Premier League', country: 'England', logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=200&q=80' },
  { name: 'La Liga', country: 'Spain', logoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=200&q=80' },
  { name: 'Serie A', country: 'Italy', logoUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?auto=format&fit=crop&w=200&q=80' },
  { name: 'Bundesliga', country: 'Germany', logoUrl: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=200&q=80' },
  { name: 'International', country: 'World', logoUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=200&q=80' },
];

const teamData: Record<string, Array<{
  name: string;
  shortName: string;
  logoUrl: string;
  baseRating: number;
  players: PlayerSeed[];
}>> = {
  'Premier League': [
    {
      name: 'Manchester City',
      shortName: 'MCI',
      logoUrl: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=120&q=80',
      baseRating: 89,
      players: [
        { name: 'Erling Haaland', position: 'ST', category: 'FWD', rating: 91, nationality: 'Norway', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Kevin De Bruyne', position: 'CM', category: 'MID', rating: 90, nationality: 'Belgium', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Rodri', position: 'CM', category: 'MID', rating: 91, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Phil Foden', position: 'LW', category: 'FWD', rating: 88, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Bernardo Silva', position: 'CAM', category: 'MID', rating: 88, nationality: 'Portugal', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Ederson', position: 'GK', category: 'GK', rating: 88, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Ruben Dias', position: 'CB', category: 'DEF', rating: 88, nationality: 'Portugal', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Josko Gvardiol', position: 'LB', category: 'DEF', rating: 84, nationality: 'Croatia', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Kyle Walker', position: 'RB', category: 'DEF', rating: 84, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'John Stones', position: 'CB', category: 'DEF', rating: 85, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jeremy Doku', position: 'RW', category: 'FWD', rating: 82, nationality: 'Belgium', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Arsenal',
      shortName: 'ARS',
      logoUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=120&q=80',
      baseRating: 87,
      players: [
        { name: 'Bukayo Saka', position: 'RW', category: 'FWD', rating: 87, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Martin Odegaard', position: 'CAM', category: 'MID', rating: 89, nationality: 'Norway', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'William Saliba', position: 'CB', category: 'DEF', rating: 87, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Declan Rice', position: 'CM', category: 'MID', rating: 87, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Gabriel Magalhaes', position: 'CB', category: 'DEF', rating: 86, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Kai Havertz', position: 'ST', category: 'FWD', rating: 83, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Gabriel Martinelli', position: 'LW', category: 'FWD', rating: 83, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'David Raya', position: 'GK', category: 'GK', rating: 84, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Ben White', position: 'RB', category: 'DEF', rating: 83, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jurrien Timber', position: 'LB', category: 'DEF', rating: 81, nationality: 'Netherlands', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Mikel Merino', position: 'CM', category: 'MID', rating: 84, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Liverpool',
      shortName: 'LIV',
      logoUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=120&q=80',
      baseRating: 88,
      players: [
        { name: 'Mohamed Salah', position: 'RW', category: 'FWD', rating: 89, nationality: 'Egypt', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Virgil van Dijk', position: 'CB', category: 'DEF', rating: 89, nationality: 'Netherlands', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alisson Becker', position: 'GK', category: 'GK', rating: 89, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Trent Alexander-Arnold', position: 'RB', category: 'DEF', rating: 86, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alexis Mac Allister', position: 'CM', category: 'MID', rating: 86, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Luis Diaz', position: 'LW', category: 'FWD', rating: 84, nationality: 'Colombia', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Dominik Szoboszlai', position: 'CAM', category: 'MID', rating: 83, nationality: 'Hungary', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Andy Robertson', position: 'LB', category: 'DEF', rating: 85, nationality: 'Scotland', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Ibrahima Konate', position: 'CB', category: 'DEF', rating: 84, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Diogo Jota', position: 'ST', category: 'FWD', rating: 85, nationality: 'Portugal', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Ryan Gravenberch', position: 'CM', category: 'MID', rating: 82, nationality: 'Netherlands', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Chelsea',
      shortName: 'CHE',
      logoUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=120&q=80',
      baseRating: 83,
      players: [
        { name: 'Cole Palmer', position: 'CAM', category: 'MID', rating: 86, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Enzo Fernandez', position: 'CM', category: 'MID', rating: 83, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Moises Caicedo', position: 'CM', category: 'MID', rating: 83, nationality: 'Ecuador', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Christopher Nkunku', position: 'ST', category: 'FWD', rating: 84, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Reece James', position: 'RB', category: 'DEF', rating: 83, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Levi Colwill', position: 'CB', category: 'DEF', rating: 80, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Robert Sanchez', position: 'GK', category: 'GK', rating: 80, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Nicolas Jackson', position: 'ST', category: 'FWD', rating: 81, nationality: 'Senegal', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Pedro Neto', position: 'RW', category: 'FWD', rating: 80, nationality: 'Portugal', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Marc Cucurella', position: 'LB', category: 'DEF', rating: 81, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Wesley Fofana', position: 'CB', category: 'DEF', rating: 80, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Tottenham',
      shortName: 'TOT',
      logoUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=120&q=80',
      baseRating: 84,
      players: [
        { name: 'Heung-Min Son', position: 'LW', category: 'FWD', rating: 87, nationality: 'South Korea', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'James Maddison', position: 'CAM', category: 'MID', rating: 85, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Cristian Romero', position: 'CB', category: 'DEF', rating: 84, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Dejan Kulusevski', position: 'RW', category: 'FWD', rating: 82, nationality: 'Sweden', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Guglielmo Vicario', position: 'GK', category: 'GK', rating: 83, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Micky van de Ven', position: 'CB', category: 'DEF', rating: 83, nationality: 'Netherlands', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Destiny Udogie', position: 'LB', category: 'DEF', rating: 82, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Pedro Porro', position: 'RB', category: 'DEF', rating: 83, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Rodrigo Bentancur', position: 'CM', category: 'MID', rating: 82, nationality: 'Uruguay', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Dominic Solanke', position: 'ST', category: 'FWD', rating: 81, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Pape Sarr', position: 'CM', category: 'MID', rating: 80, nationality: 'Senegal', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
  ],
  'La Liga': [
    {
      name: 'Real Madrid',
      shortName: 'RMA',
      logoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=120&q=80',
      baseRating: 91,
      players: [
        { name: 'Kylian Mbappe', position: 'ST', category: 'FWD', rating: 91, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Vinicius Jr', position: 'LW', category: 'FWD', rating: 90, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jude Bellingham', position: 'CAM', category: 'MID', rating: 90, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Federico Valverde', position: 'CM', category: 'MID', rating: 88, nationality: 'Uruguay', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Thibaut Courtois', position: 'GK', category: 'GK', rating: 89, nationality: 'Belgium', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Antonio Rudiger', position: 'CB', category: 'DEF', rating: 88, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Rodrygo', position: 'RW', category: 'FWD', rating: 86, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Dani Carvajal', position: 'RB', category: 'DEF', rating: 86, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Aurelien Tchouameni', position: 'CM', category: 'MID', rating: 85, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Eder Militao', position: 'CB', category: 'DEF', rating: 85, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Ferland Mendy', position: 'LB', category: 'DEF', rating: 82, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Barcelona',
      shortName: 'BAR',
      logoUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?auto=format&fit=crop&w=120&q=80',
      baseRating: 88,
      players: [
        { name: 'Robert Lewandowski', position: 'ST', category: 'FWD', rating: 88, nationality: 'Poland', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Lamine Yamal', position: 'RW', category: 'FWD', rating: 84, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Pedri', position: 'CM', category: 'MID', rating: 86, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Frenkie de Jong', position: 'CM', category: 'MID', rating: 87, nationality: 'Netherlands', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Raphinha', position: 'LW', category: 'FWD', rating: 86, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jules Kounde', position: 'RB', category: 'DEF', rating: 85, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Marc-Andre ter Stegen', position: 'GK', category: 'GK', rating: 89, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Ronald Araujo', position: 'CB', category: 'DEF', rating: 85, nationality: 'Uruguay', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Dani Olmo', position: 'CAM', category: 'MID', rating: 85, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alejandro Balde', position: 'LB', category: 'DEF', rating: 82, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Pau Cubarsi', position: 'CB', category: 'DEF', rating: 80, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Atletico Madrid',
      shortName: 'ATM',
      logoUrl: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=120&q=80',
      baseRating: 86,
      players: [
        { name: 'Antoine Griezmann', position: 'ST', category: 'FWD', rating: 88, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Julian Alvarez', position: 'ST', category: 'FWD', rating: 85, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jan Oblak', position: 'GK', category: 'GK', rating: 88, nationality: 'Slovenia', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Rodrigo De Paul', position: 'CM', category: 'MID', rating: 84, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Koke', position: 'CM', category: 'MID', rating: 82, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Marcos Llorente', position: 'RB', category: 'DEF', rating: 82, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Robin Le Normand', position: 'CB', category: 'DEF', rating: 83, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jose Gimenez', position: 'CB', category: 'DEF', rating: 83, nationality: 'Uruguay', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Conor Gallagher', position: 'CAM', category: 'MID', rating: 82, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Samuel Lino', position: 'LW', category: 'FWD', rating: 81, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alexander Sorloth', position: 'ST', category: 'FWD', rating: 82, nationality: 'Norway', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Athletic Club',
      shortName: 'ATH',
      logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80',
      baseRating: 82,
      players: [
        { name: 'Nico Williams', position: 'LW', category: 'FWD', rating: 85, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Inaki Williams', position: 'RW', category: 'FWD', rating: 82, nationality: 'Ghana', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Oihan Sancet', position: 'CAM', category: 'MID', rating: 82, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Unai Simon', position: 'GK', category: 'GK', rating: 83, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Dani Vivian', position: 'CB', category: 'DEF', rating: 81, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Yeray Alvarez', position: 'CB', category: 'DEF', rating: 80, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Yuri Berchiche', position: 'LB', category: 'DEF', rating: 80, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Oscar de Marcos', position: 'RB', category: 'DEF', rating: 79, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Mikel Vesga', position: 'CM', category: 'MID', rating: 79, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Gorka Guruzeta', position: 'ST', category: 'FWD', rating: 80, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Benat Prados', position: 'CM', category: 'MID', rating: 78, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Real Sociedad',
      shortName: 'RSO',
      logoUrl: 'https://images.unsplash.com/photo-1541534401786-2077eed87a74?auto=format&fit=crop&w=120&q=80',
      baseRating: 82,
      players: [
        { name: 'Martin Zubimendi', position: 'CM', category: 'MID', rating: 84, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Takefusa Kubo', position: 'RW', category: 'FWD', rating: 83, nationality: 'Japan', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Mikel Oyarzabal', position: 'LW', category: 'FWD', rating: 83, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alex Remiro', position: 'GK', category: 'GK', rating: 84, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Brais Mendez', position: 'CAM', category: 'MID', rating: 82, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Igor Zubeldia', position: 'CB', category: 'DEF', rating: 81, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jon Pacheco', position: 'CB', category: 'DEF', rating: 79, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Hamari Traore', position: 'RB', category: 'DEF', rating: 80, nationality: 'Mali', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Aihen Munoz', position: 'LB', category: 'DEF', rating: 79, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Luka Sucic', position: 'CM', category: 'MID', rating: 79, nationality: 'Croatia', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Umar Sadiq', position: 'ST', category: 'FWD', rating: 78, nationality: 'Nigeria', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
  ],
  'Serie A': [
    {
      name: 'Inter Milan',
      shortName: 'INT',
      logoUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?auto=format&fit=crop&w=120&q=80',
      baseRating: 88,
      players: [
        { name: 'Lautaro Martinez', position: 'ST', category: 'FWD', rating: 89, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Nicolo Barella', position: 'CM', category: 'MID', rating: 87, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alessandro Bastoni', position: 'CB', category: 'DEF', rating: 87, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Hakan Calhanoglu', position: 'CM', category: 'MID', rating: 86, nationality: 'Turkey', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Federico Dimarco', position: 'LB', category: 'DEF', rating: 84, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Yann Sommer', position: 'GK', category: 'GK', rating: 87, nationality: 'Switzerland', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Marcus Thuram', position: 'ST', category: 'FWD', rating: 84, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Benjamin Pavard', position: 'CB', category: 'DEF', rating: 84, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Denzel Dumfries', position: 'RB', category: 'DEF', rating: 82, nationality: 'Netherlands', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Henrikh Mkhitaryan', position: 'CAM', category: 'MID', rating: 83, nationality: 'Armenia', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Davide Frattesi', position: 'CM', category: 'MID', rating: 81, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Juventus',
      shortName: 'JUV',
      logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=120&q=80',
      baseRating: 84,
      players: [
        { name: 'Dusan Vlahovic', position: 'ST', category: 'FWD', rating: 84, nationality: 'Serbia', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Gleison Bremer', position: 'CB', category: 'DEF', rating: 86, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Teun Koopmeiners', position: 'CAM', category: 'MID', rating: 84, nationality: 'Netherlands', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Manuel Locatelli', position: 'CM', category: 'MID', rating: 82, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Kenan Yildiz', position: 'LW', category: 'FWD', rating: 81, nationality: 'Turkey', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Michele Di Gregorio', position: 'GK', category: 'GK', rating: 82, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Andrea Cambiaso', position: 'LB', category: 'DEF', rating: 81, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Danilo', position: 'RB', category: 'DEF', rating: 81, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Douglas Luiz', position: 'CM', category: 'MID', rating: 83, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Nicolas Gonzalez', position: 'RW', category: 'FWD', rating: 81, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Federico Gatti', position: 'CB', category: 'DEF', rating: 80, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'AC Milan',
      shortName: 'MIL',
      logoUrl: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=120&q=80',
      baseRating: 85,
      players: [
        { name: 'Rafael Leao', position: 'LW', category: 'FWD', rating: 86, nationality: 'Portugal', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Theo Hernandez', position: 'LB', category: 'DEF', rating: 87, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Mike Maignan', position: 'GK', category: 'GK', rating: 87, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Christian Pulisic', position: 'RW', category: 'FWD', rating: 83, nationality: 'USA', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alvaro Morata', position: 'ST', category: 'FWD', rating: 83, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Tijjani Reijnders', position: 'CM', category: 'MID', rating: 82, nationality: 'Netherlands', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Fikayo Tomori', position: 'CB', category: 'DEF', rating: 82, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Ismael Bennacer', position: 'CM', category: 'MID', rating: 82, nationality: 'Algeria', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Davide Calabria', position: 'RB', category: 'DEF', rating: 80, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Ruben Loftus-Cheek', position: 'CAM', category: 'MID', rating: 81, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Strahinja Pavlovic', position: 'CB', category: 'DEF', rating: 80, nationality: 'Serbia', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Napoli',
      shortName: 'NAP',
      logoUrl: 'https://images.unsplash.com/photo-1530904578637-59d47a1e7e4b?auto=format&fit=crop&w=120&q=80',
      baseRating: 84,
      players: [
        { name: 'Khvicha Kvaratskhelia', position: 'LW', category: 'FWD', rating: 86, nationality: 'Georgia', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Romelu Lukaku', position: 'ST', category: 'FWD', rating: 83, nationality: 'Belgium', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Stanislav Lobotka', position: 'CM', category: 'MID', rating: 84, nationality: 'Slovakia', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Giovanni Di Lorenzo', position: 'RB', category: 'DEF', rating: 82, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alessandro Buongiorno', position: 'CB', category: 'DEF', rating: 82, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alex Meret', position: 'GK', category: 'GK', rating: 80, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Andre-Frank Zambo Anguissa', position: 'CM', category: 'MID', rating: 82, nationality: 'Cameroon', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Scott McTominay', position: 'CAM', category: 'MID', rating: 81, nationality: 'Scotland', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Matteo Politano', position: 'RW', category: 'FWD', rating: 80, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Mathias Olivera', position: 'LB', category: 'DEF', rating: 79, nationality: 'Uruguay', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Amir Rrahmani', position: 'CB', category: 'DEF', rating: 80, nationality: 'Kosovo', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Roma',
      shortName: 'ROM',
      logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80',
      baseRating: 83,
      players: [
        { name: 'Paulo Dybala', position: 'CAM', category: 'MID', rating: 86, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Artem Dovbyk', position: 'ST', category: 'FWD', rating: 84, nationality: 'Ukraine', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Lorenzo Pellegrini', position: 'CM', category: 'MID', rating: 82, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Gianluca Mancini', position: 'CB', category: 'DEF', rating: 81, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Evan Ndicka', position: 'CB', category: 'DEF', rating: 80, nationality: 'Ivory Coast', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Mile Svilar', position: 'GK', category: 'GK', rating: 80, nationality: 'Serbia', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Matias Soule', position: 'RW', category: 'FWD', rating: 80, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Stephan El Shaarawy', position: 'LW', category: 'FWD', rating: 79, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Bryan Cristante', position: 'CM', category: 'MID', rating: 80, nationality: 'Italy', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Angelino', position: 'LB', category: 'DEF', rating: 79, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Zeki Celik', position: 'RB', category: 'DEF', rating: 78, nationality: 'Turkey', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
  ],
  'Bundesliga': [
    {
      name: 'Bayern Munich',
      shortName: 'BAY',
      logoUrl: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=120&q=80',
      baseRating: 90,
      players: [
        { name: 'Harry Kane', position: 'ST', category: 'FWD', rating: 90, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jamal Musiala', position: 'CAM', category: 'MID', rating: 88, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Joshua Kimmich', position: 'CM', category: 'MID', rating: 86, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Manuel Neuer', position: 'GK', category: 'GK', rating: 86, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Leroy Sane', position: 'RW', category: 'FWD', rating: 85, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alphonso Davies', position: 'LB', category: 'DEF', rating: 83, nationality: 'Canada', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Dayot Upamecano', position: 'CB', category: 'DEF', rating: 82, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Kim Min-jae', position: 'CB', category: 'DEF', rating: 83, nationality: 'South Korea', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Michael Olise', position: 'RW', category: 'FWD', rating: 83, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Serge Gnabry', position: 'LW', category: 'FWD', rating: 82, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Leon Goretzka', position: 'CM', category: 'MID', rating: 84, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Bayer Leverkusen',
      shortName: 'LEV',
      logoUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=120&q=80',
      baseRating: 87,
      players: [
        { name: 'Florian Wirtz', position: 'CAM', category: 'MID', rating: 88, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jeremie Frimpong', position: 'RB', category: 'DEF', rating: 84, nationality: 'Netherlands', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Granit Xhaka', position: 'CM', category: 'MID', rating: 86, nationality: 'Switzerland', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alex Grimaldo', position: 'LB', category: 'DEF', rating: 86, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jonathan Tah', position: 'CB', category: 'DEF', rating: 86, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Victor Boniface', position: 'ST', category: 'FWD', rating: 83, nationality: 'Nigeria', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Lukas Hradecky', position: 'GK', category: 'GK', rating: 84, nationality: 'Finland', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Edmond Tapsoba', position: 'CB', category: 'DEF', rating: 83, nationality: 'Burkina Faso', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Robert Andrich', position: 'CM', category: 'MID', rating: 83, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Piero Hincapie', position: 'CB', category: 'DEF', rating: 82, nationality: 'Ecuador', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Martin Terrier', position: 'LW', category: 'FWD', rating: 80, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Borussia Dortmund',
      shortName: 'BVB',
      logoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=120&q=80',
      baseRating: 85,
      players: [
        { name: 'Gregor Kobel', position: 'GK', category: 'GK', rating: 88, nationality: 'Switzerland', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Nico Schlotterbeck', position: 'CB', category: 'DEF', rating: 85, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Julian Brandt', position: 'CAM', category: 'MID', rating: 84, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Serhou Guirassy', position: 'ST', category: 'FWD', rating: 83, nationality: 'Guinea', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Marcel Sabitzer', position: 'CM', category: 'MID', rating: 82, nationality: 'Austria', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Karim Adeyemi', position: 'LW', category: 'FWD', rating: 80, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Donyell Malen', position: 'RW', category: 'FWD', rating: 81, nationality: 'Netherlands', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Waldemar Anton', position: 'CB', category: 'DEF', rating: 81, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Yan Couto', position: 'RB', category: 'DEF', rating: 79, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Ramy Bensebaini', position: 'LB', category: 'DEF', rating: 79, nationality: 'Algeria', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Emre Can', position: 'CM', category: 'MID', rating: 81, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'RB Leipzig',
      shortName: 'RBL',
      logoUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=120&q=80',
      baseRating: 83,
      players: [
        { name: 'Xavi Simons', position: 'CAM', category: 'MID', rating: 84, nationality: 'Netherlands', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Lois Openda', position: 'ST', category: 'FWD', rating: 83, nationality: 'Belgium', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Benjamin Sesko', position: 'ST', category: 'FWD', rating: 81, nationality: 'Slovenia', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Peter Gulacsi', position: 'GK', category: 'GK', rating: 82, nationality: 'Hungary', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Castello Lukeba', position: 'CB', category: 'DEF', rating: 81, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'David Raum', position: 'LB', category: 'DEF', rating: 81, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Willi Orban', position: 'CB', category: 'DEF', rating: 81, nationality: 'Hungary', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Benjamin Henrichs', position: 'RB', category: 'DEF', rating: 80, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Amadou Haidara', position: 'CM', category: 'MID', rating: 80, nationality: 'Mali', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Christoph Baumgartner', position: 'CM', category: 'MID', rating: 80, nationality: 'Austria', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Antonio Nusa', position: 'LW', category: 'FWD', rating: 78, nationality: 'Norway', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'VfB Stuttgart',
      shortName: 'STU',
      logoUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=120&q=80',
      baseRating: 81,
      players: [
        { name: 'Deniz Undav', position: 'ST', category: 'FWD', rating: 82, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Angelo Stiller', position: 'CM', category: 'MID', rating: 81, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alexander Nubel', position: 'GK', category: 'GK', rating: 81, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Maximilian Mittelstadt', position: 'LB', category: 'DEF', rating: 81, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Atakan Karazor', position: 'CM', category: 'MID', rating: 80, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Enzo Millot', position: 'CAM', category: 'MID', rating: 80, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Josha Vagnoman', position: 'RB', category: 'DEF', rating: 79, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jeff Chabot', position: 'CB', category: 'DEF', rating: 79, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Dan-Axel Zagadou', position: 'CB', category: 'DEF', rating: 78, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Chris Fuhrich', position: 'LW', category: 'FWD', rating: 80, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jamie Leweling', position: 'RW', category: 'FWD', rating: 79, nationality: 'Germany', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
  ],
  'International': [
    {
      name: 'Argentina',
      shortName: 'ARG',
      logoUrl: 'https://images.unsplash.com/photo-1541534401786-2077eed87a74?auto=format&fit=crop&w=120&q=80',
      baseRating: 90,
      players: [
        { name: 'Lionel Messi', position: 'RW', category: 'FWD', rating: 88, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Lautaro Martinez', position: 'ST', category: 'FWD', rating: 89, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Emiliano Martinez', position: 'GK', category: 'GK', rating: 87, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alexis Mac Allister', position: 'CM', category: 'MID', rating: 86, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Rodrigo De Paul', position: 'CM', category: 'MID', rating: 84, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Cristian Romero', position: 'CB', category: 'DEF', rating: 84, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Lisandro Martinez', position: 'CB', category: 'DEF', rating: 84, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Nahuel Molina', position: 'RB', category: 'DEF', rating: 81, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Nicolas Tagliafico', position: 'LB', category: 'DEF', rating: 79, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Enzo Fernandez', position: 'CM', category: 'MID', rating: 83, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Julian Alvarez', position: 'ST', category: 'FWD', rating: 85, nationality: 'Argentina', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'France',
      shortName: 'FRA',
      logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80',
      baseRating: 90,
      players: [
        { name: 'Kylian Mbappe', position: 'ST', category: 'FWD', rating: 91, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Antoine Griezmann', position: 'CAM', category: 'MID', rating: 88, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Mike Maignan', position: 'GK', category: 'GK', rating: 87, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Theo Hernandez', position: 'LB', category: 'DEF', rating: 87, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'William Saliba', position: 'CB', category: 'DEF', rating: 87, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jules Kounde', position: 'RB', category: 'DEF', rating: 85, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Aurelien Tchouameni', position: 'CM', category: 'MID', rating: 85, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Eduardo Camavinga', position: 'CM', category: 'MID', rating: 83, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Ousmane Dembele', position: 'RW', category: 'FWD', rating: 86, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Bradley Barcola', position: 'LW', category: 'FWD', rating: 80, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Ibrahima Konate', position: 'CB', category: 'DEF', rating: 84, nationality: 'France', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Brazil',
      shortName: 'BRA',
      logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=120&q=80',
      baseRating: 89,
      players: [
        { name: 'Vinicius Jr', position: 'LW', category: 'FWD', rating: 90, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Rodrygo', position: 'RW', category: 'FWD', rating: 86, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Alisson Becker', position: 'GK', category: 'GK', rating: 89, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Marquinhos', position: 'CB', category: 'DEF', rating: 87, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Gabriel Magalhaes', position: 'CB', category: 'DEF', rating: 86, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Bruno Guimaraes', position: 'CM', category: 'MID', rating: 85, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Raphinha', position: 'RW', category: 'FWD', rating: 86, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Casemiro', position: 'CM', category: 'MID', rating: 84, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Gleison Bremer', position: 'CB', category: 'DEF', rating: 86, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Danilo', position: 'RB', category: 'DEF', rating: 81, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Endrick', position: 'ST', category: 'FWD', rating: 80, nationality: 'Brazil', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'England',
      shortName: 'ENG',
      logoUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=120&q=80',
      baseRating: 89,
      players: [
        { name: 'Jude Bellingham', position: 'CAM', category: 'MID', rating: 90, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Harry Kane', position: 'ST', category: 'FWD', rating: 90, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Phil Foden', position: 'LW', category: 'FWD', rating: 88, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Bukayo Saka', position: 'RW', category: 'FWD', rating: 87, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Declan Rice', position: 'CM', category: 'MID', rating: 87, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Trent Alexander-Arnold', position: 'RB', category: 'DEF', rating: 86, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'John Stones', position: 'CB', category: 'DEF', rating: 85, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Kyle Walker', position: 'RB', category: 'DEF', rating: 84, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Cole Palmer', position: 'CAM', category: 'MID', rating: 86, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jordan Pickford', position: 'GK', category: 'GK', rating: 83, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Marc Guehi', position: 'CB', category: 'DEF', rating: 81, nationality: 'England', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
    {
      name: 'Spain',
      shortName: 'ESP',
      logoUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=120&q=80',
      baseRating: 90,
      players: [
        { name: 'Rodri', position: 'CM', category: 'MID', rating: 91, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Lamine Yamal', position: 'RW', category: 'FWD', rating: 84, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Nico Williams', position: 'LW', category: 'FWD', rating: 85, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
        { name: 'Pedri', position: 'CM', category: 'MID', rating: 86, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
        { name: 'Dani Carvajal', position: 'RB', category: 'DEF', rating: 86, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Dani Olmo', position: 'CAM', category: 'MID', rating: 85, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { name: 'Robin Le Normand', position: 'CB', category: 'DEF', rating: 83, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' },
        { name: 'Aymeric Laporte', position: 'CB', category: 'DEF', rating: 83, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Marc Cucurella', position: 'LB', category: 'DEF', rating: 82, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Fabian Ruiz', position: 'CM', category: 'MID', rating: 83, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { name: 'Unai Simon', position: 'GK', category: 'GK', rating: 83, nationality: 'Spain', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      ],
    },
  ],
};

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required before running the seed script.');
  }

  console.log('Clearing existing records and seeding authentic football data...');

  await db.delete(players);
  await db.delete(teams);
  await db.delete(leagues);

  const insertedLeagues = await db
    .insert(leagues)
    .values([...leagueTemplates])
    .returning({ id: leagues.id, name: leagues.name });

  const leagueLookup = new Map(insertedLeagues.map((l) => [l.name, l.id]));

  let totalTeams = 0;
  let totalPlayers = 0;

  for (const [leagueName, clubs] of Object.entries(teamData)) {
    const leagueId = leagueLookup.get(leagueName);
    if (!leagueId) continue;

    for (const club of clubs) {
      const [insertedTeam] = await db
        .insert(teams)
        .values({
          leagueId,
          name: club.name,
          shortName: club.shortName,
          logoUrl: club.logoUrl,
          baseRating: club.baseRating,
        })
        .returning({ id: teams.id, name: teams.name });

      totalTeams += 1;

      const playerRows = club.players.map((p) => ({
        teamId: insertedTeam.id,
        name: p.name,
        position: p.position,
        category: p.category,
        rating: p.rating,
        nationality: p.nationality,
        photoUrl: p.photoUrl,
      }));

      await db.insert(players).values(playerRows);
      totalPlayers += playerRows.length;
    }
  }

  console.log(`✅ Seed successful! Inserted ${insertedLeagues.length} leagues, ${totalTeams} teams, and ${totalPlayers} real superstar players.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
