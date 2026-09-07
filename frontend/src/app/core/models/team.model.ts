import { Player } from './player.model';

export interface Team {
  id: number;
  name: string;
  shortName: string;
  badgeUrl: string;
  country: string;
  league?: string;
  founded?: number;
  venue?: string;
  coach?: string;
  titles?: number;
  stadiumCapacity?: number;
}

export interface TeamDetail extends Team {
  players: Player[];
  description?: string;
}

export interface TeamListResponse {
  teams: Team[];
  total: number;
}
