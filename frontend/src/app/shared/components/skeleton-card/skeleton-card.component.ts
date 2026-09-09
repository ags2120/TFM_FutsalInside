import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  template: `
    <div class="skeleton-card">
      <div class="skeleton-header">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line tiny"></div>
      </div>
      <div class="skeleton-teams">
        <div class="skeleton-team">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-line medium"></div>
        </div>
        <div class="skeleton-score">
          <div class="skeleton-box"></div>
        </div>
        <div class="skeleton-team">
          <div class="skeleton-line medium"></div>
          <div class="skeleton-avatar"></div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .skeleton-card {
      background-color: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-3);
    }

    .skeleton-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }

    .skeleton-teams {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
    }

    .skeleton-team {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      flex: 1;
    }

    .skeleton-score {
      flex-shrink: 0;
    }

    .skeleton-line {
      height: 12px;
      background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-bg-hover) 50%, var(--color-bg-tertiary) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-sm);
    }

    .skeleton-line.short { width: 60px; }
    .skeleton-line.tiny { width: 40px; }
    .skeleton-line.medium { width: 80px; }

    .skeleton-avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-bg-hover) 50%, var(--color-bg-tertiary) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      flex-shrink: 0;
    }

    .skeleton-box {
      width: 60px;
      height: 36px;
      background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-bg-hover) 50%, var(--color-bg-tertiary) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-md);
    }
  `,
})
export class SkeletonCardComponent {}
