import { Component, input, computed } from '@angular/core';
import { PlayerStatistics } from '../../../core/models/statistics.model';

@Component({
  selector: 'app-player-stats-card',
  standalone: true,
  template: `
    <div class="stats-card">
      <h3 class="stats-title">{{ title() }}</h3>
      <div class="stats-grid">
        @for (stat of statItems(); track stat.label) {
          <div class="stat-item">
            <span class="stat-value" [class]="stat.color || ''">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .stats-card {
      background-color: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    }
    .stats-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0 0 var(--space-3) 0;
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
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      font-family: var(--font-family-mono);
    }
    .stat-value.accent { color: var(--color-accent); }
    .stat-value.yellow { color: #f59e0b; }
    .stat-value.red { color: #ef4444; }
    .stat-value.blue { color: #3b82f6; }
    .stat-value.purple { color: #a78bfa; }
    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: center;
    }
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `],
})
export class PlayerStatsCardComponent {
  readonly title = input.required<string>();
  readonly stats = input.required<PlayerStatistics>();
  readonly averageRating = input<number>(0);

  readonly statItems = computed(() => {
    const s = this.stats();
    const goalParticipations = s.goals + s.assists;

    if (this.title().toLowerCase().includes('carrera')) {
      return [
        { label: 'Goles', value: s.careerGoals, color: 'accent' },
        { label: 'Asistencias', value: s.careerAssists, color: 'blue' },
        { label: 'Partidos', value: s.careerMatchesPlayed, color: '' },
        { label: 'Amarillas', value: s.careerYellowCards, color: 'yellow' },
        { label: 'Rojas', value: s.careerRedCards, color: 'red' },
        { label: 'Gol/Partido', value: s.careerMatchesPlayed > 0 ? (s.careerGoals / s.careerMatchesPlayed).toFixed(2) : '0.00', color: 'accent' },
      ];
    }

    return [
      { label: 'Goles', value: s.goals, color: 'accent' },
      { label: 'Asistencias', value: s.assists, color: 'blue' },
      { label: 'Partidos', value: s.matchesPlayed, color: '' },
      { label: 'Valoración', value: this.averageRating().toFixed(1), color: 'purple' },
      { label: 'Amarillas', value: s.yellowCards, color: 'yellow' },
      { label: 'Rojas', value: s.redCards, color: 'red' },
      { label: 'Part. gol', value: goalParticipations, color: 'accent' },
      { label: 'xG', value: s.expectedGoals.toFixed(1), color: 'blue' },
    ];
  });
}
