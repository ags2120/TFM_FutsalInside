import { Component, computed, input } from '@angular/core';
import { pentagonPoints, pentagonPointsArray, pointAtAngle, pointsToPolygon } from '../../utils/radar-chart';

@Component({
  selector: 'app-radar-chart',
  template: `
    <div class="radar-container">
      <svg viewBox="0 0 300 300" class="radar-svg">
        @for (level of [100, 75, 50, 25]; track level) {
          <polygon [attr.points]="pentagonPoints(center, radius * level / 100)" class="radar-grid" />
        }
        @for (p of axisLines(); track $index) {
          <line [attr.x1]="center" [attr.y1]="center" [attr.x2]="p.x" [attr.y2]="p.y" class="radar-axis" />
        }
        <polygon [attr.points]="dataPolygon()" class="radar-data" />
        @for (p of dataDots(); track $index) {
          <circle [attr.cx]="p.x" [attr.cy]="p.y" r="4" class="radar-dot" />
        }
        @for (l of labelPositions(); track $index) {
          <text [attr.x]="l.x" [attr.y]="l.y - 7" class="radar-label" text-anchor="middle" dominant-baseline="middle">{{ labels()[$index] }}</text>
          <text [attr.x]="l.x" [attr.y]="l.y + 7" class="radar-value" text-anchor="middle" dominant-baseline="middle">{{ displayValues()[$index] }}</text>
        }
      </svg>
    </div>
  `,
  styles: `
    .radar-container { width: 100%; max-width: 300px; margin: 0 auto; }
    .radar-svg { width: 100%; height: auto; }
    .radar-grid { fill: none; stroke: var(--color-border); stroke-width: 1; }
    .radar-axis { stroke: var(--color-border); stroke-width: 0.5; }
    .radar-data { fill: rgba(0, 210, 106, 0.2); stroke: var(--color-accent); stroke-width: 2; }
    .radar-label { fill: var(--color-text-secondary); font-size: 11px; font-weight: 500; }
    .radar-value { fill: var(--color-accent); font-size: 12px; font-weight: 700; font-family: var(--font-family-mono); }
    .radar-dot { fill: var(--color-accent); stroke: var(--color-bg-primary); stroke-width: 2; }
  `,
})
export class RadarChartComponent {
  readonly values = input.required<number[]>();
  readonly labels = input.required<string[]>();

  protected readonly center = 150;
  protected readonly radius = 105;

  protected readonly displayValues = computed(() =>
    this.values().map(v => Math.round(v))
  );

  protected readonly axisLines = computed(() => pentagonPointsArray(this.center, this.radius));
  protected readonly labelPositions = computed(() => pentagonPointsArray(this.center, this.radius * 1.22));

  protected readonly dataDots = computed(() =>
    this.values().map((v, i) => pointAtAngle(this.center, i, (v / 100) * this.radius))
  );

  protected readonly dataPolygon = computed(() => pointsToPolygon(this.dataDots()));

  protected readonly pentagonPoints = pentagonPoints;
}
