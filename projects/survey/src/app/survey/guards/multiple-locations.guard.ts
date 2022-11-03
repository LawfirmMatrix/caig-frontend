import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable, map, tap} from 'rxjs';
import {SurveyService} from '../survey.service';

@Injectable({providedIn: 'root'})
export class MultipleLocationsGuard implements CanActivate {
  constructor(private router: Router, private surveyService: SurveyService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.surveyService.initialize$
      .pipe(
        tap((survey) => {
          const extras = { replaceUrl: true };
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
