import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {user} from '../../store/selectors/core.selectors';
import {AuthActions} from '../../../auth/store/actions/action-types';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
  public user$ = this.store.select(user);
  public routeMenu: UserMenuItemWithRoute[] = [
    {
      label: 'My Profile',
      icon: 'account_circle',
      route: '/',
    },
  ];
  public callbackMenu: UserMenuItemWithCallback[] = [
    {
      label: 'Sign Out',
      icon: 'logout',
      callback: () => this.store.dispatch(AuthActions.logout({}))
    }
  ];
  constructor(private store: Store<AppState>) { }
}

interface UserMenuItem {
  label: string;
  icon: string;
}

interface UserMenuItemWithRoute extends UserMenuItem {
  route: string;
}

interface UserMenuItemWithCallback extends UserMenuItem {
  callback: () => void;
}
