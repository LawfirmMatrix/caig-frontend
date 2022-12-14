import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {Survey, SurveyDataService} from './survey-data.service';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class InitializeResolver implements Resolve<Survey> {
  constructor(private surveyService: SurveyDataService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Survey> {
    return this.surveyService.initialize$.pipe(
      switchMap((initialize) => {
        const surveyId = route.firstChild?.params['surveyId'];
        return !surveyId || surveyId === initialize.id ? of(initialize) : this.surveyService.getOne(surveyId);
      })
    );
  }
}
