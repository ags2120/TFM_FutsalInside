import { Team } from './team.model';

export type PlayerPosition =
  | 'goalkeeper'
  | 'fixo'
  | 'ala'
  | 'pivot';

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
}

export interface PlayerDetail extends Player {
  careerHistory?: CareerEntry[];
}

export interface CareerEntry {
  team: Team;
  startDate: string;
  endDate?: string;
}

export interface PlayerListResponse {
  players: Player[];
  total: number;
}
