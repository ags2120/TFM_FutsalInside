import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';
import { API_CONFIG } from '../api/api.config';
import { environment } from '../../../environments/environment';

/**
 * Validation messages the Laravel API emits, keyed by the English text, so
 * the UI can show Spanish copy without the backend owning user-facing
 * language (the same convention the pipes and labels follow).
 */
const VALIDATION_MESSAGES: Record<string, string> = {
  'The username has already been taken.': 'El nombre de usuario ya está en uso',
  'The email has already been taken.': 'El email ya está registrado',
  'The password must be at least 8 characters.': 'La contraseña debe tener al menos 8 caracteres',
  'The password confirmation does not match.': 'Las contraseñas no coinciden',
  'The selected entity does not exist.': 'El elemento ya no existe',
};

/**
 * Token-based session state (Sanctum personal access tokens).
 *
 * The session is a bearer token plus the user snapshot, both mirrored in
 * localStorage so a reload keeps the user signed in; `hydrate()` revalidates
 * that stored token against `/auth/me` on bootstrap because the server may
 * have revoked it (logout elsewhere) or it may have expired (7-day lifetime,
 * no refresh flow — expiry means re-authentication).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = (endpoint: keyof typeof API_CONFIG.endpoints.auth): string =>
    `${environment.apiUrl}${API_CONFIG.endpoints.auth[endpoint]}`;

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
      try {
        this._token.set(token);
        this._user.set(JSON.parse(userJson) as User);
      } catch {
        this.clearSession();
      }
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(this.authUrl('login'), { email, password }),
      );
      this.setSession(response.user, response.token);
      return true;
    } catch (error) {
      this._error.set(this.toSpanishMessage(error));
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Registration mints the token server-side and returns the same envelope
   * as login, so the user is signed in immediately after signing up.
   */
  async register(username: string, email: string, password: string): Promise<boolean> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(this.authUrl('register'), {
          username,
          email,
          password,
          password_confirmation: password,
        }),
      );
      this.setSession(response.user, response.token);
      return true;
    } catch (error) {
      this._error.set(this.toSpanishMessage(error));
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Revoke the presented token server-side and drop the local session.
   * Revocation is best-effort: the local session is cleared first so the
   * user is signed out even if the network is down, and the request carries
   * its own captured header because the token signal is already gone.
   */
  logout(): void {
    const token = this._token();
    this.clearSession();
    if (token) {
      this.http
        .post(this.authUrl('logout'), {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({ error: () => undefined });
    }
  }

  /**
   * Revalidate the stored token on bootstrap. Only an explicit rejection
   * (401/403) clears the session — a network failure says nothing about the
   * token's validity and must not silently sign the user out.
   */
  async hydrate(): Promise<void> {
    if (!this._token()) {
      return;
    }
    try {
      const response = await firstValueFrom(
        this.http.get<{ user: User }>(this.authUrl('me')),
      );
      this._user.set(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        this.clearSession();
      }
    }
  }

  /** Local-only reset; used by the 401 interceptor as well as logout. */
  clearSession(): void {
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

  private toSpanishMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Error de conexión. Inténtalo de nuevo.';
    }
    if (error.status === 401) {
      return 'Credenciales incorrectas';
    }
    if (error.status === 429) {
      return 'Demasiados intentos. Inténtalo de nuevo en un minuto.';
    }
    if (error.status === 422) {
      const bag = (error.error as { errors?: Record<string, string[]> } | undefined)?.errors;
      const first = bag ? Object.values(bag).flat()[0] : undefined;
      if (first && VALIDATION_MESSAGES[first]) {
        return VALIDATION_MESSAGES[first];
      }
      return 'Revisa los datos introducidos';
    }
    return 'Error de conexión. Inténtalo de nuevo.';
  }
}
