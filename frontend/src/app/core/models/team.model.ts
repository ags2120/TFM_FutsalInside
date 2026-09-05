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
}

export interface TeamDetail extends Team {
  players: Player[];
  coach?: string;
  description?: string;
}

export interface TeamListResponse {
  teams: Team[];
  total: number;
}
