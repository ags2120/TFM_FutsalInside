import { Injectable, signal } from '@angular/core';
import { Player } from '../core/models/player.model';

@Injectable()
export class PlayersStore {
  private readonly _players = signal<Player[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly players = this._players.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // TODO: Inyectar PlayersService y usar HttpClient
  async loadPlayers(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._players.set([]);
    } catch {
      this._error.set('Error al cargar jugadores');
    } finally {
      this._loading.set(false);
    }
  }
}
