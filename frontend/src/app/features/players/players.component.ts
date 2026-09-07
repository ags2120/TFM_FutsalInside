import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlayersStore } from '../../stores/players.store';
import { PlayerAvatarComponent } from '../../shared/components/player-avatar/player-avatar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PlayerPositionPipe } from '../../shared/pipes/player-position.pipe';

@Component({
  selector: 'app-players',
  imports: [RouterLink, PlayerAvatarComponent, LoadingSpinnerComponent, EmptyStateComponent, PlayerPositionPipe],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css',
})
export class PlayersComponent implements OnInit {
  protected readonly store = inject(PlayersStore);

  protected readonly searchTerm = signal('');
  protected readonly selectedPosition = signal('');

  protected readonly positions = ['portero', 'cierre', 'ala', 'pivot'] as const;

  protected readonly filteredPlayers = computed(() => {
    let players = this.store.players();

    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      players = players.filter(
        (p) =>
          p.firstName.toLowerCase().includes(search) ||
          p.lastName.toLowerCase().includes(search) ||
          p.name.toLowerCase().includes(search)
      );
    }

    const position = this.selectedPosition();
    if (position) {
      players = players.filter((p) => p.position === position);
    }

    return players;
  });

  protected readonly playerCount = computed(() => this.filteredPlayers().length);

  protected readonly hasActiveFilters = computed(
    () => !!this.searchTerm() || !!this.selectedPosition()
  );

  ngOnInit(): void {
    this.store.loadPlayers();
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onPositionChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedPosition.set(value);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedPosition.set('');
  }
}
