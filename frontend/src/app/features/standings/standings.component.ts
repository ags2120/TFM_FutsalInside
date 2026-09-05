import { Component } from '@angular/core';

@Component({
  selector: 'app-standings',
  template: `
    <div class="standings-page container">
      <h1>Clasificación</h1>
      <div class="standings-table">
        <p class="placeholder-text">La tabla de clasificación se mostrará aquí</p>
      </div>
    </div>
  `,
  styles: `
    .standings-page { padding-top: var(--space-6); }
    .placeholder-text { color: var(--color-text-muted); text-align: center; padding: var(--space-8); }
  `,
})
export class StandingsComponent {}
