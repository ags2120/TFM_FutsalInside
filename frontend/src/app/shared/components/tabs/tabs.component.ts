import { Component, input, output, ElementRef, inject, effect } from '@angular/core';

export interface Tab {
  key: string;
  label: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent {
  tabs = input.required<Tab[]>();
  activeTab = input.required<string>();
  tabChange = output<string>();

  private readonly el = inject(ElementRef);

  constructor() {
    effect(() => {
      const activeKey = this.activeTab();
      const tabs = this.tabs();
      const index = tabs.findIndex(t => t.key === activeKey);
      if (index >= 0) {
        requestAnimationFrame(() => {
          const buttons = this.el.nativeElement.querySelectorAll('[role="tab"]');
          buttons[index]?.focus();
        });
      }
    });
  }

  onKeydown(event: KeyboardEvent, currentKey: string): void {
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
