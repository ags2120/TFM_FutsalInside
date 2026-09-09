import { Standing } from '../models/standings.model';
import { Competition } from '../models/competition.model';
import { MOCK_TEAMS } from './teams.mock';

export const COMPETITIONS: Competition[] = [
  { id: 1, name: 'Liga Nacional de Fútbol Sala (ESP)', country: 'España', logoUrl: '', season: '2026/2027' },
  { id: 2, name: 'Liga Nacional de Fútbol Sala (ESP)', country: 'España', logoUrl: '', season: '2025/2026' },
];

export const MOCK_STANDINGS: Standing[] = [
  // === COMPETITION 1: Liga Nacional 2026/2027 ===
  { competitionId: 1, position: 1, team: MOCK_TEAMS[0], played: 5, won: 4, drawn: 1, lost: 0, goalsFor: 16, goalsAgainst: 3, goalDifference: 13, points: 13, form: ['W', 'W', 'W', 'D', 'W'] },
  { competitionId: 1, position: 2, team: MOCK_TEAMS[1], played: 5, won: 3, drawn: 2, lost: 0, goalsFor: 17, goalsAgainst: 8, goalDifference: 9, points: 11, form: ['D', 'W', 'W', 'W', 'W'] },
  { competitionId: 1, position: 3, team: MOCK_TEAMS[2], played: 5, won: 2, drawn: 1, lost: 2, goalsFor: 11, goalsAgainst: 13, goalDifference: -2, points: 7, form: ['W', 'W', 'D', 'L', 'L'] },
  { competitionId: 1, position: 4, team: MOCK_TEAMS[3], played: 5, won: 2, drawn: 1, lost: 2, goalsFor: 10, goalsAgainst: 9, goalDifference: 1, points: 7, form: ['D', 'W', 'W', 'L', 'L'] },
  { competitionId: 1, position: 5, team: MOCK_TEAMS[4], played: 5, won: 2, drawn: 1, lost: 2, goalsFor: 8, goalsAgainst: 11, goalDifference: -3, points: 7, form: ['L', 'L', 'W', 'W', 'L'] },
  { competitionId: 1, position: 6, team: MOCK_TEAMS[8], played: 5, won: 2, drawn: 0, lost: 3, goalsFor: 13, goalsAgainst: 12, goalDifference: 1, points: 6, form: ['L', 'L', 'W', 'L', 'W'] },
  { competitionId: 1, position: 7, team: MOCK_TEAMS[5], played: 5, won: 1, drawn: 1, lost: 3, goalsFor: 7, goalsAgainst: 12, goalDifference: -5, points: 4, form: ['W', 'L', 'L', 'L', 'W'] },
  { competitionId: 1, position: 8, team: MOCK_TEAMS[6], played: 5, won: 1, drawn: 1, lost: 3, goalsFor: 6, goalsAgainst: 10, goalDifference: -4, points: 4, form: ['L', 'L', 'L', 'W', 'L'] },
  { competitionId: 1, position: 9, team: MOCK_TEAMS[7], played: 5, won: 1, drawn: 1, lost: 3, goalsFor: 12, goalsAgainst: 16, goalDifference: -4, points: 4, form: ['L', 'W', 'L', 'L', 'L'] },
  { competitionId: 1, position: 10, team: MOCK_TEAMS[9], played: 5, won: 1, drawn: 1, lost: 3, goalsFor: 8, goalsAgainst: 12, goalDifference: -4, points: 4, form: ['L', 'W', 'L', 'D', 'L'] },

  // === COMPETITION 2: Liga Nacional 2025/2026 ===
  { competitionId: 2, position: 1, team: MOCK_TEAMS[1], played: 38, won: 28, drawn: 6, lost: 4, goalsFor: 142, goalsAgainst: 62, goalDifference: 80, points: 90, form: ['W', 'W', 'D', 'W', 'W'] },
  { competitionId: 2, position: 2, team: MOCK_TEAMS[0], played: 38, won: 27, drawn: 5, lost: 6, goalsFor: 135, goalsAgainst: 58, goalDifference: 77, points: 86, form: ['W', 'W', 'W', 'W', 'D'] },
  { competitionId: 2, position: 3, team: MOCK_TEAMS[3], played: 38, won: 24, drawn: 8, lost: 6, goalsFor: 120, goalsAgainst: 65, goalDifference: 55, points: 80, form: ['W', 'D', 'W', 'W', 'L'] },
  { competitionId: 2, position: 4, team: MOCK_TEAMS[4], played: 38, won: 22, drawn: 6, lost: 10, goalsFor: 105, goalsAgainst: 78, goalDifference: 27, points: 72, form: ['L', 'W', 'W', 'D', 'W'] },
  { competitionId: 2, position: 5, team: MOCK_TEAMS[2], played: 38, won: 20, drawn: 7, lost: 11, goalsFor: 98, goalsAgainst: 82, goalDifference: 16, points: 67, form: ['W', 'W', 'L', 'W', 'D'] },
  { competitionId: 2, position: 6, team: MOCK_TEAMS[6], played: 38, won: 18, drawn: 8, lost: 12, goalsFor: 92, goalsAgainst: 80, goalDifference: 12, points: 62, form: ['D', 'W', 'L', 'W', 'W'] },
  { competitionId: 2, position: 7, team: MOCK_TEAMS[5], played: 38, won: 15, drawn: 10, lost: 13, goalsFor: 85, goalsAgainst: 88, goalDifference: -3, points: 55, form: ['L', 'D', 'W', 'L', 'W'] },
  { competitionId: 2, position: 8, team: MOCK_TEAMS[8], played: 38, won: 14, drawn: 9, lost: 15, goalsFor: 80, goalsAgainst: 85, goalDifference: -5, points: 51, form: ['W', 'L', 'L', 'D', 'W'] },
  { competitionId: 2, position: 9, team: MOCK_TEAMS[9], played: 38, won: 12, drawn: 11, lost: 15, goalsFor: 78, goalsAgainst: 90, goalDifference: -12, points: 47, form: ['D', 'D', 'L', 'W', 'L'] },
  { competitionId: 2, position: 10, team: MOCK_TEAMS[7], played: 38, won: 8, drawn: 6, lost: 24, goalsFor: 65, goalsAgainst: 120, goalDifference: -55, points: 30, form: ['L', 'L', 'L', 'D', 'L'] },
];
