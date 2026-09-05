import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-player-detail',
  template: `
    <div class="player-detail container">
      <h1>Detalle del Jugador</h1>
      <p class="placeholder-text">Detalles del jugador aparecerán aquí</p>
    </div>
  `,
  styles: `
    .player-detail { padding-top: var(--space-6); }
    .placeholder-text { color: var(--color-text-muted); text-align: center; padding: var(--space-8); }
  `,
})
export class PlayerDetailComponent {
  constructor(private route: ActivatedRoute) {}
}
