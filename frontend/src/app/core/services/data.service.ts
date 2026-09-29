import { Observable } from 'rxjs';
import { Match } from '../models/match.model';
import { Team } from '../models/team.model';
import { Player, PlayerDetail } from '../models/player.model';
import { PlayerMatchParticipation } from '../models/player-match.model';
import { Standing } from '../models/standings.model';
import { Competition } from '../models/competition.model';
import { PlayerStatistics, TeamStatistics } from '../models/statistics.model';

/**
 * Data-access contract every store and page consumes.
 *
 * `MockDataService` and `ApiDataService` both implement this surface with
 * identical semantics (the same method names, signatures and undefined-when-
 * absent behaviour), so the whole app switches between mock and live data by
 * swapping one provider in `app.config.ts`. Never inject the concrete classes:
 * the point of the seam is that a consumer cannot tell which source it talks
 * to.
 */
export abstract class DataService {
  abstract getMatches(date?: string): Observable<Match[]>;
  abstract getMatchById(id: number): Observable<Match | undefined>;
  abstract getMatchesByIds(ids: number[]): Observable<Match[]>;
  abstract getLiveMatches(): Observable<Match[]>;
  abstract getUpcomingMatches(): Observable<Match[]>;
  abstract getRecentMatches(): Observable<Match[]>;
  abstract getTeams(): Observable<Team[]>;
  abstract getTeamById(id: number): Observable<Team | undefined>;
  abstract getTeamStatistics(id: number): Observable<TeamStatistics | undefined>;
  abstract getPlayers(): Observable<Player[]>;
  abstract getPlayersByTeam(teamId: number): Observable<Player[]>;
  abstract getPlayerById(id: number): Observable<Player | undefined>;
  abstract getPlayerDetailById(id: number): Observable<PlayerDetail | undefined>;
  abstract getPlayerStats(playerId: number): Observable<PlayerStatistics | undefined>;
  abstract getAllPlayerStats(): Observable<PlayerStatistics[]>;
  abstract getPlayerMatchParticipation(playerId: number): Observable<PlayerMatchParticipation[]>;
  abstract getStandings(): Observable<Standing[]>;
  abstract getCompetitions(): Observable<Competition[]>;
  abstract getMatchesByTeam(teamId: number): Observable<Match[]>;
}