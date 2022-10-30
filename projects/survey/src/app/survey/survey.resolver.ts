import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {timer, map, Observable} from 'rxjs';
import {SurveyService} from './survey.service';

@Injectable({providedIn: 'root'})
export class SurveyResolver implements Resolve<Observable<any>> {
  constructor(private surveySurvey: SurveyService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    console.log('Survey Resolver', route.paramMap);

    // @TODO - return surveys from api
    return timer(2000)
      .pipe(map(() => null));
  }
}
