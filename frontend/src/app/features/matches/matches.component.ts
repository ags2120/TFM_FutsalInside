import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MatchesStore } from '../../stores/matches.store';
import { MatchCardComponent } from '../../shared/components/match-card/match-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { Match } from '../../core/models/match.model';

interface DayItem {
  label: string;
  shortLabel: string;
  dayNumber: number;
  date: string;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-matches',
  imports: [
    MatchCardComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.css',
})
export class MatchesComponent implements OnInit {
  protected readonly store = inject(MatchesStore);
  protected readonly weekDays = signal<DayItem[]>([]);

  protected readonly groupedByCompetition = computed(() => {
    const matches = this.store.matches();
    const map = new Map<string, Match[]>();
    for (const match of matches) {
      const key = match.competition.name;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(match);
    }
    return map;
  });

  constructor() {
    this.buildWeek();
  }

  ngOnInit(): void {
    this.store.loadMatches();
  }

  private buildWeek(): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const fullDayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const days: DayItem[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = dateStr === today.toISOString().split('T')[0];

      days.push({
        label: fullDayNames[i],
        shortLabel: dayNames[i],
        dayNumber: d.getDate(),
        date: dateStr,
        isToday,
        isSelected: isToday,
      });
    }
    this.weekDays.set(days);
  }

  selectDay(date: string): void {
    this.weekDays.update(days =>
      days.map(d => ({ ...d, isSelected: d.date === date }))
    );
    this.store.loadMatches(date);
  }

  prevWeek(): void {
    const current = new Date(this.weekDays()[0].date);
    current.setDate(current.getDate() - 7);
    this.rebuildWeekFrom(current);
  }

  nextWeek(): void {
    const current = new Date(this.weekDays()[0].date);
    current.setDate(current.getDate() + 7);
    this.rebuildWeekFrom(current);
  }

  private rebuildWeekFrom(start: Date): void {
    const today = new Date();
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const fullDayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const days: DayItem[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];

      days.push({
        label: fullDayNames[i],
        shortLabel: dayNames[i],
        dayNumber: d.getDate(),
        date: dateStr,
        isToday: dateStr === todayStr,
        isSelected: false,
      });
    }
    this.weekDays.set(days);
  }
}
