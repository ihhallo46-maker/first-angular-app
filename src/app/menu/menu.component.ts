import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { menuData, type MenuItem } from './menu-data';
import { TranslationService } from '../i18n/translation.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  readonly ts       = inject(TranslationService);
  readonly menuData = menuData;
  readonly searchTerm = signal('');
  readonly activeSection = signal<string>('');

  private rafPending = false;
  private spyLockUntil = 0;

  constructor() {
    afterNextRender(() => this.updateActiveSection());
  }

  readonly filteredSections = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.menuData.sections;
    return this.menuData.sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => this.matchesSearch(item, term)),
      }))
      .filter((section) => section.items.length > 0);
  });

  readonly totalFilteredItems = computed(() =>
    this.filteredSections().reduce((sum, s) => sum + s.items.length, 0),
  );

  readonly totalItems = computed(() =>
    this.menuData.sections.reduce((sum, s) => sum + s.items.length, 0),
  );

  /** Eindeutige, sprungfähige ID aus dem Kategorietitel */
  sectionId(title: string): string {
    return 'sec-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  /** Zur Kategorie springen (Klick in der Navigation) */
  scrollToSection(title: string): void {
    const id = this.sectionId(title);
    this.activeSection.set(id);
    if (typeof document === 'undefined') return;
    // Scroll-Spy während des sanften Scrollens sperren → keine Flacker-Kaskade
    this.spyLockUntil = Date.now() + 900;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.centerActiveChip(id);
  }

  search(value: string): void {
    this.searchTerm.set(value);
    this.scheduleUpdate();
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.scheduleUpdate();
  }

  printMenu(): void {
    window.print();
  }

  // ── Scroll-Erkennung (welche Kategorie ist gerade oben?) ──
  @HostListener('window:scroll')
  onScroll(): void { this.scheduleUpdate(); }

  @HostListener('window:resize')
  onResize(): void { this.scheduleUpdate(); }

  private scheduleUpdate(): void {
    if (this.rafPending || typeof window === 'undefined') return;
    this.rafPending = true;
    requestAnimationFrame(() => {
      this.rafPending = false;
      this.updateActiveSection();
    });
  }

  private updateActiveSection(): void {
    if (typeof document === 'undefined') return;
    if (Date.now() < this.spyLockUntil) return; // nach Klick kurz gesperrt

    const sections = Array.from(document.querySelectorAll<HTMLElement>('.menu-section'));
    if (sections.length === 0) return;

    let current: string;
    // Am Seitenende immer die letzte Kategorie markieren (sonst nie erreichbar)
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) {
      current = sections[sections.length - 1].id;
    } else {
      // Höhe der klebenden Leisten (Nav + Suche [+ mobile Chip-Leiste])
      const offset = (window.innerWidth >= 992 ? 130 : 175) + 4;
      current = sections[0].id;
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= offset) current = s.id;
        else break;
      }
    }

    if (current && current !== this.activeSection()) {
      this.activeSection.set(current);
      this.centerActiveChip(current);
    }
  }

  /** Aktive Chip in der mobilen Leiste horizontal zentrieren */
  private centerActiveChip(id: string): void {
    if (typeof window === 'undefined' || window.innerWidth >= 992) return;
    const nav = document.querySelector('.menu-nav') as HTMLElement | null;
    const chip = document.querySelector(`[data-id="${id}"]`) as HTMLElement | null;
    if (!nav || !chip) return;
    const target = chip.offsetLeft - nav.clientWidth / 2 + chip.clientWidth / 2;
    nav.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }

  private matchesSearch(item: MenuItem, term: string): boolean {
    const haystack = [item.name, item.description ?? '', item.price].join(' ').toLowerCase();
    return haystack.includes(term);
  }
}
