import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Match } from '../../../core/models/match.model';
import { TeamBadgeComponent } from '../team-badge/team-badge.component';
import { ScoreDisplayComponent } from '../score-display/score-display.component';

@Component({
  selector: 'app-match-card',
  imports: [RouterLink, TeamBadgeComponent, ScoreDisplayComponent],
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.css'],
})
export class MatchCardComponent {
  match = input.required<Match>();
  showCompetition = input(true);
  variant = input<'card' | 'list'>('card');
}
