import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent {
  private readonly auth = inject(AuthService);
  private readonly fb   = inject(FormBuilder);
  readonly ts           = inject(TranslationService);

  readonly closed = output<void>();

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(64)]],
    password: ['', [Validators.required, Validators.maxLength(128)]],
  });

  readonly error        = signal<'invalid' | 'locked' | null>(null);
  readonly loading      = signal(false);
  readonly showPassword = signal(false);

  get lockoutSeconds(): number { return this.auth.lockoutSecondsLeft; }

  lockedMsg(): string {
    return this.ts.translator().loginLocked.replace('{n}', String(this.lockoutSeconds));
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.loading()) return;
    this.error.set(null);
    this.loading.set(true);

    const { username, password } = this.form.getRawValue();
    const result = await this.auth.login(username ?? '', password ?? '');

    this.loading.set(false);

    if (result === 'ok') {
      this.closed.emit();
    } else {
      this.error.set(result);
      this.form.controls.password.reset();
    }
  }

  close(): void { this.closed.emit(); }

  togglePassword(): void { this.showPassword.update(v => !v); }
}
