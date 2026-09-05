import { Component } from '@angular/core';

@Component({
  selector: 'app-favorites',
  template: `
    <div class="favorites-page container">
      <h1>Mis Favoritos</h1>
      <div class="favorites-list">
        <p class="placeholder-text">Tus favoritos aparecerán aquí</p>
      </div>
    </div>
  `,
  styles: `
    .favorites-page { padding-top: var(--space-6); }
    .placeholder-text { color: var(--color-text-muted); text-align: center; padding: var(--space-8); }
  `,
})
export class FavoritesComponent {}
