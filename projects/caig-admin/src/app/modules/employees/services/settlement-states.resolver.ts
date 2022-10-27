import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {first, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {settlementStates} from '../../../enums/store/selectors/enums.selectors';
import {EnumsActions} from '../../../enums/store/actions/action-types';

@Injectable()
export class SettlementStatesResolver implements Resolve<any> {
  constructor(private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.store.select(settlementStates)
      .pipe(
        first(),
        tap((states) => {
          if (!states) {
            this.store.dispatch(EnumsActions.loadEnums({enumType: 'settlementStates'}));
          }
        }),
      );
  }
}
