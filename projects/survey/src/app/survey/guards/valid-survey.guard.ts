import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable, map, tap} from 'rxjs';
import {SurveyService} from '../survey.service';

@Injectable({providedIn: 'root'})
export class ValidSurveyGuard implements CanActivate {
  constructor(private router: Router, private surveyService: SurveyService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.surveyService.initialize$
      .pipe(
        map((survey) => survey.id === route.params['surveyId'] && !survey.locations?.length),
        tap((canActivate) => {
          if (!canActivate) {
            this.router.navigateByUrl('/', { replaceUrl: true });
          }
        }),
      );
  }
}
