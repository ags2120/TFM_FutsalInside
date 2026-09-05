import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-stat-bar',
  templateUrl: './stat-bar.component.html',
  styleUrl: './stat-bar.component.css',
})
export class StatBarComponent {
  label = input.required<string>();
  homeValue = input.required<number>();
  awayValue = input.required<number>();
  max = input(100);

  readonly total = computed(() => this.homeValue() + this.awayValue() || 1);

  getHomeWidth = computed(() => (this.homeValue() / this.total()) * 100);
  getAwayWidth = computed(() => (this.awayValue() / this.total()) * 100);
}
