import { Injectable, inject, signal } from '@angular/core';
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

  private readonly _authenticated = signal(false);
  readonly isAuthenticated = this._authenticated.asReadonly();

  constructor() {
    // Firebase prüft automatisch ob der User eingeloggt ist (auch nach Reload)
    onAuthStateChanged(this.firebaseAuth, (user) => {
      this._authenticated.set(!!user);
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
