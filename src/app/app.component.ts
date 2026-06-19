import { ChangeDetectionStrategy, Component, OnDestroy, afterNextRender, computed, inject, signal, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { TranslationService } from './i18n/translation.service';
import { BetriebsurlaubModalComponent } from './betriebsurlaub-modal/betriebsurlaub-modal.component';
import { ScrollRevealDirective } from './directives/scroll-reveal.directive';

type NavView = 'menu' | 'orders' | 'takeaway' | 'anfahrt';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, RouterLink, BetriebsurlaubModalComponent, ScrollRevealDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
  private readonly router = inject(Router);
  readonly ts = inject(TranslationService);

  // ── Slideshow-Steuerung ───────────────────────────────────
  readonly slideIndexes = [0, 1, 2, 3, 4];
  readonly currentSlide = signal(0);
  private slideTimer: ReturnType<typeof setInterval> | null = null;
  private slidePaused = false;

  constructor() {
    // Nur im Browser: Auto-Wechsel starten (außer bei "Reduced Motion")
    afterNextRender(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced) {
        this.slideTimer = setInterval(() => {
          if (!this.slidePaused) {
            this.currentSlide.update((i) => (i + 1) % this.slideIndexes.length);
          }
        }, 6000);
      }
    });
  }

  goToSlide(i: number): void {
    this.currentSlide.set(i);
  }

  pauseSlideshow(): void {
    this.slidePaused = true;
  }

  resumeSlideshow(): void {
    this.slidePaused = false;
  }

  ngOnDestroy(): void {
    if (this.slideTimer) clearInterval(this.slideTimer);
  }

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  readonly isInternRoute = computed(() => this.currentUrl().startsWith('/intern'));


  readonly activeView = computed<string | null>(() => {
    const url = this.currentUrl();
    if (url.startsWith('/menu'))        return 'menu';
    if (url.startsWith('/orders'))      return 'orders';
    if (url.startsWith('/takeaway'))    return 'takeaway';
    if (url.startsWith('/anfahrt'))     return 'anfahrt';
    if (url.startsWith('/impressum'))   return 'impressum';
    if (url.startsWith('/datenschutz')) return 'datenschutz';
    return null;
  });

  selectView(view: NavView): void {
    this.router.navigate([view]);
    if (typeof window !== 'undefined') {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 20);
    }
  }

  goHome(): void {
    this.router.navigate(['']);
  }

  // ── Back-to-Top ───────────────────────────────────────────
  readonly showBackToTop = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showBackToTop.set(window.scrollY > 300);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
