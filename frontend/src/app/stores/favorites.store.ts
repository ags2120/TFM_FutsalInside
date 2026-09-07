import { Injectable, signal, computed } from '@angular/core';
import { Favorite, FavoriteType } from '../core/models/favorite.model';

const STORAGE_KEY = 'futsalinside_favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesStore {
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
    };
  });

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this._favorites.set(JSON.parse(raw));
      }
    } catch {
      this._favorites.set([]);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._favorites()));
    } catch {
      // silently fail
    }
  }

  async loadFavorites(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this.loadFromStorage();
    } catch {
      this._error.set('Error al cargar favoritos');
    } finally {
      this._loading.set(false);
    }
  }

  toggleFavorite(type: FavoriteType, entityId: number, name: string): void {
    const existing = this._favorites().find(
      (f) => f.type === type && f.entityId === entityId,
    );

    if (existing) {
      this._favorites.set(
        this._favorites().filter(
          (f) => !(f.type === type && f.entityId === entityId),
        ),
      );
    } else {
      this._favorites.set([
        ...this._favorites(),
        {
          id: Date.now(),
          type,
          entityId,
          name,
          addedAt: new Date().toISOString(),
        },
      ]);
    }
    this.saveToStorage();
  }

  isFavorite(type: FavoriteType, entityId: number): boolean {
    return this._favorites().some(
      (f) => f.type === type && f.entityId === entityId,
    );
  }
}
