import { Routes } from '@angular/router';
import { FavoritesComponent } from './favorites.component';
import { authGuard } from '../../core/auth/auth.guard';

export const FAVORITES_ROUTES: Routes = [
  {
    path: '',
    component: FavoritesComponent,
    canActivate: [authGuard],
  },
];
