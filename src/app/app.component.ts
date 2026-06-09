import { Component, signal } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { OrdersComponent } from './orders/orders.component';
import { TakeawayComponent } from './takeaway/takeaway.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, MenuComponent, OrdersComponent, TakeawayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly activeView = signal<'menu' | 'orders' | 'takeaway'>('menu');

  selectView(view: 'menu' | 'orders' | 'takeaway'): void {
    this.activeView.set(view);
  }
}