import { TeamStatistics } from '../models/statistics.model';
import { MOCK_TEAMS_UEFA } from './teams-uefa.mock';

export const MOCK_TEAM_STATISTICS_UEFA: TeamStatistics[] = [
  { teamId: 1, season: '2025/2026', goalsScored: 28, goalsConceded: 8, cleanSheets: 4, matchesPlayed: 7, wins: 6, draws: 1, losses: 0, avgBallPossession: 60, avgShotsPerMatch: 26 },
  { teamId: 2, season: '2025/2026', goalsScored: 22, goalsConceded: 10, cleanSheets: 3, matchesPlayed: 7, wins: 5, draws: 1, losses: 1, avgBallPossession: 56, avgShotsPerMatch: 23 },
  { teamId: 11, season: '2025/2026', goalsScored: 20, goalsConceded: 12, cleanSheets: 2, matchesPlayed: 7, wins: 5, draws: 0, losses: 2, avgBallPossession: 54, avgShotsPerMatch: 21 },
  { teamId: 12, season: '2025/2026', goalsScored: 18, goalsConceded: 11, cleanSheets: 2, matchesPlayed: 7, wins: 4, draws: 1, losses: 2, avgBallPossession: 52, avgShotsPerMatch: 20 },
  { teamId: 21, season: '2025/2026', goalsScored: 16, goalsConceded: 13, cleanSheets: 1, matchesPlayed: 7, wins: 3, draws: 2, losses: 2, avgBallPossession: 50, avgShotsPerMatch: 19 },
  { teamId: 22, season: '2025/2026', goalsScored: 14, goalsConceded: 15, cleanSheets: 1, matchesPlayed: 7, wins: 2, draws: 2, losses: 3, avgBallPossession: 48, avgShotsPerMatch: 18 },
  { teamId: 31, season: '2025/2026', goalsScored: 10, goalsConceded: 20, cleanSheets: 0, matchesPlayed: 7, wins: 1, draws: 1, losses: 5, avgBallPossession: 44, avgShotsPerMatch: 15 },
  { teamId: 32, season: '2025/2026', goalsScored: 8, goalsConceded: 22, cleanSheets: 0, matchesPlayed: 7, wins: 1, draws: 0, losses: 6, avgBallPossession: 42, avgShotsPerMatch: 14 },
  { teamId: 33, season: '2025/2026', goalsScored: 6, goalsConceded: 25, cleanSheets: 0, matchesPlayed: 7, wins: 0, draws: 1, losses: 6, avgBallPossession: 40, avgShotsPerMatch: 13 },
  { teamId: 34, season: '2025/2026', goalsScored: 5, goalsConceded: 28, cleanSheets: 0, matchesPlayed: 7, wins: 0, draws: 0, losses: 7, avgBallPossession: 38, avgShotsPerMatch: 12 },
];
