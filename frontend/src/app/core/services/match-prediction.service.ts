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
  /** Home advantage, expressed as extra expected goals for the host. */
  private static readonly HOME_ADVANTAGE = 0.35;

  predict(homeTeam: Team, awayTeam: Team, standings: Standing[]): MatchPrediction {
    const homeStanding = standings.find(s => s.team.id === homeTeam.id);
    const awayStanding = standings.find(s => s.team.id === awayTeam.id);

    // Two clubs can co-exist in several competitions; a prediction must be
    // framed inside the competition they actually share, so league baselines
    // are scoped to the home side's table (both sides sit in the same one).
    const homeCompetitionId = homeStanding?.competitionId;
    const scoped = homeCompetitionId !== undefined
      ? standings.filter(s => s.competitionId === homeCompetitionId)
      : standings;

    const leagueAvgGoals = this.leagueAverage(scoped);

    const attackHome = this.attackStrength(homeStanding, leagueAvgGoals);
    const attackAway = this.attackStrength(awayStanding, leagueAvgGoals);
    const defenseHome = this.defenseStrength(homeStanding, leagueAvgGoals);
    const defenseAway = this.defenseStrength(awayStanding, leagueAvgGoals);

    const expectedHomeGoals = this.clampExpected(
      attackHome * defenseAway * leagueAvgGoals + MatchPredictionService.HOME_ADVANTAGE,
    );
    const expectedAwayGoals = this.clampExpected(attackAway * defenseHome * leagueAvgGoals);

    const probabilities = this.resultProbabilities(expectedHomeGoals, expectedAwayGoals);

    // Round the two smaller shares and derive the largest bucket as the
    // remainder, so the three probabilities always sum to exactly 100.
    const raw = [
      { key: 'home' as const, value: probabilities.home },
      { key: 'draw' as const, value: probabilities.draw },
      { key: 'away' as const, value: probabilities.away },
    ].sort((a, b) => a.value - b.value);

    const pct: Record<'home' | 'draw' | 'away', number> = { home: 0, draw: 0, away: 0 };
    pct[raw[0].key] = Math.round(raw[0].value * 100);
    pct[raw[1].key] = Math.round(raw[1].value * 100);
    pct[raw[2].key] = 100 - pct[raw[0].key] - pct[raw[1].key];

    let mostLikelyOutcome: 'home' | 'draw' | 'away' = 'home';
    if (pct.away >= pct.home && pct.away >= pct.draw) {
      mostLikelyOutcome = 'away';
    } else if (pct.draw >= pct.home && pct.draw >= pct.away) {
      mostLikelyOutcome = 'draw';
    }

    return { homeTeam, awayTeam, homeWinProb: pct.home, drawProb: pct.draw, awayWinProb: pct.away, mostLikelyOutcome };
  }

  /**
   * Baseline for the competition: total goals per played fixture. Summing
   * `goalsFor` over the ten-team table counts every goal twice, as does
   * summing `played`, so the double counting cancels and the ratio is the
   * true league average.
   */
  private leagueAverage(standings: Standing[]): number {
    const totals = standings.reduce(
      (acc, s) => {
        acc.goals += s.goalsFor;
        acc.played += s.played;
        return acc;
      },
      { goals: 0, played: 0 },
    );
    return totals.played > 0 ? totals.goals / totals.played : 3;
  }

  private attackStrength(standing: Standing | undefined, leagueAvgGoals: number): number {
    if (!standing || standing.played === 0 || leagueAvgGoals <= 0) return 1;
    return standing.goalsFor / standing.played / leagueAvgGoals;
  }

  private defenseStrength(standing: Standing | undefined, leagueAvgGoals: number): number {
    if (!standing || standing.played === 0 || leagueAvgGoals <= 0) return 1;
    return standing.goalsAgainst / standing.played / leagueAvgGoals;
  }

  private clampExpected(goals: number): number {
    return Math.min(6, Math.max(0.3, goals));
  }

  /**
   * Independent Poisson scoring rates: each side's goals-per-match figure
   * becomes a full goal grid (0..6+, tail folded in) whose joint mass adds
   * up to the three outcome probabilities.
   */
  private resultProbabilities(lambdaHome: number, lambdaAway: number): {
    home: number;
    draw: number;
    away: number;
  } {
    const pmfHome = this.poissonPmf(lambdaHome);
    const pmfAway = this.poissonPmf(lambdaAway);

    let home = 0;
    let draw = 0;

    for (let i = 0; i < pmfHome.length; i++) {
      for (let j = 0; j < pmfAway.length; j++) {
        if (i > j) home += pmfHome[i] * pmfAway[j];
        else if (i === j) draw += pmfHome[i] * pmfAway[j];
      }
    }

    return { home, draw, away: Math.max(0, 1 - home - draw) };
  }

  /** P(k goals | lambda) for k = 0..6, with the 6+ tail folded into k = 6. */
  private poissonPmf(lambda: number): number[] {
    const pmf: number[] = [];
    let cumulative = 0;
    for (let k = 0; k <= 6; k++) {
      const p = (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
      pmf.push(k === 6 ? Math.max(0, 1 - cumulative) : p);
      cumulative += p;
    }
    return pmf;
  }
}

function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}