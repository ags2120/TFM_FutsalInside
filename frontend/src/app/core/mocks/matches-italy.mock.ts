import { Match } from '../models/match.model';
import { MOCK_TEAMS_ITALY } from './teams-italy.mock';
import { MOCK_PLAYERS_ITALY } from './players-italy.mock';
import { COMPETITION_ITALY } from './competitions-italy.mock';

const today = new Date();
const toISODate = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
};

export const MOCK_LIVE_MATCHES_ITALY: Match[] = [
  {
    id: 441,
    homeTeam: MOCK_TEAMS_ITALY[0],
    awayTeam: MOCK_TEAMS_ITALY[1],
    homeScore: 2,
    awayScore: 1,
    status: 'live',
    minute: 33,
    date: toISODate(today),
    competition: COMPETITION_ITALY,
    venue: 'Palasport Del Frigo',
    events: [
      { type: 'goal', minute: 7, player: MOCK_PLAYERS_ITALY[2], team: MOCK_TEAMS_ITALY[0], assistPlayer: MOCK_PLAYERS_ITALY[1] },
      { type: 'goal', minute: 15, player: MOCK_PLAYERS_ITALY[6], team: MOCK_TEAMS_ITALY[1], assistPlayer: MOCK_PLAYERS_ITALY[7] },
      { type: 'yellowcard', minute: 20, player: MOCK_PLAYERS_ITALY[0], team: MOCK_TEAMS_ITALY[0] },
      { type: 'goal', minute: 28, player: MOCK_PLAYERS_ITALY[3], team: MOCK_TEAMS_ITALY[0], assistPlayer: MOCK_PLAYERS_ITALY[2] },
    ],
    statistics: [
      { type: 'Posesión', homeValue: 56, awayValue: 44 },
      { type: 'Tiros', homeValue: 12, awayValue: 9 },
      { type: 'Tiros a puerta', homeValue: 6, awayValue: 4 },
    ],
  },
  {
    id: 442,
    homeTeam: MOCK_TEAMS_ITALY[2],
    awayTeam: MOCK_TEAMS_ITALY[3],
    homeScore: 1,
    awayScore: 1,
    status: 'halftime',
    minute: 20,
    date: toISODate(today),
    competition: COMPETITION_ITALY,
    venue: 'PalaRigone',
    events: [
      { type: 'goal', minute: 10, player: MOCK_PLAYERS_ITALY[12], team: MOCK_TEAMS_ITALY[2], assistPlayer: MOCK_PLAYERS_ITALY[11] },
      { type: 'goal', minute: 18, player: MOCK_PLAYERS_ITALY[17], team: MOCK_TEAMS_ITALY[3], assistPlayer: MOCK_PLAYERS_ITALY[16] },
    ],
  },
  {
    id: 443,
    homeTeam: MOCK_TEAMS_ITALY[4],
    awayTeam: MOCK_TEAMS_ITALY[5],
    homeScore: 3,
    awayScore: 0,
    status: 'live',
    minute: 28,
    date: toISODate(today),
    competition: COMPETITION_ITALY,
    venue: 'PalaDelConero',
  },
  {
    id: 444,
    homeTeam: MOCK_TEAMS_ITALY[6],
    awayTeam: MOCK_TEAMS_ITALY[7],
    homeScore: 0,
    awayScore: 2,
    status: 'live',
    minute: 15,
    date: toISODate(today),
    competition: COMPETITION_ITALY,
    venue: 'PalaNeri',
  },
];

export const MOCK_UPCOMING_MATCHES_ITALY: Match[] = [
  {
    id: 461,
    homeTeam: MOCK_TEAMS_ITALY[0],
    awayTeam: MOCK_TEAMS_ITALY[4],
    homeScore: 0, awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 1)),
    competition: COMPETITION_ITALY,
    venue: 'Palasport Del Frigo',
  },
  {
    id: 462,
    homeTeam: MOCK_TEAMS_ITALY[1],
    awayTeam: MOCK_TEAMS_ITALY[5],
    homeScore: 0, awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 2)),
    competition: COMPETITION_ITALY,
    venue: 'PalaBarbuto',
  },
  {
    id: 463,
    homeTeam: MOCK_TEAMS_ITALY[2],
    awayTeam: MOCK_TEAMS_ITALY[6],
    homeScore: 0, awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 3)),
    competition: COMPETITION_ITALY,
    venue: 'PalaRigone',
  },
  {
    id: 464,
    homeTeam: MOCK_TEAMS_ITALY[8],
    awayTeam: MOCK_TEAMS_ITALY[0],
    homeScore: 0, awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 4)),
    competition: COMPETITION_ITALY,
    venue: 'Palazzetto dello Sport',
  },
  {
    id: 465,
    homeTeam: MOCK_TEAMS_ITALY[9],
    awayTeam: MOCK_TEAMS_ITALY[1],
    homeScore: 0, awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 5)),
    competition: COMPETITION_ITALY,
    venue: 'PalaSharp',
  },
];

export const MOCK_RECENT_MATCHES_ITALY: Match[] = [
  {
    id: 471,
    homeTeam: MOCK_TEAMS_ITALY[0],
    awayTeam: MOCK_TEAMS_ITALY[2],
    homeScore: 3,
    awayScore: 2,
    status: 'finished',
    date: toISODate(addDays(today, -1)),
    competition: COMPETITION_ITALY,
    venue: 'Palasport Del Frigo',
    events: [
      { type: 'goal', minute: 5, player: MOCK_PLAYERS_ITALY[2], team: MOCK_TEAMS_ITALY[0], assistPlayer: MOCK_PLAYERS_ITALY[1] },
      { type: 'goal', minute: 12, player: MOCK_PLAYERS_ITALY[12], team: MOCK_TEAMS_ITALY[2], assistPlayer: MOCK_PLAYERS_ITALY[11] },
      { type: 'goal', minute: 22, player: MOCK_PLAYERS_ITALY[3], team: MOCK_TEAMS_ITALY[0], assistPlayer: MOCK_PLAYERS_ITALY[2] },
      { type: 'goal', minute: 30, player: MOCK_PLAYERS_ITALY[11], team: MOCK_TEAMS_ITALY[2], assistPlayer: MOCK_PLAYERS_ITALY[12] },
      { type: 'goal', minute: 38, player: MOCK_PLAYERS_ITALY[2], team: MOCK_TEAMS_ITALY[0], assistPlayer: MOCK_PLAYERS_ITALY[3] },
    ],
  },
  {
    id: 472,
    homeTeam: MOCK_TEAMS_ITALY[1],
    awayTeam: MOCK_TEAMS_ITALY[3],
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
    date: toISODate(addDays(today, -2)),
    competition: COMPETITION_ITALY,
    venue: 'PalaBarbuto',
    events: [
      { type: 'goal', minute: 10, player: MOCK_PLAYERS_ITALY[7], team: MOCK_TEAMS_ITALY[1], assistPlayer: MOCK_PLAYERS_ITALY[6] },
      { type: 'goal', minute: 25, player: MOCK_PLAYERS_ITALY[16], team: MOCK_TEAMS_ITALY[3], assistPlayer: MOCK_PLAYERS_ITALY[17] },
      { type: 'goal', minute: 35, player: MOCK_PLAYERS_ITALY[8], team: MOCK_TEAMS_ITALY[1], assistPlayer: MOCK_PLAYERS_ITALY[7] },
    ],
  },
  {
    id: 473,
    homeTeam: MOCK_TEAMS_ITALY[4],
    awayTeam: MOCK_TEAMS_ITALY[6],
    homeScore: 4,
    awayScore: 1,
    status: 'finished',
    date: toISODate(addDays(today, -3)),
    competition: COMPETITION_ITALY,
    venue: 'PalaDelConero',
  },
  {
    id: 474,
    homeTeam: MOCK_TEAMS_ITALY[5],
    awayTeam: MOCK_TEAMS_ITALY[8],
    homeScore: 1,
    awayScore: 1,
    status: 'finished',
    date: toISODate(addDays(today, -4)),
    competition: COMPETITION_ITALY,
    venue: 'PalaSavelli',
  },
];

export const MOCK_ALL_MATCHES_ITALY: Match[] = [
  ...MOCK_LIVE_MATCHES_ITALY,
  ...MOCK_UPCOMING_MATCHES_ITALY,
  ...MOCK_RECENT_MATCHES_ITALY,
];
