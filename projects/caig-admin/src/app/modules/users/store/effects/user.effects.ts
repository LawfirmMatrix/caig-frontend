import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatMap, filter, map, withLatestFrom} from 'rxjs/operators';
import {UserActions} from '../actions/action-types';
import {UserDataService} from '../../services/user-data.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {selectUsersState} from '../selectors/user.selectors';

@Injectable()
export class UserEffects {
  public load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      concatMap((action) =>
        this.dataService.getForSettlement()
          .pipe(
            map((users) => UserActions.usersLoaded({users}))
          )
      )
    ),
  );

  public invalidate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.invalidateUsers),
      withLatestFrom(this.store.select(selectUsersState)),
      filter(([action, state]) => !!state.forSettlement),
      map(([action, state]) => UserActions.loadUsers())
    )
  );

  public loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadRoles),
      concatMap(() => this.dataService.roles()),
      map((roles) => UserActions.rolesLoaded({roles}))
    )
  );

  constructor(
    private actions$: Actions,
    private dataService: UserDataService,
    private store: Store<AppState>
  ) {
  }
}
