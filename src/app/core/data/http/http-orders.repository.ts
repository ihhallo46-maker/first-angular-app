import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdersRepository } from '../orders.repository';
import { type OrderDraft } from '../../../orders/models/order.model';

const API = '/api/orders';

/**
 * PLATZHALTER für ein späteres Python-Backend (REST/HTTP).
 * NOCH NICHT AKTIV.
 *
 * Erwartete Endpunkte auf der Python-Seite:
 *   GET    /api/orders            → alle Bestellungen
 *   POST   /api/orders            → speichern
 *   DELETE /api/orders/:id        → löschen
 *   PATCH  /api/orders/:id        → als erledigt markieren
 */
@Injectable()
export class HttpOrdersRepository extends OrdersRepository {
  private readonly http = inject(HttpClient);

  private readonly _orders = signal<OrderDraft[]>([]);
  readonly orders = this._orders.asReadonly();

  readonly inProgressCount = computed(
    () => this._orders().filter((o) => o.status !== 'completed').length,
  );

  start(): void {
    this.http.get<OrderDraft[]>(API).subscribe({
      next: (data) => this._orders.set(data),
      error: () => { /* still: leer lassen */ },
    });
  }

  async save(order: OrderDraft): Promise<'duplicate' | 'saved'> {
    void order; // TODO: POST /api/orders
    throw new Error('HttpOrdersRepository: noch nicht implementiert (Python-Backend).');
  }

  async delete(orderId: string): Promise<void> {
    void orderId; // TODO: DELETE /api/orders/:id
    throw new Error('HttpOrdersRepository: noch nicht implementiert (Python-Backend).');
  }

  async markCompleted(orderId: string): Promise<void> {
    void orderId; // TODO: PATCH /api/orders/:id
    throw new Error('HttpOrdersRepository: noch nicht implementiert (Python-Backend).');
  }
}
