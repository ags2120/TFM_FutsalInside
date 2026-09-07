import { Injectable, signal, computed } from '@angular/core';
import { Standing, Competition } from '../core/models';
import { MOCK_STANDINGS, COMPETITIONS } from '../core/mocks';

@Injectable({ providedIn: 'root' })
export class StandingsStore {
  private readonly _standings = signal<Standing[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly standings = this._standings.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly competitions: Competition[] = COMPETITIONS;

  readonly leagueNames = computed(() =>
    [...new Set(this.competitions.map((c) => c.name))].sort()
  );

  seasonsForLeague = (leagueName: string): string[] =>
    [...new Set(this.competitions.filter((c) => c.name === leagueName).map((c) => c.season))].sort().reverse();

  competitionFor = (leagueName: string, season: string): Competition | undefined =>
    this.competitions.find((c) => c.name === leagueName && c.season === season);

  async loadStandings(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._standings.set(MOCK_STANDINGS);
    } catch {
      this._error.set('Error al cargar clasificación');
    } finally {
      this._loading.set(false);
    }
  }
}
