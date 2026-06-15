import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // Warten bis Firebase den Login-Status nach dem Neuladen wiederhergestellt hat
  await auth.ready;

  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(['/intern']);
};
