import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable, map, tap} from 'rxjs';
import {SurveyDataService} from '../survey-data.service';

@Injectable({providedIn: 'root'})
export class ShortcutRedirectGuard implements CanActivate {
  constructor(private router: Router, private surveyService: SurveyDataService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.surveyService.initialize$
      .pipe(
        tap((survey) => {
          const extras = { replaceUrl: true };
          const shortcut = route.paramMap.get('shortcut');
          const baseUrl = '/';
          if (!shortcut) {
            this.router.navigateByUrl(baseUrl, extras);
          }
          const locationShortcut = survey.locations.find((l) => l.shortcut === shortcut);
          const redirectUrl = survey.shortcut === shortcut || locationShortcut ? `/survey/${survey.id}${locationShortcut ? `/${locationShortcut.id}` : ''}` : baseUrl;
          this.router.navigateByUrl(redirectUrl, extras);
        }),
        map(() => false),
      );
  }
}
