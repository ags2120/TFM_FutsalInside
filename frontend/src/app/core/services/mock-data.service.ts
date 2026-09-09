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
import { MOCK_ALL_MATCHES_BRAZIL, MOCK_LIVE_MATCHES_BRAZIL, MOCK_UPCOMING_MATCHES_BRAZIL, MOCK_RECENT_MATCHES_BRAZIL } from '../mocks/matches-brazil.mock';
import { MOCK_ALL_MATCHES_ITALY, MOCK_LIVE_MATCHES_ITALY, MOCK_UPCOMING_MATCHES_ITALY, MOCK_RECENT_MATCHES_ITALY } from '../mocks/matches-italy.mock';
import { MOCK_ALL_MATCHES_UEFA, MOCK_LIVE_MATCHES_UEFA, MOCK_UPCOMING_MATCHES_UEFA, MOCK_RECENT_MATCHES_UEFA } from '../mocks/matches-uefa.mock';
import { MOCK_TEAMS } from '../mocks/teams.mock';
import { MOCK_TEAMS_BRAZIL } from '../mocks/teams-brazil.mock';
import { MOCK_TEAMS_ITALY } from '../mocks/teams-italy.mock';
import { MOCK_TEAMS_UEFA } from '../mocks/teams-uefa.mock';
import { MOCK_PLAYERS } from '../mocks/players.mock';
import { MOCK_PLAYERS_BRAZIL } from '../mocks/players-brazil.mock';
import { MOCK_PLAYERS_ITALY } from '../mocks/players-italy.mock';
import { MOCK_PLAYERS_UEFA } from '../mocks/players-uefa.mock';
import { MOCK_STANDINGS, COMPETITIONS } from '../mocks/standings.mock';
import { COMPETITION_BRAZIL, MOCK_STANDINGS_BRAZIL } from '../mocks/competitions-brazil.mock';
import { COMPETITION_ITALY, MOCK_STANDINGS_ITALY } from '../mocks/competitions-italy.mock';
import { COMPETITION_UEFA, MOCK_STANDINGS_UEFA } from '../mocks/competitions-uefa.mock';
import { MOCK_PLAYER_STATISTICS } from '../mocks/player-statistics.mock';
import { MOCK_PLAYER_STATISTICS_BRAZIL } from '../mocks/player-statistics-brazil.mock';
import { MOCK_PLAYER_STATISTICS_ITALY } from '../mocks/player-statistics-italy.mock';
import { MOCK_PLAYER_STATISTICS_UEFA } from '../mocks/player-statistics-uefa.mock';
import { MOCK_PLAYER_CAREER } from '../mocks/player-career.mock';
import { MOCK_PLAYER_CAREER_BRAZIL } from '../mocks/player-career-brazil.mock';
import { MOCK_PLAYER_CAREER_ITALY } from '../mocks/player-career-italy.mock';
import { MOCK_PLAYER_CAREER_UEFA } from '../mocks/player-career-uefa.mock';
import { MOCK_PLAYER_MATCH_PARTICIPATION } from '../mocks/player-match-participation.mock';
import { MOCK_PLAYER_MATCH_PARTICIPATION_BRAZIL } from '../mocks/player-match-participation-brazil.mock';
import { MOCK_PLAYER_MATCH_PARTICIPATION_ITALY } from '../mocks/player-match-participation-italy.mock';
import { MOCK_PLAYER_MATCH_PARTICIPATION_UEFA } from '../mocks/player-match-participation-uefa.mock';
import { MOCK_TEAM_STATISTICS } from '../mocks/team-statistics.mock';
import { MOCK_TEAM_STATISTICS_BRAZIL } from '../mocks/team-statistics-brazil.mock';
import { MOCK_TEAM_STATISTICS_ITALY } from '../mocks/team-statistics-italy.mock';
import { MOCK_TEAM_STATISTICS_UEFA } from '../mocks/team-statistics-uefa.mock';

const MOCK_DELAY_MS = 300;

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  getMatches(date?: string): Observable<Match[]> {
    const allMatches = [...MOCK_ALL_MATCHES, ...MOCK_ALL_MATCHES_BRAZIL, ...MOCK_ALL_MATCHES_ITALY, ...MOCK_ALL_MATCHES_UEFA];
    let matches = allMatches;
    if (date) {
      matches = matches.filter((m) => m.date === date);
    }
    return of(matches).pipe(delay(MOCK_DELAY_MS));
  }

  getMatchById(id: number): Observable<Match | undefined> {
    const allMatches = [...MOCK_ALL_MATCHES, ...MOCK_ALL_MATCHES_BRAZIL, ...MOCK_ALL_MATCHES_ITALY, ...MOCK_ALL_MATCHES_UEFA];
    const match = allMatches.find((m) => m.id === id);
    return of(match).pipe(delay(MOCK_DELAY_MS));
  }

  getMatchesByIds(ids: number[]): Observable<Match[]> {
    const allMatches = [...MOCK_ALL_MATCHES, ...MOCK_ALL_MATCHES_BRAZIL, ...MOCK_ALL_MATCHES_ITALY, ...MOCK_ALL_MATCHES_UEFA];
    const matches = allMatches.filter((m) => ids.includes(m.id));
    return of(matches).pipe(delay(MOCK_DELAY_MS));
  }

  getLiveMatches(): Observable<Match[]> {
    return of([...MOCK_LIVE_MATCHES, ...MOCK_LIVE_MATCHES_BRAZIL, ...MOCK_LIVE_MATCHES_ITALY, ...MOCK_LIVE_MATCHES_UEFA]).pipe(delay(MOCK_DELAY_MS));
  }

  getUpcomingMatches(): Observable<Match[]> {
    return of([...MOCK_UPCOMING_MATCHES, ...MOCK_UPCOMING_MATCHES_BRAZIL, ...MOCK_UPCOMING_MATCHES_ITALY, ...MOCK_UPCOMING_MATCHES_UEFA]).pipe(delay(MOCK_DELAY_MS));
  }

  getRecentMatches(): Observable<Match[]> {
    return of([...MOCK_RECENT_MATCHES, ...MOCK_RECENT_MATCHES_BRAZIL, ...MOCK_RECENT_MATCHES_ITALY, ...MOCK_RECENT_MATCHES_UEFA]).pipe(delay(MOCK_DELAY_MS));
  }

  getTeams(): Observable<Team[]> {
    const allTeams = [...MOCK_TEAMS, ...MOCK_TEAMS_BRAZIL, ...MOCK_TEAMS_ITALY, ...MOCK_TEAMS_UEFA];
    const seen = new Set<number>();
    const unique = allTeams.filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
    return of(unique).pipe(delay(MOCK_DELAY_MS));
  }

  getTeamById(id: number): Observable<Team | undefined> {
    const allTeams = [...MOCK_TEAMS, ...MOCK_TEAMS_BRAZIL, ...MOCK_TEAMS_ITALY, ...MOCK_TEAMS_UEFA];
    const team = allTeams.find((t) => t.id === id);
    return of(team).pipe(delay(MOCK_DELAY_MS));
  }

  getPlayers(): Observable<Player[]> {
    const allPlayers = [...MOCK_PLAYERS, ...MOCK_PLAYERS_BRAZIL, ...MOCK_PLAYERS_ITALY, ...MOCK_PLAYERS_UEFA];
    const seen = new Set<number>();
    const unique = allPlayers.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
    return of(unique).pipe(delay(MOCK_DELAY_MS));
  }

  getPlayersByTeam(teamId: number): Observable<Player[]> {
    const allPlayers = [...MOCK_PLAYERS, ...MOCK_PLAYERS_BRAZIL, ...MOCK_PLAYERS_ITALY, ...MOCK_PLAYERS_UEFA];
    const players = allPlayers.filter((p) => p.team?.id === teamId);
    return of(players).pipe(delay(MOCK_DELAY_MS));
  }

  getPlayerById(id: number): Observable<Player | undefined> {
    const allPlayers = [...MOCK_PLAYERS, ...MOCK_PLAYERS_BRAZIL, ...MOCK_PLAYERS_ITALY, ...MOCK_PLAYERS_UEFA];
    const player = allPlayers.find((p) => p.id === id);
    return of(player).pipe(delay(MOCK_DELAY_MS));
  }

  getPlayerDetailById(id: number): Observable<PlayerDetail | undefined> {
    const allPlayers = [...MOCK_PLAYERS, ...MOCK_PLAYERS_BRAZIL, ...MOCK_PLAYERS_ITALY, ...MOCK_PLAYERS_UEFA];
    const player = allPlayers.find((p) => p.id === id);
    if (!player) return of(undefined).pipe(delay(MOCK_DELAY_MS));

    const allCareer = { ...MOCK_PLAYER_CAREER, ...MOCK_PLAYER_CAREER_BRAZIL, ...MOCK_PLAYER_CAREER_ITALY, ...MOCK_PLAYER_CAREER_UEFA };
    const detail: PlayerDetail = {
      ...player,
      careerHistory: allCareer[id] || [],
    };
    return of(detail).pipe(delay(MOCK_DELAY_MS));
  }

  getPlayerStats(playerId: number): Observable<PlayerStatistics | undefined> {
    const allStats = [...MOCK_PLAYER_STATISTICS, ...MOCK_PLAYER_STATISTICS_BRAZIL, ...MOCK_PLAYER_STATISTICS_ITALY, ...MOCK_PLAYER_STATISTICS_UEFA];
    const stats = allStats.find((s) => s.playerId === playerId);
    return of(stats).pipe(delay(MOCK_DELAY_MS));
  }

  getAllPlayerStats(): Observable<PlayerStatistics[]> {
    return of([...MOCK_PLAYER_STATISTICS, ...MOCK_PLAYER_STATISTICS_BRAZIL, ...MOCK_PLAYER_STATISTICS_ITALY, ...MOCK_PLAYER_STATISTICS_UEFA]).pipe(delay(MOCK_DELAY_MS));
  }

  getPlayerMatchParticipation(playerId: number): Observable<PlayerMatchParticipation[]> {
    const allParticipation = [...MOCK_PLAYER_MATCH_PARTICIPATION, ...MOCK_PLAYER_MATCH_PARTICIPATION_BRAZIL, ...MOCK_PLAYER_MATCH_PARTICIPATION_ITALY, ...MOCK_PLAYER_MATCH_PARTICIPATION_UEFA];
    const participations = allParticipation.filter((p) => p.playerId === playerId);
    return of(participations).pipe(delay(MOCK_DELAY_MS));
  }

  getStandings(): Observable<Standing[]> {
    return of([...MOCK_STANDINGS, ...MOCK_STANDINGS_BRAZIL, ...MOCK_STANDINGS_ITALY, ...MOCK_STANDINGS_UEFA]).pipe(delay(MOCK_DELAY_MS));
  }

  getCompetitions(): Observable<Competition[]> {
    return of([...COMPETITIONS, COMPETITION_BRAZIL, COMPETITION_ITALY, COMPETITION_UEFA]).pipe(delay(MOCK_DELAY_MS));
  }

  getMatchesByTeam(teamId: number): Observable<Match[]> {
    const allMatches = [...MOCK_ALL_MATCHES, ...MOCK_ALL_MATCHES_BRAZIL, ...MOCK_ALL_MATCHES_ITALY, ...MOCK_ALL_MATCHES_UEFA];
    const matches = allMatches.filter(
      (m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId
    );
    return of(matches).pipe(delay(MOCK_DELAY_MS));
  }

  getTeamStatistics(teamId: number): Observable<TeamStatistics | undefined> {
    const allStats = [...MOCK_TEAM_STATISTICS, ...MOCK_TEAM_STATISTICS_BRAZIL, ...MOCK_TEAM_STATISTICS_ITALY, ...MOCK_TEAM_STATISTICS_UEFA];
    const stats = allStats.find((s) => s.teamId === teamId);
    return of(stats).pipe(delay(MOCK_DELAY_MS));
  }
}
