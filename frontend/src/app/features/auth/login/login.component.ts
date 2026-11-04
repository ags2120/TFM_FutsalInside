import { Component, inject } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  protected readonly loginForm: FormGroup;
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid || this.auth.loading()) {
      return;
    }
    const { email, password } = this.loginForm.value;
    void this.login(email ?? '', password ?? '');
  }

  private async login(email: string, password: string): Promise<void> {
    const ok = await this.auth.login(email, password);
    if (ok) {
      this.router.navigateByUrl(this.returnUrl());
    }
  }

  /**
   * Where to go after authenticating: the `returnUrl` the authGuard
   * preserved, validated as a same-app path to avoid open redirects.
   */
  private returnUrl(): string {
    const raw = this.route.snapshot.queryParamMap.get('returnUrl');
    if (raw && raw.startsWith('/') && !raw.startsWith('//')) {
      return raw;
    }
    return '/';
  }
}
