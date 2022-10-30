import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, first, switchMap, tap} from 'rxjs/operators';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {AuthService} from '../auth.service';
import {authToken} from '../../store/selectors/auth.selectors';
import {AuthActions} from '../../store/actions/action-types';
import {Router} from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private notifications: NotificationsService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private authService: AuthService,
    private router: Router,
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(authToken)
      .pipe(
        first(),
        switchMap((token) => {
          if (!req.url.endsWith('jwtrefresh') && token && AuthService.tokenNeedsRefresh(token)) {
            return this.authService.refreshToken()
              .pipe(tap((token) => this.store.dispatch(AuthActions.login({token}))));
          }
          return of(token);
        }),
        switchMap((token) => {
          const cloned = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token?.token),
          });
          return next.handle(cloned);
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.dialog.closeAll();
            this.store.dispatch(AuthActions.logout({redirectUrl: this.router.url}));
          } else {
            this.notifications.showDetailedMessage('An error has occurred', err);
          }
          return throwError(err);
        })
      );
  }
}
