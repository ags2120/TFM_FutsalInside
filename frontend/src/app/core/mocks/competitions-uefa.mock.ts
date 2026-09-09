import { Competition } from '../models/competition.model';
import { Standing } from '../models/standings.model';
import { MOCK_TEAMS_UEFA } from './teams-uefa.mock';

export const COMPETITION_UEFA: Competition = {
  id: 5,
  name: 'UEFA Futsal Champions League (EUR)',
  country: 'Europa',
  logoUrl: '',
  season: '2025/2026',
};

export const MOCK_STANDINGS_UEFA: Standing[] = [
  { competitionId: 5, position: 1, team: MOCK_TEAMS_UEFA[0], played: 7, won: 6, drawn: 1, lost: 0, goalsFor: 28, goalsAgainst: 8, goalDifference: 20, points: 19, form: ['W', 'W', 'W', 'D', 'W'] },
  { competitionId: 5, position: 2, team: MOCK_TEAMS_UEFA[1], played: 7, won: 5, drawn: 1, lost: 1, goalsFor: 22, goalsAgainst: 10, goalDifference: 12, points: 16, form: ['W', 'W', 'D', 'W', 'L'] },
  { competitionId: 5, position: 3, team: MOCK_TEAMS_UEFA[2], played: 7, won: 5, drawn: 0, lost: 2, goalsFor: 20, goalsAgainst: 12, goalDifference: 8, points: 15, form: ['W', 'L', 'W', 'W', 'W'] },
  { competitionId: 5, position: 4, team: MOCK_TEAMS_UEFA[3], played: 7, won: 4, drawn: 1, lost: 2, goalsFor: 18, goalsAgainst: 11, goalDifference: 7, points: 13, form: ['D', 'W', 'W', 'L', 'W'] },
  { competitionId: 5, position: 5, team: MOCK_TEAMS_UEFA[4], played: 7, won: 3, drawn: 2, lost: 2, goalsFor: 16, goalsAgainst: 13, goalDifference: 3, points: 11, form: ['W', 'D', 'L', 'W', 'D'] },
  { competitionId: 5, position: 6, team: MOCK_TEAMS_UEFA[5], played: 7, won: 2, drawn: 2, lost: 3, goalsFor: 14, goalsAgainst: 15, goalDifference: -1, points: 8, form: ['L', 'W', 'D', 'D', 'L'] },
  { competitionId: 5, position: 7, team: MOCK_TEAMS_UEFA[6], played: 7, won: 1, drawn: 1, lost: 5, goalsFor: 10, goalsAgainst: 20, goalDifference: -10, points: 4, form: ['L', 'L', 'W', 'L', 'D'] },
  { competitionId: 5, position: 8, team: MOCK_TEAMS_UEFA[7], played: 7, won: 1, drawn: 0, lost: 6, goalsFor: 8, goalsAgainst: 22, goalDifference: -14, points: 3, form: ['L', 'L', 'L', 'W', 'L'] },
  { competitionId: 5, position: 9, team: MOCK_TEAMS_UEFA[8], played: 7, won: 0, drawn: 1, lost: 6, goalsFor: 6, goalsAgainst: 25, goalDifference: -19, points: 1, form: ['L', 'L', 'D', 'L', 'L'] },
  { competitionId: 5, position: 10, team: MOCK_TEAMS_UEFA[9], played: 7, won: 0, drawn: 0, lost: 7, goalsFor: 5, goalsAgainst: 28, goalDifference: -23, points: 0, form: ['L', 'L', 'L', 'L', 'L'] },
];
