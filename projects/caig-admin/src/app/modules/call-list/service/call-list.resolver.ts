import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {first, tap} from 'rxjs/operators';
import {EmployeeEntityService} from '../../employees/services/employee-entity.service';

@Injectable()
export class CallListResolver implements Resolve<any> {
  constructor(private employeeService: EmployeeEntityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.employeeService.loaded$
      .pipe(
        first(),
        tap((loaded) => {
          if (!loaded) {
            this.employeeService.getWithQuery({includeEvents: 'true'})
              .subscribe(() => this.employeeService.setLoaded(true));
          }
        })
      );
  }
}
