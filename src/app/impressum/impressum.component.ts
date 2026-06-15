import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslationService } from '../i18n/translation.service';

@Component({
  selector: 'app-impressum',
  standalone: true,
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImpressumComponent {
  readonly ts = inject(TranslationService);
}
