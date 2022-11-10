import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {first, tap} from 'rxjs/operators';
import {EntityCollectionServiceBase} from '@ngrx/data';

export abstract class AllEntityResolver {
  constructor(protected entityService: EntityCollectionServiceBase<any>) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.entityService.loaded$
      .pipe(
        first(),
        tap((loaded) => {
          if (!loaded) {
            this.entityService.getAll().subscribe();
          }
        })
      );
  }
}
