import {Component, ViewChild} from '@angular/core';
import {RespondentsList, RespondentFlat, rowIcon, rowColor} from '../respondents-list';
import {VsTableComponent, TableColumn, TextColumn, IconColumn, CurrencyColumn, DateColumn} from 'vs-table';
import {Router, ActivatedRoute} from '@angular/router';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {NgxCsvService} from 'export-csv';
import {RespondentDataService} from '../../../services/respondent-data.service';
import {ColumnConfigService} from '../column-config.service';

@Component({
  selector: 'app-nage-va-triage',
  templateUrl: '../respondents-list.html',
  styleUrls: ['../respondents-list.scss'],
})
export class NageVaTriageComponent extends RespondentsList {
  @ViewChild(VsTableComponent) public override table!: VsTableComponent<RespondentFlat>;
  constructor(
    protected override router: Router,
    protected override route: ActivatedRoute,
    protected override notifications: NotificationsService,
    protected override dialog: MatDialog,
    protected override csvService: NgxCsvService,
    protected override dataService: RespondentDataService,
    protected override columnConfigService: ColumnConfigService,
  ) {
    super(router, route, notifications, dialog, csvService, dataService, columnConfigService);
  }
  protected override getColumns(viewMode: string): TableColumn<RespondentFlat>[] {
    switch (viewMode) {
      case 'bue':
        return [
          ...this.columnConfigService.sharedColumns,
          new TextColumn({
            title: 'Start Month',
            field: 'startMonth',
            fxLayoutAlign: 'center center',
          }),
          new TextColumn({
            title: 'Start Year',
            field: 'startYear',
            fxLayoutAlign: 'center center',
          }),
          new IconColumn({
            title: 'Full Duration',
            field: 'uncertainStartDate',
            calculate: rowIcon('uncertainStartDate'),
            color: rowColor('uncertainStartDate'),
          }),
          new IconColumn({
            title: 'BUE',
            field: 'currentBue',
            calculate: rowIcon('currentBue'),
            color: rowColor('currentBue'),
          }),
          new IconColumn({
            title: 'Retired',
            field: 'retired',
            calculate: rowIcon('retired'),
            color: rowColor('retired'),
          }),
          new TextColumn({
            title: 'Job Title',
            field: 'jobTitle',
          }),
          new TextColumn({
            title: 'BUS Code',
            field: 'busCode',
          }),
          new TextColumn({
            title: 'Grade',
            field: 'grade',
          }),
          new TextColumn({
            title: 'Step',
            field: 'step',
          }),
          new TextColumn({
            title: 'Series',
            field: 'series',
          }),
          new CurrencyColumn({
            title: 'Annual Rate',
            field: 'annualRate',
          }),
        ];
      case 'survey':
        return [
          ...this.columnConfigService.sharedColumns,
          new IconColumn({
            title: 'Uncomp.',
            field: 'uncompensatedWork',
            calculate: rowIcon('uncompensatedWork'),
            color: rowColor('uncompensatedWork'),
          }),
          new IconColumn({
            title: 'Early',
            field: 'early',
            calculate: rowIcon('early'),
            color: rowColor('early')
          }),
          new IconColumn({
            title: 'Late',
            field: 'late',
            calculate: rowIcon('late'),
            color: rowColor('late')
          }),
          new IconColumn({
            title: 'Lunch',
            field: 'lunch',
            calculate: rowIcon('lunch'),
            color: rowColor('lunch')
          }),
          new IconColumn({
            title: 'Weekends',
            field: 'weekends',
            calculate: rowIcon('weekends'),
            color: rowColor('weekends'),
          }),
          new IconColumn({
            title: 'Holidays',
            field: 'holidays',
            calculate: rowIcon('holidays'),
            color: rowColor('holidays'),
          }),
          new IconColumn({
            title: 'Off Days',
            field: 'offDays',
            calculate: rowIcon('offDays'),
            color: rowColor('offDays')
          }),
          new IconColumn({
            title: 'Overtime',
            field: 'overtimeWorked',
            calculate: rowIcon('overtimeWorked'),
            color: rowColor('overtimeWorked'),
          }),
          new IconColumn({
            title: 'Home',
            field: 'homeWork',
            calculate: rowIcon('homeWork'),
            color: rowColor('homeWork')
          }),
          new IconColumn({
            title: 'Travel',
            field: 'travelWork',
            calculate: rowIcon('travelWork'),
            color: rowColor('travelWork')
          }),
          new IconColumn({
            title: 'Comp Time',
            field: 'compTime',
            calculate: rowIcon('compTime'),
            color: rowColor('compTime'),
          }),
          new IconColumn({
            title: 'PPE',
            field: 'ppeSurvey',
            calculate: rowIcon('ppeSurvey'),
            color: rowColor('ppeSurvey')
          }),
        ];
      case 'contact':
        return [
          ...this.columnConfigService.sharedColumns,
          new TextColumn({
            title: 'Cell #',
            field: 'phoneCell',
          }),
          new IconColumn({
            title: 'SMS',
            field: 'sms',
            calculate: rowIcon('sms'),
            color: rowColor('sms')
          }),
          new TextColumn({
            title: 'Home #',
            field: 'phoneHome',
          }),
          new TextColumn({
            title: 'Work #',
            field: 'phoneWork',
          }),
          new TextColumn({
            title: 'Email',
            field: 'email',
          }),
          new TextColumn({
            title: 'Alt Email',
            field: 'altEmail',
            hide: true,
          }),
          new IconColumn({
            title: 'Follow-Up',
            field: 'followUp',
            calculate: rowIcon('followUp'),
            color: rowColor('followUp')
          }),
          new DateColumn({
            title: 'Appt #1',
            field: 'dateTime1',
            format: 'short',
          }),
          new DateColumn({
            title: 'Appt #2',
            field: 'dateTime2',
            format: 'short',
          }),
          new DateColumn({
            title: 'Appt #3',
            field: 'dateTime3',
            format: 'short',
          }),
        ];
      case 'notes':
        return [
          ...this.columnConfigService.sharedColumns,
          ...this.columnConfigService.notesColumns,
        ];
      default:
        return [];
    }
  }
}
