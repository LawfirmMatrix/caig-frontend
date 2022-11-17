import {Injectable} from '@angular/core';
import {PortalGuard} from './portal.guard';
import {Portal} from '../../models/session.model';
import {RouterStateSnapshot, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/reducers';

@Injectable({providedIn: 'root'})
export class CaigPortalGuard extends PortalGuard {
  protected override allowAccess = [ Portal.CAIG ];
  constructor(protected override store: Store<AppState>, protected override router: Router) {
    super(store, router);
  }
  protected override redirectTo(state: RouterStateSnapshot): string {
    return '/';
  }
}
