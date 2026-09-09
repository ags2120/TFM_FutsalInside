import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Standing } from '../../../core/models/standings.model';
import { TeamBadgeComponent } from '../team-badge/team-badge.component';

@Component({
  selector: 'app-standings-mini',
  imports: [RouterLink, TeamBadgeComponent],
  template: `
    <div class="standings-mini">
      <div class="mini-header">
        <h3 class="mini-title">{{ label() }}</h3>
        <a routerLink="/standings" class="mini-link">Ver toda →</a>
      </div>
      <div class="mini-table">
        <div class="mini-row header-row">
          <span class="col-pos">#</span>
          <span class="col-team">Equipo</span>
          <span class="col-stat">PJ</span>
          <span class="col-stat">DG</span>
          <span class="col-stat pts">Pts</span>
        </div>
        @for (standing of standings().slice(0, maxItems()); track standing.team.id) {
          <div class="mini-row">
            <span class="col-pos">{{ standing.position }}</span>
            <div class="col-team">
              <a [routerLink]="['/teams', standing.team.id]" class="team-link">
                <app-team-badge [team]="standing.team" size="sm" />
                <span class="team-name">{{ standing.team.shortName }}</span>
              </a>
            </div>
            <span class="col-stat">{{ standing.played }}</span>
            <span class="col-stat" [class.positive]="standing.goalDifference > 0" [class.negative]="standing.goalDifference < 0">
              {{ standing.goalDifference > 0 ? '+' : '' }}{{ standing.goalDifference }}
            </span>
            <span class="col-stat pts">{{ standing.points }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .standings-mini {
      background-color: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .mini-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--color-border);
    }

    .mini-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
    }

    .mini-link {
      font-size: var(--font-size-xs);
      color: var(--color-accent);
      text-decoration: none;
      font-weight: var(--font-weight-medium);
    }

    .mini-link:hover {
      text-decoration: underline;
    }

    .mini-table {
      display: flex;
      flex-direction: column;
    }

    .mini-row {
      display: grid;
      grid-template-columns: 28px 1fr 36px 36px 40px;
      align-items: center;
      padding: var(--space-2) var(--space-4);
      gap: var(--space-2);
      border-bottom: 1px solid var(--color-border);
    }

    .mini-row:last-child {
      border-bottom: none;
    }

    .mini-row.header-row {
      background-color: var(--color-bg-tertiary);
    }

    .mini-row.header-row .col-stat,
    .mini-row.header-row .col-pos {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      font-weight: var(--font-weight-medium);
    }

    .col-pos {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      text-align: center;
      font-weight: var(--font-weight-medium);
    }

    .col-team {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      min-width: 0;
    }

    .team-link {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      text-decoration: none;
      color: inherit;
      padding: 2px 4px;
      border-radius: var(--radius-sm);
      transition: background-color var(--transition-fast);
      min-width: 0;
      cursor: pointer;
    }

    .team-link:hover { transform: scale(1.05); }
    .team-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .col-stat {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      text-align: center;
      font-weight: var(--font-weight-medium);
    }

    .col-stat.pts {
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
    }

    .col-stat.positive {
      color: var(--color-win);
    }

    .col-stat.negative {
      color: var(--color-loss);
    }
  `,
})
export class StandingsMiniComponent {
  standings = input.required<Standing[]>();
  maxItems = input(5);
  label = input<string>('Clasificación');
}
