import { TeamStatistics } from '../models/statistics.model';
import { MOCK_TEAMS } from './teams.mock';

export const MOCK_TEAM_STATISTICS: TeamStatistics[] = [
  // Barça (id: 1)
  {
    teamId: 1, season: '2025/2026',
    goalsScored: 68, goalsConceded: 32, cleanSheets: 6, matchesPlayed: 18,
    wins: 14, draws: 2, losses: 2,
    avgBallPossession: 58, avgShotsPerMatch: 24,
  },
  // Inter Movistar (id: 2)
  {
    teamId: 2, season: '2025/2026',
    goalsScored: 62, goalsConceded: 28, cleanSheets: 7, matchesPlayed: 18,
    wins: 13, draws: 3, losses: 2,
    avgBallPossession: 55, avgShotsPerMatch: 22,
  },
  // ElPozo Murcia (id: 3)
  {
    teamId: 3, season: '2025/2026',
    goalsScored: 52, goalsConceded: 35, cleanSheets: 4, matchesPlayed: 18,
    wins: 11, draws: 3, losses: 4,
    avgBallPossession: 50, avgShotsPerMatch: 20,
  },
  // Palma Futsal (id: 4)
  {
    teamId: 4, season: '2025/2026',
    goalsScored: 55, goalsConceded: 35, cleanSheets: 5, matchesPlayed: 18,
    wins: 12, draws: 2, losses: 4,
    avgBallPossession: 52, avgShotsPerMatch: 21,
  },
  // Jaén Paraíso Interior (id: 5)
  {
    teamId: 5, season: '2025/2026',
    goalsScored: 48, goalsConceded: 38, cleanSheets: 3, matchesPlayed: 18,
    wins: 9, draws: 4, losses: 5,
    avgBallPossession: 48, avgShotsPerMatch: 18,
  },
  // Córdoba (id: 6)
  {
    teamId: 6, season: '2025/2026',
    goalsScored: 45, goalsConceded: 40, cleanSheets: 3, matchesPlayed: 18,
    wins: 8, draws: 5, losses: 5,
    avgBallPossession: 47, avgShotsPerMatch: 17,
  },
  // Jimbee Cartagena (id: 7)
  {
    teamId: 7, season: '2025/2026',
    goalsScored: 50, goalsConceded: 36, cleanSheets: 4, matchesPlayed: 18,
    wins: 9, draws: 4, losses: 5,
    avgBallPossession: 49, avgShotsPerMatch: 19,
  },
  // Manzanares FS (id: 8)
  {
    teamId: 8, season: '2025/2026',
    goalsScored: 40, goalsConceded: 42, cleanSheets: 2, matchesPlayed: 18,
    wins: 7, draws: 5, losses: 6,
    avgBallPossession: 45, avgShotsPerMatch: 16,
  },
  // Ribera Navarra (id: 9)
  {
    teamId: 9, season: '2025/2026',
    goalsScored: 38, goalsConceded: 45, cleanSheets: 2, matchesPlayed: 18,
    wins: 5, draws: 5, losses: 8,
    avgBallPossession: 44, avgShotsPerMatch: 15,
  },
  // Jaén FS (id: 10)
  {
    teamId: 10, season: '2025/2026',
    goalsScored: 32, goalsConceded: 50, cleanSheets: 1, matchesPlayed: 18,
    wins: 3, draws: 2, losses: 13,
    avgBallPossession: 42, avgShotsPerMatch: 14,
  },
];
