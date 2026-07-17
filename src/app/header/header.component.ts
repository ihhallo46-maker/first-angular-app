import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TranslationService } from '../i18n/translation.service';
import { type Lang } from '../i18n/translations';
import { BetriebsurlaubService } from '../betriebsurlaub-modal/betriebsurlaub.service';

type View = 'menu' | 'orders' | 'takeaway' | 'anfahrt';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly auth    = inject(AuthService);
  readonly ts      = inject(TranslationService);
  readonly betrieb = inject(BetriebsurlaubService);
  private  readonly router  = inject(Router);

  private tapCount = 0;
  private tapTimer: ReturnType<typeof setTimeout> | null = null;

  readonly activeView   = input<string | null>(null);
  readonly viewSelected = output<View>();
  readonly homeClicked  = output<void>();

  readonly isLangOpen       = signal(false);
  readonly showLogoutConfirm = signal(false);

  private readonly today = signal(new Date());

  readonly isTuesday = computed(() => this.today().getDay() === 2);

  readonly isOpen = computed(() => {
    const d = this.today();
    if (d.getDay() === 2) return false;
    const mins = d.getHours() * 60 + d.getMinutes();
    return (mins >= 12 * 60 && mins < 15 * 60) || (mins >= 17 * 60 + 30 && mins < 22 * 60);
  });

  readonly formattedDate = computed(() => {
    const d      = this.today();
    const locale = this.ts.currentLang() === 'zh' ? 'zh-CN' : this.ts.currentLang() === 'en' ? 'en-GB' : 'de-DE';
    const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(d);
    const date    = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
    return `${weekday} · ${date}`.toUpperCase();
  });

  readonly langFlags: Record<Lang, string> = { de: '🇩🇪', en: '🇬🇧', zh: '🇨🇳' };
  readonly langLabels: Record<Lang, string> = { de: 'DE', en: 'EN', zh: '中文' };

  select(view: View): void {
    this.closeNav();
    this.viewSelected.emit(view);
  }

  goHome(): void {
    this.closeNav();
    this.homeClicked.emit();
  }

  logoTap(): void {
    if (this.activeView() !== null) {
      this.tapCount = 0;
      return;
    }
    this.tapCount++;
    if (this.tapTimer) clearTimeout(this.tapTimer);
    if (this.tapCount >= 10) {
      this.tapCount = 0;
      void this.router.navigate(['/intern']);
      return;
    }
    this.tapTimer = setTimeout(() => { this.tapCount = 0; }, 2000);
  }

  logout(): void         { this.showLogoutConfirm.set(true); }
  cancelLogout(): void   { this.showLogoutConfirm.set(false); }
  confirmLogout(): void  { this.showLogoutConfirm.set(false); void this.auth.logout(); }
  toggleLang(): void     { this.isLangOpen.update(v => !v); }

  setLang(lang: Lang): void {
    this.ts.setLang(lang);
    this.isLangOpen.set(false);
  }

  private closeNav(): void {
    const el = document.getElementById('navMain');
    if (el) {
      const bsCollapse = (window as any).bootstrap?.Collapse?.getInstance(el);
      bsCollapse?.hide();
    }
  }
}
