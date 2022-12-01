import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Employee} from '../../../models/employee.model';
import {EmployeeEntityService} from '../../employees/services/employee-entity.service';
import {Observable} from 'rxjs';

@Injectable()
export class BatchResolver implements Resolve<Employee[]> {
  constructor(private employeeService: EmployeeEntityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Employee[]> {
    return this.employeeService.getBatch(route.params['batchId']);
  }
}
