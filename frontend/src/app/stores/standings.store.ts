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
  private readonly _selectedLeague = signal('');
  private readonly _selectedSeason = signal('');

  readonly standings = this._standings.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly competitions = this._competitions.asReadonly();
  readonly selectedLeague = this._selectedLeague.asReadonly();
  readonly selectedSeason = this._selectedSeason.asReadonly();

  readonly leagueNames = computed(() => {
    const names = [...new Set(this._competitions().map((c) => c.name))];
    const order = ['(ESP)', '(BRA)', '(ITA)', '(EUR)'];
    return names.sort((a, b) => {
      const ai = order.findIndex((o) => a.includes(o));
      const bi = order.findIndex((o) => b.includes(o));
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  });

  readonly availableSeasons = computed(() => {
    const league = this._selectedLeague();
    if (!league) return [];
    return [...new Set(this._competitions().filter((c) => c.name === league).map((c) => c.season))].sort().reverse();
  });

  readonly selectedCompetition = computed(() => {
    const league = this._selectedLeague();
    const season = this._selectedSeason();
    if (!league || !season) return undefined;
    return this._competitions().find((c) => c.name === league && c.season === season);
  });

  readonly filteredStandings = computed(() => {
    const comp = this.selectedCompetition();
    if (!comp) return [];
    return this._standings().filter((s) => s.competitionId === comp.id);
  });

  initSelections(): void {
    const names = this.leagueNames();
    if (names.length > 0 && !this._selectedLeague()) {
      this._selectedLeague.set(names[0]);
      const seasons = [...new Set(this._competitions().filter((c) => c.name === names[0]).map((c) => c.season))].sort().reverse();
      if (seasons.length > 0) {
        this._selectedSeason.set(seasons[0]);
      }
    }
  }

  selectLeague(name: string): void {
    this._selectedLeague.set(name);
    const seasons = [...new Set(this._competitions().filter((c) => c.name === name).map((c) => c.season))].sort().reverse();
    this._selectedSeason.set(seasons[0] ?? '');
  }

  selectSeason(season: string): void {
    this._selectedSeason.set(season);
  }

  async loadStandings(): Promise<void> {
    if (this._loading()) return;
    this._loading.set(true);
    this._error.set(null);
    try {
      const [standings, competitions] = await Promise.all([
        firstValueFrom(this.mockData.getStandings()),
        firstValueFrom(this.mockData.getCompetitions()),
      ]);
      this._standings.set(standings);
      this._competitions.set(competitions);
      this.initSelections();
    } catch {
      this._error.set('Error al cargar clasificación');
    } finally {
      this._loading.set(false);
    }
  }
}
