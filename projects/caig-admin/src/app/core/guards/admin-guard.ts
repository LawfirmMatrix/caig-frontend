import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/reducers';
import {isAdmin} from '../store/selectors/core.selectors';
import {filter, first, tap} from 'rxjs/operators';
import {isNotUndefined} from '../util/functions';

@Injectable({providedIn: 'root'})
export class AdminGuard implements CanLoad {
  constructor(private store: Store<AppState>, private router: Router) { }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.store.select(isAdmin)
      .pipe(
        filter(isNotUndefined),
        first(),
        tap((isAdmin) => {
          if (!isAdmin) {
            this.router.navigateByUrl('/');
          }
        })
      );
  }
}
