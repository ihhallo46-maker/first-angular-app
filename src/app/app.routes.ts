import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { OrdersComponent } from './orders/orders.component';
import { TakeawayComponent } from './takeaway/takeaway.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'takeaway', component: TakeawayComponent },
  { path: '**', redirectTo: '' },
];
