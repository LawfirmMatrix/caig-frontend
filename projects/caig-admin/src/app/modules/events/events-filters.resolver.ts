import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/reducers';
import {usersForSettlement} from '../users/store/selectors/user.selectors';
import {tap} from 'rxjs/operators';
import {UserActions} from '../users/store/actions/action-types';
import {first, combineLatest} from 'rxjs';
import {eventTypes} from '../../enums/store/selectors/enums.selectors';
import {EnumsActions} from '../../enums/store/actions/action-types';

@Injectable()
export class EventsFiltersResolver implements Resolve<any> {
  constructor(private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return combineLatest([
      this.store.select(eventTypes),
      this.store.select(usersForSettlement),
    ])
      .pipe(
        tap(([eventTypes, users]) => {
          if (!eventTypes) {
            this.store.dispatch(EnumsActions.loadEnums({enumType: 'eventTypes'}));
          }
          if (!users) {
            this.store.dispatch(UserActions.loadUsers());
          }
        }),
        first(),
      );
  }
}
