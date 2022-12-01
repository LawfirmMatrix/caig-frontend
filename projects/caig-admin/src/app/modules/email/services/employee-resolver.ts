import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Employee} from '../../../models/employee.model';
import {EmployeeEntityService} from '../../employees/services/employee-entity.service';
import {Observable, of} from 'rxjs';
import {first, switchMap} from 'rxjs/operators';

@Injectable()
export class EmployeeResolver implements Resolve<Employee> {
  constructor(private employeeService: EmployeeEntityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Employee> {
    return this.employeeService.entityMap$.pipe(
      first(),
      switchMap((entityMap) => {
        const employeeId = Number(route.params['employeeId']);
        const cached = entityMap[employeeId];
        return cached ? of(cached) : this.employeeService.getByKey(employeeId);
      })
    );
  }
}
