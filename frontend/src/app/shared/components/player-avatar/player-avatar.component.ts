import { Component, input } from '@angular/core';
import { Player } from '../../../core/models/player.model';

@Component({
  selector: 'app-player-avatar',
  template: `
    <div class="avatar" [class]="size()">
      <span class="avatar-initials">{{ player().firstName.charAt(0) }}{{ player().lastName.charAt(0) }}</span>
    </div>
  `,
  styles: `
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      background-color: var(--color-bg-tertiary);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-secondary);
      flex-shrink: 0;
      overflow: hidden;
    }
    .avatar.sm {
      width: 32px;
      height: 32px;
      font-size: var(--font-size-xs);
    }
    .avatar.md {
      width: 40px;
      height: 40px;
      font-size: var(--font-size-sm);
    }
    .avatar.lg {
      width: 64px;
      height: 64px;
      font-size: var(--font-size-lg);
    }
    .avatar.xl {
      width: 96px;
      height: 96px;
      font-size: var(--font-size-2xl);
    }
  `,
})
export class PlayerAvatarComponent {
  player = input.required<Player>();
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
}
