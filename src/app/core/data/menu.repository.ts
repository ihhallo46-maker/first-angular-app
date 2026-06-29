import { Signal } from '@angular/core';
import { MenuCategory } from '../models/menu.model';

/**
 * Vertrag (Schnittstelle) für den Zugriff auf die Speisekarten-Daten.
 *
 * Die Komponenten kennen NUR diesen Vertrag – nicht Firebase.
 * Heute wird er von `FirebaseMenuRepository` erfüllt.
 * Später kann ein `HttpMenuRepository` (Python-Backend) dieselbe Klasse
 * erweitern, und man tauscht nur den Provider in `app.config.ts` aus.
 */
export abstract class MenuRepository {
  // ── Live-Speisekarte (öffentlich sichtbar) ────────────────
  abstract readonly categories: Signal<MenuCategory[]>;
  abstract readonly loaded: Signal<boolean>;

  // ── Entwurf (interne Arbeitskopie im Admin) ───────────────
  abstract readonly draftCategories: Signal<MenuCategory[]>;
  abstract readonly draftLoaded: Signal<boolean>;

  abstract startDraft(): void;
  abstract saveDraftCategory(cat: MenuCategory): Promise<void>;
  abstract deleteDraftCategory(id: string): Promise<void>;
  abstract addDraftCategory(title: string): Promise<string>;
  abstract swapDraftOrder(a: MenuCategory, b: MenuCategory): Promise<void>;
  abstract ensureDraftCopy(): Promise<void>;
  abstract resetDraftFromLive(): Promise<void>;
  abstract publish(): Promise<void>;
  abstract seedFromStatic(): Promise<void>;
}
