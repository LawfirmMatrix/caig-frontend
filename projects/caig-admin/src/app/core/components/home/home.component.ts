import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {ChangePasswordComponent, ChangePasswordData} from '../change-password/change-password.component';
import {Portal, User} from '../../../models/session.model';
import {SelectField} from 'dynamic-form';
import {of} from 'rxjs';
import {isSuperAdmin, selectCoreState} from '../../store/selectors/core.selectors';
import {filter, first} from 'rxjs/operators';
import {CoreActions} from '../../store/actions/action-types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isSuperAdmin$ = this.store.select(isSuperAdmin);
  public state: any;
  public portalSelection = new SelectField({
    key: 'portal',
    label: 'Portal',
    options: of([{name: Portal.CAIG}, {name: Portal.CallCenter}, {name: Portal.Survey}]),
    itemKey: 'name',
    displayField: 'name',
    onChange: (portal) => this.store.dispatch(CoreActions.portalChange({ portal }))
  });
  constructor(private store: Store<AppState>, private dialog: MatDialog) { }
  public ngOnInit() {
    this.store.select(selectCoreState)
      .pipe(
        filter((state) => !!state.user),
        first(),
      )
      .subscribe((state) => this.state = state);
  }

  public compare(a: any, b: any): number {
    return 0;
  }
  public changePassword(user: User): void {
    const data: ChangePasswordData = { userId: user.id, self: true };
    this.dialog.open(ChangePasswordComponent, { data });
  }
}
