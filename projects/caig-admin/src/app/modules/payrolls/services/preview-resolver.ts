import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable, catchError, throwError, of} from 'rxjs';
import {PayrollEntityService} from './payroll-entity.service';

@Injectable()
export class PreviewResolver implements Resolve<{ payments: any[] }> {
  constructor(private dataService: PayrollEntityService, private router: Router) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ payments: any[] }> {
    return this.dataService.getPreview(route.params['batchId'])
      .pipe(
        catchError((err) => {
          this.router.navigateByUrl('/');
          return throwError(err);
        })
      );
  }
}
