import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EnumsActions} from '../actions/action-types';
import {concatMap, filter, map, withLatestFrom} from 'rxjs/operators';
import {EnumsService} from '../../service/enums.service';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {selectEnumsState} from '../selectors/enums.selectors';

@Injectable()
export class EnumsEffects {
  public loadEnums$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnumsActions.loadEnums),
      concatMap((action) =>
        (this.dataService[action.enumType]() as Observable<any[]>)
          .pipe(
            map((payload) => EnumsActions.enumsLoaded({enumType: action.enumType, payload}))
          )
      )
    ),
  );

  public invalidateEnums$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnumsActions.invalidateEnums),
      withLatestFrom(this.store.select(selectEnumsState)),
      filter(([action, state]) => !!state[action.enumType]),
      map(([action, state]) => EnumsActions.loadEnums({enumType: action.enumType}))
    )
  );

  constructor(
    private actions$: Actions,
    private dataService: EnumsService,
    private store: Store<AppState>
  ) {
  }
}
