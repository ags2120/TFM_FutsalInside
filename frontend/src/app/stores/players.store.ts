import { Injectable, signal } from '@angular/core';
import { Player } from '../core/models/player.model';
import { PlayerStatistics } from '../core/models/statistics.model';
import { MOCK_PLAYERS, MOCK_PLAYER_STATISTICS } from '../core/mocks';

@Injectable({ providedIn: 'root' })
export class PlayersStore {
  private readonly _players = signal<Player[]>([]);
  private readonly _playerStats = signal<PlayerStatistics[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly players = this._players.asReadonly();
  readonly playerStats = this._playerStats.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  async loadPlayers(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._players.set(MOCK_PLAYERS);
      this._playerStats.set(MOCK_PLAYER_STATISTICS);
    } catch {
      this._error.set('Error al cargar jugadores');
    } finally {
      this._loading.set(false);
    }
  }
}
