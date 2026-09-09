import { Component, input, output, ElementRef, inject, effect, untracked } from '@angular/core';

export interface Tab {
  key: string;
  label: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent {
  tabs = input.required<Tab[]>();
  activeTab = input.required<string>();
  tabChange = output<string>();

  private readonly el = inject(ElementRef);
  private interactionDetected = false;

  constructor() {
    effect(() => {
      const activeKey = this.activeTab();
      untracked(() => {
        if (!this.interactionDetected) return;
        const tabs = this.tabs();
        const index = tabs.findIndex(t => t.key === activeKey);
        if (index >= 0) {
          requestAnimationFrame(() => {
            const buttons = this.el.nativeElement.querySelectorAll('[role="tab"]');
            buttons[index]?.focus();
          });
        }
      });
    });

    effect(() => {
      this.activeTab();
      this.tabs();
    });
  }

  onTabInteraction(event: Event, key: string): void {
    this.interactionDetected = true;
    this.tabChange.emit(key);
  }

  onKeydown(event: KeyboardEvent, currentKey: string): void {
    this.interactionDetected = true;
    const tabs = this.tabs();
    const currentIndex = tabs.findIndex(t => t.key === currentKey);
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % tabs.length;
        this.tabChange.emit(tabs[nextIndex].key);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        this.tabChange.emit(tabs[nextIndex].key);
        break;
      case 'Home':
        event.preventDefault();
        this.tabChange.emit(tabs[0].key);
        break;
      case 'End':
        event.preventDefault();
        this.tabChange.emit(tabs[tabs.length - 1].key);
        break;
    }
  }
}
