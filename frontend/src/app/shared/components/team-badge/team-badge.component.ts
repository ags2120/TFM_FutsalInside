import { Component, input } from '@angular/core';
import { Team } from '../../../core/models/team.model';

@Component({
  selector: 'app-team-badge',
  template: `
  <div class="badge" [class]="size()">
    @if (team().badgeUrl && !imageError) {
      <img
        [src]="team().badgeUrl"
        [alt]="team().name"
        class="badge-image"
        (error)="imageError = true"
      />
    } @else {
      <span class="badge-icon">
        {{ team().shortName.charAt(0) }}
      </span>
    }
  </div>
`,
  styles: `
    .badge {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      background-color: var(--color-bg-tertiary);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      flex-shrink: 0;
    }
    .badge.sm {
      width: 35px;
      height: 35px;
      font-size: var(--font-size-xs);
    }
    .badge.md {
      width: 32px;
      height: 32px;
      font-size: var(--font-size-sm);
    }
    .badge.lg {
      width: 48px;
      height: 48px;
      font-size: var(--font-size-lg);
    }
  `,
})
export class TeamBadgeComponent {
  team = input.required<Team>();
  size = input<'sm' | 'md' | 'lg'>('md');
  imageError = false;
}
