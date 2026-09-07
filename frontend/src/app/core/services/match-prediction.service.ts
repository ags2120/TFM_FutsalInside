import { Injectable } from '@angular/core';
import { Standing } from '../models/standings.model';
import { Team } from '../models/team.model';

export interface MatchPrediction {
  homeTeam: Team;
  awayTeam: Team;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  mostLikelyOutcome: 'home' | 'draw' | 'away';
}

@Injectable({ providedIn: 'root' })
export class MatchPredictionService {

  predict(homeTeam: Team, awayTeam: Team, standings: Standing[]): MatchPrediction {
    const homeStanding = standings.find(s => s.team.id === homeTeam.id);
    const awayStanding = standings.find(s => s.team.id === awayTeam.id);

    const totalGoals = standings.reduce((sum, s) => sum + s.goalsFor, 0);
    const totalMatches = standings.reduce((sum, s) => sum + s.played, 0);
    const leagueAvgGoals = totalMatches > 0 ? totalGoals / totalMatches : 3;

    const homeStrength = this.computeStrength(homeStanding, leagueAvgGoals);
    const awayStrength = this.computeStrength(awayStanding, leagueAvgGoals);

    const HFA = 0.07;
    const diff = (homeStrength + HFA) - awayStrength;

    let homeWin = 1 / (1 + Math.pow(10, -10 * diff));
    const awayWin = 1 / (1 + Math.pow(10, 10 * diff));

    const absDiff = Math.abs(diff);
    let draw = Math.max(0.12, 0.22 - absDiff * 35) * (1 - absDiff);
    draw = Math.min(draw, 0.30);

    const total = homeWin + draw + awayWin;
    homeWin /= total;
    draw /= total;
    const awayWinNorm = awayWin / total;

    const homeWinProb = Math.round(homeWin * 100);
    const drawProb = Math.round(draw * 100);
    const awayWinProb = 100 - homeWinProb - drawProb;

    let mostLikelyOutcome: 'home' | 'draw' | 'away' = 'home';
    if (awayWinProb >= homeWinProb && awayWinProb >= drawProb) {
      mostLikelyOutcome = 'away';
    } else if (drawProb >= homeWinProb && drawProb >= awayWinProb) {
      mostLikelyOutcome = 'draw';
    }

    return { homeTeam, awayTeam, homeWinProb, drawProb, awayWinProb, mostLikelyOutcome };
  }

  private computeStrength(standing: Standing | undefined, leagueAvgGoals: number): number {
    if (!standing || standing.played === 0) return 0.5;

    const attackStrength = standing.goalsFor / standing.played / leagueAvgGoals;
    const defenseStrength = standing.goalsAgainst / standing.played / leagueAvgGoals;

    const maxPoints = standingsMaxPoints(standing);
    const pointBonus = maxPoints > 0 ? (standing.points / maxPoints) * 0.05 : 0;

    let formBonus = 0;
    for (const result of standing.form) {
      if (result === 'W') formBonus += 0.04;
      else if (result === 'L') formBonus -= 0.03;
    }

    return attackStrength * 0.65 + (1 - defenseStrength) * 0.35 + formBonus + pointBonus;
  }
}

function standingsMaxPoints(s: Standing): number {
  return s.played * 3;
}
