import {Component} from '@angular/core';
import {SurveysDataService} from '../../services/surveys-data.service';
import {map} from 'rxjs/operators';
import {TableColumn, TextColumn, NumberColumn, ButtonColumn} from 'vs-table';
import {SurveyLocation, Survey} from '../../../../models/survey.model';
import {Observable} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-surveys-list',
  templateUrl: './surveys-list.component.html',
  styleUrls: ['./surveys-list.component.scss']
})
export class SurveysListComponent {
  public data$: Observable<SurveyFlat[]> = this.dataService.get()
    .pipe(
      map((surveys) => surveys.reduce((prev, curr) => {
        return curr.locations?.length ?
          [...prev, ...curr.locations.map((l) => new SurveyFlat(curr, l))] :
          [...prev, new SurveyFlat(curr)];
      }, [] as SurveyFlat[]))
    );
  public columns: TableColumn<SurveyFlat>[] = [
    new TextColumn({
      title: 'Name',
      field: 'name',
    }),
    new TextColumn({
      title: 'Location',
      field: 'locationName',
    }),
    new NumberColumn({
      title: 'Respondents',
      field: 'respondentCount',
    })
  ];
  public buttonColumns: ButtonColumn<SurveyFlat>[] = [
    {
      title: '',
      position: 'end',
      label: (row) => 'Test',
      callback: (row) => window.open(`https://testsurvey.caig.co/survey/${row.surveyId}${row.locationId ? `/${row.locationId}` : ''}`, '_blank'),
      color: (row) => 'warn',
    },
    {
      title: '',
      position: 'end',
      label: (row) => 'Live',
      callback: (row) => {},
      disabled: (row) => true,
    }
  ];
  constructor(
    private dataService: SurveysDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  public viewRespondents(survey: SurveyFlat): void {
    this.router.navigate([survey.locationId || survey.surveyId], { relativeTo: this.route });
  }
}

export class SurveyFlat {
  public surveyId: string;
  public locationId: string | undefined;
  public name: string;
  public locationName: string | undefined;
  public respondentCount: number;
  constructor(survey: Survey, location?: SurveyLocation) {
    this.surveyId = survey.id;
    this.name = survey.name;
    this.locationName = location?.name;
    this.locationId = location?.id;
    this.respondentCount = location?.respondentCount || survey.respondentCount;
  }
}
