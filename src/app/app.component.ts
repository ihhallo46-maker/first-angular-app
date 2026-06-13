import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { HeaderComponent } from './header/header.component';

type View = 'menu' | 'orders' | 'takeaway' | 'anfahrt';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  readonly activeView = computed<View | null>(() => {
    const url = this.currentUrl();
    if (url.startsWith('/menu'))     return 'menu';
    if (url.startsWith('/orders'))   return 'orders';
    if (url.startsWith('/takeaway')) return 'takeaway';
    if (url.startsWith('/anfahrt'))  return 'anfahrt';
    return null;
  });

  selectView(view: View): void {
    this.router.navigate([view]);
    if (typeof window !== 'undefined') {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 20);
    }
  }

  goHome(): void {
    this.router.navigate(['']);
  }
}
