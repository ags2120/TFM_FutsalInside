import { Component, input } from '@angular/core';
import { Team } from '../../../core/models/team.model';

@Component({
  selector: 'app-club-info',
  template: `
    <div class="club-info-card">
      <h3 class="card-title">Información del club</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-icon">🏟️</span>
          <div class="info-content">
            <span class="info-label">Estadio</span>
            <span class="info-value">{{ team().venue || '—' }}</span>
          </div>
        </div>
        @if (team().stadiumCapacity) {
          <div class="info-item">
            <span class="info-icon">👥</span>
            <div class="info-content">
              <span class="info-label">Capacidad</span>
              <span class="info-value">{{ team().stadiumCapacity!.toLocaleString() }}</span>
            </div>
          </div>
        }
        @if (team().founded) {
          <div class="info-item">
            <span class="info-icon">📅</span>
            <div class="info-content">
              <span class="info-label">Fundación</span>
              <span class="info-value">{{ team().founded }}</span>
            </div>
          </div>
        }
        <div class="info-item">
          <span class="info-icon">🌍</span>
          <div class="info-content">
            <span class="info-label">País</span>
            <span class="info-value">{{ team().country }}</span>
          </div>
        </div>
        @if (team().coach) {
          <div class="info-item">
            <span class="info-icon">👔</span>
            <div class="info-content">
              <span class="info-label">Entrenador</span>
              <span class="info-value">{{ team().coach }}</span>
            </div>
          </div>
        }
        <div class="info-item">
          <span class="info-icon">🏆</span>
          <div class="info-content">
            <span class="info-label">Títulos</span>
            <span class="info-value number">{{ team().titles || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .club-info-card {
      background-color: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    }
    .card-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0 0 var(--space-4) 0;
    }
    .info-grid {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    .info-icon {
      font-size: var(--font-size-lg);
      width: 28px;
      text-align: center;
      flex-shrink: 0;
    }
    .info-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .info-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
    }
    .info-value.number {
      font-family: var(--font-family-mono);
      color: var(--color-accent);
      font-weight: var(--font-weight-bold);
    }
  `],
})
export class ClubInfoComponent {
  readonly team = input.required<Team>();
}
