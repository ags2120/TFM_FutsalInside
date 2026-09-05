import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatchesStore } from '../../stores/matches.store';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrl: './live.component.css',
})
export class LiveComponent implements OnInit, OnDestroy {
  protected readonly store = inject(MatchesStore);

  ngOnInit(): void {
    this.store.loadMatches();
    this.store.startPolling();
  }

  ngOnDestroy(): void {
    this.store.stopPolling();
  }
}
