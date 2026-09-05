import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <span class="empty-icon">{{ icon() }}</span>
      <p class="empty-message">{{ message() }}</p>
    </div>
  `,
  styles: `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-12) var(--space-4);
      text-align: center;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: var(--space-4);
      opacity: 0.5;
    }
    .empty-message {
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      max-width: 300px;
    }
  `,
})
export class EmptyStateComponent {
  message = input('No hay datos disponibles');
  icon = input('📋');
}
