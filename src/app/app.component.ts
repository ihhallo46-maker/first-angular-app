import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { OrdersComponent } from './orders/orders.component';
import { TakeawayComponent } from './takeaway/takeaway.component';

@Component({
  selector: 'app-root',
  imports: [MenuComponent, OrdersComponent, TakeawayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly activeView = signal<'menu' | 'orders' | 'takeaway' | null>(null);

  private readonly today = signal(new Date());

  readonly formattedDate = computed(() => {
    const d = this.today();
    const weekday = new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format(d);
    const rest = new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(d);
    return `${weekday} · ${rest}`.toUpperCase();
  });

  selectView(view: 'menu' | 'orders' | 'takeaway'): void {
    this.activeView.set(view);
    setTimeout(() => {
      document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }
}
