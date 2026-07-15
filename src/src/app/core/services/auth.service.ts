import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { AuthResponse, UserProfile } from '../models/sell-flow.models';

const ACCESS_KEY = 'rc_access_token';
const REFRESH_KEY = 'rc_refresh_token';
const USER_KEY = 'rc_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  /** Emits the current user, or null when logged out. */
  user$ = this.userSubject.asObservable();

  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private restored = false;

  constructor(private http: HttpClient, private storage: StorageService) { }

  /** Call once at app start (or lazily before first gated action) to hydrate session. */
  async restore(): Promise<void> {
    if (this.restored) return;
    this.restored = true;
    this.accessToken = await this.storage.get(ACCESS_KEY);
    this.refreshToken = await this.storage.get(REFRESH_KEY);
    const rawUser = await this.storage.get(USER_KEY);
    if (rawUser) {
      try { this.userSubject.next(JSON.parse(rawUser)); } catch { /* ignore corrupt cache */ }
    }
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
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

  verifyOtp(id: string, otp: string, name?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/verify_otp`, { id, otp, name }).pipe(
      tap((res) => this.persistSession(res))
    );
  }

  async refreshSession(): Promise<AuthResponse> {
    const res = await firstValueFrom(this.http.post<AuthResponse>(`${this.base}/refresh`, {
      refreshToken: this.refreshToken
    }));
    await this.persistSession(res);
    return res;
  }

  fetchMe(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.base}/me`).pipe(
      tap((user) => { this.userSubject.next(user); this.storage.set(USER_KEY, JSON.stringify(user)); })
    );
  }

  async logout(): Promise<void> {
    try { await firstValueFrom(this.http.delete(`${this.base}/logout`)); } catch { /* best-effort */ }
    this.accessToken = null;
    this.refreshToken = null;
    this.userSubject.next(null);
    await Promise.all([
      this.storage.remove(ACCESS_KEY),
      this.storage.remove(REFRESH_KEY),
      this.storage.remove(USER_KEY)
    ]);
  }

  private async persistSession(res: AuthResponse): Promise<void> {
    this.accessToken = res.accessToken;
    this.refreshToken = res.refreshToken;
    if (res.user) this.userSubject.next(res.user);
    await Promise.all([
      this.storage.set(ACCESS_KEY, res.accessToken),
      this.storage.set(REFRESH_KEY, res.refreshToken),
      res.user ? this.storage.set(USER_KEY, JSON.stringify(res.user)) : Promise.resolve()
    ]);
  }
}
