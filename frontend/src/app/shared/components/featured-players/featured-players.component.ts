import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Player } from '../../../core/models/player.model';
import { PlayerStatistics } from '../../../core/models/statistics.model';
import { PlayerAvatarComponent } from '../player-avatar/player-avatar.component';

@Component({
  selector: 'app-featured-players',
  imports: [RouterLink, PlayerAvatarComponent],
  template: `
    <div class="featured-card">
      <h3 class="card-title">Jugadores destacados</h3>
      <div class="featured-grid">
        @for (player of featured(); track player.type) {
          <a [routerLink]="['/players', player.player.id]" class="featured-item">
            <app-player-avatar [player]="player.player" size="md" />
            <div class="featured-info">
              <span class="featured-type">{{ player.type }}</span>
              <span class="featured-name">{{ player.player.firstName }} {{ player.player.lastName }}</span>
              <span class="featured-stat">{{ player.statValue }}</span>
            </div>
          </a>
        }
      </div>
    </div>
  `,
  styles: [`
    .featured-card {
      background-color: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    }
    .card-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0 0 var(--space-4) 0;
    }
    .featured-grid {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .featured-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-3);
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: background-color var(--transition-fast);
    }
    .featured-item:hover {
      background-color: var(--color-bg-hover);
    }
    .featured-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }
    .featured-type {
      font-size: 10px;
      font-weight: var(--font-weight-bold);
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .featured-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .featured-stat {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      font-family: var(--font-family-mono);
    }
  `],
})
export class FeaturedPlayersComponent {
  readonly players = input.required<Player[]>();
  readonly playerStats = input.required<PlayerStatistics[]>();

  protected readonly featured = computed(() => {
    const players = this.players();
    const stats = this.playerStats();

    const topScorer = this.findTopByStat(stats, 'goals', players);
    const topAssister = this.findTopByStat(stats, 'assists', players);
    const topRated = players.reduce<{ player: Player; rating: number } | null>((best, p) => {
      if (!p.averageRating) return best;
      if (!best || p.averageRating > best.rating) return { player: p, rating: p.averageRating };
      return best;
    }, null);

    return [
      { type: 'Máximo goleador', player: topScorer?.player || players[0], statValue: topScorer ? `${topScorer.stat.goals} goles` : '—' },
      { type: 'Máximo asistidor', player: topAssister?.player || players[0], statValue: topAssister ? `${topAssister.stat.assists} asistencias` : '—' },
      { type: 'Mejor valorado', player: topRated?.player || players[0], statValue: topRated ? `${topRated.rating.toFixed(1)} rating` : '—' },
    ];
  });

  private findTopByStat(stats: PlayerStatistics[], field: 'goals' | 'assists', players: Player[]): { player: Player; stat: PlayerStatistics } | null {
    let best: { player: Player; stat: PlayerStatistics } | null = null;
    for (const s of stats) {
      const player = players.find(p => p.id === s.playerId);
      if (!player) continue;
      if (!best || s[field] > best.stat[field]) {
        best = { player, stat: s };
      }
    }
    return best;
  }
}
