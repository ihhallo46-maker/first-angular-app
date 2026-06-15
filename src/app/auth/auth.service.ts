import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly firebaseAuth = inject(Auth);
  private readonly router       = inject(Router);
  private readonly isBrowser    = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _authenticated = signal(false);
  readonly isAuthenticated = this._authenticated.asReadonly();

  // Wird aufgelöst, sobald Firebase den Login-Status das erste Mal kennt.
  readonly ready: Promise<void>;

  constructor() {
    this.ready = new Promise<void>((resolve) => {
      if (!this.isBrowser) { resolve(); return; }
      let first = true;
      // Firebase prüft automatisch ob der User eingeloggt ist (auch nach Reload)
      onAuthStateChanged(this.firebaseAuth, (user) => {
        this._authenticated.set(!!user);
        if (first) { first = false; resolve(); }
      });
    });
  }

  async login(email: string, password: string): Promise<'ok' | 'invalid'> {
    try {
      await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      return 'ok';
    } catch {
      return 'invalid';
    }
  }

  async logout(): Promise<void> {
    await signOut(this.firebaseAuth);
    void this.router.navigate(['/']);
  }
}
