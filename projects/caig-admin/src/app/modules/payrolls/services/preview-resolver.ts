import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable, catchError, throwError} from 'rxjs';
import {PayrollEntityService} from './payroll-entity.service';
import {Payroll} from '../../../models/payroll.model';

@Injectable()
export class PreviewResolver implements Resolve<Payroll> {
  constructor(private dataService: PayrollEntityService, private router: Router) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Payroll> {
    return this.dataService.getPreview(route.params['batchId'])
      .pipe(
        catchError((err) => {
          this.router.navigateByUrl('/');
          return throwError(err);
        })
      );
  }
}
