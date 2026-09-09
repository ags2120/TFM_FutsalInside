import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatchesStore } from '../../stores/matches.store';
import { StandingsStore } from '../../stores/standings.store';
import { PlayersStore } from '../../stores/players.store';
import { MatchCardComponent } from '../../shared/components/match-card/match-card.component';
import { MatchCardCompactComponent } from '../../shared/components/match-card-compact/match-card-compact.component';
import { StandingsMiniComponent } from '../../shared/components/standings-mini/standings-mini.component';
import { TopScorersComponent } from '../../shared/components/top-scorers/top-scorers.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

const LEAGUE_PRIORITY = ['(ESP)', '(BRA)', '(ITA)', '(EUR)'];

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatchCardComponent,
    MatchCardCompactComponent,
    StandingsMiniComponent,
    TopScorersComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  protected readonly matchesStore = inject(MatchesStore);
  protected readonly standingsStore = inject(StandingsStore);
  protected readonly playersStore = inject(PlayersStore);

  protected readonly collapsedCompetitions = signal(new Set<string>());
  protected readonly selectedDate = signal<string>(new Date().toISOString().split('T')[0]);

  readonly featuredLive = computed(() => this.matchesStore.liveMatches().slice(0, 4));

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
      const ai = LEAGUE_PRIORITY.findIndex(p => a[0].includes(p));
      const bi = LEAGUE_PRIORITY.findIndex(p => b[0].includes(p));
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  });

  readonly dateOptions = computed(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        value: d.toISOString().split('T')[0],
        label: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      };
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

  selectDate(date: string): void {
    this.selectedDate.set(date);
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
