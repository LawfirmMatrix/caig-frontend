import {Component} from '@angular/core';
import {Observable, map, filter} from 'rxjs';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';
import {SurveyService} from './survey/survey.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public isLoading$: Observable<boolean> = this.router.events
    .pipe(
      map((event) => {
        switch (true) {
          case event instanceof NavigationStart:
            return true;
          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError:
            return false;
          default:
            return null;
        }
      }),
      filter((loading): loading is boolean => typeof loading === 'boolean'),
    )
  constructor(private router: Router, public surveyService: SurveyService) { }
}
