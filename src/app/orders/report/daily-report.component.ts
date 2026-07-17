import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { type OrderDraft } from '../models/order.model';
import {
  BUFFET_ADULT_PRICE,
  BUFFET_CHILD_PRICE,
  DRINK_PRICES,
  type DrinkSize,
} from './report-prices';
import { menuData } from '../../menu/menu-data';

export type PeriodType = 'tag' | 'monat' | 'jahr';

export interface DrinkLine {
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CarteLine {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [],
  templateUrl: './daily-report.component.html',
  styleUrl: './daily-report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyReportComponent {
  readonly orders = input<OrderDraft[]>([]);
  readonly closed = output<void>();

  readonly buffetAdultPrice = BUFFET_ADULT_PRICE;
  readonly buffetChildPrice = BUFFET_CHILD_PRICE;
  readonly menuSections     = menuData.sections;

  // ── Perioden-Steuerung ───────────────────────────────────
  readonly periodType   = signal<PeriodType>('tag');
  readonly selectedDate = signal(new Date());
  readonly showPriceList = signal(false);

  readonly periodLabel = computed(() => {
    const d    = this.selectedDate();
    const type = this.periodType();
    if (type === 'tag')
      return new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(d);
    if (type === 'monat')
      return new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(d);
    return String(d.getFullYear());
  });

  readonly filteredOrders = computed((): OrderDraft[] => {
    const d    = this.selectedDate();
    const type = this.periodType();
    return this.orders().filter(order => {
      // createdAt bevorzugt; deletedAt als Fallback damit archivierte Bestellungen
      // auch dann im richtigen Zeitraum erscheinen wenn createdAt fehlt
      const dateStr = order.createdAt ?? order.deletedAt;
      if (!dateStr) return false;
      const c = new Date(dateStr);
      if (type === 'tag')
        return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth() && c.getDate() === d.getDate();
      if (type === 'monat')
        return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
      return c.getFullYear() === d.getFullYear();
    });
  });

  setPeriod(type: PeriodType): void {
    this.periodType.set(type);
    this.selectedDate.set(new Date());
  }

  prev(): void {
    const d    = new Date(this.selectedDate());
    const type = this.periodType();
    if (type === 'tag')   d.setDate(d.getDate() - 1);
    if (type === 'monat') d.setMonth(d.getMonth() - 1);
    if (type === 'jahr')  d.setFullYear(d.getFullYear() - 1);
    this.selectedDate.set(d);
  }

  next(): void {
    const d    = new Date(this.selectedDate());
    const type = this.periodType();
    if (type === 'tag')   d.setDate(d.getDate() + 1);
    if (type === 'monat') d.setMonth(d.getMonth() + 1);
    if (type === 'jahr')  d.setFullYear(d.getFullYear() + 1);
    this.selectedDate.set(d);
  }

  // ── Berechnungen ─────────────────────────────────────────
  readonly drinkLines = computed((): DrinkLine[] => {
    const map = new Map<string, DrinkLine>();
    for (const order of this.filteredOrders()) {
      for (const drink of order.drinks) {
        const key       = `${drink.name}__${drink.size}`;
        const entry     = DRINK_PRICES.find(p => p.name === drink.name);
        const unitPrice = entry?.prices[drink.size as DrinkSize] ?? 0;
        const existing  = map.get(key);
        if (existing) {
          existing.quantity += drink.quantity;
          existing.total     = existing.quantity * unitPrice;
        } else {
          map.set(key, { name: drink.name, size: drink.size, quantity: drink.quantity, unitPrice, total: drink.quantity * unitPrice });
        }
      }
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'de'));
  });

  readonly totalBuffetAdults   = computed(() => this.filteredOrders().reduce((s, o) => s + (o.buffetAdults   ?? 0), 0));
  readonly totalBuffetChildren = computed(() => this.filteredOrders().reduce((s, o) => s + (o.buffetChildren ?? 0), 0));
  readonly totalCartePersons   = computed(() => this.filteredOrders().reduce((s, o) => s + (o.carteCount     ?? 0), 0));
  readonly totalDrinks = computed(() => this.drinkLines().reduce((s, l) => s + l.total, 0));
  readonly totalBuffet = computed(() =>
    this.totalBuffetAdults() * BUFFET_ADULT_PRICE + this.totalBuffetChildren() * BUFFET_CHILD_PRICE);

  readonly carteLines = computed((): CarteLine[] => {
    const map = new Map<number, CarteLine>();
    for (const order of this.filteredOrders()) {
      for (const item of (order.carteItems ?? [])) {
        const existing = map.get(item.id);
        if (existing) {
          existing.quantity += item.quantity;
          existing.total     = existing.quantity * existing.unitPrice;
        } else {
          map.set(item.id, { id: item.id, name: item.name, unitPrice: item.price, quantity: item.quantity, total: item.price * item.quantity });
        }
      }
    }
    return [...map.values()].sort((a, b) => a.id - b.id);
  });

  readonly totalCarte = computed(() => this.carteLines().reduce((s, l) => s + l.total, 0));
  readonly grandTotal = computed(() => this.totalDrinks() + this.totalBuffet() + this.totalCarte());

  drinkCount(order: OrderDraft): number {
    return order.drinks.reduce((s, d) => s + d.quantity, 0);
  }

  fmt(n: number): string {
    return n.toFixed(2).replace('.', ',') + ' €';
  }

  print(): void { window.print(); }
}
