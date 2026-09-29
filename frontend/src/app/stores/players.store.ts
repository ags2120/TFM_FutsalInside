import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Player } from '../core/models/player.model';
import { PlayerStatistics } from '../core/models/statistics.model';
import { DataService } from '../core/services/data.service';

@Injectable({ providedIn: 'root' })
export class PlayersStore {
  protected readonly data = inject(DataService);

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

    const totals = new Map<number, { goals: number; assists: number }>();
    stats.forEach((s) => {
      const current = totals.get(s.playerId) ?? { goals: 0, assists: 0 };
      totals.set(s.playerId, {
        goals: current.goals + s.goals,
        assists: current.assists + s.assists,
      });
    });

    const sorted = Array.from(totals.entries()).sort(
      (a, b) => b[1].goals - a[1].goals || b[1].assists - a[1].assists,
    );

    return sorted
      .map(([playerId, { goals, assists }]) => {
        const player = allPlayers.find((p) => p.id === playerId);
        return player ? { player, goals, assists } : null;
      })
      .filter(
        (entry): entry is { player: Player; goals: number; assists: number } =>
          entry !== null,
      );
  });

  async loadPlayers(): Promise<void> {
    if (this._loading()) return;
    this._loading.set(true);
    this._error.set(null);
    try {
      const [players, stats] = await Promise.all([
        firstValueFrom(this.data.getPlayers()),
        firstValueFrom(this.data.getAllPlayerStats()),
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
