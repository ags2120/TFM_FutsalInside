import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _user = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);
  private readonly _loading = signal(false);

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly loading = this._loading.asReadonly();
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
    try {
      // Simulación - reemplazar con HttpClient
      console.log('Login:', email);
    } finally {
      this._loading.set(false);
    }
  }

  // TODO: Implementar con llamada HTTP real
  async register(_username: string, _email: string, _password: string): Promise<void> {
    this._loading.set(true);
    try {
      // Simulación - reemplazar con HttpClient
      console.log('Register');
    } finally {
      this._loading.set(false);
    }
  }

  logout(): void {
    this._user.set(null);
    this._token.set(null);
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
