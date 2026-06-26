import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { menuData, type MenuItem } from '../app/menu/menu-data';

export interface MenuCategory {
  id?: string;
  title: string;
  order: number;
  items: MenuItem[];
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly firestore = inject(Firestore);
  private readonly col = collection(this.firestore, 'menu');

  private readonly _categories = signal<MenuCategory[]>([]);
  /** Live-Kategorien aus Firestore (nach `order` sortiert) */
  readonly categories = this._categories.asReadonly();
  /** true, sobald der erste Firestore-Snapshot da war */
  readonly loaded = signal(false);

  constructor() {
    // Nur im Browser abonnieren – beim Prerendering greift der statische Fallback (SEO bleibt)
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const q = query(this.col, orderBy('order'));
    collectionData(q, { idField: 'id' }).subscribe({
      next: (data) => {
        this._categories.set(data as MenuCategory[]);
        this.loaded.set(true);
      },
      error: (err) => {
        console.error('[MenuService] Firestore-Lesefehler:', err);
        this.loaded.set(true);
      },
    });
  }

  /** Kategorie anlegen oder aktualisieren */
  async saveCategory(cat: MenuCategory): Promise<void> {
    const id = cat.id ?? doc(this.col).id;
    const payload = { title: cat.title, order: cat.order, items: cat.items };
    await setDoc(doc(this.col, id), payload);
  }

  async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(this.col, id));
  }

  /** Neue, leere Kategorie ans Ende anhängen */
  async addCategory(title: string): Promise<void> {
    const maxOrder = this._categories().reduce((m, c) => Math.max(m, c.order), -1);
    await this.saveCategory({ title, order: maxOrder + 1, items: [] });
  }

  /** Zwei Kategorien in der Reihenfolge tauschen */
  async swapOrder(a: MenuCategory, b: MenuCategory): Promise<void> {
    await Promise.all([
      this.saveCategory({ ...a, order: b.order }),
      this.saveCategory({ ...b, order: a.order }),
    ]);
  }

  /** Einmaliger Import der bestehenden (statischen) Karte – nur wenn die DB leer ist */
  async seedFromStatic(): Promise<void> {
    let order = 0;
    for (const s of menuData.sections) {
      const id = doc(this.col).id;
      await setDoc(doc(this.col, id), { title: s.title, order: order++, items: s.items });
    }
  }
}
