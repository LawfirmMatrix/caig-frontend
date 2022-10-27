import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from './store/reducers';
import {settlementId} from './core/store/selectors/core.selectors';
import {filter, first} from 'rxjs/operators';
import {isNotUndefined} from './core/util/functions';

@Injectable({providedIn: 'root'})
export class SessionResolver implements Resolve<any> {
  constructor(private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.store.select(settlementId)
      .pipe(
        filter(isNotUndefined),
        first(),
      );
  }
}
