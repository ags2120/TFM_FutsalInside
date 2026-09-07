import { Component, input, computed } from '@angular/core';
import { PlayerStatistics } from '../../../core/models/statistics.model';

@Component({
  selector: 'app-player-advanced-stats',
  template: `
    <div class="advanced-card">
      <h3 class="card-title">Estadísticas avanzadas</h3>
      <div class="stats-list">
        @for (stat of advancedStats(); track stat.label) {
          <div class="stat-row">
            <div class="stat-header">
              <span class="stat-label">{{ stat.label }}</span>
              <span class="stat-value">{{ stat.displayValue }}</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" [style.width.%]="stat.percentage"></div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .advanced-card {
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
    .stats-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .stat-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    .stat-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      font-family: var(--font-family-mono);
    }
    .progress-track {
      width: 100%;
      height: 6px;
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background-color: var(--color-accent);
      border-radius: var(--radius-full);
      transition: width var(--transition-normal);
    }
  `],
})
export class PlayerAdvancedStatsComponent {
  readonly stats = input.required<PlayerStatistics>();

  readonly advancedStats = computed(() => {
    const s = this.stats();
    return [
      { label: 'xG (Expected Goals)', displayValue: s.expectedGoals.toFixed(1), percentage: Math.min(100, (s.expectedGoals / 20) * 100) },
      { label: 'xA (Expected Assists)', displayValue: s.expectedAssists.toFixed(1), percentage: Math.min(100, (s.expectedAssists / 12) * 100) },
      { label: 'Precisión de pase', displayValue: s.passAccuracy + '%', percentage: s.passAccuracy },
      { label: 'Participación en goles', displayValue: s.goalParticipation + '%', percentage: s.goalParticipation },
      { label: 'Acciones defensivas', displayValue: s.defensiveActions.toString(), percentage: Math.min(100, (s.defensiveActions / 40) * 100) },
    ];
  });
}
