import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Employee} from '../../../models/employee.model';
import {EmployeeEntityService} from '../../employees/services/employee-entity.service';
import {Observable, tap, switchMap, first, filter} from 'rxjs';

@Injectable()
export class BatchResolver implements Resolve<Employee[]> {
  constructor(private employeeService: EmployeeEntityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Employee[]> {
    return this.employeeService.loaded$
      .pipe(
        tap((loaded) => {
          if (!loaded) {
            this.employeeService.getAll();
          }
        }),
        filter((loaded) => loaded),
        switchMap(() => this.employeeService.entities$),
        first(),
      );
    // @TODO - replace with this:
    // return this.employeeService.getBatch(route.params['batchId']);
  }
}
