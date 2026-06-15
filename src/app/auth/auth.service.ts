import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const PASS_HASH    = environment.adminPassHash;
const USERNAME     = 'admin';
const SESSION_KEY  = 'dh_session';
const LOCKOUT_KEY  = 'dh_lockout';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000; // 15 Minuten

interface LockoutData { until: number; attempts: number; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  private readonly _authenticated = signal(
    sessionStorage.getItem(SESSION_KEY) === '1',
  );
  readonly isAuthenticated = this._authenticated.asReadonly();

  private attempts     = 0;
  private lockoutUntil = 0;

  constructor() {
    try {
      const raw = sessionStorage.getItem(LOCKOUT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as LockoutData;
        this.attempts     = d.attempts;
        this.lockoutUntil = d.until;
      }
    } catch { /* sessionStorage nicht verfügbar */ }
  }

  get isLockedOut(): boolean {
    return Date.now() < this.lockoutUntil;
  }

  get lockoutSecondsLeft(): number {
    return Math.ceil(Math.max(0, this.lockoutUntil - Date.now()) / 1000);
  }

  async login(username: string, password: string): Promise<'ok' | 'invalid' | 'locked'> {
    if (this.isLockedOut) return 'locked';

    const hash = await this.sha256(password.trim());

    if (username.trim() !== USERNAME || hash !== PASS_HASH) {
      this.attempts++;
      if (this.attempts >= MAX_ATTEMPTS) {
        this.lockoutUntil = Date.now() + LOCKOUT_MS;
      }
      sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify({ until: this.lockoutUntil, attempts: this.attempts }));
      return this.isLockedOut ? 'locked' : 'invalid';
    }

    this.attempts     = 0;
    this.lockoutUntil = 0;
    sessionStorage.removeItem(LOCKOUT_KEY);
    sessionStorage.setItem(SESSION_KEY, '1');
    this._authenticated.set(true);
    return 'ok';
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this._authenticated.set(false);
    void this.router.navigate(['/']);
  }

  private async sha256(msg: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
    return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('');
  }
}
