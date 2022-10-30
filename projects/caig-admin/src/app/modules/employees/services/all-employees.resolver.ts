import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {first, tap} from 'rxjs/operators';
import {EmployeeEntityService} from './employee-entity.service';

@Injectable()
export class AllEmployeesResolver implements Resolve<any> {
  constructor(private employeeService: EmployeeEntityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.employeeService.loaded$
      .pipe(
        first(),
        tap((loaded) => {
          if (!loaded) {
            this.employeeService.getAll().subscribe();
          }
        })
      );
  }
}
