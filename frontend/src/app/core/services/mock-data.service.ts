import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Match } from '../models/match.model';
import { Team } from '../models/team.model';
import { Player, PlayerDetail } from '../models/player.model';
import { PlayerMatchParticipation } from '../models/player-match.model';
import { Standing } from '../models/standings.model';
import { Competition } from '../models/competition.model';
import { PlayerStatistics, TeamStatistics } from '../models/statistics.model';
import {
  MOCK_ALL_MATCHES,
  MOCK_LIVE_MATCHES,
  MOCK_UPCOMING_MATCHES,
  MOCK_RECENT_MATCHES,
} from '../mocks/matches.mock';
import { MOCK_TEAMS } from '../mocks/teams.mock';
import { MOCK_PLAYERS } from '../mocks/players.mock';
import { MOCK_STANDINGS, COMPETITIONS } from '../mocks/standings.mock';
import { MOCK_PLAYER_STATISTICS } from '../mocks/player-statistics.mock';
import { MOCK_PLAYER_CAREER } from '../mocks/player-career.mock';
import { MOCK_PLAYER_MATCH_PARTICIPATION } from '../mocks/player-match-participation.mock';
import { MOCK_TEAM_STATISTICS } from '../mocks/team-statistics.mock';

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

  getPlayerDetailById(id: number): Observable<PlayerDetail | undefined> {
    const player = MOCK_PLAYERS.find((p) => p.id === id);
    if (!player) return of(undefined).pipe(delay(MOCK_DELAY_MS));

    const detail: PlayerDetail = {
      ...player,
      careerHistory: MOCK_PLAYER_CAREER[id] || [],
    };
    return of(detail).pipe(delay(MOCK_DELAY_MS));
  }

  getPlayerStats(playerId: number): Observable<PlayerStatistics | undefined> {
    const stats = MOCK_PLAYER_STATISTICS.find((s) => s.playerId === playerId);
    return of(stats).pipe(delay(MOCK_DELAY_MS));
  }

  getAllPlayerStats(): Observable<PlayerStatistics[]> {
    return of(MOCK_PLAYER_STATISTICS).pipe(delay(MOCK_DELAY_MS));
  }

  getPlayerMatchParticipation(playerId: number): Observable<PlayerMatchParticipation[]> {
    const participations = MOCK_PLAYER_MATCH_PARTICIPATION.filter((p) => p.playerId === playerId);
    return of(participations).pipe(delay(MOCK_DELAY_MS));
  }

  getStandings(): Observable<Standing[]> {
    return of(MOCK_STANDINGS).pipe(delay(MOCK_DELAY_MS));
  }

  getCompetitions(): Observable<Competition[]> {
    return of(COMPETITIONS).pipe(delay(MOCK_DELAY_MS));
  }

  getMatchesByTeam(teamId: number): Observable<Match[]> {
    const matches = MOCK_ALL_MATCHES.filter(
      (m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId
    );
    return of(matches).pipe(delay(MOCK_DELAY_MS));
  }

  getTeamStatistics(teamId: number): Observable<TeamStatistics | undefined> {
    const stats = MOCK_TEAM_STATISTICS.find((s) => s.teamId === teamId);
    return of(stats).pipe(delay(MOCK_DELAY_MS));
  }
}
