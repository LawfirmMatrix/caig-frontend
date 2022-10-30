import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {SurveyService} from './survey/survey.service';
import {map, Observable, tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LocationParserGuard implements CanActivate {
  constructor(private dataService: SurveyService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const location = route.paramMap.get('location');
    const baseUrl = '/';
    if (!location) {
      this.router.navigateByUrl(baseUrl);
      return false;
    }
    return this.dataService.get().pipe(
      tap((surveys) => {
        const survey = surveys.find((s) => s.locations.indexOf(location) > -1);
        const redirectUrl = survey ? `/survey/${survey.id}` : baseUrl;
        this.router.navigateByUrl(redirectUrl);
      }),
      map(() => false)
    );
  }
}
