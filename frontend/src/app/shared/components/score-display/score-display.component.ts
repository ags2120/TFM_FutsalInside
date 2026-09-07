import { Component, input } from '@angular/core';

@Component({
  selector: 'app-score-display',
  template: `
    <div class="score-display">
      <div class="score-box home">
        <span class="score-number">{{ homeScore() }}</span>
      </div>
      <div class="score-center">
        @if (isLive()) {
          <span class="live-dot"></span>
        }
        <span class="separator">:</span>
      </div>
      <div class="score-box away">
        <span class="score-number">{{ awayScore() }}</span>
      </div>
    </div>
  `,
  styles: `
    .score-display {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: linear-gradient(135deg, var(--color-bg-tertiary) 0%, var(--color-bg-secondary) 100%);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border-light);
      box-shadow: var(--shadow-md);
    }

    /*.score-display.live:hover {
      background: linear-gradient(135deg, rgba(255, 68, 68, 0.2) 0%, rgba(255, 68, 68, 0.1) 100%);
      border-color: var(--color-live);
      box-shadow: 0 0 8px rgba(255, 68, 68, 0.3), var(--shadow-md);
      animation: pulse-glow 2s ease-in-out infinite;
    }*/

    .score-box {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 48px;
      padding: 6px 10px;
      background: var(--color-bg-primary);
      border-radius: var(--radius-md);
    }

    .score-number {
      font-family: var(--font-family-mono);
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
    }

    .score-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 0 4px;
    }

    .separator {
      font-family: var(--font-family-mono);
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
    }

    .live-dot {
      width: 8px;
      height: 8px;
      background: var(--color-live);
      border-radius: 50%;
      animation: blink 1s ease-in-out infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `,
})
export class ScoreDisplayComponent {
  homeScore = input.required<number>();
  awayScore = input.required<number>();
  isLive = input<boolean>(false);
}
