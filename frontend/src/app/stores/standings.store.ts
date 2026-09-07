import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Standing, Competition } from '../core/models';
import { MockDataService } from '../core/services/mock-data.service';

@Injectable({ providedIn: 'root' })
export class StandingsStore {
  private readonly mockData = inject(MockDataService);

  private readonly _standings = signal<Standing[]>([]);
  private readonly _competitions = signal<Competition[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly standings = this._standings.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly competitions = this._competitions.asReadonly();

  readonly leagueNames = computed(() =>
    [...new Set(this._competitions().map((c) => c.name))].sort()
  );

  seasonsForLeague = (leagueName: string): string[] =>
    [...new Set(this._competitions().filter((c) => c.name === leagueName).map((c) => c.season))].sort().reverse();

  competitionFor = (leagueName: string, season: string): Competition | undefined =>
    this._competitions().find((c) => c.name === leagueName && c.season === season);

  async loadStandings(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const [standings, competitions] = await Promise.all([
        firstValueFrom(this.mockData.getStandings()),
        firstValueFrom(this.mockData.getCompetitions()),
      ]);
      this._standings.set(standings);
      this._competitions.set(competitions);
    } catch {
      this._error.set('Error al cargar clasificación');
    } finally {
      this._loading.set(false);
    }
  }
}
