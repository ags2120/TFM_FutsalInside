import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MatchesStore } from '../../stores/matches.store';
import { MatchCardComponent } from '../../shared/components/match-card/match-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { Match } from '../../core/models/match.model';

const LEAGUE_PRIORITY = ['(ESP)', '(BRA)', '(ITA)', '(EUR)'];

interface DayItem {
  label: string;
  shortLabel: string;
  dayNumber: number;
  date: string;
  isToday: boolean;
  isSelected: boolean;
  hasLive: boolean;
}

@Component({
  selector: 'app-matches',
  imports: [
    MatchCardComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css'],
})
export class MatchesComponent implements OnInit {
  protected readonly store = inject(MatchesStore);
  protected readonly weekDays = signal<DayItem[]>([]);
  protected readonly selectedFilter = signal<string>('all');

  protected readonly groupedByCompetition = computed(() => {
    const matches = this.store.matches();
    const filter = this.selectedFilter();
    const filtered = filter === 'all' ? matches : matches.filter(m => m.competition.name === filter);

    const entries: [string, Match[]][] = [];
    for (const match of filtered) {
      const key = match.competition.name;
      const existing = entries.find(e => e[0] === key);
      if (existing) {
        existing[1].push(match);
      } else {
        entries.push([key, [match]]);
      }
    }

    return entries.sort((a, b) => {
      const ai = LEAGUE_PRIORITY.findIndex(p => a[0].includes(p));
      const bi = LEAGUE_PRIORITY.findIndex(p => b[0].includes(p));
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  });

  protected readonly competitionNames = computed(() => {
    const matches = this.store.matches();
    const names = [...new Set(matches.map(m => m.competition.name))];
    return names.sort((a, b) => {
      const ai = LEAGUE_PRIORITY.findIndex(p => a.includes(p));
      const bi = LEAGUE_PRIORITY.findIndex(p => b.includes(p));
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  });

  protected readonly isTodaySelected = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.weekDays().some(d => d.isSelected && d.date === today);
  });

  ngOnInit(): void {
    this.buildWeek();
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
        hasLive: false,
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

  selectFilter(filter: string): void {
    this.selectedFilter.set(filter);
  }

  goToToday(): void {
    const today = new Date().toISOString().split('T')[0];
    this.selectDay(today);
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

  retryLoad(): void {
    const selectedDay = this.weekDays().find(d => d.isSelected);
    this.store.loadMatches(selectedDay?.date);
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
        hasLive: false,
      });
    }
    this.weekDays.set(days);
  }
}
