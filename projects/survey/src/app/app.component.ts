import {Component, OnInit} from '@angular/core';
import {Observable, map, filter} from 'rxjs';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';
import {SurveyDataService} from './survey/survey-data.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
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
  constructor(private router: Router, public surveyService: SurveyDataService) { }
  ngOnInit() {
    console.log('environment.production:', environment.production);
  }
}
