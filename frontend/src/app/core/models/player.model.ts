import { Team } from './team.model';

export type PlayerPosition =
  | 'portero'
  | 'cierre'
  | 'ala'
  | 'pivot';

export interface RadarAttributes {
  goals: number;
  assists: number;
  defense: number;
  physical: number;
  technique: number;
}

export interface Player {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  nationality: string;
  birthDate: string;
  position: PlayerPosition;
  shirtNumber: number;
  team?: Team;
  height?: number;
  weight?: number;
  radarAttributes?: RadarAttributes;
  dominantFoot?: 'left' | 'right' | 'both';
  averageRating?: number;
  marketValue?: string;
}

export interface PlayerDetail extends Player {
  careerHistory?: CareerEntry[];
}

export interface CareerEntry {
  team: Team;
  startDate: string;
  endDate?: string;
  matchesPlayed?: number;
  goals?: number;
}

export interface PlayerListResponse {
  players: Player[];
  total: number;
}
