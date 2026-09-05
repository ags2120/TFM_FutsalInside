import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Player } from '../../../core/models/player.model';
import { MockDataService } from '../../../core/services/mock-data.service';
import { TeamBadgeComponent } from '../../../shared/components/team-badge/team-badge.component';
import { PlayerAvatarComponent } from '../../../shared/components/player-avatar/player-avatar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-player-detail',
  imports: [
    RouterLink,
    TeamBadgeComponent,
    PlayerAvatarComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './player-detail.component.html',
  styleUrl: './player-detail.component.css',
})
export class PlayerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly mockData = inject(MockDataService);

  protected readonly player = signal<Player | null>(null);
  protected readonly loading = signal(true);

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const result = await firstValueFrom(this.mockData.getPlayerById(id));
      this.player.set(result ?? null);
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

  getPositionDescription(position: string): string {
    switch (position) {
      case 'goalkeeper': return 'Última defensa del equipo, encargado de proteger la portería.';
      case 'fixo': return 'Jugador defensivo que organiza la defensa y distribuye el juego.';
      case 'ala': return 'Jugador ofensivo por las bandas, rápido y con capacidad de desborde.';
      case 'pivot': return 'Jugador estratégico en la zona de ataque,referencia ofensiva.';
      default: return '';
    }
  }

  getAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}
