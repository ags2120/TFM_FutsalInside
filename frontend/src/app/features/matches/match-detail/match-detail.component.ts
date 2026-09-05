import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-match-detail',
  template: `
    <div class="match-detail container">
      <h1>Detalle del Partido</h1>
      <p class="placeholder-text">Detalles del partido aparecerán aquí</p>
    </div>
  `,
  styles: `
    .match-detail { padding-top: var(--space-6); }
    .placeholder-text { color: var(--color-text-muted); text-align: center; padding: var(--space-8); }
  `,
})
export class MatchDetailComponent {
  constructor(private route: ActivatedRoute) {}
}
