import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {user} from '../../store/selectors/core.selectors';
import {AuthActions} from '../../../auth/store/actions/action-types';
import {ServiceWorkerService} from '../../services/service-worker.service';
import {first} from 'rxjs';
import {AppData} from '../../../models/app-data.model';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
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
  constructor(private store: Store<AppState>, private swService: ServiceWorkerService) { }
  public ngOnInit() {
    this.swService.isUpdateAvailable$
      .pipe(first())
      .subscribe((event) => {
        const appData: AppData | undefined = event.latestVersion.appData;
        if (appData) {
          this.callbackMenu.unshift({
            label: 'What\'s New',
            icon: 'new_releases',
            callback: () => this.swService.openScopedChanges(appData),
          });
        }
      });
  }
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
