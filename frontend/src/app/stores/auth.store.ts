import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { User } from '../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly _user = signal<User | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  private readonly authService = inject(AuthService);

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly isAuthenticated = computed(() => !!this._user());

  constructor() {
    this._user.set(this.authService.user());
  }

  async login(email: string, password: string): Promise<boolean> {
    this._loading.set(true);
    this._error.set(null);
    try {
      await this.authService.login(email, password);
      this._user.set(this.authService.user());
      return true;
    } catch {
      this._error.set('Credenciales incorrectas');
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  async register(username: string, email: string, password: string): Promise<boolean> {
    this._loading.set(true);
    this._error.set(null);
    try {
      await this.authService.register(username, email, password);
      return true;
    } catch {
      this._error.set('Error al registrar usuario');
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this._user.set(null);
  }
}
