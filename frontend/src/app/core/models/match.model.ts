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

/**
 * Canonical metric keys exposed by the API.
 *
 * Mirrors the `MatchStatisticType` enum in the backend. These are identifiers,
 * not display text: the label map in the match detail component owns every
 * user-facing string, so a single client can render any language.
 */
export type MatchStatisticType =
  | 'possession'
  | 'shots'
  | 'shots_on_target'
  | 'corners'
  | 'fouls'
  | 'yellow_cards'
  | 'red_cards';

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
  type: MatchStatisticType;
  homeValue: number;
  awayValue: number;
}

export interface MatchListResponse {
  matches: Match[];
  total: number;
}
