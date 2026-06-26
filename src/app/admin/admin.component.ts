import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService, type MenuCategory } from '../../service/menu.service';

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
  private readonly router = inject(Router);

  /** Lokale Arbeitskopie zum Bearbeiten */
  readonly draft = signal<MenuCategory[]>([]);
  readonly savingId = signal<string | null>(null);
  readonly busy = signal(false);
  readonly activeCat = signal<string>('');
  private initialized = false;
  private rafPending = false;
  private spyLocked = false;
  private unlockTimer?: ReturnType<typeof setTimeout>;

  /** Live-Statistik für den Hero-Kopf */
  readonly categoryCount = computed(() => this.menu.categories().length);
  readonly dishCount = computed(() =>
    this.menu.categories().reduce((sum, c) => sum + (c.items?.length ?? 0), 0),
  );

  constructor() {
    // Arbeitskopie aus den Live-Daten erzeugen (und nach strukturellen Änderungen neu)
    effect(() => {
      const cats = this.menu.categories();
      if (!this.initialized) {
        this.draft.set(structuredClone(cats) as MenuCategory[]);
        if (this.menu.loaded()) this.initialized = true;
      }
    });
    afterNextRender(() => this.updateActiveCat());
  }

  /** Stabile Sprung-ID je Kategorie */
  catId(cat: MenuCategory, index: number): string {
    return 'cat-' + (cat.id ?? 'n' + index);
  }

  /** Zur Kategorie springen (Klick in der Leiste) */
  scrollToCategory(cat: MenuCategory, index: number): void {
    const id = this.catId(cat, index);
    this.activeCat.set(id);
    if (typeof document === 'undefined') return;
    this.spyLocked = true;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.armSpyUnlock();
  }

  // ── Scroll-Spy ────────────────────────────────────────────
  @HostListener('window:scroll') onScroll(): void { this.scheduleSpy(); }
  @HostListener('window:resize') onResize(): void { this.scheduleSpy(); }

  private scheduleSpy(): void {
    if (this.rafPending || typeof window === 'undefined') return;
    this.rafPending = true;
    requestAnimationFrame(() => { this.rafPending = false; this.updateActiveCat(); });
  }

  private updateActiveCat(): void {
    if (typeof document === 'undefined' || this.spyLocked) return;
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.cat-card'));
    if (cards.length === 0) return;
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    let current = cards[0].id;
    if (atBottom) {
      current = cards[cards.length - 1].id;
    } else {
      const offset = 134;
      for (const c of cards) {
        if (c.getBoundingClientRect().top <= offset) current = c.id;
        else break;
      }
    }
    if (current && current !== this.activeCat()) this.activeCat.set(current);
  }

  private armSpyUnlock(): void {
    if (typeof window === 'undefined') return;
    if (this.unlockTimer) clearTimeout(this.unlockTimer);
    const onEnd = () => {
      window.removeEventListener('scrollend', onEnd);
      if (this.unlockTimer) clearTimeout(this.unlockTimer);
      this.spyLocked = false;
    };
    window.addEventListener('scrollend', onEnd, { once: true });
    this.unlockTimer = setTimeout(() => {
      window.removeEventListener('scrollend', onEnd);
      this.spyLocked = false;
    }, 1600);
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
    // Neue Kategorie steht jetzt oben → dorthin scrollen
    if (typeof document !== 'undefined') {
      setTimeout(
        () => document.querySelector('.cat-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        180,
      );
    }
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
