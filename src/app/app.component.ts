import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { OrdersComponent } from './orders/orders.component';
import { TakeawayComponent } from './takeaway/takeaway.component';

type View = 'menu' | 'orders' | 'takeaway';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, MenuComponent, OrdersComponent, TakeawayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly activeView = signal<View | null>(null);

  selectView(view: View): void {
    this.activeView.set(view);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 20);
  }
}
