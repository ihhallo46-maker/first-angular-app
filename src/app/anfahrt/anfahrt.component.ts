import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// ─── Google Maps API-Schlüssel ────────────────────────────────────────────────
// Erstelle einen Schlüssel unter: https://console.cloud.google.com/
// Aktiviere "Maps Embed API" und trage den Schlüssel hier ein:
const GOOGLE_MAPS_API_KEY = '';

const ADDRESS = 'Harpener+Hellweg+211a,+44805+Bochum,+Deutschland';

@Component({
  selector: 'app-anfahrt',
  standalone: true,
  templateUrl: './anfahrt.component.html',
  styleUrl:    './anfahrt.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnfahrtComponent {
  private readonly sanitizer = inject(DomSanitizer);

  // Wenn kein API-Key → einfacher Embed (kein Key nötig)
  // Wenn API-Key vorhanden → offizielle Maps Embed API
  readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    GOOGLE_MAPS_API_KEY
      ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${ADDRESS}&zoom=16&language=de`
      : `https://maps.google.com/maps?q=${ADDRESS}&output=embed&hl=de&z=16`,
  );

  readonly directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${ADDRESS}`;

  readonly mapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${ADDRESS}`;
}
