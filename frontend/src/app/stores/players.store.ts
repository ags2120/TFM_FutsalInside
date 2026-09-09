import { Injectable, signal, computed, inject } from '@angular/core';
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

  readonly topScorers = computed(() => {
    const stats = this._playerStats();
    const allPlayers = this._players();

    const playerGoals = new Map<number, number>();
    stats.forEach(s => {
      const current = playerGoals.get(s.playerId) || 0;
      playerGoals.set(s.playerId, current + s.goals);
    });

    const sorted = Array.from(playerGoals.entries())
      .sort((a, b) => b[1] - a[1]);

    return sorted.map(([playerId, goals]) => {
      const player = allPlayers.find(p => p.id === playerId);
      return player ? { player, goals } : null;
    }).filter((entry): entry is { player: Player; goals: number } => entry !== null);
  });

  async loadPlayers(): Promise<void> {
    if (this._loading()) return;
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
