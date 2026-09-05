import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team-detail',
  template: `
    <div class="team-detail container">
      <h1>Detalle del Equipo</h1>
      <p class="placeholder-text">Detalles del equipo aparecerán aquí</p>
    </div>
  `,
  styles: `
    .team-detail { padding-top: var(--space-6); }
    .placeholder-text { color: var(--color-text-muted); text-align: center; padding: var(--space-8); }
  `,
})
export class TeamDetailComponent {
  constructor(private route: ActivatedRoute) {}
}
