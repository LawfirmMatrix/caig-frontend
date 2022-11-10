import {Component} from '@angular/core';
import {map} from 'rxjs/operators';
import {TableColumn, TextColumn, NumberColumn, ButtonColumn, RowMenuItem, TableMenuItem} from 'vs-table';
import {SurveyLocation, Survey} from '../../../../models/survey.model';
import {Observable} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {NgxCsvService} from 'export-csv';
import {RespondentEntityService} from '../../services/respondent-entity.service';
import {uniq} from 'lodash-es';
import {SurveysEntityService} from '../../services/surveys-entity.service';

@Component({
  selector: 'app-surveys-list',
  templateUrl: './surveys-list.component.html',
  styleUrls: ['./surveys-list.component.scss']
})
export class SurveysListComponent {
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
    private surveyService: SurveysEntityService,
    private respondentService: RespondentEntityService,
    private router: Router,
    private route: ActivatedRoute,
    private csv: NgxCsvService,
  ) { }
  public viewRespondents(survey: SurveyFlat): void {
    const route = survey.locationId ? [ survey.surveyId, survey.locationId ] : [ survey.surveyId ];
    this.router.navigate(route, { relativeTo: this.route });
  }
  private exportToCsv(rows: SurveyFlat[]): void {
    const surveyId = uniq(rows.map((r) => r.surveyId));
    this.isProcessing = true;
    console.log(surveyId);
    // this.respondentService.get({surveyId})
    //   .subscribe(
    //     (respondents) => {
    //       this.csv.download(respondents, this.columns, 'Survey Respondents');
    //       this.isProcessing = false;
    //     },
    //     () => this.isProcessing = false,
    //   );
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
