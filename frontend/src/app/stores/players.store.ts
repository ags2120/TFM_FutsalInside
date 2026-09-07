import { Injectable, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Player } from '../core/models/player.model';
import { PlayerStatistics } from '../core/models/statistics.model';
import { MockDataService } from '../core/services/mock-data.service';

@Injectable({ providedIn: 'root' })
export class PlayersStore {
  private readonly mockData = inject(MockDataService);

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
      const [players, stats] = await Promise.all([
        firstValueFrom(this.mockData.getPlayers()),
        firstValueFrom(this.mockData.getAllPlayerStats()),
      ]);
      this._players.set(players);
      this._playerStats.set(stats);
    } catch {
      this._error.set('Error al cargar jugadores');
    } finally {
      this._loading.set(false);
    }
  }
}
