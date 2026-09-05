import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-container">
      <div class="spinner"></div>
    </div>
  `,
  styles: `
    .spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-8);
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-accent);
      border-radius: var(--radius-full);
      animation: spin 0.8s linear infinite;
    }
  `,
})
export class LoadingSpinnerComponent {}
