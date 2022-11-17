import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {PayrollEntityService} from './payroll-entity.service';
import {tap, first} from 'rxjs';

@Injectable()
export class PayrollsResolver implements Resolve<any> {
  constructor(private dataService: PayrollEntityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.dataService.loaded$
      .pipe(
        tap((loaded) => {
          if (!loaded) {
            this.dataService.getAll();
          }
        }),
        first(),
      );
  }
}
