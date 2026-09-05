export type FavoriteType = 'match' | 'team' | 'player';

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
