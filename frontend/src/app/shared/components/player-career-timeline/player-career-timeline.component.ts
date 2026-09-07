import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CareerEntry } from '../../../core/models/player.model';

@Component({
  selector: 'app-player-career-timeline',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="career-card">
      <h3 class="career-title">Trayectoria</h3>
      <div class="timeline">
        @for (entry of career(); track entry.startDate; let i = $index) {
          <div class="timeline-item" [class.current]="!entry.endDate">
            <div class="timeline-marker">
              <div class="marker-dot" [class.current]="!entry.endDate"></div>
              @if (i < career().length - 1) {
                <div class="marker-line"></div>
              }
            </div>
            <div class="timeline-content">
              <div class="timeline-top">
                <a [routerLink]="['/teams', entry.team.id]" class="team-name">
                  {{ entry.team.name }}
                </a>
                @if (!entry.endDate) {
                  <span class="current-badge">Actual</span>
                }
              </div>
              <span class="team-period">
                {{ formatYear(entry.startDate) }} — {{ entry.endDate ? formatYear(entry.endDate) : 'Actual' }}
              </span>
              @if (entry.matchesPlayed || entry.goals) {
                <div class="career-stats">
                  @if (entry.matchesPlayed) {
                    <span class="career-stat">{{ entry.matchesPlayed }} partidos</span>
                  }
                  @if (entry.goals) {
                    <span class="career-stat">{{ entry.goals }} goles</span>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .career-card {
      background-color: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    }
    .career-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0 0 var(--space-4) 0;
    }
    .timeline {
      display: flex;
      flex-direction: column;
    }
    .timeline-item {
      display: flex;
      gap: var(--space-3);
    }
    .timeline-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }
    .marker-dot {
      width: 12px;
      height: 12px;
      border-radius: var(--radius-full);
      background-color: var(--color-border);
      border: 2px solid var(--color-bg-card);
      flex-shrink: 0;
      z-index: 1;
    }
    .marker-dot.current {
      background-color: var(--color-accent);
    }
    .marker-line {
      width: 2px;
      flex: 1;
      background-color: var(--color-border);
      min-height: 24px;
    }
    .timeline-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-bottom: var(--space-3);
    }
    .timeline-top {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    .team-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      text-decoration: none;
      transition: color var(--transition-fast);
    }
    .team-name:hover {
      color: var(--color-accent);
    }
    .team-period {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }
    .career-stats {
      display: flex;
      gap: var(--space-3);
      margin-top: 2px;
    }
    .career-stat {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      font-family: var(--font-family-mono);
    }
    .current-badge {
      display: inline-flex;
      align-items: center;
      font-size: 10px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-accent);
      background-color: var(--color-accent-muted);
      padding: 2px 8px;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `],
})
export class PlayerCareerTimelineComponent {
  readonly career = input.required<CareerEntry[]>();

  protected formatYear(dateStr: string): string {
    const date = new Date(dateStr);
    return date.getFullYear().toString();
  }
}
