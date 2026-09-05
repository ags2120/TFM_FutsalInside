import { Component, input, output } from '@angular/core';
import { FavoriteType } from '../../../core/models/favorite.model';

@Component({
  selector: 'app-favorite-button',
  template: `
    <button
      class="favorite-btn"
      [class.active]="isActive()"
      (click)="toggle.emit()"
      [attr.aria-label]="isActive() ? 'Eliminar de favoritos' : 'Añadir a favoritos'"
    >
      {{ isActive() ? '♥' : '♡' }}
    </button>
  `,
  styles: `
    .favorite-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      font-size: var(--font-size-lg);
      color: var(--color-text-muted);
      border-radius: var(--radius-full);
      transition: all var(--transition-fast);
      cursor: pointer;
    }
    .favorite-btn:hover {
      color: var(--color-live);
      background-color: var(--color-live-muted);
    }
    .favorite-btn.active {
      color: var(--color-live);
    }
  `,
})
export class FavoriteButtonComponent {
  isActive = input(false);
  type = input.required<FavoriteType>();
  entityId = input.required<number>();
  toggle = output<void>();
}
