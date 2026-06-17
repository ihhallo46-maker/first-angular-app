import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslationService } from '../i18n/translation.service';
import { BetriebsurlaubService } from './betriebsurlaub.service';

@Component({
  selector: 'app-betriebsurlaub-modal',
  standalone: true,
  templateUrl: './betriebsurlaub-modal.component.html',
  styleUrl: './betriebsurlaub-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetriebsurlaubModalComponent {
  readonly ts      = inject(TranslationService);
  readonly betrieb = inject(BetriebsurlaubService);

  readonly formattedStart = this.betrieb.formattedStart;
  readonly formattedEnd   = this.betrieb.formattedEnd;
  readonly formattedOpen  = this.betrieb.formattedOpen;

  private readonly dismissed = signal(
    typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('dk-betrieb-dismissed') === '1'
      : false,
  );

  readonly show = computed(() =>
    this.betrieb.isActive && !this.dismissed(),
  );

  dismiss(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('dk-betrieb-dismissed', '1');
    }
    this.dismissed.set(true);
  }
}
