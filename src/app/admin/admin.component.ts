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

  /** Lokale Arbeitskopie (Entwurf) */
  readonly draft = signal<MenuCategory[]>([]);
  readonly savingId = signal<string | null>(null);
  readonly busy = signal(false);
  readonly publishing = signal(false);
  readonly published = signal(false);
  readonly deleteTarget = signal<MenuCategory | null>(null);
  readonly activeCat = signal<string>('');

  private initialized = false;
  private ensuring = false;
  private rafPending = false;
  private spyLocked = false;
  private unlockTimer?: ReturnType<typeof setTimeout>;

  readonly categoryCount = computed(() => this.draft().length);
  readonly dishCount = computed(() =>
    this.draft().reduce((sum, c) => sum + (c.items?.length ?? 0), 0),
  );

  constructor() {
    this.menu.startDraft();
    effect(() => {
      const d = this.menu.draftCategories();
      const dLoaded = this.menu.draftLoaded();
      if (this.initialized || !dLoaded) return;

      // Entwurf leer, aber Live vorhanden → einmalig eine Kopie anlegen
      if (d.length === 0 && this.menu.loaded() && this.menu.categories().length > 0) {
        if (!this.ensuring) {
          this.ensuring = true;
          void this.menu.ensureDraftCopy();
        }
        return;
      }
      this.draft.set(structuredClone(d) as MenuCategory[]);
      this.initialized = true;
    });
    afterNextRender(() => this.updateActiveCat());
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
    const id = await this.menu.addDraftCategory('Neue Kategorie');
    this.draft.set([{ id, title: 'Neue Kategorie', order: 0, items: [] }, ...this.draft()]);
    this.busy.set(false);
    if (typeof document !== 'undefined') {
      setTimeout(
        () => document.querySelector('.cat-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        120,
      );
    }
  }

  async saveCategory(cat: MenuCategory): Promise<void> {
    this.savingId.set(cat.id ?? cat.title);
    cat.title = cat.title.trim() || 'Ohne Titel';
    cat.items = cat.items
      .filter((it) => it.name.trim() || it.price.trim())
      .map((it) => ({
        name: it.name.trim(),
        price: it.price.trim(),
        ...(it.description?.trim() ? { description: it.description.trim() } : {}),
      }));
    this.draft.set([...this.draft()]);
    await this.menu.saveDraftCategory(cat);
    this.savingId.set(null);
  }

  // ── Löschen (mit Modal, optimistisch = schnell) ───────────
  askDelete(cat: MenuCategory): void {
    this.deleteTarget.set(cat);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  async confirmDelete(): Promise<void> {
    const cat = this.deleteTarget();
    this.deleteTarget.set(null);
    if (!cat?.id) return;
    // Sofort lokal entfernen → fühlt sich schnell an
    this.draft.set(this.draft().filter((c) => c.id !== cat.id));
    // Im Hintergrund aus dem Entwurf löschen
    await this.menu.deleteDraftCategory(cat.id);
  }

  async move(index: number, dir: -1 | 1): Promise<void> {
    const list = [...this.draft()];
    const other = index + dir;
    if (other < 0 || other >= list.length) return;
    const a = list[index];
    const b = list[other];
    const ao = a.order;
    a.order = b.order;
    b.order = ao;
    list[index] = b;
    list[other] = a;
    this.draft.set(list);
    await this.menu.saveDraftCategory(a);
    await this.menu.saveDraftCategory(b);
  }

  async seed(): Promise<void> {
    this.busy.set(true);
    await this.menu.seedFromStatic();
    await this.menu.ensureDraftCopy();
    this.initialized = false;
    this.busy.set(false);
  }

  // ── Veröffentlichen / Zurücksetzen ────────────────────────
  async publish(): Promise<void> {
    this.publishing.set(true);
    // Alle lokalen Stände in den Entwurf schreiben …
    for (const cat of this.draft()) {
      await this.menu.saveDraftCategory({
        ...cat,
        items: cat.items.filter((it) => it.name.trim() || it.price.trim()),
      });
    }
    // … und Entwurf live schalten
    await this.menu.publish();
    this.publishing.set(false);
    this.published.set(true);
    setTimeout(() => this.published.set(false), 2600);
  }

  async resetFromLive(): Promise<void> {
    if (!confirm('Entwurf verwerfen und den aktuellen Live-Stand laden?')) return;
    this.busy.set(true);
    await this.menu.resetDraftFromLive();
    this.initialized = false;
    this.busy.set(false);
  }

  // ── Navigation ────────────────────────────────────────────
  backToMenu(): void {
    this.router.navigate(['/menu']);
  }

  // ── Scroll-Spy / Seitenleiste ─────────────────────────────
  catId(cat: MenuCategory, index: number): string {
    return 'cat-' + (cat.id ?? 'n' + index);
  }

  scrollToCategory(cat: MenuCategory, index: number): void {
    const id = this.catId(cat, index);
    this.activeCat.set(id);
    if (typeof document === 'undefined') return;
    this.spyLocked = true;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.armSpyUnlock();
  }

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
      const offset = 110;
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
}
