import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslationService } from '../i18n/translation.service';

const PLACE_QUERY   = 'Duck+House+Chinesisches+Restaurant,+Harpener+Hellweg+211a,+44805+Bochum';
const PLACE_ENCODED = encodeURIComponent('Duck House Chinesisches Restaurant, Harpener Hellweg 211a, 44805 Bochum');

@Component({
  selector: 'app-anfahrt',
  standalone: true,
  templateUrl: './anfahrt.component.html',
  styleUrl:    './anfahrt.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnfahrtComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly ts = inject(TranslationService);

  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://maps.google.com/maps?q=${PLACE_QUERY}&output=embed&hl=de&z=17`,
  );

  readonly directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${PLACE_ENCODED}&travelmode=driving`;

  readonly mapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${PLACE_ENCODED}`;
}
