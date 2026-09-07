import { Pipe, PipeTransform } from '@angular/core';
import { PlayerPosition } from '../../core/models/player.model';

const POSITION_LABELS: Record<string, string> = {
  portero: 'Portero',
  cierre: 'Cierre',
  ala: 'Ala',
  pivot: 'Pívot',
};

@Pipe({
  name: 'playerPosition',
})
export class PlayerPositionPipe implements PipeTransform {
  transform(position: PlayerPosition | string): string {
    return POSITION_LABELS[position] ?? position;
  }
}
