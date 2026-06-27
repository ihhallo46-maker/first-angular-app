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
import { MenuService } from '../../service/menu.service';
import { AuthService } from '../auth/auth.service';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';

interface MenuSectionView {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  imports: [RouterLink, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  readonly auth    = inject(AuthService);
  readonly ts   = inject(TranslationService);
  readonly menu = inject(MenuService);
  readonly searchTerm = signal('');
  readonly activeSection = signal<string>('');

  private rafPending = false;
  private spyLocked = false;
  private unlockTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    afterNextRender(() => this.updateActiveSection());
  }

  /** Quelle: Firestore-Kategorien; Fallback auf statische Karte, solange die DB leer ist */
  private readonly sections = computed<MenuSectionView[]>(() => {
    const db = this.menu.categories();
    if (db.length > 0) {
      return db.map((c) => ({ title: c.title, items: c.items }));
    }
    return menuData.sections.map((s) => ({ title: s.title, items: s.items }));
  });

  readonly totalCategories = computed(() => this.sections().length);

  readonly filteredSections = computed<MenuSectionView[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.sections();
    return this.sections()
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
    this.sections().reduce((sum, s) => sum + s.items.length, 0),
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
    // Scroll-Spy sperren, bis das Scrollen wirklich beendet ist
    this.spyLocked = true;
    this.centerActiveChip(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.armSpyUnlock();
  }

  /** Spy erst wieder freigeben, wenn das (sanfte) Scrollen zu Ende ist – ohne Neuauswertung */
  private armSpyUnlock(): void {
    if (typeof window === 'undefined') return;
    if (this.unlockTimer) clearTimeout(this.unlockTimer);

    const onEnd = () => {
      window.removeEventListener('scrollend', onEnd);
      if (this.unlockTimer) clearTimeout(this.unlockTimer);
      this.spyLocked = false;
    };
    window.addEventListener('scrollend', onEnd, { once: true });
    // Fallback, falls der Browser kein 'scrollend' kennt
    this.unlockTimer = setTimeout(() => {
      window.removeEventListener('scrollend', onEnd);
      this.spyLocked = false;
    }, 1600);
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
    if (this.spyLocked) return; // nach Klick gesperrt bis Scrollende

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

  editMenu(): void {
   console.log('Edit menu clicked');
  };

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
