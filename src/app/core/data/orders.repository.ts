import { Signal } from '@angular/core';
import { type OrderDraft } from '../../orders/models/order.model';

/**
 * Vertrag für den Zugriff auf die Bestellungen.
 *
 * Wie beim Menü: Die Komponenten nutzen nur diesen Vertrag.
 * Firebase heute, Python-Backend später – ohne Änderung an der Oberfläche.
 */
export abstract class OrdersRepository {
  /** Nur aktive Bestellungen (kein deletedAt) — für die Bestellliste */
  abstract readonly orders: Signal<OrderDraft[]>;
  /** Alle Bestellungen inkl. archivierte — für Berichte */
  abstract readonly allOrders: Signal<OrderDraft[]>;
  abstract readonly inProgressCount: Signal<number>;

  abstract start(): void;
  abstract save(order: OrderDraft): Promise<'duplicate' | 'saved'>;
  abstract delete(orderId: string): Promise<void>;
  abstract markCompleted(orderId: string): Promise<void>;
}
