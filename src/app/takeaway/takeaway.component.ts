import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslationService } from '../i18n/translation.service';
import { BetriebsurlaubService } from '../betriebsurlaub-modal/betriebsurlaub.service';
import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';

@Component({
  selector: 'app-takeaway',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './takeaway.component.html',
  styleUrl: './takeaway.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakeawayComponent {
  readonly ts      = inject(TranslationService);
  readonly betrieb = inject(BetriebsurlaubService);
}
