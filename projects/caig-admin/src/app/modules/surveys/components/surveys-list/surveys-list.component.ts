import {Component} from '@angular/core';
import {map} from 'rxjs/operators';
import {TableColumn, TextColumn, NumberColumn, ButtonColumn, RowMenuItem, TableMenuItem} from 'vs-table';
import {SurveyLocation, Survey} from '../../../../models/survey.model';
import {Observable} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {NgxCsvService} from 'export-csv';
import {RespondentDataService} from '../../services/respondent-data.service';
import {SurveysEntityService} from '../../services/surveys-entity.service';

@Component({
  selector: 'app-surveys-list',
  templateUrl: './surveys-list.component.html',
  styleUrls: ['./surveys-list.component.scss']
})
export class SurveysListComponent {
  private static testUrl = 'testsurvey.caig.co';
  public data$: Observable<SurveyFlat[]> = this.surveyService.entities$.pipe(
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
      callback: (row) => SurveysListComponent.openSurvey(SurveysListComponent.testUrl, row),
      color: (row) => undefined,
    },
    {
      title: '',
      position: 'end',
      label: (row) => 'Live',
      callback: (row) => SurveysListComponent.openSurvey(SurveysListComponent.testUrl, row), // @ TODO - replace baseUrl with row.url
      color: (row) => 'warn',
      disabled: (row) => true,
    },
    {
      title: '',
      position: 'end',
      label: (row) => 'Event',
      callback: (row) => SurveysListComponent.openSurvey(SurveysListComponent.testUrl, row, true), // @ TODO - replace baseUrl with row.url
      color: (row) => 'accent',
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
    public surveyService: SurveysEntityService,
    private respondentService: RespondentDataService,
    private router: Router,
    private route: ActivatedRoute,
    private csv: NgxCsvService,
  ) { }
  public viewRespondents(survey: SurveyFlat): void {
    const route = survey.locationId ? [ survey.surveyId, survey.locationId ] : [ survey.surveyId ];
    this.router.navigate(route, { relativeTo: this.route });
  }
  private exportToCsv(rows: SurveyFlat[]): void {
    const params: any = {
      surveyId: [],
      locationId: [],
    };
    rows.forEach((row) => {
      if (row.locationId) {
        params.locationId.push(row.locationId);
      } else {
        params.surveyId.push(row.surveyId);
      }
    });
    this.isProcessing = true;
    this.respondentService.get(params).subscribe((respondents) => {
      this.csv.download(respondents, this.columns, 'Survey Respondents');
      this.isProcessing = false;
    }, () => this.isProcessing = false);
  }
  private static openSurvey(baseUrl: string, survey: SurveyFlat, reload?: boolean): void {
    window.open(`https://${baseUrl}/survey/${survey.surveyId}${survey.locationId ? `/${survey.locationId}` : ''}${reload ? '?reload=true' : ''}`, '_blank')
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
    this.respondentCount = location ? location.respondentCount : survey.respondentCount;
  }
}
