import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StandingsStore } from '../../stores/standings.store';
import { TeamBadgeComponent } from '../../shared/components/team-badge/team-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { SkeletonListComponent } from '../../shared/components/skeleton-list/skeleton-list.component';
import { FormLabelPipe, FormClassPipe } from '../../shared/pipes/form-result.pipe';

type SortColumn = 'position' | 'played' | 'won' | 'drawn' | 'lost' | 'goalsFor' | 'goalsAgainst' | 'goalDifference' | 'points';
type SortDirection = 'asc' | 'desc';

const LEAGUE_SHORT_LABELS: Record<string, string> = {
  'Liga Nacional de Fútbol Sala (ESP)': 'LNFS',
  'Liga Nacional de Futsal (BRA)': 'Brasil',
  'Serie A (ITA)': 'Serie A',
  'UEFA Futsal Champions League (EUR)': 'Champions',
};

@Component({
  selector: 'app-standings',
  imports: [RouterLink, TeamBadgeComponent, LoadingSpinnerComponent, SkeletonListComponent, FormLabelPipe, FormClassPipe],
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css'],
})
export class StandingsComponent implements OnInit {
  protected readonly store = inject(StandingsStore);

  protected readonly sortColumn = signal<SortColumn>('position');
  protected readonly sortDirection = signal<SortDirection>('asc');
  protected readonly switchingLeague = signal(false);

  protected readonly sortedStandings = computed(() => {
    const standings = this.store.filteredStandings();
    const col = this.sortColumn();
    const dir = this.sortDirection();
    const multiplier = dir === 'asc' ? 1 : -1;

    return [...standings].sort((a, b) => {
      switch (col) {
        case 'position': return (a.position - b.position) * multiplier;
        case 'played': return (a.played - b.played) * multiplier;
        case 'won': return (a.won - b.won) * multiplier;
        case 'drawn': return (a.drawn - b.drawn) * multiplier;
        case 'lost': return (a.lost - b.lost) * multiplier;
        case 'goalsFor': return (a.goalsFor - b.goalsFor) * multiplier;
        case 'goalsAgainst': return (a.goalsAgainst - b.goalsAgainst) * multiplier;
        case 'goalDifference': return (a.goalDifference - b.goalDifference) * multiplier;
        case 'points': return (a.points - b.points) * multiplier;
        default: return (a.position - b.position) * multiplier;
      }
    });
  });

  ngOnInit(): void {
    this.store.loadStandings();
  }

  onLeagueChange(name: string): void {
    this.switchingLeague.set(true);
    this.store.selectLeague(name);
    setTimeout(() => this.switchingLeague.set(false), 300);
  }

  onSeasonChange(season: string): void {
    this.switchingLeague.set(true);
    this.store.selectSeason(season);
    setTimeout(() => this.switchingLeague.set(false), 300);
  }

  onSort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set(column === 'position' ? 'asc' : 'desc');
    }
  }

  getSortAriaLabel(column: SortColumn): string {
    const labels: Record<SortColumn, string> = {
      position: 'Posición',
      played: 'Partidos jugados',
      won: 'Ganados',
      drawn: 'Empatados',
      lost: 'Perdidos',
      goalsFor: 'Goles a favor',
      goalsAgainst: 'Goles en contra',
      goalDifference: 'Diferencia de goles',
      points: 'Puntos',
    };
    const current = this.sortColumn();
    const dir = this.sortDirection();
    const suffix = current === column ? ` (ordenado ${dir === 'asc' ? 'ascendente' : 'descendente'})` : '';
    return labels[column] + suffix;
  }

  getSortIcon(column: SortColumn): string {
    if (this.sortColumn() !== column) return '';
    return this.sortDirection() === 'asc' ? ' ↑' : ' ↓';
  }

  getGoalDifferenceClass(diff: number): string {
    if (diff > 0) return 'positive';
    if (diff < 0) return 'negative';
    return '';
  }

  getPositionClass(pos: number): string {
    if (pos <= 2) return 'champions';
    if (pos <= 6) return 'playoff';
    if (pos >= 9) return 'relegation';
    return '';
  }

  getFormBadgeLabel(result: string): string {
    const labels: Record<string, string> = { W: 'Victoria', D: 'Empate', L: 'Derrota' };
    return labels[result] ?? result;
  }

  getShortLabel(name: string): string {
    return LEAGUE_SHORT_LABELS[name] ?? name;
  }
}
