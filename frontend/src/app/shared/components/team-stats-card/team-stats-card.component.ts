import { Component, input, computed } from '@angular/core';
import { TeamStatistics } from '../../../core/models/statistics.model';
import { Standing } from '../../../core/models/standings.model';

@Component({
  selector: 'app-team-stats-card',
  template: `
    <div class="team-stats-card">
      <h3 class="card-title">{{ title() }}</h3>
      <div class="stats-grid">
        @for (stat of computedStats(); track stat.label) {
          <div class="stat-item" [class]="stat.colorClass || ''">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .team-stats-card {
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
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-3);
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: var(--space-2);
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-md);
    }
    .stat-value {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      font-family: var(--font-family-mono);
    }
    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-item.color-accent .stat-value { color: var(--color-accent); }
    .stat-item.color-win .stat-value { color: var(--color-win); }
    .stat-item.color-loss .stat-value { color: var(--color-loss); }
    .stat-item.color-muted .stat-value { color: var(--color-text-secondary); }
    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: repeat(3, 1fr); }
    }
  `],
})
export class TeamStatsCardComponent {
  readonly title = input('Estadísticas de temporada');
  readonly stats = input.required<TeamStatistics>();
  readonly standing = input<Standing | null>(null);

  protected readonly computedStats = computed(() => {
    const s = this.stats();
    const st = this.standing();
    const goalsPerMatch = s.matchesPlayed > 0 ? (s.goalsScored / s.matchesPlayed).toFixed(1) : '0.0';
    const winRate = s.matchesPlayed > 0 ? ((s.wins / s.matchesPlayed) * 100).toFixed(0) : '0';
    const streak = this.getStreak(st?.form || []);

    return [
      { label: 'Goles marcados', value: s.goalsScored.toString(), colorClass: 'color-accent' },
      { label: 'Goles encajados', value: s.goalsConceded.toString(), colorClass: 'color-muted' },
      { label: 'Goles/partido', value: goalsPerMatch, colorClass: 'color-accent' },
      { label: '% Victoria', value: winRate + '%', colorClass: 'color-win' },
      { label: 'Racha', value: streak, colorClass: 'color-win' },
      { label: 'Porterías a cero', value: s.cleanSheets.toString(), colorClass: 'color-muted' },
      { label: 'Posesión media', value: (s.avgBallPossession || 0) + '%', colorClass: 'color-accent' },
      { label: 'Puntos', value: (st?.points || 0).toString(), colorClass: 'color-accent' },
    ];
  });

  private getStreak(form: string[]): string {
    if (form.length === 0) return '—';
    const last = form[form.length - 1];
    let count = 0;
    for (let i = form.length - 1; i >= 0; i--) {
      if (form[i] === last) count++;
      else break;
    }
    const label = last === 'W' ? 'V' : last === 'D' ? 'E' : 'D';
    return count > 1 ? `${count}${label}` : label;
  }
}
