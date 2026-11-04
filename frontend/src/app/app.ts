import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App implements OnInit {
  private readonly auth = inject(AuthService);

  /** Revalidate any stored token once per app start (see hydrate()). */
  ngOnInit(): void {
    void this.auth.hydrate();
  }
}
