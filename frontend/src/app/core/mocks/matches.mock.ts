import { Match } from '../models/match.model';
import { MOCK_TEAMS } from './teams.mock';

const COMPETITION = {
  id: 1,
  name: 'Liga Nacional de Fútbol Sala',
  country: 'España',
  logoUrl: '',
  season: '2025/2026',
};

const today = new Date();
const toISODate = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
};

// === PARTIDOS EN DIRECTO (8) ===
export const MOCK_LIVE_MATCHES: Match[] = [
  {
    id: 101,
    homeTeam: MOCK_TEAMS[0], // Barça
    awayTeam: MOCK_TEAMS[1], // Inter Movistar
    homeScore: 2,
    awayScore: 1,
    status: 'live',
    minute: 34,
    date: toISODate(today),
    competition: COMPETITION,
    venue: 'Palau Blaugrana',
    statistics: [
      { type: 'Tiros', homeValue: 12, awayValue: 8 },
      { type: 'Tiros a puerta', homeValue: 6, awayValue: 4 },
      { type: 'Córneres', homeValue: 3, awayValue: 2 },
      { type: 'Faltas', homeValue: 5, awayValue: 7 },
    ],
  },
  {
    id: 102,
    homeTeam: MOCK_TEAMS[2], // ElPozo Murcia
    awayTeam: MOCK_TEAMS[3], // Palma Futsal
    homeScore: 1,
    awayScore: 1,
    status: 'halftime',
    minute: 20,
    date: toISODate(today),
    competition: COMPETITION,
    venue: 'Palacio de Deportes',
  },
  {
    id: 103,
    homeTeam: MOCK_TEAMS[4], // Jaén
    awayTeam: MOCK_TEAMS[5], // Castellón
    homeScore: 3,
    awayScore: 0,
    status: 'live',
    minute: 28,
    date: toISODate(today),
    competition: COMPETITION,
    venue: 'Olivo Arena',
  },
  {
    id: 104,
    homeTeam: MOCK_TEAMS[6], // Panta
    awayTeam: MOCK_TEAMS[7], // Ourense
    homeScore: 0,
    awayScore: 1,
    status: 'live',
    minute: 15,
    date: toISODate(today),
    competition: COMPETITION,
    venue: 'Pabellón Municipal',
  },
  {
    id: 105,
    homeTeam: MOCK_TEAMS[8], // Ribera Navarra
    awayTeam: MOCK_TEAMS[9], // Cártama
    homeScore: 4,
    awayScore: 2,
    status: 'live',
    minute: 38,
    date: toISODate(today),
    competition: COMPETITION,
    venue: 'Pabellón Anselmo Vega',
  },
  {
    id: 106,
    homeTeam: MOCK_TEAMS[1], // Inter Movistar
    awayTeam: MOCK_TEAMS[4], // Jaén
    homeScore: 1,
    awayScore: 0,
    status: 'halftime',
    minute: 20,
    date: toISODate(today),
    competition: COMPETITION,
    venue: 'Pabellón Vista Alegre',
  },
  {
    id: 107,
    homeTeam: MOCK_TEAMS[3], // Palma
    awayTeam: MOCK_TEAMS[6], // Panta
    homeScore: 2,
    awayScore: 2,
    status: 'live',
    minute: 22,
    date: toISODate(today),
    competition: COMPETITION,
    venue: 'Palau Municipal d\'Esports',
  },
  {
    id: 108,
    homeTeam: MOCK_TEAMS[5], // Castellón
    awayTeam: MOCK_TEAMS[0], // Barça
    homeScore: 0,
    awayScore: 1,
    status: 'live',
    minute: 8,
    date: toISODate(today),
    competition: COMPETITION,
    venue: 'Pabellón Ciutat de Castelló',
  },
];

// === PRÓXIMOS PARTIDOS (12) ===
export const MOCK_UPCOMING_MATCHES: Match[] = [
  {
    id: 201,
    homeTeam: MOCK_TEAMS[0],
    awayTeam: MOCK_TEAMS[2],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 1)),
    competition: COMPETITION,
    venue: 'Palau Blaugrana',
  },
  {
    id: 202,
    homeTeam: MOCK_TEAMS[1],
    awayTeam: MOCK_TEAMS[3],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 1)),
    competition: COMPETITION,
    venue: 'Pabellón Vista Alegre',
  },
  {
    id: 203,
    homeTeam: MOCK_TEAMS[4],
    awayTeam: MOCK_TEAMS[7],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 2)),
    competition: COMPETITION,
    venue: 'Olivo Arena',
  },
  {
    id: 204,
    homeTeam: MOCK_TEAMS[5],
    awayTeam: MOCK_TEAMS[8],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 2)),
    competition: COMPETITION,
    venue: 'Pabellón Ciutat de Castelló',
  },
  {
    id: 205,
    homeTeam: MOCK_TEAMS[6],
    awayTeam: MOCK_TEAMS[9],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 3)),
    competition: COMPETITION,
    venue: 'Pabellón Municipal',
  },
  {
    id: 206,
    homeTeam: MOCK_TEAMS[2],
    awayTeam: MOCK_TEAMS[0],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 3)),
    competition: COMPETITION,
    venue: 'Palacio de Deportes',
  },
  {
    id: 207,
    homeTeam: MOCK_TEAMS[7],
    awayTeam: MOCK_TEAMS[1],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 4)),
    competition: COMPETITION,
    venue: 'Pazo dos Deportes',
  },
  {
    id: 208,
    homeTeam: MOCK_TEAMS[9],
    awayTeam: MOCK_TEAMS[4],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 4)),
    competition: COMPETITION,
    venue: 'Pabellón Municipal de Cártama',
  },
  {
    id: 209,
    homeTeam: MOCK_TEAMS[3],
    awayTeam: MOCK_TEAMS[5],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 5)),
    competition: COMPETITION,
    venue: 'Palau Municipal d\'Esports',
  },
  {
    id: 210,
    homeTeam: MOCK_TEAMS[8],
    awayTeam: MOCK_TEAMS[6],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 5)),
    competition: COMPETITION,
    venue: 'Pabellón Anselmo Vega',
  },
  {
    id: 211,
    homeTeam: MOCK_TEAMS[0],
    awayTeam: MOCK_TEAMS[7],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 6)),
    competition: COMPETITION,
    venue: 'Palau Blaugrana',
  },
  {
    id: 212,
    homeTeam: MOCK_TEAMS[1],
    awayTeam: MOCK_TEAMS[9],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 6)),
    competition: COMPETITION,
    venue: 'Pabellón Vista Alegre',
  },
];

// === RESULTADOS RECIENTES (10) ===
export const MOCK_RECENT_MATCHES: Match[] = [
  {
    id: 301,
    homeTeam: MOCK_TEAMS[0],
    awayTeam: MOCK_TEAMS[4],
    homeScore: 5,
    awayScore: 2,
    status: 'finished',
    date: toISODate(addDays(today, -1)),
    competition: COMPETITION,
    venue: 'Palau Blaugrana',
  },
  {
    id: 302,
    homeTeam: MOCK_TEAMS[3],
    awayTeam: MOCK_TEAMS[1],
    homeScore: 3,
    awayScore: 3,
    status: 'finished',
    date: toISODate(addDays(today, -1)),
    competition: COMPETITION,
    venue: 'Palau Municipal d\'Esports',
  },
  {
    id: 303,
    homeTeam: MOCK_TEAMS[7],
    awayTeam: MOCK_TEAMS[2],
    homeScore: 1,
    awayScore: 4,
    status: 'finished',
    date: toISODate(addDays(today, -2)),
    competition: COMPETITION,
    venue: 'Pazo dos Deportes',
  },
  {
    id: 304,
    homeTeam: MOCK_TEAMS[5],
    awayTeam: MOCK_TEAMS[6],
    homeScore: 2,
    awayScore: 0,
    status: 'finished',
    date: toISODate(addDays(today, -2)),
    competition: COMPETITION,
    venue: 'Pabellón Ciutat de Castelló',
  },
  {
    id: 305,
    homeTeam: MOCK_TEAMS[9],
    awayTeam: MOCK_TEAMS[8],
    homeScore: 3,
    awayScore: 1,
    status: 'finished',
    date: toISODate(addDays(today, -3)),
    competition: COMPETITION,
    venue: 'Pabellón Municipal de Cártama',
  },
  {
    id: 306,
    homeTeam: MOCK_TEAMS[2],
    awayTeam: MOCK_TEAMS[0],
    homeScore: 2,
    awayScore: 3,
    status: 'finished',
    date: toISODate(addDays(today, -3)),
    competition: COMPETITION,
    venue: 'Palacio de Deportes',
  },
  {
    id: 307,
    homeTeam: MOCK_TEAMS[1],
    awayTeam: MOCK_TEAMS[5],
    homeScore: 6,
    awayScore: 1,
    status: 'finished',
    date: toISODate(addDays(today, -4)),
    competition: COMPETITION,
    venue: 'Pabellón Vista Alegre',
  },
  {
    id: 308,
    homeTeam: MOCK_TEAMS[4],
    awayTeam: MOCK_TEAMS[9],
    homeScore: 4,
    awayScore: 2,
    status: 'finished',
    date: toISODate(addDays(today, -4)),
    competition: COMPETITION,
    venue: 'Olivo Arena',
  },
  {
    id: 309,
    homeTeam: MOCK_TEAMS[6],
    awayTeam: MOCK_TEAMS[3],
    homeScore: 0,
    awayScore: 2,
    status: 'finished',
    date: toISODate(addDays(today, -5)),
    competition: COMPETITION,
    venue: 'Pabellón Municipal',
  },
  {
    id: 310,
    homeTeam: MOCK_TEAMS[8],
    awayTeam: MOCK_TEAMS[7],
    homeScore: 5,
    awayScore: 4,
    status: 'finished',
    date: toISODate(addDays(today, -5)),
    competition: COMPETITION,
    venue: 'Pabellón Anselmo Vega',
  },
];

// === TODOS LOS PARTIDOS (para MatchesStore) ===
export const MOCK_ALL_MATCHES: Match[] = [
  ...MOCK_LIVE_MATCHES,
  ...MOCK_UPCOMING_MATCHES,
  ...MOCK_RECENT_MATCHES,
];
