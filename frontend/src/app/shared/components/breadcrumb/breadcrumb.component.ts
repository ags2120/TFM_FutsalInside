import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      @for (item of items(); track $index; let last = $last) {
        @if (item.route && !last) {
          <a [routerLink]="item.route" class="breadcrumb-link">{{ item.label }}</a>
        } @else {
          <span class="breadcrumb-current">{{ item.label }}</span>
        }
        @if (!last) {
          <span class="breadcrumb-separator">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </span>
        }
      }
    </nav>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-3) 0;
      font-size: var(--font-size-sm);
    }
    .breadcrumb-link {
      color: var(--color-text-muted);
      text-decoration: none;
      transition: color var(--transition-fast);
    }
    .breadcrumb-link:hover {
      color: var(--color-accent);
    }
    .breadcrumb-current {
      color: var(--color-text-primary);
      font-weight: var(--font-weight-medium);
    }
    .breadcrumb-separator {
      display: flex;
      align-items: center;
      color: var(--color-text-muted);
      opacity: 0.5;
    }
  `],
})
export class BreadcrumbComponent {
  readonly items = input.required<BreadcrumbItem[]>();
}
