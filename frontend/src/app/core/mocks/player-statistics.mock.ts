import { PlayerStatistics } from '../models/statistics.model';

export const MOCK_PLAYER_STATISTICS: PlayerStatistics[] = [
  // === BARÇA (id: 1) ===
  // Dyego Coelho (id: 1) - cierre
  { playerId: 1, season: '2025/2026', goals: 0, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 160, careerGoals: 12, careerAssists: 18, careerYellowCards: 22, careerRedCards: 2, careerMatchesPlayed: 185, expectedGoals: 0.8, expectedAssists: 1.5, goalParticipation: 2, passAccuracy: 84, shotAccuracy: 32, defensiveActions: 18 },
  // Adolfo Fernández (id: 2) - ala
  { playerId: 2, season: '2025/2026', goals: 3, assists: 5, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 52, careerAssists: 38, careerYellowCards: 12, careerRedCards: 1, careerMatchesPlayed: 195, expectedGoals: 2.8, expectedAssists: 4.2, goalParticipation: 8, passAccuracy: 82, shotAccuracy: 62, defensiveActions: 8 },
  // Pito Martínez (id: 3) - pivot
  { playerId: 3, season: '2025/2026', goals: 5, assists: 3, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 78, careerAssists: 25, careerYellowCards: 18, careerRedCards: 2, careerMatchesPlayed: 215, expectedGoals: 4.5, expectedAssists: 2.5, goalParticipation: 8, passAccuracy: 76, shotAccuracy: 68, defensiveActions: 10 },
  // Ferrão (id: 4) - ala
  { playerId: 4, season: '2025/2026', goals: 4, assists: 3, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 62, careerAssists: 42, careerYellowCards: 10, careerRedCards: 1, careerMatchesPlayed: 200, expectedGoals: 3.8, expectedAssists: 2.8, goalParticipation: 7, passAccuracy: 85, shotAccuracy: 66, defensiveActions: 7 },
  // Juanjo Catato (id: 5) - portero
  { playerId: 5, season: '2025/2026', goals: 1, assists: 0, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, saves: 32, blocks: 4, steals: 3, careerGoals: 3, careerAssists: 6, careerYellowCards: 8, careerRedCards: 0, careerMatchesPlayed: 195, expectedGoals: 0.3, expectedAssists: 0.5, goalParticipation: 1, passAccuracy: 72, shotAccuracy: 25, defensiveActions: 22 },

  // === INTER MOVISTAR (id: 2) ===
  // Ricardinho (id: 6) - cierre
  { playerId: 6, season: '2025/2026', goals: 0, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 160, careerGoals: 15, careerAssists: 22, careerYellowCards: 25, careerRedCards: 2, careerMatchesPlayed: 210, expectedGoals: 1.0, expectedAssists: 1.8, goalParticipation: 2, passAccuracy: 85, shotAccuracy: 35, defensiveActions: 20 },
  // Higor Pino (id: 7) - ala
  { playerId: 7, season: '2025/2026', goals: 4, assists: 3, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 38, careerAssists: 45, careerYellowCards: 12, careerRedCards: 1, careerMatchesPlayed: 195, expectedGoals: 3.5, expectedAssists: 3.0, goalParticipation: 7, passAccuracy: 86, shotAccuracy: 60, defensiveActions: 9 },
  // Bebe (id: 8) - pivot
  { playerId: 8, season: '2025/2026', goals: 6, assists: 3, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 72, careerAssists: 35, careerYellowCards: 15, careerRedCards: 2, careerMatchesPlayed: 205, expectedGoals: 5.2, expectedAssists: 2.5, goalParticipation: 9, passAccuracy: 78, shotAccuracy: 65, defensiveActions: 12 },
  // Miguelín (id: 9) - ala
  { playerId: 9, season: '2025/2026', goals: 3, assists: 4, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 35, careerAssists: 48, careerYellowCards: 8, careerRedCards: 0, careerMatchesPlayed: 190, expectedGoals: 2.8, expectedAssists: 3.5, goalParticipation: 7, passAccuracy: 87, shotAccuracy: 58, defensiveActions: 7 },
  // Jesús Velasco (id: 10) - portero
  { playerId: 10, season: '2025/2026', goals: 1, assists: 0, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, saves: 28, blocks: 3, steals: 2, careerGoals: 4, careerAssists: 8, careerYellowCards: 5, careerRedCards: 0, careerMatchesPlayed: 190, expectedGoals: 0.2, expectedAssists: 0.6, goalParticipation: 1, passAccuracy: 70, shotAccuracy: 22, defensiveActions: 20 },

  // === ELPOZO MURCIA (id: 3) ===
  // Chino (id: 11) - cierre
  { playerId: 11, season: '2025/2026', goals: 2, assists: 1, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 160, careerGoals: 14, careerAssists: 18, careerYellowCards: 30, careerRedCards: 3, careerMatchesPlayed: 200, expectedGoals: 1.5, expectedAssists: 1.2, goalParticipation: 3, passAccuracy: 78, shotAccuracy: 42, defensiveActions: 22 },
  // Diego Rios (id: 12) - ala
  { playerId: 12, season: '2025/2026', goals: 3, assists: 2, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 25, careerAssists: 28, careerYellowCards: 15, careerRedCards: 1, careerMatchesPlayed: 175, expectedGoals: 2.5, expectedAssists: 2.0, goalParticipation: 5, passAccuracy: 80, shotAccuracy: 55, defensiveActions: 10 },
  // Raúl Gutiérrez (id: 13) - pivot
  { playerId: 13, season: '2025/2026', goals: 4, assists: 3, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 55, careerAssists: 18, careerYellowCards: 22, careerRedCards: 1, careerMatchesPlayed: 190, expectedGoals: 3.5, expectedAssists: 2.5, goalParticipation: 7, passAccuracy: 74, shotAccuracy: 62, defensiveActions: 14 },
  // Pol Pacheco (id: 14) - ala
  { playerId: 14, season: '2025/2026', goals: 2, assists: 3, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 28, careerAssists: 32, careerYellowCards: 10, careerRedCards: 0, careerMatchesPlayed: 180, expectedGoals: 1.8, expectedAssists: 2.5, goalParticipation: 5, passAccuracy: 79, shotAccuracy: 52, defensiveActions: 9 },
  // Carlos Barrón (id: 15) - portero
  { playerId: 15, season: '2025/2026', goals: 0, assists: 0, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, saves: 35, blocks: 5, steals: 2, careerGoals: 2, careerAssists: 4, careerYellowCards: 10, careerRedCards: 1, careerMatchesPlayed: 195, expectedGoals: 0.1, expectedAssists: 0.3, goalParticipation: 0, passAccuracy: 68, shotAccuracy: 20, defensiveActions: 25 },

  // === PALMA FUTSAL (id: 4) ===
  // Neto (id: 16) - cierre
  { playerId: 16, season: '2025/2026', goals: 1, assists: 1, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 160, careerGoals: 12, careerAssists: 15, careerYellowCards: 20, careerRedCards: 2, careerMatchesPlayed: 190, expectedGoals: 0.8, expectedAssists: 1.0, goalParticipation: 2, passAccuracy: 80, shotAccuracy: 38, defensiveActions: 18 },
  // Zico (id: 17) - ala
  { playerId: 17, season: '2025/2026', goals: 3, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 32, careerAssists: 38, careerYellowCards: 8, careerRedCards: 0, careerMatchesPlayed: 185, expectedGoals: 2.5, expectedAssists: 2.5, goalParticipation: 5, passAccuracy: 86, shotAccuracy: 58, defensiveActions: 8 },
  // Climaco Rafael (id: 18) - pivot
  { playerId: 18, season: '2025/2026', goals: 2, assists: 3, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 48, careerAssists: 30, careerYellowCards: 10, careerRedCards: 0, careerMatchesPlayed: 185, expectedGoals: 2.0, expectedAssists: 2.5, goalParticipation: 5, passAccuracy: 82, shotAccuracy: 60, defensiveActions: 10 },
  // Marlon Álvarez (id: 19) - ala
  { playerId: 19, season: '2025/2026', goals: 1, assists: 2, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 30, careerAssists: 42, careerYellowCards: 10, careerRedCards: 0, careerMatchesPlayed: 185, expectedGoals: 1.2, expectedAssists: 2.5, goalParticipation: 3, passAccuracy: 83, shotAccuracy: 52, defensiveActions: 9 },
  // Pablo Saucedo (id: 20) - portero
  { playerId: 20, season: '2025/2026', goals: 0, assists: 0, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, saves: 30, blocks: 4, steals: 2, careerGoals: 2, careerAssists: 5, careerYellowCards: 4, careerRedCards: 0, careerMatchesPlayed: 185, expectedGoals: 0.1, expectedAssists: 0.4, goalParticipation: 0, passAccuracy: 65, shotAccuracy: 18, defensiveActions: 22 },

  // === JAÉN PARAÍSO INTERIOR (id: 5) ===
  // César (id: 21) - cierre
  { playerId: 21, season: '2025/2026', goals: 1, assists: 2, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 160, careerGoals: 10, careerAssists: 14, careerYellowCards: 28, careerRedCards: 3, careerMatchesPlayed: 195, expectedGoals: 0.8, expectedAssists: 1.5, goalParticipation: 3, passAccuracy: 76, shotAccuracy: 38, defensiveActions: 20 },
  // Alex Yepes (id: 22) - ala
  { playerId: 22, season: '2025/2026', goals: 1, assists: 3, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 25, careerAssists: 22, careerYellowCards: 18, careerRedCards: 1, careerMatchesPlayed: 185, expectedGoals: 1.0, expectedAssists: 2.5, goalParticipation: 4, passAccuracy: 74, shotAccuracy: 48, defensiveActions: 12 },
  // David Ruiz (id: 23) - pivot
  { playerId: 23, season: '2025/2026', goals: 3, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 45, careerAssists: 15, careerYellowCards: 12, careerRedCards: 1, careerMatchesPlayed: 180, expectedGoals: 2.5, expectedAssists: 1.5, goalParticipation: 5, passAccuracy: 73, shotAccuracy: 62, defensiveActions: 14 },
  // Pedro del Rey (id: 24) - ala
  { playerId: 24, season: '2025/2026', goals: 2, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 55, careerAssists: 32, careerYellowCards: 8, careerRedCards: 0, careerMatchesPlayed: 195, expectedGoals: 1.8, expectedAssists: 2.0, goalParticipation: 4, passAccuracy: 80, shotAccuracy: 58, defensiveActions: 8 },
  // Alberto González (id: 25) - portero
  { playerId: 25, season: '2025/2026', goals: 0, assists: 0, yellowCards: 0, redCards: 1, matchesPlayed: 4, minutesPlayed: 160, saves: 25, blocks: 3, steals: 2, careerGoals: 3, careerAssists: 3, careerYellowCards: 6, careerRedCards: 1, careerMatchesPlayed: 185, expectedGoals: 0.1, expectedAssists: 0.2, goalParticipation: 0, passAccuracy: 71, shotAccuracy: 20, defensiveActions: 18 },

  // === CÓRDOBA (id: 6) ===
  // Eloy Rojas (id: 26) - cierre
  { playerId: 26, season: '2025/2026', goals: 0, assists: 1, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 160, careerGoals: 15, careerAssists: 12, careerYellowCards: 22, careerRedCards: 2, careerMatchesPlayed: 200, expectedGoals: 0.8, expectedAssists: 0.8, goalParticipation: 1, passAccuracy: 77, shotAccuracy: 35, defensiveActions: 18 },
  // Nikolay Líber (id: 27) - ala
  { playerId: 27, season: '2025/2026', goals: 2, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 38, careerAssists: 42, careerYellowCards: 10, careerRedCards: 0, careerMatchesPlayed: 195, expectedGoals: 1.8, expectedAssists: 2.0, goalParticipation: 4, passAccuracy: 85, shotAccuracy: 55, defensiveActions: 8 },
  // Juanlu (id: 28) - pivot
  { playerId: 28, season: '2025/2026', goals: 0, assists: 1, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 30, careerAssists: 15, careerYellowCards: 12, careerRedCards: 1, careerMatchesPlayed: 175, expectedGoals: 0.5, expectedAssists: 0.8, goalParticipation: 1, passAccuracy: 74, shotAccuracy: 48, defensiveActions: 12 },
  // Nico (id: 29) - ala
  { playerId: 29, season: '2025/2026', goals: 0, assists: 1, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 62, careerAssists: 28, careerYellowCards: 6, careerRedCards: 0, careerMatchesPlayed: 200, expectedGoals: 0.5, expectedAssists: 0.8, goalParticipation: 1, passAccuracy: 76, shotAccuracy: 52, defensiveActions: 6 },
  // Unai (id: 30) - portero
  { playerId: 30, season: '2025/2026', goals: 0, assists: 0, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, saves: 28, blocks: 3, steals: 2, careerGoals: 2, careerAssists: 5, careerYellowCards: 4, careerRedCards: 0, careerMatchesPlayed: 190, expectedGoals: 0.1, expectedAssists: 0.3, goalParticipation: 0, passAccuracy: 69, shotAccuracy: 18, defensiveActions: 20 },

  // === JIMBEE CARTAGENA (id: 7) ===
  // Sergio Román (id: 31) - cierre
  { playerId: 31, season: '2025/2026', goals: 0, assists: 0, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 160, careerGoals: 15, careerAssists: 25, careerYellowCards: 25, careerRedCards: 2, careerMatchesPlayed: 205, expectedGoals: 0.8, expectedAssists: 1.2, goalParticipation: 0, passAccuracy: 83, shotAccuracy: 35, defensiveActions: 20 },
  // Bebeto (id: 32) - ala
  { playerId: 32, season: '2025/2026', goals: 1, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 35, careerAssists: 48, careerYellowCards: 10, careerRedCards: 0, careerMatchesPlayed: 190, expectedGoals: 1.0, expectedAssists: 2.5, goalParticipation: 3, passAccuracy: 85, shotAccuracy: 52, defensiveActions: 8 },
  // Antonio Pelegrín (id: 33) - pivot
  { playerId: 33, season: '2025/2026', goals: 1, assists: 1, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 42, careerAssists: 20, careerYellowCards: 28, careerRedCards: 3, careerMatchesPlayed: 180, expectedGoals: 1.0, expectedAssists: 0.8, goalParticipation: 2, passAccuracy: 77, shotAccuracy: 50, defensiveActions: 15 },
  // Mota (id: 34) - ala
  { playerId: 34, season: '2025/2026', goals: 1, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 28, careerAssists: 25, careerYellowCards: 15, careerRedCards: 1, careerMatchesPlayed: 185, expectedGoals: 1.0, expectedAssists: 1.5, goalParticipation: 3, passAccuracy: 78, shotAccuracy: 48, defensiveActions: 10 },
  // Francisco José (id: 35) - portero
  { playerId: 35, season: '2025/2026', goals: 0, assists: 0, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, saves: 38, blocks: 5, steals: 3, careerGoals: 1, careerAssists: 2, careerYellowCards: 3, careerRedCards: 0, careerMatchesPlayed: 185, expectedGoals: 0.1, expectedAssists: 0.2, goalParticipation: 0, passAccuracy: 66, shotAccuracy: 15, defensiveActions: 28 },

  // === MANZANARES FS (id: 8) ===
  // Iago Benlloch (id: 36) - cierre
  { playerId: 36, season: '2025/2026', goals: 0, assists: 1, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 160, careerGoals: 10, careerAssists: 14, careerYellowCards: 30, careerRedCards: 4, careerMatchesPlayed: 200, expectedGoals: 0.8, expectedAssists: 1.0, goalParticipation: 1, passAccuracy: 75, shotAccuracy: 32, defensiveActions: 22 },
  // Matías (id: 37) - ala
  { playerId: 37, season: '2025/2026', goals: 4, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 28, careerAssists: 22, careerYellowCards: 10, careerRedCards: 1, careerMatchesPlayed: 165, expectedGoals: 3.5, expectedAssists: 1.8, goalParticipation: 6, passAccuracy: 78, shotAccuracy: 58, defensiveActions: 10 },
  // Pablo Álvarez (id: 38) - pivot
  { playerId: 38, season: '2025/2026', goals: 3, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 35, careerAssists: 18, careerYellowCards: 18, careerRedCards: 2, careerMatchesPlayed: 170, expectedGoals: 2.8, expectedAssists: 1.5, goalParticipation: 5, passAccuracy: 76, shotAccuracy: 60, defensiveActions: 12 },
  // Diego Santisteban (id: 39) - ala
  { playerId: 39, season: '2025/2026', goals: 2, assists: 3, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 22, careerAssists: 20, careerYellowCards: 12, careerRedCards: 0, careerMatchesPlayed: 175, expectedGoals: 1.8, expectedAssists: 2.5, goalParticipation: 5, passAccuracy: 76, shotAccuracy: 52, defensiveActions: 9 },
  // Pedro Bacelos (id: 40) - portero
  { playerId: 40, season: '2025/2026', goals: 0, assists: 0, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, saves: 25, blocks: 3, steals: 2, careerGoals: 2, careerAssists: 8, careerYellowCards: 4, careerRedCards: 0, careerMatchesPlayed: 185, expectedGoals: 0.1, expectedAssists: 0.5, goalParticipation: 0, passAccuracy: 67, shotAccuracy: 18, defensiveActions: 20 },

  // === RIBERA NAVARRA (id: 9) ===
  // Enrique Franco (id: 41) - cierre
  { playerId: 41, season: '2025/2026', goals: 0, assists: 0, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 160, careerGoals: 12, careerAssists: 10, careerYellowCards: 22, careerRedCards: 2, careerMatchesPlayed: 195, expectedGoals: 0.8, expectedAssists: 0.8, goalParticipation: 0, passAccuracy: 76, shotAccuracy: 35, defensiveActions: 20 },
  // Sandro (id: 42) - ala
  { playerId: 42, season: '2025/2026', goals: 3, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 28, careerAssists: 32, careerYellowCards: 18, careerRedCards: 2, careerMatchesPlayed: 170, expectedGoals: 2.5, expectedAssists: 2.0, goalParticipation: 5, passAccuracy: 83, shotAccuracy: 55, defensiveActions: 9 },
  // Javier Eseverri (id: 43) - pivot
  { playerId: 43, season: '2025/2026', goals: 3, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 42, careerAssists: 25, careerYellowCards: 15, careerRedCards: 2, careerMatchesPlayed: 175, expectedGoals: 2.8, expectedAssists: 1.5, goalParticipation: 5, passAccuracy: 80, shotAccuracy: 62, defensiveActions: 12 },
  // Aitor Aguilar (id: 44) - ala
  { playerId: 44, season: '2025/2026', goals: 2, assists: 3, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 32, careerAssists: 45, careerYellowCards: 6, careerRedCards: 0, careerMatchesPlayed: 190, expectedGoals: 1.8, expectedAssists: 2.8, goalParticipation: 5, passAccuracy: 86, shotAccuracy: 52, defensiveActions: 7 },
  // Ricardo Ceballos (id: 45) - portero
  { playerId: 45, season: '2025/2026', goals: 0, assists: 0, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, saves: 30, blocks: 4, steals: 3, careerGoals: 3, careerAssists: 5, careerYellowCards: 8, careerRedCards: 0, careerMatchesPlayed: 195, expectedGoals: 0.2, expectedAssists: 0.5, goalParticipation: 0, passAccuracy: 70, shotAccuracy: 20, defensiveActions: 22 },

  // === OSASUNA MAGNA (id: 10) ===
  // Álex González (id: 46) - cierre
  { playerId: 46, season: '2025/2026', goals: 0, assists: 0, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 160, careerGoals: 10, careerAssists: 15, careerYellowCards: 22, careerRedCards: 2, careerMatchesPlayed: 195, expectedGoals: 0.8, expectedAssists: 1.0, goalParticipation: 0, passAccuracy: 81, shotAccuracy: 35, defensiveActions: 18 },
  // Luca Beghellini (id: 47) - ala
  { playerId: 47, season: '2025/2026', goals: 4, assists: 2, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 52, careerAssists: 38, careerYellowCards: 8, careerRedCards: 0, careerMatchesPlayed: 195, expectedGoals: 3.5, expectedAssists: 2.0, goalParticipation: 6, passAccuracy: 87, shotAccuracy: 65, defensiveActions: 8 },
  // Miguel Corredera (id: 48) - pivot
  { playerId: 48, season: '2025/2026', goals: 2, assists: 2, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 35, careerAssists: 12, careerYellowCards: 8, careerRedCards: 0, careerMatchesPlayed: 165, expectedGoals: 2.0, expectedAssists: 1.5, goalParticipation: 4, passAccuracy: 71, shotAccuracy: 58, defensiveActions: 10 },
  // Dani Salgado (id: 49) - ala
  { playerId: 49, season: '2025/2026', goals: 0, assists: 2, yellowCards: 1, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, careerGoals: 25, careerAssists: 32, careerYellowCards: 12, careerRedCards: 0, careerMatchesPlayed: 180, expectedGoals: 0.5, expectedAssists: 2.0, goalParticipation: 2, passAccuracy: 79, shotAccuracy: 45, defensiveActions: 10 },
  // José Miguel (id: 50) - portero
  { playerId: 50, season: '2025/2026', goals: 0, assists: 0, yellowCards: 0, redCards: 0, matchesPlayed: 5, minutesPlayed: 200, saves: 22, blocks: 2, steals: 2, careerGoals: 2, careerAssists: 6, careerYellowCards: 3, careerRedCards: 0, careerMatchesPlayed: 190, expectedGoals: 0.1, expectedAssists: 0.3, goalParticipation: 0, passAccuracy: 69, shotAccuracy: 18, defensiveActions: 18 },
];
