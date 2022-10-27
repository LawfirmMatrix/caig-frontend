import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {tap} from 'rxjs/operators';
import {AppState} from '../../../store/reducers';
import {isLoggedOut} from '../../store/selectors/auth.selectors';

@Injectable()
export class NoAuthGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<AppState>, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.check();
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.check();
  }
  private check(): Observable<boolean> {
    return this.store.select(isLoggedOut).pipe(
      tap((loggedOut) => {
        if (!loggedOut) {
          this.router.navigateByUrl('/');
        }
      }),
    );
  }
}
