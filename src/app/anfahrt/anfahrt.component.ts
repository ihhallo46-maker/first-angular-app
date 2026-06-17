import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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

  // ── Öffnungsstatus (identisch zur Header-Logik) ──────────
  private readonly today = signal(new Date());

  readonly isTuesday = computed(() => this.today().getDay() === 2);

  readonly isOpen = computed(() => {
    const d = this.today();
    if (d.getDay() === 2) return false;
    const mins = d.getHours() * 60 + d.getMinutes();
    return (mins >= 12 * 60 && mins < 15 * 60) || (mins >= 17 * 60 + 30 && mins < 22 * 60);
  });
}
