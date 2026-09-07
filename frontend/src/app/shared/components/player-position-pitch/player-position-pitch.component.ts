import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-player-position-pitch',
  template: `
    <div class="pitch-wrapper">
      <svg viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg" class="pitch-svg">
        <!-- Court background -->
        <rect x="0" y="0" width="120" height="180" rx="4"
              fill="#1a2e1a" opacity="0.6"/>

        <!-- Court outline -->
        <rect x="6" y="6" width="108" height="168" rx="3"
              fill="none" stroke="#3a5a3a" stroke-width="1.5"/>

        <!-- Center line -->
        <line x1="6" y1="90" x2="114" y2="90" stroke="#3a5a3a" stroke-width="1"/>

        <!-- Center circle -->
        <circle cx="60" cy="90" r="18" fill="none" stroke="#3a5a3a" stroke-width="1"/>

        <!-- Top penalty area (opponent) -->
        <rect x="26" y="6" width="68" height="28" rx="2"
              fill="none" stroke="#3a5a3a" stroke-width="1"/>
        <!-- Top goal -->
        <rect x="38" y="2" width="44" height="6" rx="1"
              fill="#3a5a3a" opacity="0.4"/>

        <!-- Bottom penalty area (own) -->
        <rect x="26" y="146" width="68" height="28" rx="2"
              fill="none" stroke="#3a5a3a" stroke-width="1"/>
        <!-- Bottom goal -->
        <rect x="38" y="172" width="44" height="6" rx="1"
              fill="#3a5a3a" opacity="0.4"/>

        <!-- Position dots -->
        @for (pos of positions(); track $index) {
          @if (pos.key === activePosition()) {
            <!-- Active glow ring -->
            <circle [attr.cx]="pos.x" [attr.cy]="pos.y" r="14"
                    [attr.fill]="pos.color" opacity="0.15"/>
            <!-- Active outer ring -->
            <circle [attr.cx]="pos.x" [attr.cy]="pos.y" r="10"
                    fill="none" [attr.stroke]="pos.color" stroke-width="1.5" opacity="0.6"/>
            <!-- Active filled circle -->
            <circle [attr.cx]="pos.x" [attr.cy]="pos.y" r="7"
                    [attr.fill]="pos.color"/>
            <!-- Number -->
            <text [attr.x]="pos.x" [attr.y]="pos.y + 1"
                  text-anchor="middle" dominant-baseline="central"
                  fill="#fff" font-size="8" font-weight="700"
                  font-family="var(--font-family-mono)">
              {{ pos.num }}
            </text>
          } @else {
            <!-- Inactive: subtle circle -->
            <circle [attr.cx]="pos.x" [attr.cy]="pos.y" r="5"
                    fill="#2a4a2a" stroke="#4a6a4a" stroke-width="1"/>
            <text [attr.x]="pos.x" [attr.y]="pos.y + 0.5"
                  text-anchor="middle" dominant-baseline="central"
                  fill="#6a8a6a" font-size="6" font-weight="600"
                  font-family="var(--font-family-mono)">
              {{ pos.num }}
            </text>
          }
        }
      </svg>

      <!-- Legend -->
      <div class="pitch-legend">
        @for (pos of legendItems(); track pos.key) {
          <div class="legend-item" [class.active]="pos.key === activePosition()">
            <span class="legend-dot" [style.background-color]="pos.key === activePosition() ? pos.color : '#4a6a4a'"></span>
            <span class="legend-label">{{ pos.label }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .pitch-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-3);
    }
    .pitch-svg {
      width: 100px;
      height: 150px;
    }
    .pitch-legend {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2) var(--space-4);
      justify-content: center;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--color-text-muted);
      transition: color var(--transition-fast);
    }
    .legend-item.active {
      color: var(--color-text-primary);
    }
    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .legend-label {
      font-weight: var(--font-weight-medium);
    }
  `],
})
export class PlayerPositionPitchComponent {
  readonly position = input.required<string>();

  protected readonly activePosition = computed(() => {
    const p = this.position();
    if (p.startsWith('ala')) return 'ala';
    return p;
  });

  protected readonly positions = computed(() => [
    { key: 'portero', x: 60, y: 158, num: '1', color: '#f59e0b', label: 'Portero' },
    { key: 'cierre',  x: 60, y: 118, num: '2', color: '#3b82f6', label: 'Cierre' },
    { key: 'ala',     x: 22, y: 74,  num: '3', color: '#10b981', label: 'Ala' },
    { key: 'ala',     x: 98, y: 74,  num: '3', color: '#10b981', label: '' },
    { key: 'pivot',   x: 60, y: 42,  num: '4', color: '#ef4444', label: 'Pívot' },
  ]);

  protected readonly legendItems = computed(() => [
    { key: 'portero', color: '#f59e0b', label: 'Portero' },
    { key: 'cierre',  color: '#3b82f6', label: 'Cierre' },
    { key: 'ala',     color: '#10b981', label: 'Ala' },
    { key: 'pivot',   color: '#ef4444', label: 'Pívot' },
  ]);
}
