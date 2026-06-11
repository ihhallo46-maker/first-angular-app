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
    if (haystack.includes(term)) return true;
    return this.fuzzyMatch(haystack, term);
  }

  private fuzzyMatch(haystack: string, term: string): boolean {
    let index = 0;
    for (const char of haystack) {
      if (char === term[index]) {
        index++;
        if (index === term.length) return true;
      }
    }
    return false;
  }
}
