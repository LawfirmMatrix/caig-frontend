import {Inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AuthActions} from '../actions/action-types';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {LOGIN_REDIRECT} from '../../auth.module';
import {Session} from '../../../models/session.model';
import {HttpClient} from '@angular/common/http';
import {CoreActions} from '../../../core/store/actions/action-types';
import {
  ChangePasswordComponent,
  ChangePasswordData
} from '../../../core/components/change-password/change-password.component';
import {MatDialog} from '@angular/material/dialog';
import {throwError} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';

@Injectable()
export class AuthEffects {
  public login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap((action) => AuthService.token = action.token),
      switchMap(() =>
        this.http.get<Session>('/api/session/initialize').pipe(
          catchError((err) => {
            this.store.dispatch(AuthActions.logout({}));
            return throwError(err);
          })
        )
      ),
      tap((session) => {
        if (session.mustChangePassword) {
          const data: ChangePasswordData = { userId: session.user.id, self: true, copyAuthPassword: true };
          this.dialog.open(ChangePasswordComponent, { data , disableClose: true});
        }
      }),
      map((session) => CoreActions.sessionInitialized({session}))
    ),
  );

  public logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap((action) => {
        AuthService.token = null;
        const queryParams = action.redirectUrl ? { redirect: action.redirectUrl } : undefined;
        this.router.navigate([this.loginRedirect], { queryParams });
      }),
    ), {dispatch: false}
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private store: Store<AppState>,
    @Inject(LOGIN_REDIRECT) private loginRedirect: string,
  ) { }
}
