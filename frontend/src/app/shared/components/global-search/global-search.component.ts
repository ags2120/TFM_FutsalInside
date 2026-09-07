import {
  Component,
  inject,
  signal,
  computed,
  ElementRef,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { Router } from '@angular/router';
import { TeamsStore } from '../../../stores/teams.store';
import { PlayersStore } from '../../../stores/players.store';

type SearchResult = {
  type: 'player' | 'team' | 'competition';
  id: number;
  name: string;
  subtitle: string;
  imageUrl: string;
  initials: string;
  bgClass: string;
};

@Component({
  selector: 'app-global-search',
  template: `
    <div class="search-container" (click)="$event.stopPropagation()">
      <div class="search-input-wrapper" [class.focused]="isFocused()">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          #searchInput
          type="text"
          class="search-input"
          placeholder="Buscar equipos, jugadores..."
          [value]="query()"
          (input)="onInput($event)"
          (focus)="isFocused.set(true)"
          (blur)="onBlur()"
          (keydown.escape)="close()"
        />
        @if (query()) {
          <button class="clear-btn" (click)="clear()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        }
      </div>

      @if (isOpen() && results().length > 0) {
        <div class="search-dropdown">
          @for (result of results(); track result.type + result.id) {
            <button
              class="search-result"
              (click)="navigateTo(result)"
            >
              @if (result.imageUrl) {
                <img [src]="result.imageUrl" [alt]="result.name" class="result-thumb" />
              } @else {
                <span class="result-initials" [class]="result.bgClass">{{ result.initials }}</span>
              }
              <div class="result-info">
                <span class="result-name">{{ result.name }}</span>
                <span class="result-subtitle">{{ result.subtitle }}</span>
              </div>
              <span class="result-type-label">{{ getTypeLabel(result.type) }}</span>
            </button>
          }
        </div>
      }

      @if (isOpen() && query() && results().length === 0) {
        <div class="search-dropdown">
          <div class="no-results">
            <span class="no-results-text">No se encontraron resultados para "{{ query() }}"</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .search-container {
      position: relative;
      width: 100%;
      max-width: 400px;
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      background-color: var(--color-bg-tertiary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    .search-input-wrapper.focused {
      border-color: var(--color-accent);
      background-color: var(--color-bg-secondary);
      box-shadow: 0 0 0 3px var(--color-accent-muted);
    }

    .search-icon {
      flex-shrink: 0;
      color: var(--color-text-muted);
    }

    .search-input-wrapper.focused .search-icon {
      color: var(--color-accent);
    }

    .search-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: var(--color-text-primary);
      font-size: var(--font-size-sm);
      font-family: var(--font-family-primary);
      min-width: 0;
    }

    .search-input::placeholder {
      color: var(--color-text-muted);
    }

    .clear-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border: none;
      background: none;
      color: var(--color-text-muted);
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }

    .clear-btn:hover {
      color: var(--color-text-primary);
      background-color: var(--color-bg-hover);
    }

    .search-dropdown {
      position: absolute;
      top: calc(100% + var(--space-2));
      left: 0;
      right: 0;
      background-color: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: var(--z-dropdown);
      max-height: 400px;
      overflow-y: auto;
    }

    .search-result {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      text-decoration: none;
      transition: background-color var(--transition-fast);
      border-bottom: 1px solid var(--color-border);
      width: 100%;
      background: none;
      border-left: none;
      border-right: none;
      border-top: none;
      cursor: pointer;
      text-align: left;
    }

    .search-result:first-child {
      border-top-left-radius: var(--radius-lg);
      border-top-right-radius: var(--radius-lg);
    }

    .search-result:last-child {
      border-bottom: none;
      border-bottom-left-radius: var(--radius-lg);
      border-bottom-right-radius: var(--radius-lg);
    }

    .search-result:hover {
      background-color: var(--color-bg-hover);
    }

    .result-thumb {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      object-fit: contain;
      flex-shrink: 0;
      background-color: var(--color-bg-secondary);
    }

    .result-initials {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      flex-shrink: 0;
      text-transform: uppercase;
    }

    .result-initials--team {
      background-color: rgba(139, 149, 165, 0.15);
      color: var(--color-text-secondary);
    }

    .result-initials--player {
      background-color: var(--color-accent-muted);
      color: var(--color-accent);
    }

    .result-initials--competition {
      background-color: var(--color-warning-muted);
      color: var(--color-warning);
      font-size: var(--font-size-base);
    }

    .result-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }

    .result-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-subtitle {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-type-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      background-color: var(--color-bg-secondary);
      padding: 2px var(--space-2);
      border-radius: var(--radius-sm);
      flex-shrink: 0;
      text-transform: capitalize;
    }

    .no-results {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-8) var(--space-4);
    }

    .no-results-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    @media (max-width: 768px) {
      .search-container {
        max-width: 100%;
      }
    }
  `,
})
export class GlobalSearchComponent {
  private teamsStore = inject(TeamsStore);
  private playersStore = inject(PlayersStore);
  private router = inject(Router);
  private searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  query = signal('');
  isFocused = signal(false);
  isOpen = signal(false);

  private readonly competition = {
    id: 1,
    name: 'Liga Nacional de Fútbol Sala',
    season: '2025/2026',
  };

  constructor() {
    afterNextRender(() => {
      this.teamsStore.loadTeams();
      this.playersStore.loadPlayers();
    });
  }

  results = computed<SearchResult[]>(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return [];

    const results: SearchResult[] = [];

    const teams = this.teamsStore.teams();
    for (const team of teams) {
      const nameMatch =
        team.name.toLowerCase().includes(q) ||
        team.shortName.toLowerCase().includes(q);
      if (nameMatch) {
        results.push({
          type: 'team',
          id: team.id,
          name: team.name,
          subtitle: team.league || team.country,
          imageUrl: team.badgeUrl,
          initials: team.shortName,
          bgClass: 'result-initials--team',
        });
      }
    }

    const players = this.playersStore.players();
    for (const player of players) {
      const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
      const reverseName = `${player.lastName} ${player.firstName}`.toLowerCase();
      if (fullName.includes(q) || reverseName.includes(q)) {
        results.push({
          type: 'player',
          id: player.id,
          name: `${player.firstName} ${player.lastName}`,
          subtitle: player.team ? player.team.shortName : player.position,
          imageUrl: player.photoUrl,
          initials: `${player.firstName[0]}${player.lastName[0]}`,
          bgClass: 'result-initials--player',
        });
      }
    }

    if (
      this.competition.name.toLowerCase().includes(q) ||
      this.competition.season.toLowerCase().includes(q)
    ) {
      results.push({
        type: 'competition',
        id: this.competition.id,
        name: this.competition.name,
        subtitle: `Temporada ${this.competition.season}`,
        imageUrl: '',
        initials: '🏆',
        bgClass: 'result-initials--competition',
      });
    }

    return results.slice(0, 10);
  });

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.isOpen.set(value.trim().length > 0);
  }

  onBlur(): void {
    setTimeout(() => {
      this.isFocused.set(false);
      this.isOpen.set(false);
    }, 200);
  }

  close(): void {
    this.query.set('');
    this.isOpen.set(false);
    this.searchInput()?.nativeElement.blur();
  }

  clear(): void {
    this.query.set('');
    this.isOpen.set(false);
    this.searchInput()?.nativeElement.focus();
  }

  navigateTo(result: SearchResult): void {
    const link = this.getResultLink(result);
    this.close();
    this.router.navigate([link]);
  }

  private getResultLink(result: SearchResult): string {
    switch (result.type) {
      case 'team':
        return `/teams/${result.id}`;
      case 'player':
        return `/players/${result.id}`;
      case 'competition':
        return '/standings';
    }
  }

  getTypeLabel(type: SearchResult['type']): string {
    switch (type) {
      case 'player':
        return 'Jugador';
      case 'team':
        return 'Equipo';
      case 'competition':
        return 'Competición';
    }
  }
}
