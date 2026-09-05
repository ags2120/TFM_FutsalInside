import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Match } from '../models/match.model';
import { Team } from '../models/team.model';
import { Player } from '../models/player.model';
import { Standing } from '../models/standings.model';
import {
  MOCK_ALL_MATCHES,
  MOCK_LIVE_MATCHES,
  MOCK_UPCOMING_MATCHES,
  MOCK_RECENT_MATCHES,
} from '../mocks/matches.mock';
import { MOCK_TEAMS } from '../mocks/teams.mock';
import { MOCK_PLAYERS } from '../mocks/players.mock';
import { MOCK_STANDINGS } from '../mocks/standings.mock';

const MOCK_DELAY_MS = 300;

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  getMatches(date?: string): Observable<Match[]> {
    let matches = MOCK_ALL_MATCHES;
    if (date) {
      matches = matches.filter((m) => m.date === date);
    }
    return of(matches).pipe(delay(MOCK_DELAY_MS));
  }

  getMatchById(id: number): Observable<Match | undefined> {
    const match = MOCK_ALL_MATCHES.find((m) => m.id === id);
    return of(match).pipe(delay(MOCK_DELAY_MS));
  }

  getLiveMatches(): Observable<Match[]> {
    return of(MOCK_LIVE_MATCHES).pipe(delay(MOCK_DELAY_MS));
  }

  getUpcomingMatches(): Observable<Match[]> {
    return of(MOCK_UPCOMING_MATCHES).pipe(delay(MOCK_DELAY_MS));
  }

  getRecentMatches(): Observable<Match[]> {
    return of(MOCK_RECENT_MATCHES).pipe(delay(MOCK_DELAY_MS));
  }

  getTeams(): Observable<Team[]> {
    return of(MOCK_TEAMS).pipe(delay(MOCK_DELAY_MS));
  }

  getTeamById(id: number): Observable<Team | undefined> {
    const team = MOCK_TEAMS.find((t) => t.id === id);
    return of(team).pipe(delay(MOCK_DELAY_MS));
  }

  getPlayers(): Observable<Player[]> {
    return of(MOCK_PLAYERS).pipe(delay(MOCK_DELAY_MS));
  }

  getPlayersByTeam(teamId: number): Observable<Player[]> {
    const players = MOCK_PLAYERS.filter((p) => p.team?.id === teamId);
    return of(players).pipe(delay(MOCK_DELAY_MS));
  }

  getPlayerById(id: number): Observable<Player | undefined> {
    const player = MOCK_PLAYERS.find((p) => p.id === id);
    return of(player).pipe(delay(MOCK_DELAY_MS));
  }

  getStandings(): Observable<Standing[]> {
    return of(MOCK_STANDINGS).pipe(delay(MOCK_DELAY_MS));
  }
}
