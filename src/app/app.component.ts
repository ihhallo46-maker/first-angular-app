import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { TranslationService } from './i18n/translation.service';

type NavView = 'menu' | 'orders' | 'takeaway' | 'anfahrt';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly router = inject(Router);
  readonly ts = inject(TranslationService);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

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
}
