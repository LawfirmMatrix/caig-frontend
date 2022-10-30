import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {MsalService} from '@azure/msal-angular';

@Injectable()
export class DecryptionInterceptor implements HttpInterceptor {
  constructor(private msalService: MsalService, private http: HttpClient) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          const authHeader = err.headers.get('WWW-Authenticate');
          if (authHeader) {
            const needsToken = authHeader.includes('realm=crypto');
            if (needsToken) {
              return this.msalService.acquireTokenPopup({scopes: [USER_IMPERSONATION]})
                .pipe(
                  switchMap((res) => this.http.post<void>('/api/crypto/unlock', JSON.stringify(res.accessToken), {headers: {'Content-Type': 'application/json'}})),
                  switchMap(() => next.handle(req))
                );
            }
          }
        }
        return throwError(err);
      })
    )
  }
}

const USER_IMPERSONATION = 'https://vault.azure.net/user_impersonation';
