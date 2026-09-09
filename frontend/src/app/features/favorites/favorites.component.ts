import { Component, inject, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesStore } from '../../stores/favorites.store';
import { TeamsStore } from '../../stores/teams.store';
import { PlayersStore } from '../../stores/players.store';
import { TeamBadgeComponent } from '../../shared/components/team-badge/team-badge.component';
import { PlayerAvatarComponent } from '../../shared/components/player-avatar/player-avatar.component';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, TeamBadgeComponent, PlayerAvatarComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  protected readonly favoritesStore = inject(FavoritesStore);
  protected readonly teamsStore = inject(TeamsStore);
  protected readonly playersStore = inject(PlayersStore);

  protected readonly hasFavorites = computed(() => this.favoritesStore.count() > 0);

  protected readonly favoriteTeams = computed(() => {
    const teamFavs = this.favoritesStore.byType().team;
    const allTeams = this.teamsStore.teams();
    return teamFavs.map(fav => {
      const team = allTeams.find(t => t.id === fav.entityId);
      return team ? { ...fav, team } : null;
    }).filter((item): item is { id: number; type: 'team'; entityId: number; name: string; addedAt: string; team: NonNullable<typeof item>['team'] } => item !== null);
  });

  protected readonly favoritePlayers = computed(() => {
    const playerFavs = this.favoritesStore.byType().player;
    const allPlayers = this.playersStore.players();
    return playerFavs.map(fav => {
      const player = allPlayers.find(p => p.id === fav.entityId);
      return player ? { ...fav, player } : null;
    }).filter((item): item is { id: number; type: 'player'; entityId: number; name: string; addedAt: string; player: NonNullable<typeof item>['player'] } => item !== null);
  });

  ngOnInit(): void {
    this.favoritesStore.loadFavorites();
    this.teamsStore.loadTeams();
    this.playersStore.loadPlayers();
  }

  removeFavorite(type: 'team' | 'player', entityId: number, name: string): void {
    this.favoritesStore.toggleFavorite(type, entityId, name);
  }
}
