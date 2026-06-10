import { Injectable, signal } from '@angular/core';
import { type OrderDraft, type OrderDrink } from './models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  readonly orders = signal<OrderDraft[]>([]);
  readonly isModalOpen = signal(false);
  readonly editingOrder = signal<OrderDraft | null>(null);

  openModal(order: OrderDraft | null = null): void {
    this.editingOrder.set(order);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingOrder.set(null);
  }

  addOrder(order: OrderDraft): void {
    this.orders.update((items) => [this.normalizeOrder(order), ...items]);
    this.closeModal();
  }

  startEdit(order: OrderDraft): void {
    this.openModal({ ...this.normalizeOrder(order), status: 'in-progress' });
  }

  saveOrder(order: OrderDraft): void {
    const currentEditingOrder = this.editingOrder();
    const normalizedOrder = this.normalizeOrder(order);

    if (currentEditingOrder) {
      this.orders.update((items) =>
        items.map((item) => (item.id === currentEditingOrder.id ? { ...item, ...normalizedOrder } : item)),
      );
    } else {
      this.addOrder(normalizedOrder);
      return;
    }

    this.closeModal();
  }

  markCompleted(orderId: string): void {
    this.orders.update((items) =>
      items.map((item) =>
        item.id === orderId
          ? {
              ...item,
              status: 'completed',
              drinks: item.drinks.map((drink) => ({ ...drink, status: 'completed' })),
            }
          : item,
      ),
    );
  }

  deleteOrder(orderId: string): void {
    this.orders.update((items) => items.filter((item) => item.id !== orderId));
  }

  getOccupiedTableNumbers(currentOrderId?: string): number[] {
    return this.orders()
      .filter((item) => item.id !== currentOrderId)
      .map((item) => item.tableNumber);
  }

  private normalizeOrder(order: OrderDraft): OrderDraft {
    return {
      ...order,
      drinks: order.drinks.map((drink) => ({
        ...drink,
        status: drink.status ?? (order.status === 'completed' ? 'completed' : 'new'),
      })),
    };
  }
}
