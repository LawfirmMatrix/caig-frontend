import {Injectable} from '@angular/core';
import {fromEvent, merge, Observable} from 'rxjs';
import {map, shareReplay, startWith} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class OfflineStatusService {
  public isOffline$!: Observable<boolean>;
  constructor() {
    const offline$ = fromEvent(window, 'offline').pipe(map(() => true));
    const online$ = fromEvent(window, 'online').pipe(map(() => false));
    this.isOffline$ = merge(offline$, online$)
      .pipe(
        startWith(!navigator.onLine),
        shareReplay(1),
      );
  }
}
