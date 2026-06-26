import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-intern-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './intern-login.component.html',
  styleUrl: './intern-login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternLoginComponent {
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route  = inject(ActivatedRoute);
  private readonly fb     = inject(FormBuilder);

  readonly form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly error        = signal<'invalid' | null>(null);
  readonly loading      = signal(false);
  readonly showPassword = signal(false);

  async submit(): Promise<void> {
    if (this.form.invalid || this.loading()) return;
    this.error.set(null);
    this.loading.set(true);

    const { email, password } = this.form.getRawValue();
    const result = await this.auth.login(email ?? '', password ?? '');

    this.loading.set(false);

    if (result === 'ok') {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/orders';
      void this.router.navigateByUrl(returnUrl);
    } else {
      this.error.set('invalid');
      this.form.controls.password.reset();
    }
  }

  togglePassword(): void { this.showPassword.update(v => !v); }
}
