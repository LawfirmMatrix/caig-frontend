import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Payroll} from '../../../models/payroll.model';
import {PayrollEntityService} from './payroll-entity.service';
import {Observable} from 'rxjs';

@Injectable()
export class SinglePayrollResolver implements Resolve<Payroll> {
  constructor(private dataService: PayrollEntityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Payroll> {
    return this.dataService.getByKey(route.params['payrollId']);
  }
}
