import { Component, input, computed, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PlayerMatchParticipation } from '../../../core/models/player-match.model';
import { Match } from '../../../core/models/match.model';
import { MockDataService } from '../../../core/services/mock-data.service';
import { TeamBadgeComponent } from '../team-badge/team-badge.component';

@Component({
  selector: 'app-player-match-row',
  standalone: true,
  imports: [RouterLink, TeamBadgeComponent],
  template: `
    @if (match()) {
      <div class="match-row">
        <div class="match-info">
          <div class="teams-line">
            <a [routerLink]="['/teams', match()!.homeTeam.id]" class="team-link" [class.winner]="match()!.homeScore > match()!.awayScore">
              <app-team-badge [team]="match()!.homeTeam" size="sm" />
              <span class="team-name">{{ match()!.homeTeam.shortName }}</span>
            </a>
            <span class="score" [class.live]="match()!.status === 'live' || match()!.status === 'halftime'">
              {{ match()!.homeScore }} - {{ match()!.awayScore }}
            </span>
            <a [routerLink]="['/teams', match()!.awayTeam.id]" class="team-link" [class.winner]="match()!.awayScore > match()!.homeScore">
              <app-team-badge [team]="match()!.awayTeam" size="sm" />
              <span class="team-name">{{ match()!.awayTeam.shortName }}</span>
            </a>
          </div>
          <div class="match-meta">
            <span class="result-badge" [class]="resultClass()">{{ resultLabel() }}</span>
            @if (participation().goals > 0) {
              <span class="contribution">⚽ {{ participation().goals }}</span>
            }
            @if (participation().assists > 0) {
              <span class="contribution">🅰 {{ participation().assists }}</span>
            }
            @if (participation().isMvp) {
              <span class="mvp-badge">⭐ MVP</span>
            }
          </div>
        </div>
        <div class="rating-badge" [class]="ratingClass()">
          {{ participation().rating.toFixed(1) }}
        </div>
      </div>
    }
  `,
  styles: [`
    .match-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3);
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-md);
      gap: var(--space-3);
    }
    .match-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      min-width: 0;
    }
    .teams-line {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-size-sm);
    }
    .team-link {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      text-decoration: none;
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-medium);
      padding: 2px 4px;
      border-radius: var(--radius-sm);
      transition: background-color var(--transition-fast);
    }
    .team-link:hover {
      background-color: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }
    .team-link.winner {
      color: var(--color-text-primary);
      font-weight: var(--font-weight-semibold);
    }
    .team-name {
      font-size: var(--font-size-sm);
    }
    .score {
      font-family: var(--font-family-mono);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      font-size: var(--font-size-sm);
      min-width: 40px;
      text-align: center;
    }
    .score.live {
      color: var(--color-live);
    }
    .match-meta {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-size-xs);
    }
    .result-badge {
      padding: 1px 6px;
      border-radius: var(--radius-sm);
      font-weight: var(--font-weight-semibold);
      font-size: 10px;
    }
    .result-badge.win { background-color: rgba(0, 210, 106, 0.15); color: var(--color-win); }
    .result-badge.draw { background-color: rgba(139, 149, 165, 0.15); color: var(--color-draw); }
    .result-badge.loss { background-color: rgba(255, 68, 68, 0.15); color: var(--color-loss); }
    .contribution {
      color: var(--color-text-muted);
    }
    .mvp-badge {
      color: #f59e0b;
      font-weight: var(--font-weight-semibold);
    }
    .rating-badge {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      font-family: var(--font-family-mono);
      flex-shrink: 0;
    }
    .rating-badge.excellent { background-color: rgba(0, 210, 106, 0.2); color: var(--color-accent); }
    .rating-badge.good { background-color: rgba(59, 130, 246, 0.2); color: #3b82f6; }
    .rating-badge.average { background-color: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .rating-badge.poor { background-color: rgba(255, 68, 68, 0.2); color: var(--color-loss); }
  `],
})
export class PlayerMatchRowComponent implements OnInit {
  private readonly mockData = inject(MockDataService);
  readonly participation = input.required<PlayerMatchParticipation>();

  protected readonly match = signal<Match | null>(null);

  readonly resultClass = computed(() => {
    const m = this.match();
    if (!m) return '';
    if (m.homeScore > m.awayScore) return 'win';
    if (m.homeScore < m.awayScore) return 'loss';
    return 'draw';
  });

  readonly resultLabel = computed(() => {
    const cls = this.resultClass();
    if (cls === 'win') return 'V';
    if (cls === 'loss') return 'D';
    return 'E';
  });

  readonly ratingClass = computed(() => {
    const r = this.participation().rating;
    if (r >= 8.0) return 'excellent';
    if (r >= 7.0) return 'good';
    if (r >= 6.0) return 'average';
    return 'poor';
  });

  async ngOnInit() {
    const matchData = await firstValueFrom(this.mockData.getMatchById(this.participation().matchId));
    this.match.set(matchData ?? null);
  }
}
