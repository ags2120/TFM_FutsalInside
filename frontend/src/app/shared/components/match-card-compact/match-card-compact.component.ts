import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Match } from '../../../core/models/match.model';
import { TeamBadgeComponent } from '../team-badge/team-badge.component';

@Component({
  selector: 'app-match-card-compact',
  imports: [RouterLink, TeamBadgeComponent],
  template: `
    <a [routerLink]="['/matches', match().id]" class="match-compact">
      <div class="compact-left">
        <span class="team-info">
          <app-team-badge [team]="match().homeTeam" size="sm" />
          <span class="team-name">{{ match().homeTeam.shortName }}</span>
        </span>
      </div>
      <div class="compact-score">
        <span class="score">{{ match().homeScore }} - {{ match().awayScore }}</span>
        @if (match().minute) {
          <span class="minute">{{ match().minute }}'</span>
        }
      </div>
      <div class="compact-right">
        <span class="team-info">
          <span class="team-name">{{ match().awayTeam.shortName }}</span>
          <app-team-badge [team]="match().awayTeam" size="sm" />
        </span>
      </div>
    </a>
  `,
  styles: `
    .match-compact {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-2) var(--space-3);
      background-color: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-left: 3px solid var(--color-live);
      border-radius: var(--radius-md);
      gap: var(--space-3);
      text-decoration: none;
      color: inherit;
      transition: background-color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
    }

    .match-compact:hover {
      background-color: var(--color-bg-hover);
      border-color: var(--color-border-light);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .compact-left,
    .compact-right {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      flex: 1;
      min-width: 0;
    }

    .compact-right {
      justify-content: flex-end;
    }

    .team-info {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: 2px 4px;
      border-radius: var(--radius-sm);
      min-width: 0;
    }

    .team-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .compact-score {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      flex-shrink: 0;
    }

    .score {
      font-family: var(--font-family-mono);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
    }

    .minute {
      font-size: 0.625rem;
      color: var(--color-live);
      font-weight: var(--font-weight-bold);
    }
  `,
})
export class MatchCardCompactComponent {
  match = input.required<Match>();
}
