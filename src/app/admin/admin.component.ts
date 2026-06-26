import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService, type MenuCategory } from '../../service/menu.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  readonly menu = inject(MenuService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Lokale Arbeitskopie zum Bearbeiten */
  readonly draft = signal<MenuCategory[]>([]);
  readonly savingId = signal<string | null>(null);
  readonly busy = signal(false);
  private initialized = false;

  constructor() {
    // Arbeitskopie aus den Live-Daten erzeugen (und nach strukturellen Änderungen neu)
    effect(() => {
      const cats = this.menu.categories();
      if (!this.initialized) {
        this.draft.set(structuredClone(cats) as MenuCategory[]);
        if (this.menu.loaded()) this.initialized = true;
      }
    });
  }

  // ── Gerichte ──────────────────────────────────────────────
  addItem(cat: MenuCategory): void {
    cat.items.push({ name: '', price: '', description: '' });
    this.draft.set([...this.draft()]);
  }

  removeItem(cat: MenuCategory, index: number): void {
    cat.items.splice(index, 1);
    this.draft.set([...this.draft()]);
  }

  // ── Kategorien ────────────────────────────────────────────
  async addCategory(): Promise<void> {
    this.busy.set(true);
    await this.menu.addCategory('Neue Kategorie');
    this.initialized = false;
    this.busy.set(false);
  }

  async saveCategory(cat: MenuCategory): Promise<void> {
    this.savingId.set(cat.id ?? cat.title);
    const cleaned: MenuCategory = {
      ...cat,
      title: cat.title.trim() || 'Ohne Titel',
      items: cat.items
        .filter((it) => it.name.trim() || it.price.trim())
        .map((it) => ({
          name: it.name.trim(),
          price: it.price.trim(),
          ...(it.description?.trim() ? { description: it.description.trim() } : {}),
        })),
    };
    await this.menu.saveCategory(cleaned);
    this.savingId.set(null);
  }

  async deleteCategory(cat: MenuCategory): Promise<void> {
    if (!cat.id) return;
    if (!confirm(`Kategorie „${cat.title}" mit allen Gerichten wirklich löschen?`)) return;
    this.busy.set(true);
    await this.menu.deleteCategory(cat.id);
    this.initialized = false;
    this.busy.set(false);
  }

  async move(index: number, dir: -1 | 1): Promise<void> {
    const list = this.draft();
    const other = index + dir;
    if (other < 0 || other >= list.length) return;
    this.busy.set(true);
    await this.menu.swapOrder(list[index], list[other]);
    this.initialized = false;
    this.busy.set(false);
  }

  async seed(): Promise<void> {
    this.busy.set(true);
    await this.menu.seedFromStatic();
    this.initialized = false;
    this.busy.set(false);
  }

  // ── Navigation ────────────────────────────────────────────
  backToMenu(): void {
    this.router.navigate(['/menu']);
  }
}
