import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { AddOrderModalComponent } from './add-order-modal/add-order-modal.component';
import { type OrderDraft, type OrderDrink } from './models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [AddOrderModalComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  readonly orders = signal<OrderDraft[]>([]);
  readonly isModalOpen = signal(false);
  readonly editingOrder = signal<OrderDraft | null>(null);
  readonly warningMessage = signal<string | null>(null);

  readonly inProgressCount = computed(
    () => this.orders().filter((o) => o.status !== 'completed').length,
  );

  openModal(order: OrderDraft | null = null): void {
    this.editingOrder.set(order);
    this.isModalOpen.set(true);
    this.warningMessage.set(null);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingOrder.set(null);
  }

  startEdit(order: OrderDraft): void {
    this.openModal({ ...order, status: 'in-progress' });
  }

  saveOrder(order: OrderDraft): void {
    const currentEditingOrder = this.editingOrder();

    const duplicate = this.orders().find(
      (o) => o.tableNumber === order.tableNumber && o.id !== order.id,
    );

    if (duplicate) {
      this.warningMessage.set(
        `Tisch ${order.tableNumber} ist bereits belegt — Bestellung wurde nicht gespeichert.`,
      );
      this.closeModal();
      return;
    }

    if (currentEditingOrder) {
      this.orders.update((items) =>
        items.map((item) => (item.id === currentEditingOrder.id ? { ...item, ...order } : item)),
      );
    } else {
      this.orders.update((items) => [order, ...items]);
    }

    this.closeModal();
  }

  markCompleted(orderId: string): void {
    this.orders.update((items) =>
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

  deleteOrder(orderId: string): void {
    this.orders.update((items) => items.filter((item) => item.id !== orderId));
  }

  dismissWarning(): void {
    this.warningMessage.set(null);
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