import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Team } from '../../../core/models/team.model';

@Component({
  selector: 'app-team-badge',
  imports: [RouterLink],
  template: `
    @if (link()) {
      <a [routerLink]="['/teams', team().id]" class="badge-link">
        <div class="badge" [class]="size()">
          @if (team().badgeUrl && !imageError) {
            <img
              [src]="team().badgeUrl"
              [alt]="team().name"
              class="badge-image"
              loading="lazy"
              (error)="imageError = true"
            />
          } @else {
            <span class="badge-icon">
              {{ team().shortName.charAt(0) }}
            </span>
          }
        </div>
      </a>
    } @else {
      <div class="badge" [class]="size()">
        @if (team().badgeUrl && !imageError) {
          <img
            [src]="team().badgeUrl"
            [alt]="team().name"
            class="badge-image"
            loading="lazy"
            (error)="imageError = true"
          />
        } @else {
          <span class="badge-icon">
            {{ team().shortName.charAt(0) }}
          </span>
        }
      </div>
    }
  `,
  styles: `
    .badge-link {
      display: inline-flex;
      text-decoration: none;
      color: inherit;
      line-height: 0;
    }
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
      width: 40px;
      height: 40px;
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
  link = input(false);
  imageError = false;
}
