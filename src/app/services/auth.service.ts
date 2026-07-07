import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { UserProfile, AuthTokens } from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = new BehaviorSubject<UserProfile | null>(this.loadUser());
  private _loading = new BehaviorSubject<boolean>(false);

  user$ = this._user.asObservable();
  loading$ = this._loading.asObservable();

  get isLoggedIn(): boolean { return !!this._user.value; }
  get user(): UserProfile | null { return this._user.value; }

  constructor(private api: ApiService) {
    const token = this.getAccessToken();
    if (token && !this._user.value) {
      this.fetchProfile().subscribe({ error: () => this.clearSession() });
    }
  }

  requestOtp(phone: string): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('/auth/request-otp', { phone });
  }

  verifyOtp(phone: string, otp: string): Observable<{ user: UserProfile; tokens: AuthTokens }> {
    return this.api.post<{ user: UserProfile; tokens: AuthTokens }>('/auth/verify-otp', { phone, otp }).pipe(
      tap(res => {
        this.setTokens(res.tokens);
        this.setUser(res.user);
      })
    );
  }

  fetchProfile(): Observable<UserProfile> {
    return this.api.get<UserProfile>('/auth/me').pipe(
      tap(user => this.setUser(user))
    );
  }

  logout(): Observable<unknown> {
    return this.api.post('/auth/logout', {}).pipe(
      tap(() => this.clearSession())
    );
  }

  clearSession(): void {
    localStorage.removeItem('rcl_access_token');
    localStorage.removeItem('rcl_refresh_token');
    localStorage.removeItem('rcl_user');
    this._user.next(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('rcl_access_token');
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem('rcl_access_token', tokens.accessToken);
    localStorage.setItem('rcl_refresh_token', tokens.refreshToken);
  }

  private setUser(user: UserProfile): void {
    localStorage.setItem('rcl_user', JSON.stringify(user));
    this._user.next(user);
  }

  private loadUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem('rcl_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
