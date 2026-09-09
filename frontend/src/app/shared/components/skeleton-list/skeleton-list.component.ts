import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-list',
  template: `
    <div class="skeleton-list">
      <div class="skeleton-list-header">
        <div class="skeleton-line short"></div>
      </div>
      @for (item of skeletonItems(); track item) {
        <div class="skeleton-list-row">
          <div class="skeleton-line tiny"></div>
          <div class="skeleton-avatar-sm"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line tiny"></div>
        </div>
      }
    </div>
  `,
  styles: `
    .skeleton-list {
      background-color: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .skeleton-list-header {
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--color-border);
    }

    .skeleton-list-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-4);
      border-bottom: 1px solid var(--color-border);
    }

    .skeleton-list-row:last-child {
      border-bottom: none;
    }

    .skeleton-line {
      height: 12px;
      background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-bg-hover) 50%, var(--color-bg-tertiary) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-sm);
    }

    .skeleton-line.short { width: 80px; }
    .skeleton-line.tiny { width: 20px; }
    .skeleton-line.medium { flex: 1; height: 12px; }

    .skeleton-avatar-sm {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-bg-hover) 50%, var(--color-bg-tertiary) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      flex-shrink: 0;
    }
  `,
})
export class SkeletonListComponent {
  count = input(5);

  protected readonly skeletonItems = () => Array.from({ length: this.count() }, (_, i) => i);
}
