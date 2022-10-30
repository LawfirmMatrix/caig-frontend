import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {selectEnumsState} from '../../../enums/store/selectors/enums.selectors';
import {first, tap} from 'rxjs/operators';
import {forOwn, pick} from 'lodash-es';
import {EnumsState} from '../../../enums/store/reducers';
import {EnumsActions} from '../../../enums/store/actions/action-types';

@Injectable()
export class EmployeeViewResolver implements Resolve<any> {
  constructor(private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.store.select(selectEnumsState)
      .pipe(
        first(),
        tap((state) => {
          forOwn(pick(state, ['participationStatuses', 'bueLocations']), (v, k) => {
            const enumType = k as keyof EnumsState;
            if (!state[enumType]) {
              this.store.dispatch(EnumsActions.loadEnums({enumType}));
            }
          })
        }),
      );
  }
}
