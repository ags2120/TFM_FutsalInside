import { Component, computed, input } from '@angular/core';
import { TeamStatistics } from '../../../core/models/statistics.model';

@Component({
  selector: 'app-team-radar-chart',
  standalone: true,
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
          <text [attr.x]="l.x" [attr.y]="l.y - 7" class="radar-label" text-anchor="middle" dominant-baseline="middle">{{ labels[$index] }}</text>
          <text [attr.x]="l.x" [attr.y]="l.y + 7" class="radar-value" text-anchor="middle" dominant-baseline="middle">{{ displayValues()[$index] }}</text>
        }
      </svg>
    </div>
  `,
  styles: [`
    .radar-container { width: 100%; max-width: 300px; margin: 0 auto; }
    .radar-svg { width: 100%; height: auto; }
    .radar-grid { fill: none; stroke: var(--color-border); stroke-width: 1; }
    .radar-axis { stroke: var(--color-border); stroke-width: 0.5; }
    .radar-data { fill: rgba(0, 210, 106, 0.2); stroke: var(--color-accent); stroke-width: 2; }
    .radar-label { fill: var(--color-text-secondary); font-size: 11px; font-weight: 500; }
    .radar-value { fill: var(--color-accent); font-size: 12px; font-weight: 700; font-family: var(--font-family-mono); }
    .radar-dot { fill: var(--color-accent); stroke: var(--color-bg-primary); stroke-width: 2; }
  `],
})
export class TeamRadarChartComponent {
  readonly stats = input.required<TeamStatistics>();
  readonly labels = ['Ataque', 'Defensa', 'Posesión', 'Presión', 'Eficiencia'];

  protected readonly center = 150;
  protected readonly radius = 105;

  protected readonly rawValues = computed(() => {
    const s = this.stats();
    const maxGoals = 68;
    const attack = Math.min(100, (s.goalsScored / maxGoals) * 100);
    const defense = Math.min(100, ((maxGoals - s.goalsConceded) / maxGoals) * 100);
    const possession = s.avgBallPossession || 50;
    const pressing = Math.min(100, ((s.cleanSheets / 8) * 100));
    const winRate = s.matchesPlayed > 0 ? (s.wins / s.matchesPlayed) * 100 : 0;
    const efficiency = (winRate + possession) / 2;
    return [attack, defense, possession, pressing, efficiency];
  });

  protected readonly displayValues = computed(() =>
    this.rawValues().map(v => Math.round(v))
  );

  protected readonly axisLines = computed(() => this.pentagonPointsArray(this.center, this.radius));
  protected readonly labelPositions = computed(() => this.pentagonPointsArray(this.center, this.radius * 1.22));

  protected readonly dataDots = computed(() =>
    this.rawValues().map((v, i) => this.pointAtAngle(i, (v / 100) * this.radius))
  );

  protected readonly dataPolygon = computed(() =>
    this.dataDots().map(p => `${p.x},${p.y}`).join(' ')
  );

  protected pentagonPoints(cx: number, r: number): string {
    return this.pentagonPointsArray(cx, r).map(p => `${p.x},${p.y}`).join(' ');
  }

  private pentagonPointsArray(cx: number, r: number): { x: number; y: number }[] {
    return Array.from({ length: 5 }, (_, i) => this.pointAtAngle(i, r));
  }

  private pointAtAngle(index: number, r: number): { x: number; y: number } {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    return {
      x: this.center + r * Math.cos(angle),
      y: this.center + r * Math.sin(angle),
    };
  }
}
