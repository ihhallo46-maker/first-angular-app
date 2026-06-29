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
import { MenuRepository } from '../menu.repository';
import { MenuCategory } from '../../models/menu.model';
import { menuData } from '../../../menu/menu-data';

/**
 * Firebase/Firestore-Umsetzung des MenuRepository.
 * Hier (und nur hier) wird Firestore angesprochen.
 */
@Injectable()
export class FirebaseMenuRepository extends MenuRepository {
  private readonly firestore = inject(Firestore);
  private readonly liveCol = collection(this.firestore, 'menu'); // öffentlich/live
  private readonly draftCol = collection(this.firestore, 'menu_draft'); // Entwurf (intern)
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _categories = signal<MenuCategory[]>([]);
  readonly categories = this._categories.asReadonly();
  readonly loaded = signal(false);

  private readonly _draft = signal<MenuCategory[]>([]);
  readonly draftCategories = this._draft.asReadonly();
  readonly draftLoaded = signal(false);
  private draftStarted = false;

  constructor() {
    super();
    // Nur im Browser abonnieren – beim Prerendering greift der statische Fallback (SEO bleibt).
    if (!this.isBrowser) return;
    collectionData(query(this.liveCol, orderBy('order')), { idField: 'id' }).subscribe({
      next: (d) => { this._categories.set(d as MenuCategory[]); this.loaded.set(true); },
      error: (e) => { console.error('[Menu] live-Lesefehler:', e); this.loaded.set(true); },
    });
  }

  /** Entwurf-Collection erst im Admin abonnieren (öffentliche Seiten brauchen sie nicht). */
  startDraft(): void {
    if (this.draftStarted || !this.isBrowser) return;
    this.draftStarted = true;
    collectionData(query(this.draftCol, orderBy('order')), { idField: 'id' }).subscribe({
      next: (d) => { this._draft.set(d as MenuCategory[]); this.draftLoaded.set(true); },
      error: (e) => { console.error('[Menu] draft-Lesefehler:', e); this.draftLoaded.set(true); },
    });
  }

  // Nur die Felder speichern, die wir brauchen (kein 'id' im Dokument-Body).
  private clean(cat: MenuCategory) {
    return { title: cat.title, order: cat.order, items: cat.items };
  }

  async saveDraftCategory(cat: MenuCategory): Promise<void> {
    const id = cat.id ?? doc(this.draftCol).id;
    await setDoc(doc(this.draftCol, id), this.clean(cat));
  }

  async deleteDraftCategory(id: string): Promise<void> {
    await deleteDoc(doc(this.draftCol, id));
  }

  /** Neue, leere Kategorie ganz oben in den Entwurf. */
  async addDraftCategory(title: string): Promise<string> {
    const minOrder = this._draft().reduce((m, c) => Math.min(m, c.order), 0);
    const id = doc(this.draftCol).id;
    await setDoc(doc(this.draftCol, id), { title, order: minOrder - 1, items: [] });
    return id;
  }

  async swapDraftOrder(a: MenuCategory, b: MenuCategory): Promise<void> {
    await Promise.all([
      this.saveDraftCategory({ ...a, order: b.order }),
      this.saveDraftCategory({ ...b, order: a.order }),
    ]);
  }

  /** Entwurf mit einer Kopie der Live-Karte befüllen (gleiche IDs), wenn er leer ist. */
  async ensureDraftCopy(): Promise<void> {
    if (this._draft().length > 0) return;
    const live = this._categories();
    await Promise.all(live.map((c) => setDoc(doc(this.draftCol, c.id!), this.clean(c))));
  }

  /** Entwurf verwerfen und frische Kopie aus der Live-Karte ziehen. */
  async resetDraftFromLive(): Promise<void> {
    await Promise.all(this._draft().map((c) => deleteDoc(doc(this.draftCol, c.id!))));
    await Promise.all(
      this._categories().map((c) => setDoc(doc(this.draftCol, c.id!), this.clean(c))),
    );
  }

  /** Veröffentlichen: Entwurf → Live. */
  async publish(): Promise<void> {
    const draft = this._draft();
    const live = this._categories();
    const draftIds = new Set(draft.map((c) => c.id));
    // 1) Entwurf in Live schreiben (gleiche IDs)
    await Promise.all(draft.map((c) => setDoc(doc(this.liveCol, c.id!), this.clean(c))));
    // 2) Live-Kategorien entfernen, die im Entwurf gelöscht wurden
    await Promise.all(
      live.filter((c) => !draftIds.has(c.id)).map((c) => deleteDoc(doc(this.liveCol, c.id!))),
    );
  }

  /** Einmaliger Import der statischen Karte in die Live-Collection. */
  async seedFromStatic(): Promise<void> {
    let order = 0;
    for (const s of menuData.sections) {
      const id = doc(this.liveCol).id;
      await setDoc(doc(this.liveCol, id), { title: s.title, order: order++, items: s.items });
    }
  }
}
