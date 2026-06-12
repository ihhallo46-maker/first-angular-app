import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { menuData, type MenuItem } from './menu-data';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  readonly menuData = menuData;
  readonly searchTerm = signal('');
  readonly openSectionTitle = signal<string | null>(null);

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

  isSectionOpen(title: string): boolean {
    // During search all matching sections are always visible
    if (this.searchTerm().trim()) return true;
    return this.openSectionTitle() === title;
  }

  toggleSection(title: string): void {
    if (this.searchTerm().trim()) return;
    this.openSectionTitle.update((current) => (current === title ? null : title));
  }

  search(value: string): void {
    this.searchTerm.set(value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  printMenu(): void {
    window.print();
  }

  private matchesSearch(item: MenuItem, term: string): boolean {
    const haystack = [item.name, item.description ?? '', item.price].join(' ').toLowerCase();
    return haystack.includes(term);
  }
}
