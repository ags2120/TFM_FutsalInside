import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatchesStore } from '../../stores/matches.store';
import { StandingsStore } from '../../stores/standings.store';
import { PlayersStore } from '../../stores/players.store';
import { FavoritesStore } from '../../stores/favorites.store';
import { AuthService } from '../../core/auth/auth.service';
import { Match } from '../../core/models/match.model';
import { MatchCardComponent } from '../../shared/components/match-card/match-card.component';
import { MatchCardCompactComponent } from '../../shared/components/match-card-compact/match-card-compact.component';
import { StandingsMiniComponent } from '../../shared/components/standings-mini/standings-mini.component';
import { TopScorersComponent } from '../../shared/components/top-scorers/top-scorers.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { FavoriteButtonComponent } from '../../shared/components/favorite-button/favorite-button.component';

const LEAGUE_PRIORITY = ['(ESP)', '(BRA)', '(ITA)', '(EUR)'];

const matchRank = (m: Match): number => {
  if (m.status === 'live' || m.status === 'halftime') return 0;
  return m.status === 'finished' ? 2 : 1;
};

const byStatusThenDate = (a: Match, b: Match): number => {
  const ra = matchRank(a);
  const rb = matchRank(b);
  if (ra !== rb) return ra - rb;
  if (ra === 2) return b.date.localeCompare(a.date);
  return a.date.localeCompare(b.date);
};

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatchCardComponent,
    MatchCardCompactComponent,
    StandingsMiniComponent,
    TopScorersComponent,
    LoadingSpinnerComponent,
    FavoriteButtonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  protected readonly matchesStore = inject(MatchesStore);
  protected readonly standingsStore = inject(StandingsStore);
  protected readonly playersStore = inject(PlayersStore);
  protected readonly favoritesStore = inject(FavoritesStore);
  protected readonly auth = inject(AuthService);

  protected readonly collapsedCompetitions = signal(new Set<string>());

  readonly featuredLive = computed(() => {
    const live = this.matchesStore.liveMatches();
    return [...live]
      .sort((a, b) => Number(this.favoritesStore.isFavoriteMatch(b)) - Number(this.favoritesStore.isFavoriteMatch(a)))
      .slice(0, 4);
  });

  readonly favoriteMatches = computed(() => {
    if (!this.auth.isAuthenticated() || this.favoritesStore.favoriteTeamIds().size === 0) {
      return [];
    }
    const seen = new Set<number>();
    const picked = [
      ...this.matchesStore.liveMatches(),
      ...this.matchesStore.upcomingMatches(),
      ...this.matchesStore.recentMatches(),
    ].filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return this.favoritesStore.isFavoriteTeamMatch(m);
    });

    return picked.sort(byStatusThenDate).slice(0, 8);
  });

  readonly liveCount = computed(() => this.matchesStore.liveMatches().length);
  readonly upcomingCount = computed(() => this.matchesStore.upcomingMatches().length);
  readonly recentCount = computed(() => this.matchesStore.recentMatches().length);

  readonly upcomingByCompetition = computed(() => {
    const matches = this.matchesStore.upcomingMatches();
    const grouped = new Map<string, typeof matches>();
    matches.forEach(m => {
      const key = m.competition.name;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(m);
    });

    return Array.from(grouped.entries()).sort((a, b) => {
      const favA = this.favoritesStore.favoriteCompetitionIds().has(a[1][0].competition.id) ? 0 : 1;
      const favB = this.favoritesStore.favoriteCompetitionIds().has(b[1][0].competition.id) ? 0 : 1;
      if (favA !== favB) return favA - favB;
      const ai = LEAGUE_PRIORITY.findIndex(p => a[0].includes(p));
      const bi = LEAGUE_PRIORITY.findIndex(p => b[0].includes(p));
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  });

  isCompetitionCollapsed(name: string): boolean {
    return this.collapsedCompetitions().has(name);
  }

  toggleCompetition(name: string): void {
    this.collapsedCompetitions.update(set => {
      const next = new Set(set);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  competitionIdOf(matches: Match[]): number {
    return matches[0]?.competition.id ?? 0;
  }

  retryLoad(): void {
    this.matchesStore.loadAllHomeData();
    this.standingsStore.loadStandings();
    this.playersStore.loadPlayers();
  }

  ngOnInit(): void {
    this.matchesStore.loadAllHomeData();
    this.standingsStore.loadStandings();
    this.playersStore.loadPlayers();
  }
}
