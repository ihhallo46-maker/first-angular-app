import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { type OrderDraft, type OrderDrink, type OrderItemStatus } from '../models/order.model';

interface DrinkOption {
  key: string;
  label: string;
  sizes: Array<'0.3L' | '0.5L'>;
}

@Component({
  selector: 'app-add-order-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-order-modal.component.html',
  styleUrl: './add-order-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddOrderModalComponent {
  readonly closeModal = output<void>();
  readonly saveOrder = output<OrderDraft>();
  readonly orderToEdit = input<OrderDraft | null>(null);

  readonly drinkOptions: DrinkOption[] = [
    { key: 'sprite', label: 'Sprite', sizes: ['0.3L', '0.5L'] },
    { key: 'cola', label: 'Cola', sizes: ['0.3L', '0.5L'] },
    { key: 'fanta', label: 'Fanta', sizes: ['0.3L', '0.5L'] },
    { key: 'pils', label: 'Alkoholfreies Pils', sizes: ['0.3L', '0.5L'] },
  ];
  readonly tableNumbers = Array.from({ length: 25 }, (_, index) => index + 1);

  readonly form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.createForm();

    effect(() => {
      this.applyOrderToForm(this.orderToEdit());
    });
  }

  // Called from the template to render confirmed quantities as read-only badges.
  getConfirmedCount(optionKey: string, size: '0.3L' | '0.5L'): number {
    const label = this.drinkOptions.find((o) => o.key === optionKey)?.label ?? '';
    return this.getConfirmedDrinkQuantity(this.orderToEdit(), label, size);
  }

  close(): void {
    this.closeModal.emit();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const existingOrder = this.orderToEdit();

    const selectedDrinks: OrderDrink[] = this.drinkOptions.flatMap((option) => {
      const drinks: OrderDrink[] = [];
      this.addDrinkBySize(drinks, option, '0.3L', '03', existingOrder);
      this.addDrinkBySize(drinks, option, '0.5L', '05', existingOrder);
      return drinks;
    });

    const selectedBuffetCount = this.form.get('buffet')?.value
      ? Number(this.form.get('buffetCount')?.value ?? 1)
      : 0;

    const selectedCarteCount = this.form.get('carte')?.value
      ? Number(this.form.get('carteCount')?.value ?? 1)
      : 0;

    const draft: OrderDraft = {
      id: existingOrder?.id ?? crypto.randomUUID(),
      tableNumber: Number(this.form.get('tableNumber')?.value ?? 1),
      drinks: selectedDrinks,
      buffetCount: selectedBuffetCount,
      buffetStatus: this.getItemStatus(
        existingOrder?.buffetCount ?? 0,
        existingOrder?.buffetStatus,
        selectedBuffetCount,
      ),
      carteCount: selectedCarteCount,
      carteStatus: this.getItemStatus(
        existingOrder?.carteCount ?? 0,
        existingOrder?.carteStatus,
        selectedCarteCount,
      ),
      carteComment: this.form.get('carte')?.value ? (this.form.get('comment')?.value ?? '') : '',
      status: 'in-progress',
    };

    this.saveOrder.emit(draft);
    this.close();
  }

  private createForm(): FormGroup {
    return this.fb.nonNullable.group({
      tableNumber: [1, [Validators.required, Validators.min(1), Validators.max(25)]],
      buffet: [false],
      carte: [false],
      buffetCount: [1, [Validators.min(1)]],
      carteCount: [1, [Validators.min(1)]],
      comment: [''],
      ...Object.fromEntries(
        this.drinkOptions.flatMap((option) => [
          [`${option.key}03`, false],
          [`${option.key}05`, false],
          [`${option.key}03Count`, 0],
          [`${option.key}05Count`, 0],
        ]),
      ),
    });
  }

  private applyOrderToForm(order: OrderDraft | null): void {
    const values = {
      tableNumber: order?.tableNumber ?? 1,
      buffet: (order?.buffetCount ?? 0) > 0,
      carte: (order?.carteCount ?? 0) > 0,
      buffetCount: (order?.buffetCount ?? 0) > 0 ? order!.buffetCount : 1,
      carteCount: (order?.carteCount ?? 0) > 0 ? order!.carteCount : 1,
      comment: order?.carteComment ?? '',
      ...Object.fromEntries(
        this.drinkOptions.flatMap((option) => {
          const drinksForOption = order?.drinks.filter((d) => d.name === option.label) ?? [];

          // Confirmed drinks are displayed as read-only badges in the template.
          // The input holds only the pending/new quantity so the user types the
          // additional amount (e.g. "4 mehr") and not the cumulative total.
          const confirmed03 = this.getConfirmedDrinkQuantity(order, option.label, '0.3L');
          const confirmed05 = this.getConfirmedDrinkQuantity(order, option.label, '0.5L');
          const new03 = this.getNewDrinkQuantity(drinksForOption, '0.3L');
          const new05 = this.getNewDrinkQuantity(drinksForOption, '0.5L');

          return [
            [`${option.key}03`, confirmed03 > 0 || new03 > 0],
            [`${option.key}05`, confirmed05 > 0 || new05 > 0],
            [`${option.key}03Count`, new03],
            [`${option.key}05Count`, new05],
          ];
        }),
      ),
    };

    this.form.reset(values);
  }

  private addDrinkBySize(
    drinks: OrderDrink[],
    option: DrinkOption,
    size: '0.3L' | '0.5L',
    sizeKey: '03' | '05',
    existingOrder: OrderDraft | null,
  ): void {
    const confirmedQuantity = this.getConfirmedDrinkQuantity(existingOrder, option.label, size);
    // The form value is the new/additional quantity — not a delta over confirmed.
    const newQuantity = Number(this.form.get(`${option.key}${sizeKey}Count`)?.value ?? 0);
    const isChecked = Boolean(this.form.get(`${option.key}${sizeKey}`)?.value);

    if (confirmedQuantity === 0 && (!isChecked || newQuantity <= 0)) return;

    if (confirmedQuantity > 0) {
      drinks.push({ name: option.label, size, quantity: confirmedQuantity, status: 'confirmed' });
    }

    if (isChecked && newQuantity > 0) {
      drinks.push({ name: option.label, size, quantity: newQuantity, status: 'new' });
    }
  }

  // Returns 'confirmed' only when the quantity did not increase AND the item was
  // already confirmed. Without the status check, keeping a 'new' item at the same
  // count would incorrectly flip it to 'confirmed'.
  private getItemStatus(
    existingQuantity: number,
    existingStatus: OrderItemStatus | undefined,
    selectedQuantity: number,
  ): OrderItemStatus {
    return existingStatus === 'confirmed' && selectedQuantity <= existingQuantity
      ? 'confirmed'
      : 'new';
  }

  private getNewDrinkQuantity(drinks: OrderDrink[], size: '0.3L' | '0.5L'): number {
    return drinks
      .filter((d) => d.size === size && d.status === 'new')
      .reduce((sum, d) => sum + d.quantity, 0);
  }

  private getConfirmedDrinkQuantity(
    order: OrderDraft | null,
    drinkName: string,
    size: '0.3L' | '0.5L',
  ): number {
    return (
      order?.drinks
        .filter((d) => d.name === drinkName && d.size === size && d.status === 'confirmed')
        .reduce((sum, d) => sum + d.quantity, 0) ?? 0
    );
  }
}
