import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { AuthResponse, UserProfile, AccountDeleteStatus } from '../models/sell-flow.models';

const ACCESS_KEY = 'rc_access_token';
const USER_KEY = 'rc_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/api/auth`;

  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  /** Emits the current user, or null when logged out. */
  user$ = this.userSubject.asObservable();

  private accessToken: string | null = null;
  private restored = false;
  private restorePromise: Promise<void> | null = null;

  constructor(private http: HttpClient, private storage: StorageService) { }

  /** Call once at app start (or lazily before first gated action) to hydrate session. */
  async restore(): Promise<void> {
    if (this.restored) return;
    if (!this.restorePromise) {
      // alert('worked')
      this.restorePromise = (async () => {
        this.accessToken = await this.storage.get(ACCESS_KEY);
        const rawUser = await this.storage.get(USER_KEY);
        if (rawUser) {
          try { this.userSubject.next(JSON.parse(rawUser)); } catch { /* ignore corrupt cache */ }
        }
        this.restored = true;
      })();
    }
    return this.restorePromise;
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
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
    return this.http.post<AuthResponse>(`${this.base}/verify_otp`, payload).pipe(
      tap((res) => { this.persistSession(res); })
    );
  }

  async logout(): Promise<void> {
    this.accessToken = null;
    this.userSubject.next(null);
    await Promise.all([
      this.storage.remove(ACCESS_KEY),
      this.storage.remove(USER_KEY)
    ]);
  }

  private persistSession(res: AuthResponse): void {
    this.accessToken = res.accessToken;
    if (res.user) this.userSubject.next(res.user);
    void this.storage.set(ACCESS_KEY, res.accessToken);
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
}
