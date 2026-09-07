import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Player } from '../../../core/models/player.model';
import { PlayerStatistics } from '../../../core/models/statistics.model';
import { PlayerAvatarComponent } from '../player-avatar/player-avatar.component';

@Component({
  selector: 'app-top-scorers',
  imports: [RouterLink, PlayerAvatarComponent],
  template: `
    <div class="top-scorers">
      <div class="mini-header">
        <h3 class="mini-title">Máximos Goleadores</h3>
        <a routerLink="/players" class="mini-link">Ver todos →</a>
      </div>
      <div class="scorers-list">
        @for (entry of topScorers(); track entry.player.id) {
          <div class="scorer-row">
            <span class="scorer-rank">{{ $index + 1 }}</span>
            <app-player-avatar [player]="entry.player" size="sm" />
            <div class="scorer-info">
              <a [routerLink]="['/players', entry.player.id]" class="scorer-name">{{ entry.player.firstName }} {{ entry.player.lastName }}</a>
              @if (entry.player.team) {
                <a [routerLink]="['/teams', entry.player.team.id]" class="scorer-team-link">{{ entry.player.team.shortName }}</a>
              }
            </div>
            <span class="scorer-goals">{{ entry.goals }}</span>
          </div>
        }
        @if (topScorers().length === 0) {
          <div class="empty-scorers">
            <span class="empty-text">No hay datos disponibles</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .top-scorers {
      background-color: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .mini-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--color-border);
    }

    .mini-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
    }

    .mini-link {
      font-size: var(--font-size-xs);
      color: var(--color-accent);
      text-decoration: none;
      font-weight: var(--font-weight-medium);
    }

    .mini-link:hover {
      text-decoration: underline;
    }

    .scorers-list {
      display: flex;
      flex-direction: column;
    }

    .scorer-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-4);
      border-bottom: 1px solid var(--color-border);
    }

    .scorer-row:last-child {
      border-bottom: none;
    }

    .scorer-rank {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      width: 20px;
      text-align: center;
    }

    .scorer-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    .scorer-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .scorer-name:hover {
      color: var(--color-accent);
    }

    .scorer-team-link {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-decoration: none;
      transition: color var(--transition-fast);
      cursor: pointer;
    }

    .scorer-team-link:hover {
      color: var(--color-accent);
    }

    .scorer-goals {
      font-family: var(--font-family-mono);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-accent);
      flex-shrink: 0;
    }

    .empty-scorers {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
    }

    .empty-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }
  `,
})
export class TopScorersComponent {
  players = input.required<Player[]>();
  playerStats = input.required<PlayerStatistics[]>();
  maxItems = input(5);

  topScorers = computed(() => {
    const stats = this.playerStats();
    const allPlayers = this.players();
    const max = this.maxItems();

    const playerGoals = new Map<number, number>();
    stats.forEach(s => {
      const current = playerGoals.get(s.playerId) || 0;
      playerGoals.set(s.playerId, current + s.goals);
    });

    const sorted = Array.from(playerGoals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, max);

    return sorted.map(([playerId, goals]) => {
      const player = allPlayers.find(p => p.id === playerId);
      return player ? { player, goals } : null;
    }).filter((entry): entry is { player: Player; goals: number } => entry !== null);
  });
}
