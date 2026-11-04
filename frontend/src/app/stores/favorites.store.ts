import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Favorite, FavoriteType } from '../core/models/favorite.model';
import { Match } from '../core/models/match.model';
import { AuthService } from '../core/auth/auth.service';
import { DataService } from '../core/services/data.service';

// The pre-auth era kept favourites in localStorage under this key. The
// server is now the single source of truth, so the stale copy is dropped
// on startup rather than merged — decision: discard, no migration path.
const LEGACY_STORAGE_KEY = 'futsalinside_favorites';

/**
 * Authenticated favourites state. Every read and write round-trips to the
 * API (bearer-authenticated), and the signals mirror the server's row set —
 * there is no client-side optimism to reconcile. Callers must ensure the
 * user is signed in before toggling (components redirect to login); an
 * anonymous load just presents an empty list.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly data = inject(DataService);
  private readonly auth = inject(AuthService);

  private readonly _favorites = signal<Favorite[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly favorites = this._favorites.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly count = computed(() => this._favorites().length);

  readonly byType = computed(() => {
    const favs = this._favorites();
    return {
      match: favs.filter((f) => f.type === 'match'),
      team: favs.filter((f) => f.type === 'team'),
      player: favs.filter((f) => f.type === 'player'),
      competition: favs.filter((f) => f.type === 'competition'),
    };
  });

  readonly favoriteTeamIds = computed(
    () => new Set(this.byType().team.map((f) => f.entityId)),
  );

  readonly favoriteCompetitionIds = computed(
    () => new Set(this.byType().competition.map((f) => f.entityId)),
  );

  isFavoriteMatch(match: Match): boolean {
    return (
      this.favoriteTeamIds().has(match.homeTeam.id) ||
      this.favoriteTeamIds().has(match.awayTeam.id) ||
      this.favoriteCompetitionIds().has(match.competition.id)
    );
  }

  isFavoriteTeamMatch(match: Match): boolean {
    return (
      this.favoriteTeamIds().has(match.homeTeam.id) ||
      this.favoriteTeamIds().has(match.awayTeam.id)
    );
  }

  constructor() {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    effect(() => {
      if (this.auth.isAuthenticated()) {
        void this.loadFavorites();
      } else {
        this._favorites.set([]);
      }
    });
  }

  async loadFavorites(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      this._favorites.set([]);
      return;
    }

    this._loading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.data.getFavorites());
      this._favorites.set(response.favorites);
    } catch {
      this._error.set('Error al cargar favoritos');
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Server-authoritative toggle: the response carries the resulting row
   * (or null when removed), so the list is updated from the round-trip
   * instead of guessing locally. Failures leave the previous state intact
   * and surface an error message.
   */
  async toggleFavorite(type: FavoriteType, entityId: number): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      return;
    }

    try {
      const response = await firstValueFrom(this.data.toggleFavorite(type, entityId));
      const others = this._favorites().filter(
        (f) => !(f.type === type && f.entityId === entityId),
      );
      this._favorites.set(
        response.favorite ? [response.favorite, ...others] : others,
      );
      this._error.set(null);
    } catch {
      this._error.set('Error al actualizar favoritos');
    }
  }

  isFavorite(type: FavoriteType, entityId: number): boolean {
    return this._favorites().some(
      (f) => f.type === type && f.entityId === entityId,
    );
  }
}
