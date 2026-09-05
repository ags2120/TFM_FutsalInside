import { Component, input, output } from '@angular/core';

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
}
