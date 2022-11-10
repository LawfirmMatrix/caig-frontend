import {Component} from '@angular/core';

@Component({
  selector: 'app-respondents-list',
  templateUrl: './respondents-list.component.html',
  styleUrls: ['./respondents-list.component.scss']
})
export class RespondentsListComponent {
  // public survey$: Observable<Survey | undefined> = this.route.data
  //   .pipe(
  //     map((data) => data['surveys']),
  //     filter((surveys): surveys is Survey[] => !!surveys),
  //     map((surveys) => surveys.find((s) => s.id === this.route.snapshot.params['surveyId'])),
  //   );
  // public location$: Observable<SurveyLocation | undefined> = this.survey$
  //   .pipe(
  //     map((survey) => survey && survey.locations &&
  //       survey.locations.find((l) => l.id === this.route.snapshot.params['locationId'])
  //     )
  //   );
  constructor() { }
}
