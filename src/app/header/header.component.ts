import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LoginModalComponent } from '../auth/login-modal/login-modal.component';

type View = 'menu' | 'orders' | 'takeaway' | 'anfahrt';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly auth = inject(AuthService);

  readonly activeView   = input<View | null>(null);
  readonly viewSelected = output<View>();
  readonly homeClicked  = output<void>();

  readonly isLoginOpen = signal(false);

  private readonly today = signal(new Date());

  readonly isTuesday = computed(() => this.today().getDay() === 2);

  readonly isOpen = computed(() => {
    const d = this.today();
    if (d.getDay() === 2) return false;
    const mins = d.getHours() * 60 + d.getMinutes();
    return (mins >= 12 * 60 && mins < 15 * 60) || (mins >= 17 * 60 + 30 && mins < 22 * 60);
  });

  readonly formattedDate = computed(() => {
    const d = this.today();
    const weekday = new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format(d);
    const date    = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
    return `${weekday} · ${date}`.toUpperCase();
  });

  select(view: View): void {
    this.closeNav();
    this.viewSelected.emit(view);
  }

  goHome(): void {
    this.closeNav();
    this.homeClicked.emit();
  }

  openLogin(): void  { this.isLoginOpen.set(true); }
  closeLogin(): void { this.isLoginOpen.set(false); }
  logout(): void     { this.auth.logout(); }

  private closeNav(): void {
    const el = document.getElementById('navMain');
    if (el) {
      const bsCollapse = (window as any).bootstrap?.Collapse?.getInstance(el);
      bsCollapse?.hide();
    }
  }
}
