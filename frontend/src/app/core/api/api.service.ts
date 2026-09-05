import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // TODO: Implementar con HttpClient
  // Estos métodos serán reemplazados con llamadas HTTP reales

  async get<T>(_endpoint: string): Promise<T> {
    this._loading.set(true);
    this._error.set(null);
    try {
      // Simulación
      throw new Error('API not implemented yet');
    } catch (e) {
      this._error.set((e as Error).message);
      throw e;
    } finally {
      this._loading.set(false);
    }
  }

  async post<T>(_endpoint: string, _body: unknown): Promise<T> {
    this._loading.set(true);
    this._error.set(null);
    try {
      throw new Error('API not implemented yet');
    } catch (e) {
      this._error.set((e as Error).message);
      throw e;
    } finally {
      this._loading.set(false);
    }
  }
}
