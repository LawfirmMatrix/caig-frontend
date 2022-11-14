import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {roles} from '../store/selectors/user.selectors';
import {tap} from 'rxjs/operators';
import {UserActions} from '../store/actions/action-types';
import {first} from 'rxjs';

@Injectable()
export class UserRolesResolver implements Resolve<any> {
  constructor(private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.store.select(roles)
      .pipe(
        tap((roles) => {
          if (!roles) {
            this.store.dispatch(UserActions.loadRoles());
          }
        }),
        first(),
      );
  }
}
