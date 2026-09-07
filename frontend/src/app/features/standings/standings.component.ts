import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StandingsStore } from '../../stores/standings.store';
import { TeamBadgeComponent } from '../../shared/components/team-badge/team-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { FormResult } from '../../core/models/standings.model';
import { FormLabelPipe, FormClassPipe } from '../../shared/pipes/form-result.pipe';

@Component({
  selector: 'app-standings',
  imports: [NgClass, RouterLink, TeamBadgeComponent, LoadingSpinnerComponent, EmptyStateComponent, FormLabelPipe, FormClassPipe],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css',
})
export class StandingsComponent implements OnInit {
  protected readonly store = inject(StandingsStore);

  protected readonly selectedLeague = signal(this.store.leagueNames()[0] ?? '');
  protected readonly selectedSeason = signal(this.store.seasonsForLeague(this.selectedLeague())[0] ?? '');

  protected readonly availableSeasons = computed(() =>
    this.store.seasonsForLeague(this.selectedLeague())
  );

  protected readonly selectedCompetition = computed(() =>
    this.store.competitionFor(this.selectedLeague(), this.selectedSeason())
  );

  protected readonly filteredStandings = computed(() => {
    const comp = this.selectedCompetition();
    if (!comp) return [];
    return this.store.standings().filter((s) => s.competitionId === comp.id);
  });

  ngOnInit(): void {
    this.store.loadStandings();
  }

  onLeagueChange(event: Event): void {
    const name = (event.target as HTMLSelectElement).value;
    this.selectedLeague.set(name);
    const seasons = this.store.seasonsForLeague(name);
    this.selectedSeason.set(seasons[0] ?? '');
  }

  onSeasonChange(event: Event): void {
    this.selectedSeason.set((event.target as HTMLSelectElement).value);
  }

  getGoalDifferenceClass(diff: number): string {
    if (diff > 0) return 'positive';
    if (diff < 0) return 'negative';
    return '';
  }
}
