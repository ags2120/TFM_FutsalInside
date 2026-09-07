import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GlobalSearchComponent } from '../global-search/global-search.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, GlobalSearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
