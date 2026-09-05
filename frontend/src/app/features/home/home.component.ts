import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatchesStore } from '../../stores/matches.store';
import { MatchCardComponent } from '../../shared/components/match-card/match-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatchCardComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  protected readonly store = inject(MatchesStore);

  ngOnInit(): void {
    this.store.loadAllHomeData();
  }
}
