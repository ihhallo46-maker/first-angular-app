import { computed, inject, Injectable } from '@angular/core';
import { TranslationService } from '../i18n/translation.service';

@Injectable({ providedIn: 'root' })
export class BetriebsurlaubService {
  private readonly ts = inject(TranslationService);

  // ── Zeitraum hier konfigurieren ────────────────────────
  readonly start = new Date('2027-03-22');
  readonly end   = new Date('2027-04-03');
  readonly reopen = new Date(this.end.getTime() + 24 * 60 * 60 * 1000);

  readonly isActive: boolean = new Date() >= this.start && new Date() <= this.end;

  readonly formattedStart = computed(() => this.fmt(this.start));
  readonly formattedEnd   = computed(() => this.fmt(this.end));
  readonly formattedOpen  = computed(() => this.fmt(this.reopen));

  private fmt(d: Date): string {
    const lang   = this.ts.currentLang();
    const locale = lang === 'zh' ? 'zh-CN' : lang === 'en' ? 'en-GB' : 'de-DE';
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(d);
  }
}
