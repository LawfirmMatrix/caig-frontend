import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {first, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {selectEnumsState} from '../../../enums/store/selectors/enums.selectors';
import {forOwn, omit} from 'lodash-es';
import {EnumsState} from '../../../enums/store/reducers';
import {EnumsActions} from '../../../enums/store/actions/action-types';

@Injectable()
export class EmployeeEnumsResolver implements Resolve<any> {
  constructor(private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.store.select(selectEnumsState)
      .pipe(
        first(),
        tap((state) => {
          forOwn(omit(state, ['employeeStatuses', 'settlementStates', 'eventTypes']), (v, k) => {
            const enumType = k as keyof EnumsState;
            if (!state[enumType]) {
              this.store.dispatch(EnumsActions.loadEnums({enumType}));
            }
          })
        }),
      );
  }
}
