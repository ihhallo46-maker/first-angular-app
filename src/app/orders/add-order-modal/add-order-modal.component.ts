import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { type OrderDraft, type OrderDrink, type OrderItemStatus } from '../models/order.model';

interface DrinkOption {
  key: string;
  label: string;
  sizes: Array<'0.3L' | '0.5L' | '0.75L'>;
}

interface DrinkCategory {
  key: string;
  label: string;
  icon: string;
  drinkKeys: string[];
}

interface SizeEntry {
  sizeKey: '03' | '05' | '075';
  size: '0.3L' | '0.5L' | '0.75L';
  label: string;
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
    { key: 'colaZero', label: 'Cola Zero', sizes: ['0.3L', '0.5L'] },
    { key: 'spezi', label: 'Spezi', sizes: ['0.3L', '0.5L'] },
    { key: 'fanta', label: 'Fanta', sizes: ['0.3L', '0.5L'] },
    { key: 'apple', label: 'Apfelschorle', sizes: ['0.3L', '0.5L'] },
    { key: 'wasserstill', label: 'Wasser still', sizes: ['0.3L', '0.75L'] },
     { key: 'wassersprudel', label: 'Wasser sprudel', sizes: ['0.3L', '0.75L'] },
    { key: 'pils', label: 'Alkoholfreies Pils', sizes: ['0.3L', '0.5L'] },
    { key: 'alcPils', label: 'Pils', sizes: ['0.3L', '0.5L'] },
    { key: 'weizen', label: 'Alkoholfreies Weizen', sizes: ['0.3L', '0.5L'] },
    { key: 'alcWeizen', label: 'Weizen', sizes: ['0.3L', '0.5L'] },
    { key: 'krefelder', label: 'Krefelder', sizes: ['0.3L', '0.5L'] },
    { key: 'altBier', label: 'Altbier', sizes: ['0.3L', '0.5L'] },
    { key: 'radler', label: 'Radler', sizes: ['0.3L', '0.5L'] },
    { key: 'alster', label: 'Alster', sizes: ['0.3L', '0.5L'] },
    { key: 'lemon', label: 'Bitter Lemon', sizes: ['0.3L'] },
    { key: 'gingerAle', label: 'Ginger Ale', sizes: ['0.3L'] },
    { key: 'malzbier', label: 'Malzbier', sizes: ['0.3L'] },
    { key: 'apfelsaft', label: 'Apfelsaft', sizes: ['0.3L'] },
    { key: 'orangensaft', label: 'Orangensaft', sizes: ['0.3L'] },
    { key: 'maracuja', label: 'Maracuja', sizes: ['0.3L'] },
    { key: 'kaffee', label: 'Kaffee', sizes: ['0.3L'] },
    { key: 'espresso', label: 'Espresso', sizes: ['0.3L'] },
    { key: 'doubleespresso', label: 'Doppelter Espresso', sizes: ['0.3L'] },
    { key: 'chinatee', label: 'China Tee', sizes: ['0.3L'] },
    { key: 'grüneTee', label: 'Grüner Tee', sizes: ['0.3L'] },
    { key: 'rotWein', label: 'Rotwein', sizes: ['0.3L'] },
    { key: 'weissWein', label: 'Weisswein', sizes: ['0.3L'] },
      { key: 'reisschnaps', label: 'Reisschnaps', sizes: ['0.3L'] },
      { key: 'plumwine', label: 'Pflaumenwein', sizes: ['0.3L'] },
  ];

  readonly allSizeEntries: SizeEntry[] = [
    { sizeKey: '03', size: '0.3L', label: '0.3L' },
    { sizeKey: '05', size: '0.5L', label: '0.5L' },
    { sizeKey: '075', size: '0.75L', label: '0.75L' },
  ];

  readonly drinkCategories: DrinkCategory[] = [
    { key: 'softdrinks', label: 'Softdrinks',      icon: 'bi-cup-straw',    drinkKeys: ['apple','sprite', 'cola', 'colaZero', 'spezi', 'fanta', 'lemon', 'gingerAle', 'malzbier'] },
    { key: 'bier',       label: 'Bier',             icon: 'bi-cup-fill',     drinkKeys: ['pils', 'alcPils', 'weizen', 'alcWeizen', 'krefelder', 'altBier', 'radler', 'alster'] },
    { key: 'saefte',     label: 'Säfte',            icon: 'bi-droplet-fill', drinkKeys: ['apfelsaft', 'orangensaft', 'maracuja'] },
    { key: 'wasser',     label: 'Wasser',            icon: 'bi-droplet-half', drinkKeys: ['wasserstill', 'wassersprudel'] },
    { key: 'wein',       label: 'Wein & Schnaps',   icon: 'bi-stars',        drinkKeys: ['rotWein', 'weissWein', 'reisschnaps', 'plumwine'] },
    { key: 'warm',       label: 'Kaffee und Tee',      icon: 'bi-cup-hot-fill', drinkKeys: ['kaffee', 'espresso', 'doubleespresso', 'chinatee', 'grüneTee'] },
  ];

  private readonly openCategory = signal<string | null>(null);

  isCategoryOpen(key: string): boolean {
    return this.openCategory() === key;
  }

  toggleCategory(key: string): void {
    this.openCategory.update((current) => (current === key ? null : key));
  }

  getCategoryOptions(category: DrinkCategory): DrinkOption[] {
    return this.drinkOptions.filter((o) => category.drinkKeys.includes(o.key));
  }

  getCategoryTotal(category: DrinkCategory): number {
    let total = 0;
    for (const opt of this.drinkOptions.filter((o) => category.drinkKeys.includes(o.key))) {
      for (const se of this.allSizeEntries) {
        if (!opt.sizes.includes(se.size)) continue;
        const confirmed = this.getConfirmedCount(opt.key, se.size);
        const isChecked = Boolean(this.form.get(`${opt.key}${se.sizeKey}`)?.value);
        const newCount = Number(this.form.get(`${opt.key}${se.sizeKey}Count`)?.value || 0);
        total += confirmed + (isChecked ? newCount : 0);
      }
    }
    return total;
  }

  readonly tableNumbers = Array.from({ length: 25 }, (_, i) => i + 1);

  readonly form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.createForm();

    effect(() => {
      this.applyOrderToForm(this.orderToEdit());
    });
  }

  // ── Template helpers ──────────────────────────────────────

  getConfirmedCount(optionKey: string, size: '0.3L' | '0.5L' | '0.75L'): number {
    const label = this.drinkOptions.find((o) => o.key === optionKey)?.label ?? '';
    return this.getConfirmedDrinkQuantity(this.orderToEdit(), label, size);
  }

  getSizesForOption(option: DrinkOption): SizeEntry[] {
    return this.allSizeEntries.filter((s) => option.sizes.includes(s.size));
  }

  get drinkSummary(): string {
    const parts: string[] = [];
    for (const opt of this.drinkOptions) {
      for (const { sizeKey, size } of this.allSizeEntries) {
        if (!opt.sizes.includes(size)) continue;
        const confirmed = this.getConfirmedCount(opt.key, size);
        const isChecked = Boolean(this.form.get(`${opt.key}${sizeKey}`)?.value);
        const newCount = Number(this.form.get(`${opt.key}${sizeKey}Count`)?.value || 0);
        const total = confirmed + (isChecked ? newCount : 0);
        if (total > 0) parts.push(`${total}× ${opt.label} ${size}`);
      }
    }
    if (parts.length === 0) return 'Noch keine Getränke gewählt';
    if (parts.length <= 2) return parts.join(', ');
    return `${parts.length} Positionen ausgewählt`;
  }

  get tableLabel(): string {
    return `Tisch ${Number(this.form.get('tableNumber')?.value) || 1}`;
  }

  // ── Stepper interactions ──────────────────────────────────

  increment(countKey: string, checkboxKey: string): void {
    const count = this.form.get(countKey);
    const check = this.form.get(checkboxKey);
    if (!count) return;
    count.setValue((Number(count.value) || 0) + 1);
    check?.setValue(true);
  }

  decrement(countKey: string, checkboxKey: string): void {
    const count = this.form.get(countKey);
    const check = this.form.get(checkboxKey);
    if (!count) return;
    const next = Math.max(0, (Number(count.value) || 0) - 1);
    count.setValue(next);
    if (next === 0) check?.setValue(false);
  }

  incrementService(key: 'buffetCount' | 'carteCount'): void {
    const ctrl = this.form.get(key);
    if (!ctrl) return;
    ctrl.setValue(Math.max(1, (Number(ctrl.value) || 1) + 1));
  }

  decrementService(key: 'buffetCount' | 'carteCount'): void {
    const ctrl = this.form.get(key);
    if (!ctrl) return;
    ctrl.setValue(Math.max(1, (Number(ctrl.value) || 1) - 1));
  }

  toggleService(service: 'buffet' | 'carte'): void {
    const ctrl = this.form.get(service);
    if (ctrl) ctrl.setValue(!ctrl.value);
  }

  // ── Public actions ────────────────────────────────────────

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
      this.addDrinkBySize(drinks, option, '0.75L', '075', existingOrder);
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

  // ── Private helpers ───────────────────────────────────────

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
          [`${option.key}075`, false],
          [`${option.key}03Count`, 0],
          [`${option.key}05Count`, 0],
          [`${option.key}075Count`, 0],
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

          const confirmed03 = this.getConfirmedDrinkQuantity(order, option.label, '0.3L');
          const confirmed05 = this.getConfirmedDrinkQuantity(order, option.label, '0.5L');
          const confirmed075 = this.getConfirmedDrinkQuantity(order, option.label, '0.75L');
          const new03 = this.getNewDrinkQuantity(drinksForOption, '0.3L');
          const new05 = this.getNewDrinkQuantity(drinksForOption, '0.5L');
          const new075 = this.getNewDrinkQuantity(drinksForOption, '0.75L');

          return [
            [`${option.key}03`, confirmed03 > 0 || new03 > 0],
            [`${option.key}05`, confirmed05 > 0 || new05 > 0],
            [`${option.key}075`, confirmed075 > 0 || new075 > 0],
            [`${option.key}03Count`, new03],
            [`${option.key}05Count`, new05],
            [`${option.key}075Count`, new075],
          ];
        }),
      ),
    };

    this.form.reset(values);
  }

  private addDrinkBySize(
    drinks: OrderDrink[],
    option: DrinkOption,
    size: '0.3L' | '0.5L' | '0.75L',
    sizeKey: '03' | '05' | '075',
    existingOrder: OrderDraft | null,
  ): void {
    const confirmedQuantity = this.getConfirmedDrinkQuantity(existingOrder, option.label, size);
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

  private getItemStatus(
    existingQuantity: number,
    existingStatus: OrderItemStatus | undefined,
    selectedQuantity: number,
  ): OrderItemStatus {
    return existingStatus === 'confirmed' && selectedQuantity <= existingQuantity
      ? 'confirmed'
      : 'new';
  }

  private getNewDrinkQuantity(drinks: OrderDrink[], size: '0.3L' | '0.5L' | '0.75L'): number {
    return drinks
      .filter((d) => d.size === size && d.status === 'new')
      .reduce((sum, d) => sum + d.quantity, 0);
  }

  private getConfirmedDrinkQuantity(
    order: OrderDraft | null,
    drinkName: string,
    size: '0.3L' | '0.5L' | '0.75L',
  ): number {
    return (
      order?.drinks
        .filter((d) => d.name === drinkName && d.size === size && d.status === 'confirmed')
        .reduce((sum, d) => sum + d.quantity, 0) ?? 0
    );
  }
}
