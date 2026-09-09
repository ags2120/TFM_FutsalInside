import { Team } from './team.model';
import { Player } from './player.model';
import { Competition } from './competition.model';

export type MatchStatus =
  | 'scheduled'
  | 'live'
  | 'halftime'
  | 'finished'
  | 'postponed'
  | 'cancelled';

export type MatchEventType =
  | 'goal'
  | 'yellowcard'
  | 'redcard'
  | 'substitution'
  | 'timeout';

export interface Match {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  date: string;
  competition: Competition;
  venue?: string;
  referee?: string;
  attendance?: number;
  mvpPlayer?: Player;
  events?: MatchEvent[];
  statistics?: MatchStatistics[];
}

export interface MatchEvent {
  type: MatchEventType;
  minute: number;
  player: Player;
  team: Team;
  assistPlayer?: Player;
}

export interface MatchStatistics {
  type: string;
  homeValue: number;
  awayValue: number;
}

export interface MatchListResponse {
  matches: Match[];
  total: number;
}
