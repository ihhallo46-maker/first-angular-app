import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AddOrderModalComponent } from './add-order-modal/add-order-modal.component';
import { OrdersService } from '../../service/orders.service';
import { type OrderDraft } from './models/order.model';
import { TranslationService } from '../i18n/translation.service';

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
  readonly ts           = inject(TranslationService);

  readonly isModalOpen     = signal(false);
  readonly editingOrder    = signal<OrderDraft | null>(null);
  readonly warningMessage  = signal<string | null>(null);
  readonly confirmDeleteId = signal<string | null>(null);

  // ── Tisch-Suche ───────────────────────────────────────────
  readonly tableFilter = signal('');

  filteredOrders(): OrderDraft[] {
    const q = this.tableFilter().trim();
    const all = this.orderService.orders();
    if (!q) return all;
    return all.filter((o) => String(o.tableNumber).startsWith(q));
  }

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

  async saveOrder(order: OrderDraft): Promise<void> {
    const result = await this.orderService.save(order);
    if (result === 'duplicate') {
      this.warningMessage.set(
        this.ts.translator().ordersDuplicate.replace('{n}', String(order.tableNumber)),
      );
    }
    this.closeModal();
  }

  async markCompleted(orderId: string): Promise<void> {
    await this.orderService.markCompleted(orderId);
  }

  requestDelete(orderId: string): void {
    this.confirmDeleteId.set(orderId);
  }

  async confirmDelete(): Promise<void> {
    const id = this.confirmDeleteId();
    if (id) await this.orderService.delete(id);
    this.confirmDeleteId.set(null);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  dismissWarning(): void {
    this.warningMessage.set(null);
  }

  formatDate(iso?: string): string {
    if (!iso) return '';
    const d      = new Date(iso);
    const locale = this.ts.currentLang() === 'zh' ? 'zh-CN'
                 : this.ts.currentLang() === 'en' ? 'en-GB'
                 : 'de-DE';
    const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
    const date    = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
    const time    = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(d);
    if (locale === 'zh-CN') return `${weekday} ${date} · ${time}`;
    return `${weekday}. ${date} · ${time} Uhr`;
  }

  deleteDialogTitle(tableNumber: number): string {
    return this.ts.translator().deleteTitle.replace('{n}', String(tableNumber));
  }
}
