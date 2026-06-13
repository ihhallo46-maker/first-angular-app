import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AddOrderModalComponent } from './add-order-modal/add-order-modal.component';
import { OrdersService } from '../../service/orders.service';
import { type OrderDraft } from './models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [AddOrderModalComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  readonly orderService = inject(OrdersService);

  // UI-only state
  readonly isModalOpen = signal(false);
  readonly editingOrder = signal<OrderDraft | null>(null);
  readonly warningMessage = signal<string | null>(null);
  readonly confirmDeleteId = signal<string | null>(null);

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
    const result = this.orderService.save(order);
    if (result === 'duplicate') {
      this.warningMessage.set(
        `Tisch ${order.tableNumber} ist bereits belegt — Bestellung wurde nicht gespeichert.`,
      );
    }
    this.closeModal();
  }

  markCompleted(orderId: string): void {
    this.orderService.markCompleted(orderId);
  }

  requestDelete(orderId: string): void {
    this.confirmDeleteId.set(orderId);
  }

  confirmDelete(): void {
    const id = this.confirmDeleteId();
    if (id) this.orderService.delete(id);
    this.confirmDeleteId.set(null);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  dismissWarning(): void {
    this.warningMessage.set(null);
  }
}
