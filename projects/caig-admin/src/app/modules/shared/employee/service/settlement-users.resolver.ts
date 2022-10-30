import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {first, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {usersForSettlement} from '../../../users/store/selectors/user.selectors';
import {UserActions} from '../../../users/store/actions/action-types';

@Injectable()
export class SettlementUsersResolver implements Resolve<any> {
  constructor(private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.store.select(usersForSettlement)
      .pipe(
        first(),
        tap((states) => {
          if (!states) {
            this.store.dispatch(UserActions.loadUsers());
          }
        }),
      );
  }
}
