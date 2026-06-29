import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

// Daten-Schicht: Vertrag + aktive Implementierung.
// Heute Firebase. Für ein Python-Backend später einfach die useClass-Zeilen
// auf die Http*-Variante umstellen (und provideHttpClient() ergänzen).
import { MenuRepository } from './core/data/menu.repository';
import { OrdersRepository } from './core/data/orders.repository';
import { FirebaseMenuRepository } from './core/data/firebase/firebase-menu.repository';
import { FirebaseOrdersRepository } from './core/data/firebase/firebase-orders.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),

    // ── Daten-Schicht (heute Firebase) ──────────────────────
    { provide: MenuRepository, useClass: FirebaseMenuRepository },
    { provide: OrdersRepository, useClass: FirebaseOrdersRepository },
  ],
};
