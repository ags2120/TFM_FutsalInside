import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Match, MatchEvent, MatchStatistics } from '../../../core/models/match.model';
import { MockDataService } from '../../../core/services/mock-data.service';
import { TeamBadgeComponent } from '../../../shared/components/team-badge/team-badge.component';
import { ScoreDisplayComponent } from '../../../shared/components/score-display/score-display.component';
import { StatBarComponent } from '../../../shared/components/stat-bar/stat-bar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { TabsComponent, Tab } from '../../../shared/components/tabs/tabs.component';
import { MatchStatusPipe } from '../../../shared/pipes/match-status.pipe';

@Component({
  selector: 'app-match-detail',
  imports: [
    RouterLink,
    TeamBadgeComponent,
    ScoreDisplayComponent,
    StatBarComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    TabsComponent,
    MatchStatusPipe,
    UpperCasePipe,
  ],
  templateUrl: './match-detail.component.html',
  styleUrl: './match-detail.component.css',
})
export class MatchDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly mockData = inject(MockDataService);

  protected readonly match = signal<Match | null>(null);
  protected readonly loading = signal(true);
  protected readonly activeTab = signal('info');

  protected readonly tabs: Tab[] = [
    { key: 'info', label: 'Información' },
    { key: 'events', label: 'Eventos' },
    { key: 'stats', label: 'Estadísticas' },
  ];

  protected readonly isLive = computed(() => {
    const m = this.match();
    return m?.status === 'live' || m?.status === 'halftime';
  });

  protected readonly homeEvents = computed(() => {
    const m = this.match();
    if (!m?.events) return [];
    return m.events.filter(e => e.team.id === m.homeTeam.id);
  });

  protected readonly awayEvents = computed(() => {
    const m = this.match();
    if (!m?.events) return [];
    return m.events.filter(e => e.team.id === m.awayTeam.id);
  });

  protected readonly sortedEvents = computed(() => {
    const m = this.match();
    if (!m?.events) return [];
    return [...m.events].sort((a, b) => b.minute - a.minute);
  });

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const result = await firstValueFrom(this.mockData.getMatchById(id));
      this.match.set(result ?? null);
    }
    this.loading.set(false);
  }

  onTabChange(key: string): void {
    this.activeTab.set(key);
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellowcard': return '🟨';
      case 'redcard': return '🟥';
      case 'substitution': return '🔄';
      case 'timeout': return '⏸️';
      default: return '•';
    }
  }

  getEventLabel(type: string): string {
    switch (type) {
      case 'goal': return 'Gol';
      case 'yellowcard': return 'Tarjeta amarilla';
      case 'redcard': return 'Tarjeta roja';
      case 'substitution': return 'Cambio';
      case 'timeout': return 'Tiempo muerto';
      default: return type;
    }
  }
}
