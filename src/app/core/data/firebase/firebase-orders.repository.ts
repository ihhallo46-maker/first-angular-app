import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { OrdersRepository } from '../orders.repository';
import { type OrderDraft, type OrderDrink } from '../../../orders/models/order.model';

@Injectable()
export class FirebaseOrdersRepository extends OrdersRepository {
  private readonly firestore = inject(Firestore);
  private readonly ordersCol = collection(this.firestore, 'orders');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private started = false;

  private readonly _allOrders = signal<OrderDraft[]>([]);

  // Nur aktive (nicht gelöschte) Bestellungen — für die Bestellliste
  readonly orders = computed(() => this._allOrders().filter((o: OrderDraft) => !o.deletedAt));

  // Alle inkl. archivierte — für Berichte
  readonly allOrders = this._allOrders.asReadonly();

  readonly inProgressCount = computed(
    () => this.orders().filter((o) => o.status !== 'completed').length,
  );

  start(): void {
    if (this.started || !this.isBrowser) return;
    this.started = true;
    collectionData(this.ordersCol, { idField: 'id' }).subscribe({
      next: (data) => {
        const orders = (data as OrderDraft[])
          .slice()
          .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
        this._allOrders.set(orders);
      },
      error: (err) => {
        console.error('[Orders] Firestore-Lesefehler:', err);
      },
    });
  }

  async save(order: OrderDraft): Promise<'duplicate' | 'saved'> {
    // Duplikat-Prüfung nur gegen aktive Bestellungen
    const duplicate = this.orders().find(
      (o) => o.tableNumber === order.tableNumber && o.id !== order.id,
    );
    if (duplicate) return 'duplicate';

    const isExisting = this.orders().some((o) => o.id === order.id);
    const data: OrderDraft = isExisting
      ? order
      : { ...order, createdAt: new Date().toISOString() };

    await setDoc(doc(this.ordersCol, data.id), data);
    return 'saved';
  }

  // Soft-Delete: Bestellung bleibt in Firestore, wird nur als gelöscht markiert
  async delete(orderId: string): Promise<void> {
    const order = this._allOrders().find((o) => o.id === orderId);
    await updateDoc(doc(this.ordersCol, orderId), {
      deletedAt: new Date().toISOString(),
      // createdAt explizit mitschreiben, damit es nicht verloren geht
      ...(order?.createdAt ? { createdAt: order.createdAt } : {}),
    });
  }

  async markCompleted(orderId: string): Promise<void> {
    const order = this.orders().find((o) => o.id === orderId);
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
