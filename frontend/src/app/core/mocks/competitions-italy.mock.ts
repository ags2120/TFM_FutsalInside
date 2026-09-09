import { Competition } from '../models/competition.model';
import { Standing } from '../models/standings.model';
import { MOCK_TEAMS_ITALY } from './teams-italy.mock';

export const COMPETITION_ITALY: Competition = {
  id: 4,
  name: 'Serie A (ITA)',
  country: 'Italia',
  logoUrl: '',
  season: '2025/2026',
};

export const MOCK_STANDINGS_ITALY: Standing[] = [
  { competitionId: 4, position: 1, team: MOCK_TEAMS_ITALY[0], played: 18, won: 15, drawn: 1, lost: 2, goalsFor: 68, goalsAgainst: 25, goalDifference: 43, points: 46, form: ['W', 'W', 'W', 'W', 'D'] },
  { competitionId: 4, position: 2, team: MOCK_TEAMS_ITALY[1], played: 18, won: 13, drawn: 3, lost: 2, goalsFor: 60, goalsAgainst: 28, goalDifference: 32, points: 42, form: ['W', 'W', 'D', 'W', 'W'] },
  { competitionId: 4, position: 3, team: MOCK_TEAMS_ITALY[2], played: 18, won: 12, drawn: 2, lost: 4, goalsFor: 55, goalsAgainst: 30, goalDifference: 25, points: 38, form: ['W', 'L', 'W', 'W', 'W'] },
  { competitionId: 4, position: 4, team: MOCK_TEAMS_ITALY[3], played: 18, won: 10, drawn: 4, lost: 4, goalsFor: 50, goalsAgainst: 32, goalDifference: 18, points: 34, form: ['D', 'W', 'L', 'W', 'D'] },
  { competitionId: 4, position: 5, team: MOCK_TEAMS_ITALY[4], played: 18, won: 9, drawn: 3, lost: 6, goalsFor: 46, goalsAgainst: 36, goalDifference: 10, points: 30, form: ['L', 'W', 'W', 'D', 'W'] },
  { competitionId: 4, position: 6, team: MOCK_TEAMS_ITALY[5], played: 18, won: 8, drawn: 4, lost: 6, goalsFor: 42, goalsAgainst: 38, goalDifference: 4, points: 28, form: ['W', 'D', 'L', 'D', 'W'] },
  { competitionId: 4, position: 7, team: MOCK_TEAMS_ITALY[6], played: 18, won: 7, drawn: 3, lost: 8, goalsFor: 40, goalsAgainst: 40, goalDifference: 0, points: 24, form: ['L', 'W', 'D', 'L', 'W'] },
  { competitionId: 4, position: 8, team: MOCK_TEAMS_ITALY[7], played: 18, won: 5, drawn: 4, lost: 9, goalsFor: 36, goalsAgainst: 44, goalDifference: -8, points: 19, form: ['D', 'L', 'W', 'L', 'D'] },
  { competitionId: 4, position: 9, team: MOCK_TEAMS_ITALY[8], played: 18, won: 3, drawn: 4, lost: 11, goalsFor: 32, goalsAgainst: 52, goalDifference: -20, points: 13, form: ['L', 'D', 'L', 'L', 'W'] },
  { competitionId: 4, position: 10, team: MOCK_TEAMS_ITALY[9], played: 18, won: 2, drawn: 2, lost: 14, goalsFor: 25, goalsAgainst: 62, goalDifference: -37, points: 8, form: ['L', 'L', 'L', 'D', 'L'] },
];
