import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { OrdersComponent } from './orders/orders.component';
import { TakeawayComponent } from './takeaway/takeaway.component';
import { AnfahrtComponent } from './anfahrt/anfahrt.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'takeaway', component: TakeawayComponent },
  { path: 'anfahrt', component: AnfahrtComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: '**', redirectTo: '' },
];
