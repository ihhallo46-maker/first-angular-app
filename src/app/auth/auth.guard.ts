import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // Warten bis Firebase den Login-Status nach dem Neuladen wiederhergestellt hat
  await auth.ready;

  if (auth.isAuthenticated()) return true;
  // Zielseite merken, damit der Login danach dorthin zurückführt
  return router.createUrlTree(['/intern'], { queryParams: { returnUrl: state.url } });
};
