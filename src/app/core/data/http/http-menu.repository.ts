import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuRepository } from '../menu.repository';
import { MenuCategory } from '../../models/menu.model';

// Basis-URL des späteren Python-Backends (z. B. FastAPI/Flask).
const API = '/api/menu';

/**
 * PLATZHALTER für ein späteres Python-Backend (REST/HTTP).
 * NOCH NICHT AKTIV.
 *
 * Umstellen später in `app.config.ts`:
 *   { provide: MenuRepository, useClass: HttpMenuRepository }
 * (statt der Firebase-Variante) und `provideHttpClient()` ergänzen.
 *
 * Erwartete Endpunkte auf der Python-Seite:
 *   GET    /api/menu              → Live-Kategorien
 *   GET    /api/menu/draft        → Entwurf
 *   PUT    /api/menu/draft/:id    → Kategorie speichern
 *   DELETE /api/menu/draft/:id    → Kategorie löschen
 *   POST   /api/menu/publish      → Entwurf live schalten
 */
@Injectable()
export class HttpMenuRepository extends MenuRepository {
  private readonly http = inject(HttpClient);

  private readonly _categories = signal<MenuCategory[]>([]);
  readonly categories = this._categories.asReadonly();
  readonly loaded = signal(false);

  private readonly _draft = signal<MenuCategory[]>([]);
  readonly draftCategories = this._draft.asReadonly();
  readonly draftLoaded = signal(false);

  constructor() {
    super();
    // So würde die Live-Karte vom Python-Backend kommen:
    this.http.get<MenuCategory[]>(API).subscribe({
      next: (data) => { this._categories.set(data); this.loaded.set(true); },
      error: () => this.loaded.set(true),
    });
  }

  startDraft(): void {
    this.http.get<MenuCategory[]>(`${API}/draft`).subscribe({
      next: (data) => { this._draft.set(data); this.draftLoaded.set(true); },
      error: () => this.draftLoaded.set(true),
    });
  }

  async saveDraftCategory(cat: MenuCategory): Promise<void> {
    void cat; // TODO: PUT /api/menu/draft/:id
    throw new Error('HttpMenuRepository: noch nicht implementiert (Python-Backend).');
  }

  async deleteDraftCategory(id: string): Promise<void> {
    void id; // TODO: DELETE /api/menu/draft/:id
    throw new Error('HttpMenuRepository: noch nicht implementiert (Python-Backend).');
  }

  async addDraftCategory(title: string): Promise<string> {
    void title; // TODO: POST /api/menu/draft
    throw new Error('HttpMenuRepository: noch nicht implementiert (Python-Backend).');
  }

  async swapDraftOrder(a: MenuCategory, b: MenuCategory): Promise<void> {
    void a; void b; // TODO: zwei PUTs
    throw new Error('HttpMenuRepository: noch nicht implementiert (Python-Backend).');
  }

  async ensureDraftCopy(): Promise<void> {
    throw new Error('HttpMenuRepository: noch nicht implementiert (Python-Backend).');
  }

  async resetDraftFromLive(): Promise<void> {
    throw new Error('HttpMenuRepository: noch nicht implementiert (Python-Backend).');
  }

  async publish(): Promise<void> {
    // TODO: POST /api/menu/publish
    throw new Error('HttpMenuRepository: noch nicht implementiert (Python-Backend).');
  }

  async seedFromStatic(): Promise<void> {
    throw new Error('HttpMenuRepository: noch nicht implementiert (Python-Backend).');
  }
}
