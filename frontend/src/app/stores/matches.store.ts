import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Match } from '../core/models/match.model';
import { MockDataService } from '../core/services/mock-data.service';

const POLLING_INTERVAL_MS = 30000;

@Injectable({ providedIn: 'root' })
export class MatchesStore {
  private readonly mockData = inject(MockDataService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _selectedDate = signal<string>(
    new Date().toISOString().split('T')[0]
  );
  private readonly _matches = signal<Match[]>([]);
  private readonly _liveMatches = signal<Match[]>([]);
  private readonly _upcomingMatches = signal<Match[]>([]);
  private readonly _recentMatches = signal<Match[]>([]);
  private readonly _currentMatch = signal<Match | null>(null);
  private readonly _loading = signal(false);
  private readonly _detailLoading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _detailError = signal<string | null>(null);
  private readonly _liveError = signal<string | null>(null);
  private readonly _upcomingError = signal<string | null>(null);
  private readonly _recentError = signal<string | null>(null);
  private readonly _polling = signal(false);
  private _pollingTimer: ReturnType<typeof setInterval> | null = null;

  readonly selectedDate = this._selectedDate.asReadonly();
  readonly matches = this._matches.asReadonly();
  readonly liveMatches = this._liveMatches.asReadonly();
  readonly upcomingMatches = this._upcomingMatches.asReadonly();
  readonly recentMatches = this._recentMatches.asReadonly();
  readonly currentMatch = this._currentMatch.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly detailLoading = this._detailLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly detailError = this._detailError.asReadonly();
  readonly liveError = this._liveError.asReadonly();
  readonly upcomingError = this._upcomingError.asReadonly();
  readonly recentError = this._recentError.asReadonly();
  readonly polling = this._polling.asReadonly();

  readonly hasLiveMatches = computed(() => this._liveMatches().length > 0);
  readonly matchCount = computed(() => this._matches().length);

  constructor() {
    this.destroyRef.onDestroy(() => this.stopPolling());
  }

  async loadMatches(date?: string): Promise<void> {
    if (this._loading()) return;
    if (date) {
      this._selectedDate.set(date);
    }

    this._loading.set(true);
    this._error.set(null);
    try {
      const matches = await firstValueFrom(
        this.mockData.getMatches(this._selectedDate())
      );
      this._matches.set(matches);
    } catch {
      this._error.set('Error al cargar partidos');
    } finally {
      this._loading.set(false);
    }
  }

  async loadMatchById(id: number): Promise<void> {
    if (this._detailLoading()) return;
    this._detailLoading.set(true);
    this._detailError.set(null);
    try {
      const match = await firstValueFrom(this.mockData.getMatchById(id));
      this._currentMatch.set(match ?? null);
      if (!match) {
        this._detailError.set('Partido no encontrado');
      }
    } catch {
      this._detailError.set('Error al cargar el partido');
    } finally {
      this._detailLoading.set(false);
    }
  }

  async loadLiveMatches(): Promise<void> {
    try {
      const live = await firstValueFrom(this.mockData.getLiveMatches());
      this._liveMatches.set(live);
      this._liveError.set(null);
    } catch {
      this._liveError.set('Error al cargar partidos en vivo');
    }
  }

  async loadUpcomingMatches(): Promise<void> {
    try {
      const upcoming = await firstValueFrom(this.mockData.getUpcomingMatches());
      this._upcomingMatches.set(upcoming);
      this._upcomingError.set(null);
    } catch {
      this._upcomingError.set('Error al cargar próximos partidos');
    }
  }

  async loadRecentMatches(): Promise<void> {
    try {
      const recent = await firstValueFrom(this.mockData.getRecentMatches());
      this._recentMatches.set(recent);
      this._recentError.set(null);
    } catch {
      this._recentError.set('Error al cargar resultados recientes');
    }
  }

  async loadAllHomeData(): Promise<void> {
    if (this._loading()) return;
    this._loading.set(true);
    this._error.set(null);
    this._liveError.set(null);
    this._upcomingError.set(null);
    this._recentError.set(null);
    try {
      const [live, upcoming, recent] = await Promise.all([
        firstValueFrom(this.mockData.getLiveMatches()),
        firstValueFrom(this.mockData.getUpcomingMatches()),
        firstValueFrom(this.mockData.getRecentMatches()),
      ]);
      this._liveMatches.set(live);
      this._upcomingMatches.set(upcoming);
      this._recentMatches.set(recent);
    } catch {
      this._error.set('Error al cargar datos');
    } finally {
      this._loading.set(false);
    }
  }

  setSelectedDate(date: string): void {
    this._selectedDate.set(date);
  }

  startPolling(): void {
    if (this._polling()) return;

    this._polling.set(true);
    this._pollingTimer = setInterval(() => {
      if (this.hasLiveMatches()) {
        this.loadLiveMatches();
      } else {
        this.stopPolling();
      }
    }, POLLING_INTERVAL_MS);
  }

  stopPolling(): void {
    if (this._pollingTimer) {
      clearInterval(this._pollingTimer);
      this._pollingTimer = null;
    }
    this._polling.set(false);
  }
}
