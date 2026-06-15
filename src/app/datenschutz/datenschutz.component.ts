import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslationService } from '../i18n/translation.service';

@Component({
  selector: 'app-datenschutz',
  standalone: true,
  templateUrl: './datenschutz.component.html',
  styleUrl: './datenschutz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatenschutzComponent {
  readonly ts = inject(TranslationService);
}
