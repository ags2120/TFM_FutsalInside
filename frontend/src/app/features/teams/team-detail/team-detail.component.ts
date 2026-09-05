import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Team } from '../../../core/models/team.model';
import { Player } from '../../../core/models/player.model';
import { Standing } from '../../../core/models/standings.model';
import { MockDataService } from '../../../core/services/mock-data.service';
import { TeamBadgeComponent } from '../../../shared/components/team-badge/team-badge.component';
import { PlayerAvatarComponent } from '../../../shared/components/player-avatar/player-avatar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-team-detail',
  imports: [
    RouterLink,
    TeamBadgeComponent,
    PlayerAvatarComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './team-detail.component.html',
  styleUrl: './team-detail.component.css',
})
export class TeamDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly mockData = inject(MockDataService);

  protected readonly team = signal<Team | null>(null);
  protected readonly players = signal<Player[]>([]);
  protected readonly standing = signal<Standing | null>(null);
  protected readonly loading = signal(true);

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const [teamResult, playersResult, standingsResult] = await Promise.all([
        firstValueFrom(this.mockData.getTeamById(id)),
        firstValueFrom(this.mockData.getPlayersByTeam(id)),
        firstValueFrom(this.mockData.getStandings()),
      ]);
      this.team.set(teamResult ?? null);
      this.players.set(playersResult);
      this.standing.set(standingsResult.find(s => s.team.id === id) ?? null);
    }
    this.loading.set(false);
  }

  getPositionLabel(position: string): string {
    switch (position) {
      case 'goalkeeper': return 'Portero';
      case 'fixo': return 'Fixo';
      case 'ala': return 'Ala';
      case 'pivot': return 'Pívot';
      default: return position;
    }
  }

  getPositionFilter(position: string): boolean {
    return true;
  }
}
