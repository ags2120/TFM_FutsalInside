import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _user = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    if (token && userJson) {
      this._token.set(token);
      this._user.set(JSON.parse(userJson));
    }
  }

  // TODO: Implementar con llamada HTTP real
  async login(email: string, _password: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      // Simulación - reemplazar con HttpClient
      console.log('Login:', email);
    } catch {
      this._error.set('Credenciales incorrectas');
    } finally {
      this._loading.set(false);
    }
  }

  // TODO: Implementar con llamada HTTP real
  async register(_username: string, _email: string, _password: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      // Simulación - reemplazar con HttpClient
      console.log('Register');
    } catch {
      this._error.set('Error al registrar usuario');
    } finally {
      this._loading.set(false);
    }
  }

  logout(): void {
    this._user.set(null);
    this._token.set(null);
    this._error.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  setSession(user: User, token: string): void {
    this._user.set(user);
    this._token.set(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
}
