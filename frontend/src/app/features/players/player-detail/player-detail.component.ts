import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PlayerDetail } from '../../../core/models/player.model';
import { PlayerStatistics } from '../../../core/models/statistics.model';
import { PlayerMatchParticipation } from '../../../core/models/player-match.model';
import { Standing } from '../../../core/models/standings.model';
import { Match } from '../../../core/models/match.model';
import { MockDataService } from '../../../core/services/mock-data.service';
import { FavoritesStore } from '../../../stores/favorites.store';
import { StandingsStore } from '../../../stores/standings.store';
import { PlayersStore } from '../../../stores/players.store';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { TeamBadgeComponent } from '../../../shared/components/team-badge/team-badge.component';
import { PlayerAvatarComponent } from '../../../shared/components/player-avatar/player-avatar.component';
import { RadarChartComponent } from '../../../shared/components/radar-chart/radar-chart.component';
import { PlayerStatsCardComponent } from '../../../shared/components/player-stats-card/player-stats-card.component';
import { PlayerAdvancedStatsComponent } from '../../../shared/components/player-advanced-stats/player-advanced-stats.component';
import { LeagueComparisonComponent } from '../../../shared/components/league-comparison/league-comparison.component';
import { PlayerPositionPitchComponent } from '../../../shared/components/player-position-pitch/player-position-pitch.component';
import { PlayerMatchRowComponent } from '../../../shared/components/player-match-row/player-match-row.component';
import { PlayerCareerTimelineComponent } from '../../../shared/components/player-career-timeline/player-career-timeline.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { FormLabelPipe, FormClassPipe } from '../../../shared/pipes/form-result.pipe';
import { PlayerPositionPipe } from '../../../shared/pipes/player-position.pipe';
import { AgePipe } from '../../../shared/pipes/age.pipe';

@Component({
  selector: 'app-player-detail',
  imports: [
    RouterLink,
    BreadcrumbComponent,
    TeamBadgeComponent,
    PlayerAvatarComponent,
    RadarChartComponent,
    PlayerStatsCardComponent,
    PlayerAdvancedStatsComponent,
    LeagueComparisonComponent,
    PlayerPositionPitchComponent,
    PlayerMatchRowComponent,
    PlayerCareerTimelineComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    FormLabelPipe,
    FormClassPipe,
    PlayerPositionPipe,
    AgePipe,
  ],
  templateUrl: './player-detail.component.html',
  styleUrl: './player-detail.component.css',
})
export class PlayerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly mockData = inject(MockDataService);
  protected readonly favoritesStore = inject(FavoritesStore);
  private readonly standingsStore = inject(StandingsStore);
  private readonly playersStore = inject(PlayersStore);

  protected readonly player = signal<PlayerDetail | null>(null);
  protected readonly stats = signal<PlayerStatistics | null>(null);
  protected readonly matchParticipations = signal<PlayerMatchParticipation[]>([]);
  protected readonly matchesMap = signal<Map<number, Match>>(new Map());
  protected readonly loading = signal(true);

  protected readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const p = this.player();
    return [
      { label: 'Jugadores', route: '/players' },
      { label: p?.team?.name ?? 'Equipo', route: p?.team ? `/teams/${p.team.id}` : undefined },
      { label: p ? `${p.firstName} ${p.lastName}` : 'Jugador' },
    ];
  });

  protected readonly isFavorite = computed(() => {
    const p = this.player();
    if (!p) return false;
    return this.favoritesStore.isFavorite('player', p.id);
  });

  protected readonly teamStanding = computed(() => {
    const p = this.player();
    if (!p?.team) return null;
    return this.standingsStore.standings().find(s => s.team.id === p.team!.id) ?? null;
  });

  protected readonly recentMatches = computed(() => {
    return this.matchParticipations().slice(0, 3);
  });

  protected readonly matchForParticipation = computed(() => {
    const map = this.matchesMap();
    return (participation: PlayerMatchParticipation): Match | null =>
      map.get(participation.matchId) ?? null;
  });

  protected readonly averageRating = computed(() => {
    return this.player()?.averageRating ?? 0;
  });

  protected readonly nationalityFlag = computed(() => {
    const p = this.player();
    if (!p) return '';
    const flags: Record<string, string> = {
      'España': '🇪🇸', 'Brasil': '🇧🇷', 'Portugal': '🇵🇹', 'Argentina': '🇦🇷',
      'Colombia': '🇨🇴', 'Italia': '🇮🇹', 'Rusia': '🇷🇺',
    };
    return flags[p.nationality] || '🏳️';
  });

  protected readonly radarLabels = ['Gol', 'Asist.', 'Defensa', 'Físico', 'Técnica'];

  protected readonly radarValues = computed(() => {
    const p = this.player();
    if (!p?.radarAttributes) return [0, 0, 0, 0, 0];
    const r = p.radarAttributes;
    return [r.goals, r.assists, r.defense, r.physical, r.technique];
  });

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      await Promise.all([
        this.standingsStore.loadStandings(),
        this.playersStore.loadPlayers(),
      ]);
      const [playerResult, statsResult, participations] = await Promise.all([
        firstValueFrom(this.mockData.getPlayerDetailById(id)),
        firstValueFrom(this.mockData.getPlayerStats(id)),
        firstValueFrom(this.mockData.getPlayerMatchParticipation(id)),
      ]);
      this.player.set(playerResult ?? null);
      this.stats.set(statsResult ?? null);
      this.matchParticipations.set(participations);

      const matchIds = participations.map(p => p.matchId);
      if (matchIds.length > 0) {
        const matches = await firstValueFrom(this.mockData.getMatchesByIds(matchIds));
        const map = new Map(matches.map(m => [m.id, m]));
        this.matchesMap.set(map);
      }
    }
    this.loading.set(false);
  }

  toggleFavorite(): void {
    const p = this.player();
    if (!p) return;
    const name = `${p.firstName} ${p.lastName}`;
    this.favoritesStore.toggleFavorite('player', p.id, name);
  }

  getPositionDescription(position: string): string {
    switch (position) {
      case 'portero': return 'Última defensa del equipo, encargado de proteger la portería con reflejos y buena colocación.';
      case 'cierre': return 'Jugador defensivo que organiza la defensa y distribuye el juego desde atrás.';
      case 'ala': return 'Jugador ofensivo por las bandas, rápido y con capacidad de desborde y definición.';
      case 'pivot': return 'Jugador estratégico en la zona de ataque, referencia ofensiva y definidor.';
      default: return '';
    }
  }

  getPositionEmoji(position: string): string {
    switch (position) {
      case 'portero': return '🧤';
      case 'cierre': return '🛡️';
      case 'ala': return '⚡';
      case 'pivot': return '🎯';
      default: return '⚽';
    }
  }

  getDominantFootLabel(foot?: string): string {
    switch (foot) {
      case 'right': return 'Derecha';
      case 'left': return 'Izquierda';
      case 'both': return 'Ambidiestro';
      default: return '—';
    }
  }
}
