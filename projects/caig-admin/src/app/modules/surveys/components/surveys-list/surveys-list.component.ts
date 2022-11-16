import {Component} from '@angular/core';
import {
  TableColumn,
  TextColumn,
  NumberColumn,
  ButtonColumn,
  RowMenuItem,
  TableMenuItem,
  ExpandRowConfig,
} from 'vs-table';
import {Survey} from '../../../../models/survey.model';
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
  public data$: Observable<Survey[]> = this.surveyService.entities$;
  public columns: TableColumn<Survey>[] = [
    new TextColumn({
      title: 'Name',
      field: 'name',
    }),
    new NumberColumn({
      title: 'Respondents',
      field: 'respondentCount',
      format: '1.0-0',
    }),
  ];
  public expandRowConfig: ExpandRowConfig<Survey> = {
    title: 'Locations',
    hide: (row) => !row.locations?.length,
    newRows: (row) => row.locations,
    newRowKey: 'name',
    newRowBadge: (row) => row.respondentCount,
    callback: (newRow, row) => this.router.navigate([row.id, newRow.id], {relativeTo: this.route}),
    expandBadge: (row) => row.locations?.length,
  };
  public buttonColumns: ButtonColumn<Survey>[] = [
    {
      title: '',
      position: 'end',
      label: (row) => 'Test',
      callback: (row) => SurveysListComponent.openSurvey(SurveysListComponent.testUrl, row.id),
      color: (row) => undefined,
    },
    {
      title: '',
      position: 'end',
      label: (row) => 'Live',
      callback: (row) => SurveysListComponent.openSurvey(row.url, row.id),
      color: (row) => 'warn',
      disabled: (row) => !row.url,
    },
    {
      title: '',
      position: 'end',
      label: (row) => 'Event',
      callback: (row) => SurveysListComponent.openSurvey(row.url, row.id, true),
      color: (row) => 'accent',
      disabled: (row) => !row.url,
    }
  ];
  public rowMenuItems: RowMenuItem<Survey>[] = [
    {
      name: () => 'Export respondents',
      callback: (row) => this.exportToCsv([row]),
      disabled: (row) => !row.respondentCount,
    }
  ];
  public tableMenuItems: TableMenuItem<Survey>[] = [
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
  public viewRespondents(survey: Survey): void {
    this.router.navigate([survey.id], { relativeTo: this.route });
  }
  private exportToCsv(rows: Survey[]): void {
    const surveyId = rows.map((r) => r.id);
    this.isProcessing = true;
    this.respondentService.get({surveyId}).subscribe((respondents) => {
      this.csv.download(
        respondents.map((r) => ({...r, ...r.progress})),
        [
          {
            title: 'When Submitted',
            field: 'whenSubmitted',
          },
          {
            title: 'First Name',
            field: 'firstName',
          },
          {
            title: 'Middle Name',
            field: 'middleName',
          },
          {
            title: 'Last Name',
            field: 'lastName',
          },
          {
            title: 'Annual Rate',
            field: 'annualRate',
          },
          {
            title: 'BUS Code',
            field: 'busCode',
          },
          {
            title: 'Grade',
            field: 'grade',
          },
          {
            title: 'Job Title',
            field: 'jobTitle',
          },
          {
            title: 'City',
            field: 'locationCity',
          },
          {
            title: 'State',
            field: 'locationState',
          },
          {
            title: 'Series',
            field: 'series',
          },
          {
            title: 'Step',
            field: 'step',
          },
          {
            title: 'Current BUE',
            field: 'currentBue',
          },
          {
            title: 'Current Hazard Pay',
            field: 'currentHazardPay'
          },
          {
            title: 'Email',
            field: 'email',
          },
          {
            title: 'Start Month',
            field: 'startMonth',
          },
          {
            title: 'Start Year',
            field: 'startYear',
          },
          {
            title: 'End Month',
            field: 'endMonth',
          },
          {
            title: 'End Year',
            field: 'endYear',
          },
          {
            title: 'Claimed Job Title',
            field: 'positionTitle',
          },
          {
            title: 'Claimed City',
            field: 'facilityCity',
          },
          {
            title: 'Claimed State',
            field: 'facilityState',
          },
          {
            title: 'Claimed Facility',
            field: 'facilityName',
          },
          {
            title: 'Follow Up',
            field: 'followUp',
          },
          {
            title: 'Phone Cell',
            field: 'phoneCell',
          },
          {
            title: 'Phone Home',
            field: 'phoneHome',
          },
          {
            title: 'Phone Work',
            field: 'phoneWork',
          },
        ],
        'Survey Respondents'
      );
      this.isProcessing = false;
    }, () => this.isProcessing = false);
  }
  private static openSurvey(baseUrl: string, surveyId: string, reload?: boolean): void {
    window.open(`https://${baseUrl}/survey/${surveyId}${reload ? '?reload=true' : ''}`, '_blank')
  }
}
