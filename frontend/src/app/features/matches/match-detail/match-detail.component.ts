import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatchesStore } from '../../../stores/matches.store';
import { Match, MatchEvent } from '../../../core/models/match.model';
import { TeamBadgeComponent } from '../../../shared/components/team-badge/team-badge.component';
import { ScoreDisplayComponent } from '../../../shared/components/score-display/score-display.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { TabsComponent, Tab } from '../../../shared/components/tabs/tabs.component';

interface MatchInsight {
  icon: string;
  label: string;
  value: string;
  highlight: 'home' | 'away' | 'neutral';
}

interface EnrichedStat {
  type: string;
  label: string;
  homeValue: number;
  awayValue: number;
  homePercent: number;
  awayPercent: number;
  isHomeWinner: boolean;
  isAwayWinner: boolean;
}

@Component({
  selector: 'app-match-detail',
  imports: [
    RouterLink,
    TeamBadgeComponent,
    ScoreDisplayComponent,
    LoadingSpinnerComponent,
    TabsComponent,
  ],
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css'],
})
export class MatchDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(MatchesStore);

  protected readonly activeTab = signal('info');

  protected readonly tabs: Tab[] = [
    { key: 'info', label: 'Info' },
    { key: 'events', label: 'Eventos' },
    { key: 'stats', label: 'Estadísticas' },
  ];

  protected readonly match = computed(() => this.store.currentMatch());

  protected readonly isLive = computed(() => {
    const m = this.match();
    return m?.status === 'live' || m?.status === 'halftime';
  });

  protected readonly isFinished = computed(() => this.match()?.status === 'finished');

  protected readonly statusLabel = computed(() => {
    const m = this.match();
    if (!m) return '';
    const labels: Record<string, string> = {
      scheduled: 'Programado',
      live: 'En Vivo',
      halftime: 'Descanso',
      finished: 'Finalizado',
      postponed: 'Aplazado',
      cancelled: 'Cancelado',
    };
    return labels[m.status] ?? m.status;
  });

  protected readonly sortedEvents = computed(() => {
    const m = this.match();
    if (!m?.events) return [];
    return [...m.events].sort((a, b) => a.minute - b.minute);
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

  protected readonly homeGoals = computed(() =>
    this.homeEvents().filter(e => e.type === 'goal')
  );

  protected readonly awayGoals = computed(() =>
    this.awayEvents().filter(e => e.type === 'goal')
  );

  protected readonly topScorer = computed(() => {
    const m = this.match();
    if (!m?.events) return null;
    const goalEvents = m.events.filter(e => e.type === 'goal');
    const counts = new Map<string, { player: MatchEvent['player']; count: number; team: MatchEvent['team'] }>();
    for (const g of goalEvents) {
      const key = g.player.id.toString();
      const existing = counts.get(key);
      if (existing) {
        existing.count++;
      } else {
        counts.set(key, { player: g.player, count: 1, team: g.team });
      }
    }
    let best: { player: MatchEvent['player']; count: number; team: MatchEvent['team'] } | null = null;
    for (const entry of counts.values()) {
      if (!best || entry.count > best.count) best = entry;
    }
    return best;
  });

  protected readonly mvpPlayer = computed(() => {
    const m = this.match();
    if (m?.mvpPlayer) return m.mvpPlayer;
    const scorer = this.topScorer();
    if (scorer && scorer.count >= 2) return scorer.player;
    return null;
  });

  protected readonly matchSummary = computed(() => {
    const m = this.match();
    if (!m) return '';
    const hName = m.homeTeam.shortName;
    const aName = m.awayTeam.shortName;
    const hs = m.homeScore;
    const as = m.awayScore;

    if (m.status === 'scheduled') {
      return `${hName} recibe a ${aName} en ${m.date}.`;
    }

    const diff = Math.abs(hs - as);
    const leader = hs > as ? hName : as > hs ? aName : null;

    if (m.status === 'finished') {
      if (diff === 0) return `Empate a ${hs} entre ${hName} y ${aName}.`;
      if (diff === 1) return `${leader} gana por la mínima (${hs}-${as}).`;
      if (diff >= 3) return `${leader} golea a ${hs === hs ? (hs > as ? aName : hName) : ''} (${hs}-${as}).`;
      return `${leader} vence ${hs}-${as}.`;
    }

    if (m.status === 'halftime') {
      if (leader) return `${leader} lidera ${hs}-${as} al descanso.`;
      return `Empate a ${hs} al descanso.`;
    }

    if (leader) return `${leader} lidera ${hs}-${as} en el minuto ${m.minute}'.`;
    return `Empate a ${hs} en el minuto ${m.minute}'.`;
  });

  protected readonly stats = computed(() => {
    const m = this.match();
    if (!m?.statistics) return [];
    const labels: Record<string, string> = {
      'Posesión': 'Posesión',
      'Tiros': 'Tiros',
      'Tiros a puerta': 'Tiros a puerta',
      'Córneres': 'Córneres',
      'Faltas': 'Faltas',
      'Tarjetas amarillas': 'Tarjetas amarillas',
      'Tarjetas rojas': 'Tarjetas rojas',
    };
    return m.statistics.map(s => ({
      type: s.type,
      label: labels[s.type] || s.type,
      homeValue: s.homeValue,
      awayValue: s.awayValue,
      homePercent: Math.round((s.homeValue / (s.homeValue + s.awayValue || 1)) * 100),
      awayPercent: Math.round((s.awayValue / (s.homeValue + s.awayValue || 1)) * 100),
      isHomeWinner: s.homeValue > s.awayValue,
      isAwayWinner: s.awayValue > s.homeValue,
    }));
  });

  protected readonly summaryStats = computed(() => {
    const all = this.stats();
    const keys = ['Posesión', 'Tiros', 'Tiros a puerta', 'Córneres', 'Faltas'];
    return all.filter(s => keys.includes(s.type));
  });

  protected readonly insights = computed<MatchInsight[]>(() => {
    const m = this.match();
    if (!m?.statistics || m.statistics.length === 0) return [];
    const result: MatchInsight[] = [];
    const hName = m.homeTeam.shortName;
    const aName = m.awayTeam.shortName;

    const find = (type: string) => m.statistics!.find(s => s.type === type);

    const possession = find('Posesión');
    if (possession) {
      if (possession.homeValue > possession.awayValue) {
        result.push({ icon: '⚽', label: 'Posesión', value: `${hName} domina con ${possession.homeValue}%`, highlight: 'home' });
      } else if (possession.awayValue > possession.homeValue) {
        result.push({ icon: '⚽', label: 'Posesión', value: `${aName} domina con ${possession.awayValue}%`, highlight: 'away' });
      } else {
        result.push({ icon: '⚽', label: 'Posesión', value: 'Posesión igualada al 50%', highlight: 'neutral' });
      }
    }

    const shots = find('Tiros');
    const shotsOnTarget = find('Tiros a puerta');
    if (shots && shotsOnTarget) {
      const homeEff = shots.homeValue > 0 ? Math.round((shotsOnTarget.homeValue / shots.homeValue) * 100) : 0;
      const awayEff = shots.awayValue > 0 ? Math.round((shotsOnTarget.awayValue / shots.awayValue) * 100) : 0;
      if (shotsOnTarget.homeValue > shotsOnTarget.awayValue) {
        const diff = shotsOnTarget.homeValue - shotsOnTarget.awayValue;
        result.push({ icon: '🎯', label: 'Tiros a puerta', value: `${hName} tiene ${diff} más tiros a puerta`, highlight: 'home' });
      } else if (shotsOnTarget.awayValue > shotsOnTarget.homeValue) {
        const diff = shotsOnTarget.awayValue - shotsOnTarget.homeValue;
        result.push({ icon: '🎯', label: 'Tiros a puerta', value: `${aName} tiene ${diff} más tiros a puerta`, highlight: 'away' });
      }
      if (homeEff > awayEff && homeEff - awayEff > 10) {
        result.push({ icon: '⚡', label: 'Eficiencia', value: `${hName} más eficiente (${homeEff}% vs ${awayEff}%)`, highlight: 'home' });
      } else if (awayEff > homeEff && awayEff - homeEff > 10) {
        result.push({ icon: '⚡', label: 'Eficiencia', value: `${aName} más eficiente (${awayEff}% vs ${homeEff}%)`, highlight: 'away' });
      }
    }

    const corners = find('Córneres');
    if (corners) {
      if (corners.homeValue > corners.awayValue) {
        result.push({ icon: '📐', label: 'Córneres', value: `${hName} presiona con ${corners.homeValue} córneres`, highlight: 'home' });
      } else if (corners.awayValue > corners.homeValue) {
        result.push({ icon: '📐', label: 'Córneres', value: `${aName} presiona con ${corners.awayValue} córneres`, highlight: 'away' });
      }
    }

    return result;
  });

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      await this.store.loadMatchById(id);
    }
  }

  onTabChange(key: string): void {
    this.activeTab.set(key);
  }

  retryLoad(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.store.loadMatchById(id);
    }
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

  isHomeEvent(event: MatchEvent): boolean {
    const m = this.match();
    return m ? event.team.id === m.homeTeam.id : false;
  }

  formatAttendance(num: number): string {
    return num.toLocaleString('es-ES');
  }
}
