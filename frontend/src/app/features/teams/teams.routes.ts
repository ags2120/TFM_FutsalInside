import { Routes } from '@angular/router';
import { TeamsComponent } from './teams.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';

export const TEAMS_ROUTES: Routes = [
  { path: '', component: TeamsComponent },
  { path: ':id', component: TeamDetailComponent },
];
