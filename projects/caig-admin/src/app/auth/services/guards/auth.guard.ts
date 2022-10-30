import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {tap} from 'rxjs/operators';
import {LOGIN_REDIRECT} from '../../auth.module';
import {AppState} from '../../../store/reducers';
import {isLoggedIn} from '../../store/selectors/auth.selectors';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private store: Store<AppState>,
    private router: Router,
    @Inject(LOGIN_REDIRECT) private loginRedirect: string,
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.check(state.url);
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.check(state.url);
  }
  private check(redirect: string): Observable<boolean> {
    return this.store.select(isLoggedIn).pipe(
      tap((loggedIn) => {
        if (!loggedIn) {
          this.router.navigate([this.loginRedirect], {queryParams: { redirect }});
        }
      }),
    );
  }
}
