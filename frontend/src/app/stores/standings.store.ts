import { Injectable, signal } from '@angular/core';
import { Standing } from '../core/models/standings.model';

@Injectable()
export class StandingsStore {
  private readonly _standings = signal<Standing[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly standings = this._standings.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // TODO: Inyectar StandingsService y usar HttpClient
  async loadStandings(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._standings.set([]);
    } catch {
      this._error.set('Error al cargar clasificación');
    } finally {
      this._loading.set(false);
    }
  }
}
