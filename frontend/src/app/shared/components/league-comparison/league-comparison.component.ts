import { Component, input, computed, inject } from '@angular/core';
import { PlayerStatistics } from '../../../core/models/statistics.model';
import { PlayersStore } from '../../../stores/players.store';

@Component({
  selector: 'app-league-comparison',
  template: `
    <div class="comparison-card">
      <h3 class="card-title">Comparativa con la liga</h3>
      <div class="comparison-list">
        @for (item of comparisons(); track item.label) {
          <div class="comparison-row">
            <div class="comparison-header">
              <span class="comparison-label">{{ item.label }}</span>
              <span class="comparison-values">
                <span class="player-val">{{ item.playerValue }}</span>
                <span class="separator">vs</span>
                <span class="league-val">{{ item.leagueAvg }}</span>
              </span>
            </div>
            <div class="bar-container">
              <div class="bar-track">
                <div class="bar-player" [style.width.%]="item.playerPercent"></div>
                <div class="bar-league" [style.left.%]="item.leaguePercent"></div>
              </div>
              <span class="diff-badge" [class.above]="item.diffPercent > 0" [class.below]="item.diffPercent < 0">
                {{ item.diffPercent > 0 ? '+' : '' }}{{ item.diffPercent.toFixed(1) }}%
              </span>
            </div>
            <div class="comparison-tooltip">
              Este jugador está un {{ item.diffPercent > 0 ? item.diffPercent.toFixed(1) : (item.diffPercent * -1).toFixed(1) }}% {{ item.diffPercent >= 0 ? 'por encima' : 'por debajo' }} de la media de la liga
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .comparison-card {
      background-color: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    }
    .card-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0 0 var(--space-4) 0;
    }
    .comparison-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    .comparison-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
    }
    .comparison-row:hover .comparison-tooltip {
      opacity: 1;
      visibility: visible;
    }
    .comparison-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .comparison-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    .comparison-values {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-xs);
      font-family: var(--font-family-mono);
    }
    .player-val {
      color: var(--color-accent);
      font-weight: var(--font-weight-bold);
    }
    .separator {
      color: var(--color-text-muted);
    }
    .league-val {
      color: var(--color-text-muted);
    }
    .bar-container {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    .bar-track {
      flex: 1;
      height: 6px;
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-full);
      position: relative;
      overflow: hidden;
    }
    .bar-player {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background-color: var(--color-accent);
      border-radius: var(--radius-full);
      transition: width var(--transition-normal);
    }
    .bar-league {
      position: absolute;
      top: -2px;
      width: 2px;
      height: 10px;
      background-color: var(--color-text-muted);
      border-radius: 1px;
      transform: translateX(-1px);
    }
    .diff-badge {
      font-size: 10px;
      font-weight: var(--font-weight-bold);
      font-family: var(--font-family-mono);
      padding: 1px 6px;
      border-radius: var(--radius-sm);
      white-space: nowrap;
      min-width: 42px;
      text-align: center;
    }
    .diff-badge.above {
      background-color: rgba(0, 210, 106, 0.15);
      color: var(--color-accent);
    }
    .diff-badge.below {
      background-color: rgba(255, 68, 68, 0.15);
      color: var(--color-loss);
    }
    .comparison-tooltip {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-style: italic;
      opacity: 0;
      visibility: hidden;
      transition: opacity var(--transition-fast);
    }
  `],
})
export class LeagueComparisonComponent {
  private readonly playersStore = inject(PlayersStore);

  readonly stats = input.required<PlayerStatistics>();

  readonly comparisons = computed(() => {
    const s = this.stats();
    const allStats = this.playersStore.playerStats();

    if (allStats.length === 0) return [];

    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const allGoals = allStats.map(p => p.goals);
    const allAssists = allStats.map(p => p.assists);
    const allMatches = allStats.map(p => p.matchesPlayed);
    const allXg = allStats.map(p => p.expectedGoals);
    const allPassAcc = allStats.map(p => p.passAccuracy);
    const allParticipations = allStats.map(p => p.goals + p.assists);

    const leagueGoals = avg(allGoals);
    const leagueAssists = avg(allAssists);
    const leagueMatches = avg(allMatches);
    const leagueXg = avg(allXg);
    const leaguePassAcc = avg(allPassAcc);
    const leagueParticipations = avg(allParticipations);

    const goalsPerMatch = s.matchesPlayed > 0 ? s.goals / s.matchesPlayed : 0;
    const leagueGoalsPerMatch = leagueMatches > 0 ? leagueGoals / leagueMatches : 0;
    const playerParticipations = s.goals + s.assists;
    const participationsPerMatch = s.matchesPlayed > 0 ? playerParticipations / s.matchesPlayed : 0;
    const leaguePartPerMatch = leagueMatches > 0 ? leagueParticipations / leagueMatches : 0;

    const diff = (player: number, league: number) => league > 0 ? ((player - league) / league) * 100 : 0;
    const pct = (val: number, max: number) => Math.min(100, (val / max) * 100);

    return [
      {
        label: 'Goles por partido',
        playerValue: goalsPerMatch.toFixed(2),
        leagueAvg: leagueGoalsPerMatch.toFixed(2),
        playerPercent: pct(goalsPerMatch, Math.max(goalsPerMatch, leagueGoalsPerMatch) * 1.3),
        leaguePercent: pct(leagueGoalsPerMatch, Math.max(goalsPerMatch, leagueGoalsPerMatch) * 1.3),
        diffPercent: diff(goalsPerMatch, leagueGoalsPerMatch),
      },
      {
        label: 'Asistencias por partido',
        playerValue: s.matchesPlayed > 0 ? (s.assists / s.matchesPlayed).toFixed(2) : '0.00',
        leagueAvg: leagueMatches > 0 ? (leagueAssists / leagueMatches).toFixed(2) : '0.00',
        playerPercent: pct(s.matchesPlayed > 0 ? s.assists / s.matchesPlayed : 0, Math.max(s.matchesPlayed > 0 ? s.assists / s.matchesPlayed : 0, leagueMatches > 0 ? leagueAssists / leagueMatches : 0) * 1.3),
        leaguePercent: pct(leagueMatches > 0 ? leagueAssists / leagueMatches : 0, Math.max(s.matchesPlayed > 0 ? s.assists / s.matchesPlayed : 0, leagueMatches > 0 ? leagueAssists / leagueMatches : 0) * 1.3),
        diffPercent: diff(s.matchesPlayed > 0 ? s.assists / s.matchesPlayed : 0, leagueMatches > 0 ? leagueAssists / leagueMatches : 0),
      },
      {
        label: 'xG (Expected Goals)',
        playerValue: s.expectedGoals.toFixed(1),
        leagueAvg: leagueXg.toFixed(1),
        playerPercent: pct(s.expectedGoals, Math.max(s.expectedGoals, leagueXg) * 1.3),
        leaguePercent: pct(leagueXg, Math.max(s.expectedGoals, leagueXg) * 1.3),
        diffPercent: diff(s.expectedGoals, leagueXg),
      },
      {
        label: 'Precisión de pase',
        playerValue: s.passAccuracy + '%',
        leagueAvg: leaguePassAcc.toFixed(0) + '%',
        playerPercent: s.passAccuracy,
        leaguePercent: leaguePassAcc,
        diffPercent: diff(s.passAccuracy, leaguePassAcc),
      },
      {
        label: 'Part. gol',
        playerValue: participationsPerMatch.toFixed(2),
        leagueAvg: leaguePartPerMatch.toFixed(2),
        playerPercent: pct(participationsPerMatch, Math.max(participationsPerMatch, leaguePartPerMatch) * 1.3),
        leaguePercent: pct(leaguePartPerMatch, Math.max(participationsPerMatch, leaguePartPerMatch) * 1.3),
        diffPercent: diff(participationsPerMatch, leaguePartPerMatch),
      },
    ];
  });
}
