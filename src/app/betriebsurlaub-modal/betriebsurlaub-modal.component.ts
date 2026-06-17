import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslationService } from '../i18n/translation.service';

@Component({
  selector: 'app-betriebsurlaub-modal',
  standalone: true,
  templateUrl: './betriebsurlaub-modal.component.html',
  styleUrl: './betriebsurlaub-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetriebsurlaubModalComponent {
  readonly ts = inject(TranslationService);

  // ── Betriebsurlaub-Zeitraum hier konfigurieren ─────────
  private readonly start = new Date('2026-06-14');
  private readonly end   = new Date('2026-07-15');

  private readonly dismissed = signal(
    typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('dk-betrieb-dismissed') === '1'
      : false,
  );

  readonly show = computed(() => {
    const now = new Date();
    return now >= this.start && now <= this.end && !this.dismissed();
  });

  readonly formattedStart = computed(() =>
    this.formatDate(this.start),
  );

  readonly formattedEnd = computed(() =>
    this.formatDate(this.end),
  );

  private readonly reopenDate = new Date(this.end.getTime() + 24 * 60 * 60 * 1000);

  readonly formattedOpen = computed(() =>
    this.formatDate(this.reopenDate),
  );

  dismiss(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('dk-betrieb-dismissed', '1');
    }
    this.dismissed.set(true);
  }

  private formatDate(d: Date): string {
    const lang   = this.ts.currentLang();
    const locale = lang === 'zh' ? 'zh-CN' : lang === 'en' ? 'en-GB' : 'de-DE';
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(d);
  }
}
