import { Injectable, computed, signal } from '@angular/core';
import { type Dict, type Lang, translations } from './translations';

const STORAGE_KEY = 'duck-lang';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly currentLang = signal<Lang>(this.restore());

  readonly translator = computed<Dict>(() => translations[this.currentLang()]);
  readonly t = this.translator;

  setLang(lang: Lang): void {
    this.currentLang.set(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
  }

  private restore(): Lang {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved && saved in translations) return saved;
    } catch { /* ignore */ }
    return 'de';
  }
}
