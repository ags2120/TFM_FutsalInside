import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Team } from '../core/models/team.model';
import { MockDataService } from '../core/services/mock-data.service';

@Injectable({ providedIn: 'root' })
export class TeamsStore {
  private readonly mockData = inject(MockDataService);

  private readonly _teams = signal<Team[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly teams = this._teams.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly teamCount = computed(() => this._teams().length);

  readonly leagues = computed(() => {
    const all = this._teams().map((t) => t.league).filter((l): l is string => !!l);
    return [...new Set(all)].sort();
  });

  async loadTeams(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const teams = await firstValueFrom(this.mockData.getTeams());
      this._teams.set(teams);
    } catch {
      this._error.set('Error al cargar equipos');
    } finally {
      this._loading.set(false);
    }
  }
}
