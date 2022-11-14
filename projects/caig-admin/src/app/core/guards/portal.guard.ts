import {ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable, combineLatest} from 'rxjs';
import {Portal} from '../../models/session.model';
import {portal, isSuperAdmin} from '../store/selectors/core.selectors';
import {filter, first, map, tap} from 'rxjs/operators';
import {isNotUndefined} from '../util/functions';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/reducers';
import {CoreActions} from '../store/actions/action-types';

export abstract class PortalGuard {
  protected abstract allowAccess: Portal[];
  constructor(protected store: Store<AppState>, protected router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const portal$ = this.store.select(portal).pipe(filter(isNotUndefined));
    const isSuperAdmin$ = this.store.select(isSuperAdmin).pipe(filter(isNotUndefined));
    return combineLatest([portal$, isSuperAdmin$])
      .pipe(
        first(),
        map(([portal, isSuperAdmin]) => {
          const isAllowed = this.allowAccess.indexOf(portal) > -1;
          if (!isAllowed && isSuperAdmin) {
            this.store.dispatch(CoreActions.portalChange({portal: this.allowAccess[0]}));
          }
          return isSuperAdmin || isAllowed;
        }),
        tap((canLoad) => {
          if (!canLoad) {
            this.router.navigateByUrl(this.redirectTo(state));
          }
        })
      );
  }
  protected abstract redirectTo(state: RouterStateSnapshot): string;
}
