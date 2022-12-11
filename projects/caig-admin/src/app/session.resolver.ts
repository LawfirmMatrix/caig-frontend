import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from './store/reducers';
import {selectCoreState} from './core/store/selectors/core.selectors';
import {filter, first, tap} from 'rxjs/operators';
import {ChangePasswordData, ChangePasswordComponent} from './core/components/change-password/change-password.component';
import {MatDialog} from '@angular/material/dialog';

@Injectable({providedIn: 'root'})
export class SessionResolver implements Resolve<any> {
  constructor(private store: Store<AppState>, private dialog: MatDialog) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.store.select(selectCoreState)
      .pipe(
        filter((state) => !!state.settlementId),
        first(),
        tap((state) => {
          if (state.mustChangePassword && state.user) {
            console.log('must change password');
            const data: ChangePasswordData = { userId: state.user.id, self: true, copyAuthPassword: true };
            this.dialog.open(ChangePasswordComponent, { data , disableClose: true});
          }
        }),
      );
  }
}
