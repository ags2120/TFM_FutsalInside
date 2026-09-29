import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, defer, firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataService } from './data.service';
import { environment } from '../../../environments/environment';
import { Match } from '../models/match.model';
import { Team, TeamDetail } from '../models/team.model';
import { Player, PlayerDetail } from '../models/player.model';
import { PlayerMatchParticipation } from '../models/player-match.model';
import { Standing } from '../models/standings.model';
import { Competition } from '../models/competition.model';
import { PlayerStatistics, TeamStatistics } from '../models/statistics.model';

interface Envelope<T> {
  data?: T;
}

/**
 * Reads every entity from the Laravel API over HTTP.
 *
 * Method semantics mirror `MockDataService` exactly (the two share the
 * `DataService` contract): lists come back fully resolved, single lookups are
 * `undefined` when the resource does not exist, and any transport failure
 * degrades to an empty result so the calling store can present its empty/
 * error state instead of throwing in the UI thread.
 *
 * The API paginates its list endpoints with a 25-row default, so list access
 * walks every page (`per_page=100`) until the envelope's `total` is satisfied;
 * a consumer expecting 166 players must get 166, not page one.
 */
@Injectable({ providedIn: 'root' })
export class ApiDataService extends DataService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getMatches(date?: string): Observable<Match[]> {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return this.fetchAll<Match>(`/matches${query}`, 'matches');
  }

  getMatchById(id: number): Observable<Match | undefined> {
    return this.getData<Match>(`/matches/${id}`);
  }

  getMatchesByIds(ids: number[]): Observable<Match[]> {
    const wanted = new Set(ids);
    return this.getMatches().pipe(
      map((matches) => matches.filter((match) => wanted.has(match.id))),
    );
  }

  getLiveMatches(): Observable<Match[]> {
    return this.fetchAll<Match>('/matches?status=live,halftime', 'matches');
  }

  getUpcomingMatches(): Observable<Match[]> {
    return this.fetchAll<Match>('/matches?status=scheduled', 'matches');
  }

  getRecentMatches(): Observable<Match[]> {
    return this.fetchAll<Match>('/matches?status=finished', 'matches');
  }

  getTeams(): Observable<Team[]> {
    return this.fetchAll<Team>('/teams', 'teams');
  }

  getTeamById(id: number): Observable<Team | undefined> {
    return this.getData<Team>(`/teams/${id}`);
  }

  getTeamStatistics(id: number): Observable<TeamStatistics | undefined> {
    return this.getData<TeamStatistics>(`/teams/${id}/statistics`);
  }

  getPlayers(): Observable<Player[]> {
    return this.fetchAll<Player>('/players', 'players');
  }

  getPlayersByTeam(teamId: number): Observable<Player[]> {
    return this.getData<TeamDetail>(`/teams/${teamId}`).pipe(
      map((team) => team?.players ?? []),
      catchError(() => of([])),
    );
  }

  getPlayerById(id: number): Observable<Player | undefined> {
    return this.getData<Player>(`/players/${id}`);
  }

  getPlayerDetailById(id: number): Observable<PlayerDetail | undefined> {
    return this.getData<PlayerDetail>(`/players/${id}`);
  }

  getPlayerStats(playerId: number): Observable<PlayerStatistics | undefined> {
    return this.getData<PlayerStatistics>(`/players/${playerId}/statistics`);
  }

  getAllPlayerStats(): Observable<PlayerStatistics[]> {
    return this.fetchAll<PlayerStatistics>('/player-statistics', 'statistics');
  }

  getPlayerMatchParticipation(playerId: number): Observable<PlayerMatchParticipation[]> {
    // The participation feed is a projection over the real match event log:
    // goals/assists come from the same events the match detail serves, and
    // isMvp mirrors the fixture's man of the match.
    return this.http
      .get<{ participations: PlayerMatchParticipation[]; total: number }>(
        `${this.apiUrl}/players/${playerId}/matches`,
      )
      .pipe(
        map((response) => response.participations),
        catchError(() => of([])),
      );
  }

  getStandings(): Observable<Standing[]> {
    return this.http
      .get<{ standings: Standing[]; total: number }>(`${this.apiUrl}/standings`)
      .pipe(
        map((response) => response.standings),
        catchError(() => of([])),
      );
  }

  getCompetitions(): Observable<Competition[]> {
    return this.fetchAll<Competition>('/competitions', 'competitions');
  }

  getMatchesByTeam(teamId: number): Observable<Match[]> {
    return this.fetchAll<Match>(`/matches?team=${teamId}`, 'matches');
  }

  private getData<T>(path: string): Observable<T | undefined> {
    return this.http.get<Envelope<T>>(`${this.apiUrl}${path}`).pipe(
      map((response) => response.data),
      catchError(() => of(undefined)),
    );
  }

  /**
   * Resolve a paginated list endpoint in full, walking pages until `total` is
   * reached.
   */
  private fetchAll<T>(path: string, key: string, pageSize = 100): Observable<T[]> {
    return defer(async () => {
      const rows: T[] = [];
      let page = 1;
      let total = 0;

      do {
        const separator = path.includes('?') ? '&' : '?';
        const url = `${this.apiUrl}${path}${separator}per_page=${pageSize}&page=${page}`;
        const response = await firstValueFrom(
          this.http.get<Record<string, T[]> & { total: number }>(url),
        );
        const batch = response[key] ?? [];
        rows.push(...batch);
        total = response.total;
        page += 1;
      } while (rows.length < total);

      return rows;
    }).pipe(catchError(() => of([])));
  }
}