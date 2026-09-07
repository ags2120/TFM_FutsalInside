import { PlayerMatchParticipation } from '../models/player-match.model';

export const MOCK_PLAYER_MATCH_PARTICIPATION: PlayerMatchParticipation[] = [
  // === BARÇA (id: 1) ===
  // Dyego Coelho (id: 1) - cierre
  { matchId: 101, playerId: 1, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 109, playerId: 1, goals: 1, assists: 0, isMvp: false, rating: 7.5, minutesPlayed: 38 },
  { matchId: 115, playerId: 1, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },
  { matchId: 120, playerId: 1, goals: 0, assists: 1, isMvp: false, rating: 7.0, minutesPlayed: 40 },

  // Adolfo Fernández (id: 2) - ala
  { matchId: 101, playerId: 2, goals: 1, assists: 1, isMvp: false, rating: 8.1, minutesPlayed: 40 },
  { matchId: 109, playerId: 2, goals: 0, assists: 2, isMvp: false, rating: 8.4, minutesPlayed: 40 },
  { matchId: 115, playerId: 2, goals: 2, assists: 0, isMvp: true, rating: 8.8, minutesPlayed: 40 },
  { matchId: 120, playerId: 2, goals: 1, assists: 0, isMvp: false, rating: 7.9, minutesPlayed: 36 },

  // Pito Martínez (id: 3) - pivot (EXISTING)
  { matchId: 101, playerId: 3, goals: 2, assists: 1, isMvp: true, rating: 9.1, minutesPlayed: 40 },
  { matchId: 109, playerId: 3, goals: 1, assists: 0, isMvp: false, rating: 7.8, minutesPlayed: 38 },
  { matchId: 115, playerId: 3, goals: 0, assists: 2, isMvp: false, rating: 8.2, minutesPlayed: 40 },
  { matchId: 120, playerId: 3, goals: 1, assists: 0, isMvp: false, rating: 7.5, minutesPlayed: 35 },
  { matchId: 125, playerId: 3, goals: 3, assists: 0, isMvp: true, rating: 9.4, minutesPlayed: 40 },

  // Ferrão (id: 4) - ala
  { matchId: 101, playerId: 4, goals: 1, assists: 1, isMvp: false, rating: 8.5, minutesPlayed: 40 },
  { matchId: 109, playerId: 4, goals: 2, assists: 0, isMvp: true, rating: 9.0, minutesPlayed: 40 },
  { matchId: 115, playerId: 4, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },
  { matchId: 125, playerId: 4, goals: 1, assists: 2, isMvp: false, rating: 8.6, minutesPlayed: 40 },

  // Juanjo Catato (id: 5) - portero
  { matchId: 101, playerId: 5, goals: 0, assists: 0, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 109, playerId: 5, goals: 0, assists: 1, isMvp: false, rating: 7.3, minutesPlayed: 40 },
  { matchId: 115, playerId: 5, goals: 0, assists: 0, isMvp: false, rating: 6.9, minutesPlayed: 40 },

  // === INTER MOVISTAR (id: 2) ===
  // Ricardinho (id: 6) - cierre
  { matchId: 101, playerId: 6, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 110, playerId: 6, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },
  { matchId: 116, playerId: 6, goals: 0, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 121, playerId: 6, goals: 1, assists: 1, isMvp: false, rating: 8.0, minutesPlayed: 38 },

  // Higor Pino (id: 7) - ala (EXISTING)
  { matchId: 101, playerId: 7, goals: 0, assists: 2, isMvp: false, rating: 8.4, minutesPlayed: 40 },
  { matchId: 110, playerId: 7, goals: 1, assists: 1, isMvp: false, rating: 8.0, minutesPlayed: 40 },
  { matchId: 116, playerId: 7, goals: 0, assists: 1, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 121, playerId: 7, goals: 2, assists: 0, isMvp: true, rating: 9.2, minutesPlayed: 40 },

  // Bebe (id: 8) - pivot (EXISTING)
  { matchId: 101, playerId: 8, goals: 1, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 110, playerId: 8, goals: 2, assists: 1, isMvp: true, rating: 8.8, minutesPlayed: 40 },
  { matchId: 116, playerId: 8, goals: 0, assists: 1, isMvp: false, rating: 7.0, minutesPlayed: 36 },
  { matchId: 121, playerId: 8, goals: 1, assists: 2, isMvp: false, rating: 8.5, minutesPlayed: 40 },

  // Miguelín (id: 9) - ala
  { matchId: 101, playerId: 9, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },
  { matchId: 110, playerId: 9, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 38 },
  { matchId: 116, playerId: 9, goals: 0, assists: 2, isMvp: false, rating: 8.2, minutesPlayed: 40 },
  { matchId: 121, playerId: 9, goals: 1, assists: 1, isMvp: false, rating: 8.0, minutesPlayed: 40 },

  // Jesús Velasco (id: 10) - portero
  { matchId: 101, playerId: 10, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },
  { matchId: 110, playerId: 10, goals: 0, assists: 0, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 116, playerId: 10, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 40 },

  // === ELPOZO MURCIA (id: 3) ===
  // Chino (id: 11) - cierre
  { matchId: 102, playerId: 11, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },
  { matchId: 111, playerId: 11, goals: 1, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 117, playerId: 11, goals: 0, assists: 1, isMvp: false, rating: 7.0, minutesPlayed: 38 },
  { matchId: 122, playerId: 11, goals: 0, assists: 0, isMvp: false, rating: 6.5, minutesPlayed: 40 },

  // Diego Rios (id: 12) - ala (EXISTING)
  { matchId: 102, playerId: 12, goals: 0, assists: 1, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 111, playerId: 12, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 38 },
  { matchId: 117, playerId: 12, goals: 0, assists: 1, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 122, playerId: 12, goals: 1, assists: 0, isMvp: false, rating: 7.3, minutesPlayed: 40 },

  // Raúl Gutiérrez (id: 13) - pivot (EXISTING)
  { matchId: 102, playerId: 13, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 111, playerId: 13, goals: 2, assists: 0, isMvp: true, rating: 8.9, minutesPlayed: 40 },
  { matchId: 117, playerId: 13, goals: 0, assists: 1, isMvp: false, rating: 6.8, minutesPlayed: 32 },
  { matchId: 122, playerId: 13, goals: 1, assists: 1, isMvp: false, rating: 7.9, minutesPlayed: 40 },

  // Pol Pacheco (id: 14) - ala
  { matchId: 102, playerId: 14, goals: 1, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 111, playerId: 14, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 38 },
  { matchId: 117, playerId: 14, goals: 1, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },
  { matchId: 122, playerId: 14, goals: 0, assists: 0, isMvp: false, rating: 6.9, minutesPlayed: 36 },

  // Carlos Barrón (id: 15) - portero
  { matchId: 102, playerId: 15, goals: 0, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 111, playerId: 15, goals: 0, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 122, playerId: 15, goals: 0, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },

  // === PALMA FUTSAL (id: 4) ===
  // Neto (id: 16) - cierre
  { matchId: 102, playerId: 16, goals: 0, assists: 1, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 112, playerId: 16, goals: 1, assists: 0, isMvp: false, rating: 7.3, minutesPlayed: 40 },
  { matchId: 118, playerId: 16, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },
  { matchId: 123, playerId: 16, goals: 0, assists: 1, isMvp: false, rating: 7.1, minutesPlayed: 38 },

  // Zico (id: 17) - ala (EXISTING)
  { matchId: 102, playerId: 17, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },
  { matchId: 112, playerId: 17, goals: 1, assists: 0, isMvp: false, rating: 7.5, minutesPlayed: 40 },
  { matchId: 118, playerId: 17, goals: 0, assists: 2, isMvp: false, rating: 8.3, minutesPlayed: 40 },
  { matchId: 123, playerId: 17, goals: 1, assists: 1, isMvp: true, rating: 8.9, minutesPlayed: 40 },

  // Climaco Rafael (id: 18) - pivot (EXISTING)
  { matchId: 102, playerId: 18, goals: 1, assists: 1, isMvp: false, rating: 8.3, minutesPlayed: 40 },
  { matchId: 112, playerId: 18, goals: 0, assists: 2, isMvp: false, rating: 8.0, minutesPlayed: 40 },
  { matchId: 118, playerId: 18, goals: 2, assists: 0, isMvp: true, rating: 9.0, minutesPlayed: 40 },
  { matchId: 123, playerId: 18, goals: 1, assists: 1, isMvp: false, rating: 7.7, minutesPlayed: 38 },

  // Marlon Álvarez (id: 19) - ala
  { matchId: 102, playerId: 19, goals: 1, assists: 1, isMvp: false, rating: 8.2, minutesPlayed: 40 },
  { matchId: 112, playerId: 19, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },
  { matchId: 118, playerId: 19, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 38 },
  { matchId: 123, playerId: 19, goals: 0, assists: 2, isMvp: false, rating: 8.4, minutesPlayed: 40 },

  // Pablo Saucedo (id: 20) - portero
  { matchId: 102, playerId: 20, goals: 0, assists: 0, isMvp: false, rating: 6.6, minutesPlayed: 40 },
  { matchId: 112, playerId: 20, goals: 0, assists: 1, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 118, playerId: 20, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },

  // === JAÉN PARAÍSO INTERIOR (id: 5) ===
  // César (id: 21) - cierre
  { matchId: 104, playerId: 21, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },
  { matchId: 114, playerId: 21, goals: 1, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 126, playerId: 21, goals: 0, assists: 1, isMvp: false, rating: 7.0, minutesPlayed: 38 },

  // Alex Yepes (id: 22) - ala
  { matchId: 104, playerId: 22, goals: 1, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 114, playerId: 22, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 126, playerId: 22, goals: 1, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },

  // David Ruiz (id: 23) - pivot (EXISTING)
  { matchId: 104, playerId: 23, goals: 1, assists: 0, isMvp: false, rating: 7.1, minutesPlayed: 40 },
  { matchId: 114, playerId: 23, goals: 0, assists: 1, isMvp: false, rating: 6.7, minutesPlayed: 30 },
  { matchId: 126, playerId: 23, goals: 2, assists: 0, isMvp: true, rating: 8.6, minutesPlayed: 40 },

  // Pedro del Rey (id: 24) - ala
  { matchId: 104, playerId: 24, goals: 2, assists: 1, isMvp: true, rating: 9.0, minutesPlayed: 40 },
  { matchId: 114, playerId: 24, goals: 1, assists: 0, isMvp: false, rating: 8.2, minutesPlayed: 40 },
  { matchId: 126, playerId: 24, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },

  // Alberto González (id: 25) - portero
  { matchId: 104, playerId: 25, goals: 0, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 114, playerId: 25, goals: 0, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 126, playerId: 25, goals: 0, assists: 1, isMvp: false, rating: 7.6, minutesPlayed: 40 },

  // === CÓRDOBA (id: 6) ===
  // Eloy Rojas (id: 26) - cierre
  { matchId: 108, playerId: 26, goals: 0, assists: 1, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 133, playerId: 26, goals: 1, assists: 0, isMvp: false, rating: 7.3, minutesPlayed: 40 },
  { matchId: 134, playerId: 26, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 38 },

  // Nikolay Líber (id: 27) - ala
  { matchId: 108, playerId: 27, goals: 1, assists: 1, isMvp: false, rating: 8.4, minutesPlayed: 40 },
  { matchId: 133, playerId: 27, goals: 0, assists: 2, isMvp: false, rating: 8.6, minutesPlayed: 40 },
  { matchId: 134, playerId: 27, goals: 1, assists: 0, isMvp: true, rating: 8.8, minutesPlayed: 40 },

  // Juanlu (id: 28) - pivot (EXISTING)
  { matchId: 108, playerId: 28, goals: 1, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 133, playerId: 28, goals: 0, assists: 1, isMvp: false, rating: 6.9, minutesPlayed: 38 },
  { matchId: 134, playerId: 28, goals: 1, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },

  // Nico (id: 29) - ala
  { matchId: 108, playerId: 29, goals: 2, assists: 0, isMvp: true, rating: 9.2, minutesPlayed: 40 },
  { matchId: 133, playerId: 29, goals: 1, assists: 1, isMvp: false, rating: 8.5, minutesPlayed: 40 },
  { matchId: 134, playerId: 29, goals: 1, assists: 0, isMvp: false, rating: 8.0, minutesPlayed: 40 },

  // Unai (id: 30) - portero
  { matchId: 108, playerId: 30, goals: 0, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 133, playerId: 30, goals: 0, assists: 0, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 134, playerId: 30, goals: 0, assists: 1, isMvp: false, rating: 7.4, minutesPlayed: 40 },

  // === JIMBEE CARTAGENA (id: 7) ===
  // Sergio Román (id: 31) - cierre
  { matchId: 103, playerId: 31, goals: 0, assists: 1, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 113, playerId: 31, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 119, playerId: 31, goals: 0, assists: 0, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 124, playerId: 31, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 38 },

  // Bebeto (id: 32) - ala
  { matchId: 103, playerId: 32, goals: 1, assists: 2, isMvp: false, rating: 8.6, minutesPlayed: 40 },
  { matchId: 113, playerId: 32, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },
  { matchId: 119, playerId: 32, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 124, playerId: 32, goals: 0, assists: 1, isMvp: false, rating: 8.0, minutesPlayed: 40 },

  // Antonio Pelegrín (id: 33) - pivot (EXISTING)
  { matchId: 103, playerId: 33, goals: 1, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 113, playerId: 33, goals: 0, assists: 1, isMvp: false, rating: 6.9, minutesPlayed: 35 },
  { matchId: 119, playerId: 33, goals: 2, assists: 0, isMvp: true, rating: 8.7, minutesPlayed: 40 },
  { matchId: 124, playerId: 33, goals: 1, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },

  // Mota (id: 34) - ala
  { matchId: 103, playerId: 34, goals: 0, assists: 1, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 113, playerId: 34, goals: 1, assists: 0, isMvp: false, rating: 7.6, minutesPlayed: 38 },
  { matchId: 124, playerId: 34, goals: 0, assists: 0, isMvp: false, rating: 7.0, minutesPlayed: 40 },

  // Francisco José (id: 35) - portero
  { matchId: 103, playerId: 35, goals: 0, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 119, playerId: 35, goals: 0, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 124, playerId: 35, goals: 0, assists: 0, isMvp: false, rating: 7.0, minutesPlayed: 40 },

  // === MANZANARES FS (id: 8) ===
  // Iago Benlloch (id: 36) - cierre
  { matchId: 107, playerId: 36, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },
  { matchId: 131, playerId: 36, goals: 1, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 132, playerId: 36, goals: 0, assists: 1, isMvp: false, rating: 7.0, minutesPlayed: 38 },

  // Matías (id: 37) - ala (EXISTING)
  { matchId: 107, playerId: 37, goals: 1, assists: 1, isMvp: false, rating: 7.9, minutesPlayed: 40 },
  { matchId: 131, playerId: 37, goals: 0, assists: 0, isMvp: false, rating: 6.5, minutesPlayed: 30 },
  { matchId: 132, playerId: 37, goals: 1, assists: 1, isMvp: true, rating: 8.5, minutesPlayed: 40 },

  // Pablo Álvarez (id: 38) - pivot (EXISTING)
  { matchId: 107, playerId: 38, goals: 1, assists: 0, isMvp: false, rating: 7.3, minutesPlayed: 40 },
  { matchId: 131, playerId: 38, goals: 0, assists: 1, isMvp: false, rating: 6.8, minutesPlayed: 35 },
  { matchId: 132, playerId: 38, goals: 1, assists: 1, isMvp: false, rating: 7.7, minutesPlayed: 40 },

  // Diego Santisteban (id: 39) - ala
  { matchId: 107, playerId: 39, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 131, playerId: 39, goals: 1, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 38 },
  { matchId: 132, playerId: 39, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },

  // Pedro Bacelos (id: 40) - portero
  { matchId: 107, playerId: 40, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 40 },
  { matchId: 131, playerId: 40, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 132, playerId: 40, goals: 0, assists: 0, isMvp: false, rating: 7.0, minutesPlayed: 40 },

  // === RIBERA NAVARRA (id: 9) ===
  // Enrique Franco (id: 41) - cierre
  { matchId: 105, playerId: 41, goals: 0, assists: 0, isMvp: false, rating: 6.9, minutesPlayed: 40 },
  { matchId: 127, playerId: 41, goals: 1, assists: 0, isMvp: false, rating: 7.3, minutesPlayed: 40 },
  { matchId: 128, playerId: 41, goals: 0, assists: 1, isMvp: false, rating: 7.1, minutesPlayed: 38 },

  // Sandro (id: 42) - ala (EXISTING)
  { matchId: 105, playerId: 42, goals: 0, assists: 2, isMvp: false, rating: 8.2, minutesPlayed: 40 },
  { matchId: 127, playerId: 42, goals: 1, assists: 0, isMvp: false, rating: 7.1, minutesPlayed: 36 },
  { matchId: 128, playerId: 42, goals: 0, assists: 1, isMvp: false, rating: 7.5, minutesPlayed: 40 },

  // Javier Eseverri (id: 43) - pivot (EXISTING)
  { matchId: 105, playerId: 43, goals: 1, assists: 1, isMvp: false, rating: 8.1, minutesPlayed: 40 },
  { matchId: 127, playerId: 43, goals: 0, assists: 2, isMvp: false, rating: 7.9, minutesPlayed: 40 },
  { matchId: 128, playerId: 43, goals: 1, assists: 0, isMvp: false, rating: 7.3, minutesPlayed: 36 },

  // Aitor Aguilar (id: 44) - ala
  { matchId: 105, playerId: 44, goals: 1, assists: 1, isMvp: false, rating: 8.0, minutesPlayed: 40 },
  { matchId: 127, playerId: 44, goals: 0, assists: 1, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 128, playerId: 44, goals: 1, assists: 0, isMvp: false, rating: 7.8, minutesPlayed: 40 },

  // Ricardo Ceballos (id: 45) - portero
  { matchId: 105, playerId: 45, goals: 0, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 127, playerId: 45, goals: 0, assists: 1, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 128, playerId: 45, goals: 0, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },

  // === JAÉN FS (id: 10) ===
  // Álex González (id: 46) - cierre
  { matchId: 106, playerId: 46, goals: 0, assists: 1, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 129, playerId: 46, goals: 1, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 40 },
  { matchId: 130, playerId: 46, goals: 0, assists: 0, isMvp: false, rating: 6.8, minutesPlayed: 38 },

  // Luca Beghellini (id: 47) - ala
  { matchId: 106, playerId: 47, goals: 1, assists: 1, isMvp: false, rating: 8.6, minutesPlayed: 40 },
  { matchId: 129, playerId: 47, goals: 2, assists: 0, isMvp: true, rating: 9.0, minutesPlayed: 40 },
  { matchId: 130, playerId: 47, goals: 0, assists: 1, isMvp: false, rating: 8.2, minutesPlayed: 40 },

  // Miguel Corredera (id: 48) - pivot (EXISTING)
  { matchId: 106, playerId: 48, goals: 1, assists: 0, isMvp: false, rating: 7.5, minutesPlayed: 40 },
  { matchId: 129, playerId: 48, goals: 2, assists: 0, isMvp: true, rating: 8.8, minutesPlayed: 40 },
  { matchId: 130, playerId: 48, goals: 0, assists: 1, isMvp: false, rating: 6.9, minutesPlayed: 34 },

  // Dani Salgado (id: 49) - ala
  { matchId: 106, playerId: 49, goals: 0, assists: 1, isMvp: false, rating: 7.6, minutesPlayed: 40 },
  { matchId: 129, playerId: 49, goals: 1, assists: 0, isMvp: false, rating: 7.4, minutesPlayed: 38 },
  { matchId: 130, playerId: 49, goals: 0, assists: 1, isMvp: false, rating: 7.8, minutesPlayed: 40 },

  // José Miguel (id: 50) - portero
  { matchId: 106, playerId: 50, goals: 0, assists: 0, isMvp: false, rating: 7.0, minutesPlayed: 40 },
  { matchId: 129, playerId: 50, goals: 0, assists: 0, isMvp: false, rating: 7.2, minutesPlayed: 40 },
  { matchId: 130, playerId: 50, goals: 0, assists: 1, isMvp: false, rating: 7.4, minutesPlayed: 40 },
];
