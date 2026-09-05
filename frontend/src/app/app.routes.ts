import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'live',
        loadChildren: () =>
          import('./features/live/live.routes').then((m) => m.LIVE_ROUTES),
      },
      {
        path: 'matches',
        loadChildren: () =>
          import('./features/matches/matches.routes').then((m) => m.MATCHES_ROUTES),
      },
      {
        path: 'standings',
        loadChildren: () =>
          import('./features/standings/standings.routes').then(
            (m) => m.STANDINGS_ROUTES
          ),
      },
      {
        path: 'teams',
        loadChildren: () =>
          import('./features/teams/teams.routes').then((m) => m.TEAMS_ROUTES),
      },
      {
        path: 'players',
        loadChildren: () =>
          import('./features/players/players.routes').then((m) => m.PLAYERS_ROUTES),
      },
      {
        path: 'favorites',
        loadChildren: () =>
          import('./features/favorites/favorites.routes').then(
            (m) => m.FAVORITES_ROUTES
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
