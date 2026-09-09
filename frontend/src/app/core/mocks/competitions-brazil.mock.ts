import { Competition } from '../models/competition.model';
import { Standing } from '../models/standings.model';
import { MOCK_TEAMS_BRAZIL } from './teams-brazil.mock';

export const COMPETITION_BRAZIL: Competition = {
  id: 3,
  name: 'Liga Nacional de Futsal (BRA)',
  country: 'Brasil',
  logoUrl: '',
  season: '2025/2026',
};

export const MOCK_STANDINGS_BRAZIL: Standing[] = [
  { competitionId: 3, position: 1, team: MOCK_TEAMS_BRAZIL[0], played: 18, won: 14, drawn: 2, lost: 2, goalsFor: 72, goalsAgainst: 30, goalDifference: 42, points: 44, form: ['W', 'W', 'W', 'D', 'W'] },
  { competitionId: 3, position: 2, team: MOCK_TEAMS_BRAZIL[1], played: 18, won: 13, drawn: 3, lost: 2, goalsFor: 65, goalsAgainst: 28, goalDifference: 37, points: 42, form: ['W', 'W', 'D', 'W', 'W'] },
  { competitionId: 3, position: 3, team: MOCK_TEAMS_BRAZIL[2], played: 18, won: 12, drawn: 2, lost: 4, goalsFor: 58, goalsAgainst: 32, goalDifference: 26, points: 38, form: ['W', 'L', 'W', 'W', 'W'] },
  { competitionId: 3, position: 4, team: MOCK_TEAMS_BRAZIL[3], played: 18, won: 10, drawn: 4, lost: 4, goalsFor: 52, goalsAgainst: 35, goalDifference: 17, points: 34, form: ['D', 'W', 'W', 'L', 'W'] },
  { competitionId: 3, position: 5, team: MOCK_TEAMS_BRAZIL[4], played: 18, won: 9, drawn: 3, lost: 6, goalsFor: 48, goalsAgainst: 38, goalDifference: 10, points: 30, form: ['L', 'W', 'D', 'W', 'L'] },
  { competitionId: 3, position: 6, team: MOCK_TEAMS_BRAZIL[5], played: 18, won: 8, drawn: 4, lost: 6, goalsFor: 45, goalsAgainst: 40, goalDifference: 5, points: 28, form: ['W', 'D', 'L', 'W', 'D'] },
  { competitionId: 3, position: 7, team: MOCK_TEAMS_BRAZIL[6], played: 18, won: 7, drawn: 3, lost: 8, goalsFor: 42, goalsAgainst: 42, goalDifference: 0, points: 24, form: ['L', 'W', 'L', 'D', 'W'] },
  { competitionId: 3, position: 8, team: MOCK_TEAMS_BRAZIL[7], played: 18, won: 5, drawn: 5, lost: 8, goalsFor: 38, goalsAgainst: 45, goalDifference: -7, points: 20, form: ['D', 'L', 'W', 'L', 'D'] },
  { competitionId: 3, position: 9, team: MOCK_TEAMS_BRAZIL[8], played: 18, won: 4, drawn: 3, lost: 11, goalsFor: 35, goalsAgainst: 52, goalDifference: -17, points: 15, form: ['L', 'L', 'D', 'L', 'W'] },
  { competitionId: 3, position: 10, team: MOCK_TEAMS_BRAZIL[9], played: 18, won: 2, drawn: 3, lost: 13, goalsFor: 28, goalsAgainst: 60, goalDifference: -32, points: 9, form: ['L', 'L', 'L', 'D', 'L'] },
];
