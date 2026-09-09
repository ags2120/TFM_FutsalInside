import { Match } from '../models/match.model';
import { MOCK_TEAMS_UEFA } from './teams-uefa.mock';
import { MOCK_PLAYERS_UEFA } from './players-uefa.mock';
import { COMPETITION_UEFA } from './competitions-uefa.mock';

const today = new Date();
const toISODate = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
};

const findPlayer = (id: number) => MOCK_PLAYERS_UEFA.find(p => p.id === id)!;

export const MOCK_LIVE_MATCHES_UEFA: Match[] = [
  {
    id: 481,
    homeTeam: MOCK_TEAMS_UEFA[0],
    awayTeam: MOCK_TEAMS_UEFA[1],
    homeScore: 3,
    awayScore: 1,
    status: 'live',
    minute: 30,
    date: toISODate(today),
    competition: COMPETITION_UEFA,
    venue: 'Palau Blaugrana',
    events: [
      { type: 'goal', minute: 5, player: findPlayer(4), team: MOCK_TEAMS_UEFA[0], assistPlayer: findPlayer(1) },
      { type: 'goal', minute: 12, player: findPlayer(7), team: MOCK_TEAMS_UEFA[1], assistPlayer: findPlayer(6) },
      { type: 'yellowcard', minute: 18, player: findPlayer(1), team: MOCK_TEAMS_UEFA[0] },
      { type: 'goal', minute: 25, player: findPlayer(3), team: MOCK_TEAMS_UEFA[0], assistPlayer: findPlayer(4) },
      { type: 'goal', minute: 28, player: findPlayer(4), team: MOCK_TEAMS_UEFA[0], assistPlayer: findPlayer(3) },
    ],
    statistics: [
      { type: 'Posesión', homeValue: 58, awayValue: 42 },
      { type: 'Tiros', homeValue: 15, awayValue: 8 },
      { type: 'Tiros a puerta', homeValue: 8, awayValue: 3 },
    ],
  },
  {
    id: 482,
    homeTeam: MOCK_TEAMS_UEFA[2],
    awayTeam: MOCK_TEAMS_UEFA[3],
    homeScore: 2,
    awayScore: 2,
    status: 'halftime',
    minute: 20,
    date: toISODate(today),
    competition: COMPETITION_UEFA,
    venue: 'Arena Sorocaba',
    events: [
      { type: 'goal', minute: 8, player: findPlayer(53), team: MOCK_TEAMS_UEFA[2], assistPlayer: findPlayer(52) },
      { type: 'goal', minute: 15, player: findPlayer(58), team: MOCK_TEAMS_UEFA[3], assistPlayer: findPlayer(57) },
      { type: 'goal', minute: 18, player: findPlayer(52), team: MOCK_TEAMS_UEFA[2], assistPlayer: findPlayer(53) },
      { type: 'goal', minute: 19, player: findPlayer(57), team: MOCK_TEAMS_UEFA[3], assistPlayer: findPlayer(58) },
    ],
  },
  {
    id: 483,
    homeTeam: MOCK_TEAMS_UEFA[4],
    awayTeam: MOCK_TEAMS_UEFA[5],
    homeScore: 4,
    awayScore: 1,
    status: 'live',
    minute: 35,
    date: toISODate(today),
    competition: COMPETITION_UEFA,
    venue: 'Palasport Del Frigo',
  },
];

export const MOCK_UPCOMING_MATCHES_UEFA: Match[] = [
  {
    id: 501,
    homeTeam: MOCK_TEAMS_UEFA[0],
    awayTeam: MOCK_TEAMS_UEFA[6],
    homeScore: 0, awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 1)),
    competition: COMPETITION_UEFA,
    venue: 'Palau Blaugrana',
  },
  {
    id: 502,
    homeTeam: MOCK_TEAMS_UEFA[1],
    awayTeam: MOCK_TEAMS_UEFA[7],
    homeScore: 0, awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 2)),
    competition: COMPETITION_UEFA,
    venue: 'Pabellón Vista Alegre',
  },
  {
    id: 503,
    homeTeam: MOCK_TEAMS_UEFA[2],
    awayTeam: MOCK_TEAMS_UEFA[8],
    homeScore: 0, awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 3)),
    competition: COMPETITION_UEFA,
    venue: 'Arena Sorocaba',
  },
  {
    id: 504,
    homeTeam: MOCK_TEAMS_UEFA[9],
    awayTeam: MOCK_TEAMS_UEFA[0],
    homeScore: 0, awayScore: 0,
    status: 'scheduled',
    date: toISODate(addDays(today, 4)),
    competition: COMPETITION_UEFA,
    venue: 'Gavin Arena',
  },
];

export const MOCK_RECENT_MATCHES_UEFA: Match[] = [
  {
    id: 511,
    homeTeam: MOCK_TEAMS_UEFA[0],
    awayTeam: MOCK_TEAMS_UEFA[2],
    homeScore: 4,
    awayScore: 2,
    status: 'finished',
    date: toISODate(addDays(today, -1)),
    competition: COMPETITION_UEFA,
    venue: 'Palau Blaugrana',
    events: [
      { type: 'goal', minute: 5, player: findPlayer(4), team: MOCK_TEAMS_UEFA[0], assistPlayer: findPlayer(1) },
      { type: 'goal', minute: 12, player: findPlayer(53), team: MOCK_TEAMS_UEFA[2], assistPlayer: findPlayer(52) },
      { type: 'goal', minute: 20, player: findPlayer(3), team: MOCK_TEAMS_UEFA[0], assistPlayer: findPlayer(4) },
      { type: 'yellowcard', minute: 25, player: findPlayer(52), team: MOCK_TEAMS_UEFA[2] },
      { type: 'goal', minute: 30, player: findPlayer(4), team: MOCK_TEAMS_UEFA[0], assistPlayer: findPlayer(3) },
      { type: 'goal', minute: 38, player: findPlayer(52), team: MOCK_TEAMS_UEFA[2], assistPlayer: findPlayer(53) },
    ],
  },
  {
    id: 512,
    homeTeam: MOCK_TEAMS_UEFA[1],
    awayTeam: MOCK_TEAMS_UEFA[3],
    homeScore: 3,
    awayScore: 0,
    status: 'finished',
    date: toISODate(addDays(today, -2)),
    competition: COMPETITION_UEFA,
    venue: 'Pabellón Vista Alegre',
    events: [
      { type: 'goal', minute: 10, player: findPlayer(7), team: MOCK_TEAMS_UEFA[1], assistPlayer: findPlayer(6) },
      { type: 'goal', minute: 22, player: findPlayer(6), team: MOCK_TEAMS_UEFA[1], assistPlayer: findPlayer(7) },
      { type: 'goal', minute: 35, player: findPlayer(9), team: MOCK_TEAMS_UEFA[1], assistPlayer: findPlayer(6) },
    ],
  },
  {
    id: 513,
    homeTeam: MOCK_TEAMS_UEFA[4],
    awayTeam: MOCK_TEAMS_UEFA[6],
    homeScore: 3,
    awayScore: 1,
    status: 'finished',
    date: toISODate(addDays(today, -3)),
    competition: COMPETITION_UEFA,
    venue: 'Palasport Del Frigo',
  },
  {
    id: 514,
    homeTeam: MOCK_TEAMS_UEFA[5],
    awayTeam: MOCK_TEAMS_UEFA[9],
    homeScore: 5,
    awayScore: 0,
    status: 'finished',
    date: toISODate(addDays(today, -4)),
    competition: COMPETITION_UEFA,
    venue: 'PalaBarbuto',
  },
];

export const MOCK_ALL_MATCHES_UEFA: Match[] = [
  ...MOCK_LIVE_MATCHES_UEFA,
  ...MOCK_UPCOMING_MATCHES_UEFA,
  ...MOCK_RECENT_MATCHES_UEFA,
];
