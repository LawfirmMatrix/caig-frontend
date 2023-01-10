import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {AllEntityResolver} from '../../../core/services/all-entity.resolver';
import {EmployeeEntityService} from '../../employees/services/employee-entity.service';

@Injectable({providedIn: 'root'})
export class AllEmployeesResolver extends AllEntityResolver implements Resolve<any> {
  constructor(protected employeeService: EmployeeEntityService) {
    super(employeeService);
  }
}
