import { Pipe, PipeTransform } from '@angular/core';
import { MatchStatus } from '../../core/models/match.model';

@Pipe({
  name: 'matchStatus',
})
export class MatchStatusPipe implements PipeTransform {
  private readonly statusLabels: Record<MatchStatus, string> = {
    scheduled: 'Programado',
    live: 'En Vivo',
    halftime: 'Descanso',
    finished: 'Finalizado',
    postponed: 'Aplazado',
    cancelled: 'Cancelado',
  };

  transform(status: MatchStatus): string {
    return this.statusLabels[status] || status;
  }
}
