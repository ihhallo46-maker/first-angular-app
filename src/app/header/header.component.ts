import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

type View = 'menu' | 'orders' | 'takeaway' | 'anfahrt';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly activeView = input<View | null>(null);
  readonly viewSelected = output<View>();
  readonly homeClicked = output<void>();

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
    const date = new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(d);
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

  private closeNav(): void {
    const el = document.getElementById('navbarMain');
    if (el) {
      const bsCollapse = (window as any).bootstrap?.Collapse?.getInstance(el);
      bsCollapse?.hide();
    }
  }
}
