export interface PlayerMatchParticipation {
  matchId: number;
  playerId: number;
  goals: number;
  assists: number;
  isMvp: boolean;
  rating: number;
  minutesPlayed: number;
}
