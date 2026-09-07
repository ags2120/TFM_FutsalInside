import { Component, computed, inject, OnInit } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatchesStore } from '../../stores/matches.store';
import { StandingsStore } from '../../stores/standings.store';
import { PlayersStore } from '../../stores/players.store';
import { MatchCardComponent } from '../../shared/components/match-card/match-card.component';
import { MatchCardCompactComponent } from '../../shared/components/match-card-compact/match-card-compact.component';
import { StandingsMiniComponent } from '../../shared/components/standings-mini/standings-mini.component';
import { TopScorersComponent } from '../../shared/components/top-scorers/top-scorers.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-home',
  imports: [
    KeyValuePipe,
    RouterLink,
    MatchCardComponent,
    MatchCardCompactComponent,
    StandingsMiniComponent,
    TopScorersComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  protected readonly matchesStore = inject(MatchesStore);
  protected readonly standingsStore = inject(StandingsStore);
  protected readonly playersStore = inject(PlayersStore);

  readonly featuredLive = computed(() => this.matchesStore.liveMatches().slice(0, 4));

  readonly upcomingByCompetition = computed(() => {
    const matches = this.matchesStore.upcomingMatches();
    const grouped = new Map<string, typeof matches>();
    matches.forEach(m => {
      const key = m.competition.name;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(m);
    });
    return grouped;
  });

  ngOnInit(): void {
    this.matchesStore.loadAllHomeData();
    this.standingsStore.loadStandings();
    this.playersStore.loadPlayers();
  }
}
