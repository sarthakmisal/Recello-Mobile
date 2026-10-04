import { Injectable } from '@angular/core';
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/** Auth endpoints that are public by nature (OTP/login/refresh/logout) — they must never
 *  go through the attach-token / refresh-and-retry flow, or a refresh would end up waiting
 *  on itself. They still need cookies for the refresh token, just not a Bearer header. */
const PUBLIC_AUTH_PATHS = [
  '/api/auth/refresh', '/api/auth/login', '/api/auth/verify_otp',
  '/api/auth/request_otp', '/api/auth/resend_otp', '/api/auth/initiate', '/api/auth/logout'
];

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isOwnApi = req.url.startsWith(environment.apiUrl);
    if (!isOwnApi) return next.handle(req);

    const isPublicAuthPath = PUBLIC_AUTH_PATHS.some((p) => req.url.includes(p));
    if (isPublicAuthPath) return next.handle(req);

    return from(this.auth.getValidAccessToken()).pipe(
      switchMap((token) => {
        const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
        return next.handle(authReq).pipe(
          catchError((err: unknown) => {
            if (err instanceof HttpErrorResponse && err.status === 401 && token) {
              // The token looked valid locally but the server rejected it — try one forced
              // refresh + retry before giving up (covers revoked/rotated-secret edge cases).
              return from(this.auth.getValidAccessToken(true)).pipe(
                switchMap((freshToken) => {
                  if (!freshToken) {
                    // Refresh is dead too — quietly drop the stale local session so
                    // isLoggedIn()/the UI reflect reality. We deliberately do NOT force
                    // a navigation here: a background call failing (e.g. a profile
                    // fetch) shouldn't hijack whatever the user is doing right now —
                    // each page already shows its own "couldn't load" state, and any
                    // page that truly requires a session will prompt the user itself.
                    void this.auth.clearSessionOnly();
                    return throwError(() => err);
                  }
                  const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${freshToken}` } });
                  return next.handle(retryReq);
                })
              );
            }
            return throwError(() => err);
          })
        );
      })
    );
  }
}
