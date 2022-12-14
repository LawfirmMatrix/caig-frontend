import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationExtras} from '@angular/router';
import {Observable, map, tap} from 'rxjs';
import {SurveyDataService} from '../survey-data.service';

@Injectable({providedIn: 'root'})
export class MultipleLocationsGuard implements CanActivate {
  constructor(private router: Router, private surveyService: SurveyDataService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.surveyService.initialize$
      .pipe(
        tap((survey) => {
          const extras: NavigationExtras = { replaceUrl: true, queryParams: route.queryParams };
          if (survey.locations?.length === 1) {
            this.router.navigate(['/survey', survey.id, survey.locations[0].id], extras);
          } else if (!survey.locations?.length) {
            this.router.navigate(['/survey', survey.id], extras);
          }
        }),
        map((survey) => survey.locations?.length > 1),
      );
  }
}
