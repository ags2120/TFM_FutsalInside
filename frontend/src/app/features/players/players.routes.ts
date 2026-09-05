import { Routes } from '@angular/router';
import { PlayersComponent } from './players.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';

export const PLAYERS_ROUTES: Routes = [
  { path: '', component: PlayersComponent },
  { path: ':id', component: PlayerDetailComponent },
];
