import { Injectable, computed, effect, signal } from '@angular/core';
import { type OrderDraft, type OrderDrink } from './models/order.model';

const STORAGE_KEY = 'duck-house-orders';
const isBrowser = typeof localStorage !== 'undefined';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly _orders = signal<OrderDraft[]>(this.loadFromStorage());

  readonly orders = this._orders.asReadonly();

  readonly inProgressCount = computed(
    () => this._orders().filter((o) => o.status !== 'completed').length,
  );

  constructor() {
    // Persist every state change to localStorage automatically
    effect(() => {
      if (!isBrowser) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._orders()));
    });
  }

  save(order: OrderDraft): 'duplicate' | 'saved' {
    const duplicate = this._orders().find(
      (o) => o.tableNumber === order.tableNumber && o.id !== order.id,
    );
    if (duplicate) return 'duplicate';

    const isExisting = this._orders().some((o) => o.id === order.id);
    if (isExisting) {
      this._orders.update((items) =>
        items.map((item) => (item.id === order.id ? { ...item, ...order } : item)),
      );
    } else {
      this._orders.update((items) => [order, ...items]);
    }
    return 'saved';
  }

  delete(orderId: string): void {
    this._orders.update((items) => items.filter((item) => item.id !== orderId));
  }

  markCompleted(orderId: string): void {
    this._orders.update((items) =>
      items.map((item) => {
        if (item.id !== orderId) return item;
        return {
          ...item,
          drinks: this.mergeConfirmedDrinks(item.drinks),
          buffetStatus: 'confirmed' as const,
          carteStatus: 'confirmed' as const,
          status: 'completed' as const,
        };
      }),
    );
  }

  private loadFromStorage(): OrderDraft[] {
    if (!isBrowser) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as OrderDraft[]) : [];
    } catch {
      return [];
    }
  }

  private mergeConfirmedDrinks(drinks: OrderDrink[]): OrderDrink[] {
    const merged = new Map<string, OrderDrink>();
    for (const drink of drinks) {
      const key = `${drink.name}-${drink.size}`;
      const existing = merged.get(key);
      if (existing) {
        merged.set(key, {
          ...existing,
          quantity: existing.quantity + drink.quantity,
          status: 'confirmed',
        });
      } else {
        merged.set(key, { ...drink, status: 'confirmed' });
      }
    }
    return Array.from(merged.values());
  }
}
