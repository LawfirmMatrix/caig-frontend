import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, Router} from '@angular/router';
import {Portal} from '../../models/session.model';
import {PortalGuard} from './portal.guard';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/reducers';

@Injectable({providedIn: 'root'})
export class CaigPortalGuard extends PortalGuard implements CanActivate {
  protected override allowAccess = [ Portal.CAIG ];
  constructor(protected override store: Store<AppState>, protected override router: Router) {
    super(store, router);
  }
  protected override redirectTo(state: RouterStateSnapshot): string {
    return state.url.replace('/employees', '/call-list');
  }
}
