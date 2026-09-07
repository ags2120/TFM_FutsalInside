import { Component, input, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Team } from '../../../core/models/team.model';
import { Standing } from '../../../core/models/standings.model';
import { MatchPredictionService, MatchPrediction } from '../../../core/services/match-prediction.service';
import { TeamBadgeComponent } from '../team-badge/team-badge.component';

@Component({
  selector: 'app-next-match-prediction',
  imports: [RouterLink, TeamBadgeComponent],
  template: `
    <div class="prediction-card">
      <div class="prediction-header">
        <h3 class="section-title">Próximo partido</h3>
        <div class="info-tooltip" title="Predicción basada en posición en tabla, diferencia de puntos, goles marcados/encajados, ventaja de local y últimos 5 resultados.">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
        </div>
      </div>

      @if (prediction()) {
        <div class="prediction-content">
          <!-- TEAMS ROW -->
          <div class="teams-row">
            <div class="team-side home">
              <a [routerLink]="['/teams', prediction()!.homeTeam.id]" class="team-link">
                <app-team-badge [team]="prediction()!.homeTeam" size="lg" />
                <span class="team-label">{{ prediction()!.homeTeam.shortName }}</span>
              </a>
              <span class="venue-tag home-tag">Local</span>
            </div>

            <div class="vs-badge">VS</div>

            <div class="team-side away">
              <a [routerLink]="['/teams', prediction()!.awayTeam.id]" class="team-link">
                <app-team-badge [team]="prediction()!.awayTeam" size="lg" />
                <span class="team-label">{{ prediction()!.awayTeam.shortName }}</span>
              </a>
              <span class="venue-tag away-tag">Visitante</span>
            </div>
          </div>

          <!-- PROBABILITY BARS -->
          <div class="probabilities">
            <div class="prob-row" [class.highlighted]="prediction()!.mostLikelyOutcome === 'home'">
              <div class="prob-label">
                <a [routerLink]="['/teams', prediction()!.homeTeam.id]" class="prob-team-link">{{ prediction()!.homeTeam.shortName }}</a>
                <span class="prob-tag">Victoria</span>
              </div>
              <div class="prob-bar-track">
                <div
                  class="prob-bar-fill home-fill"
                  [style.width.%]="prediction()!.homeWinProb"
                ></div>
              </div>
              <span class="prob-value">{{ prediction()!.homeWinProb }}%</span>
            </div>

            <div class="prob-row" [class.highlighted]="prediction()!.mostLikelyOutcome === 'draw'">
              <div class="prob-label">
                <span class="prob-team-name">Empate</span>
              </div>
              <div class="prob-bar-track">
                <div
                  class="prob-bar-fill draw-fill"
                  [style.width.%]="prediction()!.drawProb"
                ></div>
              </div>
              <span class="prob-value">{{ prediction()!.drawProb }}%</span>
            </div>

            <div class="prob-row" [class.highlighted]="prediction()!.mostLikelyOutcome === 'away'">
              <div class="prob-label">
                <a [routerLink]="['/teams', prediction()!.awayTeam.id]" class="prob-team-link">{{ prediction()!.awayTeam.shortName }}</a>
                <span class="prob-tag">Victoria</span>
              </div>
              <div class="prob-bar-track">
                <div
                  class="prob-bar-fill away-fill"
                  [style.width.%]="prediction()!.awayWinProb"
                ></div>
              </div>
              <span class="prob-value">{{ prediction()!.awayWinProb }}%</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .prediction-card {
      background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(0, 210, 106, 0.04) 100%);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    }

    .prediction-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-4);
    }

    .section-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0;
    }

    .info-tooltip {
      color: var(--color-text-muted);
      cursor: help;
      display: flex;
      align-items: center;
      transition: color var(--transition-fast);
    }

    .info-tooltip:hover {
      color: var(--color-accent);
    }

    /* === TEAMS ROW === */
    .teams-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-4);
      margin-bottom: var(--space-5);
    }

    .team-side {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      flex: 1;
    }

    .team-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      text-decoration: none;
      color: inherit;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      transition: background-color var(--transition-fast);
      cursor: pointer;
    }

    .team-link:hover { transform: scale(1.05); }

    .team-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
    }

    .venue-tag {
      font-size: 10px;
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 2px 8px;
      border-radius: var(--radius-sm);
    }

    .home-tag {
      background-color: rgba(34, 197, 94, 0.15);
      color: #22c55e;
    }

    .away-tag {
      background-color: rgba(59, 130, 246, 0.15);
      color: #3b82f6;
    }

    .vs-badge {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      background: var(--color-bg-tertiary);
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      flex-shrink: 0;
    }

    /* === PROBABILITY BARS === */
    .probabilities {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .prob-row {
      display: grid;
      grid-template-columns: 100px 1fr 50px;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      border: 1px solid transparent;
      transition: all var(--transition-fast);
    }

    .prob-row.highlighted {
      background-color: rgba(0, 210, 106, 0.05);
      border-color: rgba(0, 210, 106, 0.2);
    }

    .prob-label {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .prob-team-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
    }

    .prob-team-link {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      text-decoration: none;
      transition: color var(--transition-fast);
      cursor: pointer;
    }

    .prob-team-link:hover {
      color: var(--color-accent);
    }

    .prob-tag {
      font-size: 10px;
      color: var(--color-text-muted);
    }

    .prob-bar-track {
      height: 8px;
      background-color: var(--color-bg-tertiary);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .prob-bar-fill {
      height: 100%;
      border-radius: var(--radius-full);
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .home-fill {
      background: linear-gradient(90deg, #22c55e, #16a34a);
    }

    .draw-fill {
      background: linear-gradient(90deg, #eab308, #ca8a04);
    }

    .away-fill {
      background: linear-gradient(90deg, #3b82f6, #2563eb);
    }

    .prob-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      text-align: right;
      font-family: var(--font-family-mono);
    }

    .prob-row.highlighted .prob-value {
      color: var(--color-accent);
    }

    /* === RESPONSIVE === */
    @media (max-width: 480px) {
      .teams-row {
        gap: var(--space-2);
      }

      .prob-row {
        grid-template-columns: 80px 1fr 45px;
        gap: var(--space-2);
      }
    }
  `,
})
export class NextMatchPredictionComponent {
  private readonly predictionService = inject(MatchPredictionService);

  teamId = input.required<number>();
  opponents = input.required<Team[]>();
  standings = input.required<Standing[]>();

  protected readonly prediction = computed<MatchPrediction | null>(() => {
    const id = this.teamId();
    const allStandings = this.standings();
    const opps = this.opponents();

    const homeStanding = allStandings.find(s => s.team.id === id);
    if (!homeStanding) return null;

    const nextOpponent = opps.find(t => t.id !== id);
    if (!nextOpponent) return null;

    return this.predictionService.predict(homeStanding.team, nextOpponent, allStandings);
  });
}
