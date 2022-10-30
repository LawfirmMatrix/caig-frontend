import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {SurveyService} from './survey/survey.service';
import {map, tap, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class MultipleLocationsGuard implements CanActivate {
  constructor(private dataService: SurveyService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.dataService.get()
      .pipe(
        tap((surveys) => {
          if (surveys.length === 1) {
            this.router.navigate(['/survey', surveys[0].id]);
          }
        }),
        map((surveys) => surveys.length > 1),
      );
  }
}
