import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { Favorite, FavoriteType } from '../core/models/favorite.model';

@Injectable()
export class FavoritesStore {
  private readonly _favorites = signal<Favorite[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  private readonly authService = inject(AuthService);

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
    };
  });

  // TODO: Inyectar FavoritesService y usar HttpClient
  async loadFavorites(): Promise<void> {
    if (!this.authService.isAuthenticated()) return;

    this._loading.set(true);
    this._error.set(null);
    try {
      this._favorites.set([]);
    } catch {
      this._error.set('Error al cargar favoritos');
    } finally {
      this._loading.set(false);
    }
  }

  async toggleFavorite(_type: FavoriteType, _entityId: number): Promise<void> {
    // TODO: Implementar con llamada HTTP
  }

  isFavorite(type: FavoriteType, entityId: number): boolean {
    return this._favorites().some((f) => f.type === type && f.entityId === entityId);
  }
}
