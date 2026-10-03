import { Injectable } from '@angular/core';
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';
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
  constructor(private auth: AuthService, private router: Router) {}

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
                  if (!freshToken) return this.bounceToLogin(err);
                  const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${freshToken}` } });
                  return next.handle(retryReq).pipe(
                    catchError((retryErr: unknown) => this.bounceToLogin(retryErr))
                  );
                })
              );
            }
            return throwError(() => err);
          })
        );
      })
    );
  }

  /** Both the refresh token and the retry are dead — the session is genuinely over. */
  private bounceToLogin(err: unknown): Observable<never> {
    void this.auth.logout().then(() => this.router.navigateByUrl('/login'));
    return throwError(() => err);
  }
}
