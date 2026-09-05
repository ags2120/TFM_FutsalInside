import { Injectable, signal } from '@angular/core';
import { Team } from '../core/models/team.model';

@Injectable( { providedIn: 'root' })
export class TeamsStore {
  private readonly _teams = signal<Team[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly teams = this._teams.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // TODO: Inyectar TeamsService y usar HttpClient
  async loadTeams(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._teams.set([]);
    } catch {
      this._error.set('Error al cargar equipos');
    } finally {
      this._loading.set(false);
    }
  }
}
