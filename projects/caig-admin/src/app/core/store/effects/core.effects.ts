import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CoreActions} from '../actions/action-types';
import {map, mergeMap, tap} from 'rxjs/operators';
import {AuthService} from '../../../auth/services/auth.service';
import {EnumsActions} from '../../../enums/store/actions/action-types';
import {UserActions} from '../../../modules/users/store/actions/action-types';
import {EmployeeEntityService} from '../../../modules/employees/services/employee-entity.service';

@Injectable()
export class CoreEffects {
  public static readonly PORTAL_KEY = 'PORTAL';

  public initialized$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoreActions.sessionInitialized),
      map((action) => {
        const settlementId = AuthService.settlementId || action.session.settlements[0]?.id;
        return CoreActions.initializeSettlementContext({settlementId});
      }),
    )
  );

  public settlementChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoreActions.settlementChange),
      tap((action) => {
        AuthService.settlementId = action.settlementId;
        this.employeeService.clearCache();
        this.employeeService.setLoaded(false);
      }),
      mergeMap(() => [
        EnumsActions.invalidateEnums({enumType: 'settlementStates'}),
        EnumsActions.invalidateEnums({enumType: 'bueRegions'}),
        EnumsActions.invalidateEnums({enumType: 'bueLocations'}),
        EnumsActions.invalidateEnums({enumType: 'bueLocals'}),
        UserActions.invalidateUsers(),
      ]),
    )
  );

  public portalChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoreActions.portalChange),
      tap((action) => localStorage.setItem(CoreEffects.PORTAL_KEY, action.portal)),
    ), {dispatch: false}
  );


  constructor(private actions$: Actions, private employeeService: EmployeeEntityService) { }
}
