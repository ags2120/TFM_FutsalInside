export type FavoriteType = 'match' | 'team' | 'player' | 'competition';

export interface Favorite {
  id: number;
  type: FavoriteType;
  entityId: number;
  name: string;
  addedAt: string;
}

export interface FavoriteToggleRequest {
  type: FavoriteType;
  entityId: number;
}

export interface FavoritesResponse {
  favorites: Favorite[];
  total: number;
}

/**
 * Result of a toggle round-trip: `favorite: null` means the row was removed,
 * otherwise it is the freshly created row (server-owned `name` snapshot).
 */
export interface FavoriteToggleResponse {
  favorite: Favorite | null;
  total: number;
}
