import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriteType } from '../../../core/models/favorite.model';
import { AuthService } from '../../../core/auth/auth.service';
import { FavoritesStore } from '../../../stores/favorites.store';

@Component({
  selector: 'app-favorite-button',
  template: `
    <button
      type="button"
      class="favorite-btn"
      [class.active]="isActive()"
      [attr.aria-pressed]="isActive()"
      [attr.aria-label]="ariaLabel()"
      (click)="toggle()"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        [attr.fill]="isActive() ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  `,
  styles: `
    .favorite-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      color: var(--color-text-muted);
      background-color: transparent;
      border: 1px solid transparent;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .favorite-btn:hover {
      color: var(--color-live);
      background-color: var(--color-live-muted);
    }
    .favorite-btn.active {
      color: var(--color-live);
    }
    .favorite-btn:focus-visible {
      outline: 2px solid var(--color-live);
      outline-offset: 2px;
    }
  `,
})
export class FavoriteButtonComponent {
  private readonly store = inject(FavoritesStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  type = input.required<FavoriteType>();
  entityId = input.required<number>();
  label = input('');

  readonly isActive = computed(() => this.store.isFavorite(this.type(), this.entityId()));

  readonly ariaLabel = computed(() => {
    const name = this.label();
    if (this.isActive()) {
      return name ? `Quitar ${name} de favoritos` : 'Eliminar de favoritos';
    }
    return name ? `Añadir ${name} a favoritos` : 'Añadir a favoritos';
  });

  toggle(): void {
    if (!this.auth.isAuthenticated()) {
      void this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    void this.store.toggleFavorite(this.type(), this.entityId());
  }
}
