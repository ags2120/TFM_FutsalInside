import { PlayerMatchParticipation } from '../models/player-match.model';

export const MOCK_PLAYER_MATCH_PARTICIPATION_UEFA: PlayerMatchParticipation[] = [
  // === BARÇA UCL (players 1,3,4,5) ===
  { matchId: 481, playerId: 1, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 511, playerId: 1, goals: 0, assists: 0, isMvp: false, rating: 7.5, minutesPlayed: 40 },
  { matchId: 481, playerId: 3, goals: 1, assists: 1, isMvp: false, rating: 8.1, minutesPlayed: 40 },
  { matchId: 511, playerId: 3, goals: 2, assists: 0, isMvp: true, rating: 8.8, minutesPlayed: 40 },
  { matchId: 481, playerId: 4, goals: 2, assists: 0, isMvp: true, rating: 9.1, minutesPlayed: 40 },
  { matchId: 511, playerId: 4, goals: 1, assists: 0, isMvp: false, rating: 7.8, minutesPlayed: 38 },
  { matchId: 481, playerId: 5, goals: 0, assists: 0, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 511, playerId: 5, goals: 0, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },

  // === INTER MOVISTAR UCL (players 6,7,8,9) ===
  { matchId: 482, playerId: 6, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 512, playerId: 6, goals: 0, assists: 1, isMvp: false, rating: 7.5, minutesPlayed: 40 },
  { matchId: 482, playerId: 7, goals: 1, assists: 1, isMvp: false, rating: 8.1, minutesPlayed: 40 },
  { matchId: 512, playerId: 7, goals: 0, assists: 2, isMvp: false, rating: 8.4, minutesPlayed: 40 },
  { matchId: 482, playerId: 8, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 512, playerId: 8, goals: 2, assists: 0, isMvp: true, rating: 8.8, minutesPlayed: 40 },
  { matchId: 482, playerId: 9, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },
  { matchId: 512, playerId: 9, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 38 },

  // === MAGNUS SOROCABA UCL (players 51,52,53,54) ===
  { matchId: 483, playerId: 51, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },
  { matchId: 513, playerId: 51, goals: 1, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 483, playerId: 52, goals: 0, assists: 1, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 513, playerId: 52, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 38 },
  { matchId: 483, playerId: 53, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 513, playerId: 53, goals: 2, assists: 0, isMvp: true, rating: 8.9, minutesPlayed: 40 },
  { matchId: 483, playerId: 54, goals: 1, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 513, playerId: 54, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 38 },

  // === CASCAVEL UCL (players 56,57,58,59) ===
  { matchId: 483, playerId: 56, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 513, playerId: 56, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },
  { matchId: 483, playerId: 57, goals: 0, assists: 2, isMvp: false, rating: 8.4, minutesPlayed: 40 },
  { matchId: 513, playerId: 57, goals: 1, assists: 1, isMvp: false, rating: 8.0, minutesPlayed: 40 },
  { matchId: 483, playerId: 58, goals: 1, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 513, playerId: 58, goals: 2, assists: 1, isMvp: true, rating: 8.8, minutesPlayed: 40 },
  { matchId: 483, playerId: 59, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },
  { matchId: 513, playerId: 59, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 38 },

  // === ITALSERVICE PESARO UCL (players 101,102,103,104) ===
  { matchId: 483, playerId: 101, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },
  { matchId: 513, playerId: 101, goals: 1, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 483, playerId: 102, goals: 0, assists: 1, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 513, playerId: 102, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 38 },
  { matchId: 483, playerId: 103, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 513, playerId: 103, goals: 2, assists: 0, isMvp: true, rating: 8.9, minutesPlayed: 40 },
  { matchId: 483, playerId: 104, goals: 1, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 513, playerId: 104, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 38 },

  // === NAPOLI FUTSAL UCL (players 106,107,108,109) ===
  { matchId: 483, playerId: 106, goals: 0, assists: 1, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 514, playerId: 106, goals: 1, assists: 0, isMvp: false, rating: 7.3, minutesPlayed: 40 },
  { matchId: 483, playerId: 107, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },
  { matchId: 514, playerId: 107, goals: 1, assists: 0, isMvp: false, rating: 7.5, minutesPlayed: 40 },
  { matchId: 483, playerId: 108, goals: 1, assists: 1, isMvp: false, rating: 8.3, minutesPlayed: 40 },
  { matchId: 514, playerId: 108, goals: 0, assists: 2, isMvp: false, rating: 8.0, minutesPlayed: 40 },
  { matchId: 483, playerId: 109, goals: 1, assists: 1, isMvp: false, rating: 8.2, minutesPlayed: 40 },
  { matchId: 514, playerId: 109, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },

  // === SPORTING CP UCL (players 151-154) ===
  { matchId: 501, playerId: 151, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 502, playerId: 151, goals: 0, assists: 0, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 501, playerId: 152, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 502, playerId: 152, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 501, playerId: 153, goals: 1, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 502, playerId: 153, goals: 2, assists: 0, isMvp: true, rating: 8.6, minutesPlayed: 40 },
  { matchId: 501, playerId: 154, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },
  { matchId: 502, playerId: 154, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 38 },

  // === BENFICA UCL (players 155-158) ===
  { matchId: 502, playerId: 155, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },
  { matchId: 504, playerId: 155, goals: 1, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 502, playerId: 156, goals: 1, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 504, playerId: 156, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 502, playerId: 157, goals: 1, assists: 0, isMvp: false, rating: 7.1, minutesPlayed: 40 },
  { matchId: 504, playerId: 157, goals: 2, assists: 0, isMvp: true, rating: 8.6, minutesPlayed: 40 },
  { matchId: 502, playerId: 158, goals: 2, assists: 1, isMvp: true, rating: 9.0, minutesPlayed: 40 },
  { matchId: 504, playerId: 158, goals: 1, assists: 0, isMvp: false, rating: 8.2, minutesPlayed: 40 },

  // === KAIRAT ALMATY UCL (players 159-162) ===
  { matchId: 503, playerId: 159, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },
  { matchId: 503, playerId: 160, goals: 1, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 503, playerId: 161, goals: 1, assists: 0, isMvp: false, rating: 7.1, minutesPlayed: 40 },
  { matchId: 503, playerId: 162, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },

  // === TYUMEN UCL (players 163-166) ===
  { matchId: 504, playerId: 163, goals: 0, assists: 0, isMvp: false, rating: 6.6, minutesPlayed: 40 },
  { matchId: 504, playerId: 164, goals: 0, assists: 1, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 504, playerId: 165, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },
  { matchId: 504, playerId: 166, goals: 0, assists: 0, isMvp: false, rating: 7.0, minutesPlayed: 40 },
];
