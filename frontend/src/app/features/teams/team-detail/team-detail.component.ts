import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Team } from '../../../core/models/team.model';
import { Player } from '../../../core/models/player.model';
import { Standing } from '../../../core/models/standings.model';
import { Match } from '../../../core/models/match.model';
import { TeamStatistics, PlayerStatistics } from '../../../core/models/statistics.model';
import { MockDataService } from '../../../core/services/mock-data.service';
import { FavoritesStore } from '../../../stores/favorites.store';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TeamBadgeComponent } from '../../../shared/components/team-badge/team-badge.component';
import { PlayerAvatarComponent } from '../../../shared/components/player-avatar/player-avatar.component';
import { TeamStatsCardComponent } from '../../../shared/components/team-stats-card/team-stats-card.component';
import { RadarChartComponent } from '../../../shared/components/radar-chart/radar-chart.component';
import { FeaturedPlayersComponent } from '../../../shared/components/featured-players/featured-players.component';
import { ClubInfoComponent } from '../../../shared/components/club-info/club-info.component';
import { StandingsMiniComponent } from '../../../shared/components/standings-mini/standings-mini.component';
import { MatchCardCompactComponent } from '../../../shared/components/match-card-compact/match-card-compact.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { NextMatchPredictionComponent } from '../../../shared/components/next-match-prediction/next-match-prediction.component';
import { FormLabelPipe, FormClassPipe } from '../../../shared/pipes/form-result.pipe';
import { PlayerPositionPipe } from '../../../shared/pipes/player-position.pipe';

@Component({
  selector: 'app-team-detail',
  imports: [
    RouterLink,
    BreadcrumbComponent,
    TeamBadgeComponent,
    PlayerAvatarComponent,
    TeamStatsCardComponent,
    RadarChartComponent,
    FeaturedPlayersComponent,
    ClubInfoComponent,
    StandingsMiniComponent,
    MatchCardCompactComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    NextMatchPredictionComponent,
    FormLabelPipe,
    FormClassPipe,
    PlayerPositionPipe,
  ],
  templateUrl: './team-detail.component.html',
  styleUrl: './team-detail.component.css',
})
export class TeamDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly mockData = inject(MockDataService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly favoritesStore = inject(FavoritesStore);

  protected readonly team = signal<Team | null>(null);
  protected readonly players = signal<Player[]>([]);
  protected readonly standing = signal<Standing | null>(null);
  protected readonly teamStats = signal<TeamStatistics | null>(null);
  protected readonly recentMatches = signal<Match[]>([]);
  protected readonly allStandings = signal<Standing[]>([]);
  protected readonly playerStats = signal<PlayerStatistics[]>([]);
  protected readonly allTeams = signal<Team[]>([]);
  protected readonly loading = signal(true);

  protected readonly breadcrumbs = computed<BreadcrumbItem[]>(() => [
    { label: 'Equipos', route: '/teams' },
    { label: this.team()?.name ?? 'Equipo' },
  ]);

  protected readonly isFavorite = computed(() => {
    const t = this.team();
    if (!t) return false;
    return this.favoritesStore.isFavorite('team', t.id);
  });

  protected readonly topStandings = computed(() =>
    this.allStandings().slice(0, 5)
  );

  protected readonly radarLabels = ['Ataque', 'Defensa', 'Posesión', 'Presión', 'Eficiencia'];

  protected readonly radarValues = computed(() => {
    const s = this.teamStats();
    if (!s) return [0, 0, 0, 0, 0];
    const maxGoals = 68;
    const attack = Math.min(100, (s.goalsScored / maxGoals) * 100);
    const defense = Math.min(100, ((maxGoals - s.goalsConceded) / maxGoals) * 100);
    const possession = s.avgBallPossession || 50;
    const pressing = Math.min(100, ((s.cleanSheets / 8) * 100));
    const winRate = s.matchesPlayed > 0 ? (s.wins / s.matchesPlayed) * 100 : 0;
    const efficiency = (winRate + possession) / 2;
    return [attack, defense, possession, pressing, efficiency];
  });

  ngOnInit(): void {
    const sub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) this.loadTeam(id);
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  private async loadTeam(id: number): Promise<void> {
    this.loading.set(true);

    const [teamResult, playersResult, standingsResult, statsResult, matchesResult] = await Promise.all([
      firstValueFrom(this.mockData.getTeamById(id)),
      firstValueFrom(this.mockData.getPlayersByTeam(id)),
      firstValueFrom(this.mockData.getStandings()),
      firstValueFrom(this.mockData.getTeamStatistics(id)),
      firstValueFrom(this.mockData.getMatchesByTeam(id)),
    ]);

    this.team.set(teamResult ?? null);
    this.players.set(playersResult);
    this.standing.set(standingsResult.find(s => s.team.id === id) ?? null);
    this.teamStats.set(statsResult ?? null);
    this.allStandings.set(standingsResult);
    const recentFinished = matchesResult
      .filter(m => m.status === 'finished')
      .sort((a, b) => b.date.localeCompare(a.date));
    this.recentMatches.set(recentFinished.slice(0, 5));

    const allTeamsResult = await firstValueFrom(this.mockData.getTeams());
    this.allTeams.set(allTeamsResult);

    const statsPromises = playersResult.map(p => firstValueFrom(this.mockData.getPlayerStats(p.id)));
    const allStats = await Promise.all(statsPromises);
    this.playerStats.set(allStats.filter((s): s is PlayerStatistics => s !== undefined));

    this.loading.set(false);
  }

  toggleFavorite(): void {
    const t = this.team();
    if (!t) return;
    this.favoritesStore.toggleFavorite('team', t.id, t.name);
  }
}
