export interface PlayerStatistics {
  playerId: number;
  season: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  matchesPlayed: number;
  minutesPlayed: number;
  saves?: number;
  blocks?: number;
  steals?: number;
  careerGoals: number;
  careerAssists: number;
  careerYellowCards: number;
  careerRedCards: number;
  careerMatchesPlayed: number;
  expectedGoals: number;
  expectedAssists: number;
  goalParticipation: number;
  passAccuracy: number;
  shotAccuracy: number;
  defensiveActions: number;
}

export interface TeamStatistics {
  teamId: number;
  season: string;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  avgBallPossession?: number;
  avgShotsPerMatch?: number;
}

export interface StatsComparison {
  label: string;
  homeValue: number;
  awayValue: number;
}
