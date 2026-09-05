import { Team } from './team.model';

export type FormResult = 'W' | 'D' | 'L';

export interface Standing {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: FormResult[];
}

export interface StandingsResponse {
  standings: Standing[];
  competitionId: number;
  season: string;
}
