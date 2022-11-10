import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {EmployeeEntityService} from './employee-entity.service';
import {AllEntityResolver} from '../../../core/services/all-entity.resolver';

@Injectable()
export class AllEmployeesResolver extends AllEntityResolver implements Resolve<any> {
  constructor(protected employeeService: EmployeeEntityService) {
    super(employeeService);
  }
}
