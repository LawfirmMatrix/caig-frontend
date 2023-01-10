import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {EmployeeEntityService} from '../../employees/services/employee-entity.service';
import {first, switchMap} from 'rxjs/operators';
import {of, Observable} from 'rxjs';
import {Employee} from '../../../models/employee.model';

@Injectable({providedIn: 'root'})
export class SingleEmployeeResolver implements Resolve<Employee> {
  constructor(protected employeeService: EmployeeEntityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Employee> {
    return this.employeeService.entityMap$
      .pipe(
        first(),
        switchMap((entityMap) => {
          const employeeId = route.params['id'];
          const employee = entityMap[employeeId];
          return employee ? of(employee) : this.employeeService.getByKey(employeeId);
        }),
      );
  }
}
