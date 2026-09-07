import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { MatchesStore } from '../../stores/matches.store';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrl: './live.component.css',
})
export class LiveComponent implements OnInit {
  protected readonly store = inject(MatchesStore);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.store.loadMatches();
    this.store.startPolling();
    this.destroyRef.onDestroy(() => this.store.stopPolling());
  }
}
