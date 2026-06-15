import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Interner Bereich: nur im Browser rendern (Firebase Auth + Firestore)
  { path: 'orders', renderMode: RenderMode.Client },
  { path: 'intern', renderMode: RenderMode.Client },
  // Öffentliche Seiten: vorrendern (gut für SEO/Ladezeit)
  { path: '**', renderMode: RenderMode.Prerender },
];
