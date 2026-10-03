import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { AuthResponse, UserProfile, AccountDeleteStatus, MyProfile } from '../models/sell-flow.models';

const ACCESS_KEY = 'rc_access_token';
const EXPIRES_KEY = 'rc_access_expires_at'; // epoch ms, decoded from the access token's own `exp` claim
const USER_KEY = 'rc_user';

/** Buffer so we refresh a little before the token actually dies, not exactly at the wire. */
const EXPIRY_SKEW_MS = 10_000;

/** Reads the `exp` claim (seconds since epoch) out of a JWT without verifying the signature —
 *  signature verification is the backend's job; the frontend only needs to know when to renew. */
function decodeJwtExpiryMs(token: string): number | null {
  try {
    const payloadPart = token.split('.')[1];
    const json = atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json);
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/api/auth`;

  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  /** Emits the current user, or null when logged out. */
  user$ = this.userSubject.asObservable();

  private accessToken: string | null = null;
  private accessTokenExpiresAt: number | null = null;
  private restored = false;
  private restorePromise: Promise<void> | null = null;

  /** Coalesces concurrent refresh attempts so parallel 401s don't each hit /auth/refresh. */
  private refreshPromise: Promise<string | null> | null = null;

  constructor(private http: HttpClient, private storage: StorageService) { }

  /** Call once at app start (or lazily before first gated action) to hydrate session.
   *  If the cached token is already expired, this tries one silent refresh before
   *  deciding the user is logged out — this is what covers "came back after expiry". */
  async restore(): Promise<void> {
    if (this.restored) return;
    if (!this.restorePromise) {
      this.restorePromise = (async () => {
        this.accessToken = await this.storage.get(ACCESS_KEY);
        const rawExpiry = await this.storage.get(EXPIRES_KEY);
        this.accessTokenExpiresAt = rawExpiry ? Number(rawExpiry) : null;
        const rawUser = await this.storage.get(USER_KEY);
        if (rawUser) {
          try { this.userSubject.next(JSON.parse(rawUser)); } catch { /* ignore corrupt cache */ }
        }

        if (this.accessToken && this.isExpired()) {
          // Token is stale — try the refresh cookie before giving up on the session.
          const renewed = await this.refreshAccessToken();
          if (!renewed) {
            this.clearLocalSession();
          }
        }
        this.restored = true;
      })();
    }
    return this.restorePromise;
  }

  isLoggedIn(): boolean {
    return !!this.accessToken && !this.isExpired();
  }

  private isExpired(): boolean {
    if (!this.accessTokenExpiresAt) return false; // unknown expiry — don't block on it
    return Date.now() >= (this.accessTokenExpiresAt - EXPIRY_SKEW_MS);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  /** Returns a token guaranteed usable right now: the current one if still valid,
   *  a freshly-renewed one if it was expired, or null if there is no session / renewal failed.
   *  Pass forceRefresh when the server itself rejected a seemingly-valid token (e.g. a 401
   *  that slipped past our local expiry check) and a fresh one must be fetched regardless. */
  async getValidAccessToken(forceRefresh = false): Promise<string | null> {
    await this.restore();
    if (!this.accessToken) return null;
    if (!forceRefresh && !this.isExpired()) return this.accessToken;
    return this.refreshAccessToken();
  }

  /** POST /api/auth/refresh (httpOnly refresh cookie, sent via withCredentials) → new access token.
   *  Returns the new token on success, or null (and clears the local session) on failure. */
  private async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshPromise) {
      this.refreshPromise = firstValueFrom(
        this.http.post<{ accessToken: string }>(`${this.base}/refresh`, {}, { withCredentials: true })
      )
        .then((res) => {
          this.accessToken = res.accessToken;
          this.accessTokenExpiresAt = decodeJwtExpiryMs(res.accessToken);
          void this.storage.set(ACCESS_KEY, this.accessToken);
          void this.storage.set(EXPIRES_KEY, String(this.accessTokenExpiresAt ?? ''));
          return this.accessToken;
        })
        .catch(() => {
          // Refresh token missing/invalid/expired — the session is really over.
          this.clearLocalSession();
          return null;
        })
        .finally(() => { this.refreshPromise = null; });
    }
    return this.refreshPromise;
  }

  initiate(phone: string): Observable<{ isNewUser: boolean }> {
    return this.http.post<{ isNewUser: boolean }>(`${this.base}/initiate`, { phone });
  }

  requestOtp(phone: string): Observable<{ message: string; id: string }> {
    return this.http.post<{ message: string; id: string }>(`${this.base}/request_otp`, { phone });
  }

  resendOtp(id: string, phone: string): Observable<{ message: string; id: string }> {
    return this.http.post<{ message: string; id: string }>(`${this.base}/resend_otp`, { id, phone });
  }

  /** name is only required/used when the phone belongs to a brand-new user. */
  verifyOtp(id: string, otp: string, name?: string): Observable<AuthResponse> {
    const payload: { id: string; otp: string; name?: string } = { id, otp };
    if (name) payload.name = name;
    return this.http.post<AuthResponse>(`${this.base}/verify_otp`, payload, { withCredentials: true }).pipe(
      tap((res) => { this.persistSession(res); })
    );
  }

  /** Logs out on the server too (DELETE /api/auth/logout revokes the refresh token and
   *  clears its cookie) so the refresh token can't be reused after the user signs out,
   *  then always clears local state regardless of whether the network call succeeds. */
  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.base}/logout`, { withCredentials: true }));
    } catch {
      // Best-effort — the server call failing shouldn't block the local logout.
    }
    await this.clearLocalSession();
  }

  private async clearLocalSession(): Promise<void> {
    this.accessToken = null;
    this.accessTokenExpiresAt = null;
    this.userSubject.next(null);
    await Promise.all([
      this.storage.remove(ACCESS_KEY),
      this.storage.remove(EXPIRES_KEY),
      this.storage.remove(USER_KEY)
    ]);
  }

  private persistSession(res: AuthResponse): void {
    this.accessToken = res.accessToken;
    this.accessTokenExpiresAt = decodeJwtExpiryMs(res.accessToken);
    if (res.user) this.userSubject.next(res.user);
    void this.storage.set(ACCESS_KEY, res.accessToken);
    void this.storage.set(EXPIRES_KEY, String(this.accessTokenExpiresAt ?? ''));
    if (res.user) void this.storage.set(USER_KEY, JSON.stringify(res.user));
  }

  /** GET /api/auth/account_delete (requires auth) — current deletion status for this account. */
  getAccountDeleteStatus(): Observable<AccountDeleteStatus> {
    return this.http.get<AccountDeleteStatus>(`${this.base}/account_delete`);
  }

  /** POST /api/auth/account_delete (requires auth) — schedules the account for deletion. */
  requestAccountDelete(reason: string): Observable<AccountDeleteStatus> {
    return this.http.post<AccountDeleteStatus>(`${this.base}/account_delete`, { reason });
  }

  /** GET /api/users/me/profile (requires auth) — full profile for the "My Profile" screen. */
  getMyProfile(): Observable<MyProfile> {
    return this.http.get<MyProfile>(`${environment.apiUrl}/api/users/me/profile`);
  }

  /** PUT /api/users/me/profile (requires auth) — updates name/phone; refreshes the cached user on success. */
  updateMyProfile(payload: { phone?: string; profile: { first_name?: string; last_name?: string } }): Observable<MyProfile> {
    return this.http.put<MyProfile>(`${environment.apiUrl}/api/users/me/profile`, payload).pipe(
      tap((res) => {
        const cached = this.userSubject.value;
        const merged: UserProfile = {
          id: res.id ?? cached?.id ?? '',
          name: [res.first_name, res.last_name].filter(Boolean).join(' ') || cached?.name,
          email: res.email ?? cached?.email,
          roles: res.roles ?? cached?.roles,
          avatar_url: res.avatar_url ?? cached?.avatar_url
        };
        this.userSubject.next(merged);
        void this.storage.set(USER_KEY, JSON.stringify(merged));
      })
    );
  }
}
