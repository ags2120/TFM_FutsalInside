import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StandingsStore } from '../../stores/standings.store';
import { TeamBadgeComponent } from '../../shared/components/team-badge/team-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { FormResult } from '../../core/models/standings.model';

@Component({
  selector: 'app-standings',
  imports: [RouterLink, TeamBadgeComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css',
})
export class StandingsComponent implements OnInit {
  protected readonly store = inject(StandingsStore);

  ngOnInit(): void {
    this.store.loadStandings();
  }

  getFormClass(result: FormResult): string {
    switch (result) {
      case 'W': return 'win';
      case 'D': return 'draw';
      case 'L': return 'loss';
      default: return '';
    }
  }

  getFormLabel(result: FormResult): string {
    switch (result) {
      case 'W': return 'V';
      case 'D': return 'E';
      case 'L': return 'D';
      default: return '';
    }
  }

  getGoalDifferenceClass(diff: number): string {
    if (diff > 0) return 'positive';
    if (diff < 0) return 'negative';
    return '';
  }
}
