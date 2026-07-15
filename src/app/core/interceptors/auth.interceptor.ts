import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.getAccessToken();
    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && this.auth.getRefreshToken()) {
          return from(this.auth.refreshSession()).pipe(
            switchMap(() => {
              const retried = req.clone({
                setHeaders: { Authorization: `Bearer ${this.auth.getAccessToken()}` }
              });
              return next.handle(retried);
            }),
            catchError((refreshErr) => throwError(() => refreshErr))
          );
        }
        return throwError(() => err);
      })
    );
  }
}
