import { Routes } from '@angular/router';
import { MatchesComponent } from './matches.component';
import { MatchDetailComponent } from './match-detail/match-detail.component';

export const MATCHES_ROUTES: Routes = [
  { path: '', component: MatchesComponent },
  { path: ':id', component: MatchDetailComponent },
];
