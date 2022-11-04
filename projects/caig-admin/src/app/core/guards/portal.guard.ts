import {ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Portal} from '../../models/session.model';
import {portal} from '../store/selectors/core.selectors';
import {filter, first, map, tap} from 'rxjs/operators';
import {isNotUndefined} from '../util/functions';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/reducers';

export abstract class PortalGuard {
  protected abstract allowAccess: Portal[];
  constructor(protected store: Store<AppState>, protected router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(portal)
      .pipe(
        filter(isNotUndefined),
        first(),
        map((portal) => this.allowAccess.indexOf(portal) > -1),
        tap((canLoad) => {
          if (!canLoad) {
            this.router.navigateByUrl(this.redirectTo(state));
          }
        }),
      );
  }
  protected abstract redirectTo(state: RouterStateSnapshot): string;
}
