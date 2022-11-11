import {Component} from '@angular/core';
import {RespondentDataService} from '../../services/respondent-data.service';
import {ActivatedRoute} from '@angular/router';
import {SurveysEntityService} from '../../services/surveys-entity.service';
import {map} from 'rxjs/operators';
import {Observable, combineLatest} from 'rxjs';
import {Survey} from '../../../../models/survey.model';

@Component({
  selector: 'app-respondents-list',
  templateUrl: './respondents-list.component.html',
  styleUrls: ['./respondents-list.component.scss']
})
export class RespondentsListComponent {
  public survey$: Observable<Survey | undefined> =
    combineLatest([this.surveyService.entityMap$, this.route.params])
      .pipe(
        map(([entityMap, params]) => entityMap[params['surveyId']])
      );
  constructor(
    private respondentService: RespondentDataService,
    private route: ActivatedRoute,
    private surveyService: SurveysEntityService,
  ) { }
}
