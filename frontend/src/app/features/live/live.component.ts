import { Component, computed, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatchesStore } from '../../stores/matches.store';
import { MatchCardComponent } from '../../shared/components/match-card/match-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-live',
  imports: [RouterLink, MatchCardComponent, LoadingSpinnerComponent],
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css'],
})
export class LiveComponent implements OnInit {
  protected readonly store = inject(MatchesStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly liveMatches = computed(() => this.store.liveMatches());
  protected readonly hasLiveMatches = computed(() => this.liveMatches().length > 0);

  ngOnInit(): void {
    // The live rail is its own signal: without this fetch a direct visit (or
    // a refresh) would render the empty state until another page populated it.
    this.store.loadMatches();
    this.store.loadLiveMatches();
    this.store.startPolling();
    this.destroyRef.onDestroy(() => this.store.stopPolling());
  }
}
