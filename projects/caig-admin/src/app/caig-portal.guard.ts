import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from './store/reducers';
import {portal} from './core/store/selectors/core.selectors';
import {filter, first, map, tap} from 'rxjs/operators';
import {isNotUndefined} from './core/util/functions';
import {Portal} from './models/session.model';

@Injectable({providedIn: 'root'})
export class CaigPortalGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(portal)
      .pipe(
        filter(isNotUndefined),
        first(),
        map((portal) => portal === Portal.CAIG),
        tap((canLoad) => {
          if (!canLoad) {
            this.router.navigateByUrl(state.url.replace('/employees', '/call-list'));
          }
        }),
      );
  }
}
