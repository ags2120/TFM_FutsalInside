import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamsStore } from '../../stores/teams.store';
import { TeamBadgeComponent } from '../../shared/components/team-badge/team-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-teams',
  imports: [RouterLink, TeamBadgeComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
  protected readonly store = inject(TeamsStore);

  protected readonly searchTerm = signal('');
  protected readonly selectedLeague = signal('');

  protected readonly filteredTeams = computed(() => {
    let teams = this.store.teams();

    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      teams = teams.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.shortName.toLowerCase().includes(search)
      );
    }

    const league = this.selectedLeague();
    if (league) {
      teams = teams.filter((t) => t.league === league);
    }

    return teams;
  });

  protected readonly teamCount = computed(() => this.filteredTeams().length);

  protected readonly hasActiveFilters = computed(
    () => !!this.searchTerm() || !!this.selectedLeague()
  );

  ngOnInit(): void {
    this.store.loadTeams();
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onLeagueChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedLeague.set(value);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedLeague.set('');
  }
}
