import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { type OrderDraft, type OrderDrink } from '../app/orders/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly firestore = inject(Firestore);
  private readonly ordersCol = collection(this.firestore, 'orders');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private started = false;

  private readonly _orders = signal<OrderDraft[]>([]);
  readonly orders = this._orders.asReadonly();

  readonly inProgressCount = computed(
    () => this._orders().filter((o) => o.status !== 'completed').length,
  );

  /**
   * Echtzeit-Listener erst starten, wenn der (eingeloggte) Bestellbereich geöffnet wird.
   * Verhindert „permission denied"-Fehler für nicht angemeldete Besucher.
   */
  start(): void {
    if (this.started || !this.isBrowser) return;
    this.started = true;
    // Ohne orderBy, damit auch Einträge ohne createdAt-Feld erscheinen –
    // sortiert wird im Browser (neueste zuerst).
    collectionData(this.ordersCol, { idField: 'id' }).subscribe({
      next: (data) => {
        const orders = (data as OrderDraft[]).slice().sort((a, b) =>
          (b.createdAt ?? '').localeCompare(a.createdAt ?? ''),
        );
        this._orders.set(orders);
      },
      error: (err) => {
        console.error('[OrdersService] Firestore-Lesefehler:', err);
      },
    });
  }

  async save(order: OrderDraft): Promise<'duplicate' | 'saved'> {
    const duplicate = this._orders().find(
      (o) => o.tableNumber === order.tableNumber && o.id !== order.id,
    );
    if (duplicate) return 'duplicate';

    const isExisting = this._orders().some((o) => o.id === order.id);
    const data: OrderDraft = isExisting
      ? order
      : { ...order, createdAt: new Date().toISOString() };

    await setDoc(doc(this.ordersCol, data.id), data);
    return 'saved';
  }

  async delete(orderId: string): Promise<void> {
    await deleteDoc(doc(this.ordersCol, orderId));
  }

  async markCompleted(orderId: string): Promise<void> {
    const order = this._orders().find((o) => o.id === orderId);
    if (!order) return;

    await updateDoc(doc(this.ordersCol, orderId), {
      drinks: this.mergeConfirmedDrinks(order.drinks),
      buffetStatus: 'confirmed',
      carteStatus: 'confirmed',
      status: 'completed',
    });
  }

  private mergeConfirmedDrinks(drinks: OrderDrink[]): OrderDrink[] {
    const merged = new Map<string, OrderDrink>();
    for (const drink of drinks) {
      const key = `${drink.name}-${drink.size}`;
      const existing = merged.get(key);
      if (existing) {
        merged.set(key, { ...existing, quantity: existing.quantity + drink.quantity, status: 'confirmed' });
      } else {
        merged.set(key, { ...drink, status: 'confirmed' });
      }
    }
    return Array.from(merged.values());
  }
}
