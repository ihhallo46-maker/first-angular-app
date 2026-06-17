import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslationService } from '../i18n/translation.service';
import { BetriebsurlaubService } from '../betriebsurlaub-modal/betriebsurlaub.service';

@Component({
  selector: 'app-takeaway',
  standalone: true,
  templateUrl: './takeaway.component.html',
  styleUrl: './takeaway.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakeawayComponent {
  readonly ts      = inject(TranslationService);
  readonly betrieb = inject(BetriebsurlaubService);
}
