import {Component} from '@angular/core';
import {SurveysDataService} from '../../services/surveys-data.service';
import {map} from 'rxjs/operators';
import {TableColumn, TextColumn, NumberColumn, ButtonColumn, RowMenuItem, TableMenuItem} from 'vs-table';
import {SurveyLocation, Survey} from '../../../../models/survey.model';
import {Observable} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {NgxCsvService} from 'export-csv';
import {RespondentDataService} from '../../services/respondent-data.service';
import {uniq} from 'lodash-es';

@Component({
  selector: 'app-surveys-list',
  templateUrl: './surveys-list.component.html',
  styleUrls: ['./surveys-list.component.scss']
})
export class SurveysListComponent {
  public data$: Observable<SurveyFlat[]> = this.surveyService.get()
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
  public rowMenuItems: RowMenuItem<SurveyFlat>[] = [
    {
      name: () => 'Export respondents',
      callback: (row) => this.exportToCsv([row]),
      disabled: (row) => !row.respondentCount,
    }
  ];
  public tableMenuItems: TableMenuItem<SurveyFlat>[] = [
    {
      name: () => 'Bulk export respondents',
      callback: (rows) => this.exportToCsv(rows),
      disabled: (rows) => !rows.reduce((prev, curr) => curr.respondentCount + prev, 0)
    }
  ];
  public isProcessing = false;
  constructor(
    private surveyService: SurveysDataService,
    private respondentService: RespondentDataService,
    private router: Router,
    private route: ActivatedRoute,
    private csv: NgxCsvService,
  ) { }
  public viewRespondents(survey: SurveyFlat): void {
    this.router.navigate([survey.locationId || survey.surveyId], { relativeTo: this.route });
  }
  private exportToCsv(rows: SurveyFlat[]): void {
    const surveyIds = uniq(rows.map((r) => r.surveyId));
    this.isProcessing = true;
    this.respondentService.get(...surveyIds)
      .subscribe(
        (respondents) => {
          this.csv.download(respondents, this.columns, 'Survey Respondents');
          this.isProcessing = false;
        },
        () => this.isProcessing = false,
      );
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
