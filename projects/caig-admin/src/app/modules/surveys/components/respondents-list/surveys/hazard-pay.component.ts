import {Component} from '@angular/core';
import {RespondentsList, RespondentFlat, rowIcon, rowColor} from '../respondents-list';
import {Router, ActivatedRoute} from '@angular/router';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {NgxCsvService} from 'export-csv';
import {RespondentDataService} from '../../../services/respondent-data.service';
import {TableColumn, TextColumn, IconColumn} from 'vs-table';
import {Respondent} from '../../../../../models/respondent.model';
import {
  protectiveEquipmentOptions, hazardTrainingOptions
} from '../../../../../../../../survey/src/app/mock-api/survey/schemas/nageva-housekeeping';
import {zeroPad, formatMonth, formatYear} from '../../../../../core/util/functions';
import {ColumnConfigService} from '../column-config.service';

@Component({
  selector: 'app-hazard-pay',
  templateUrl: '../respondents-list.html',
  styleUrls: ['../respondents-list.scss'],
})
export class HazardPayComponent extends RespondentsList {
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
          new TextColumn({
            title: 'End Month',
            field: 'endMonth',
            fxLayoutAlign: 'center center',
          }),
          new TextColumn({
            title: 'End Year',
            field: 'endYear',
            fxLayoutAlign: 'center center',
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
          new TextColumn({
            title: 'Annual Rate',
            field: 'annualRate',
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
        ];
      case 'survey':
        return [
          ...this.columnConfigService.sharedColumns,
          new IconColumn({
            title: 'Past HDP/EDP',
            field: 'pastHazardPay',
            calculate: rowIcon('pastHazardPay'),
            color: rowColor('pastHazardPay'),
          }),
          new IconColumn({
            title: 'Current HDP/EDP',
            field: 'currentHazardPay',
            calculate: rowIcon('currentHazardPay'),
            color: rowColor('currentHazardPay')
          }),
          new TextColumn({
            title: 'Details',
            field: 'hazardDetails',
          }),
          new IconColumn({
            title: 'Trash Bags',
            field: 'hazardTrashBags',
            calculate: rowIcon('hazardTrashBags'),
            color: rowColor('hazardTrashBags')
          }),
          new IconColumn({
            title: 'Medical Bags',
            field: 'hazardMedicalBags',
            calculate: rowIcon('hazardMedicalBags'),
            color: rowColor('hazardMedicalBags')
          }),
          new IconColumn({
            title: 'Laundry',
            field: 'hazardLaundry',
            calculate: rowIcon('hazardLaundry'),
            color: rowColor('hazardLaundry'),
          }),
          new IconColumn({
            title: 'Clean Up',
            field: 'hazardCleanup',
            calculate: rowIcon('hazardCleanup'),
            color: rowColor('hazardCleanup'),
          }),
          new IconColumn({
            title: 'Protective Equipment',
            field: 'protectiveEquipment',
            calculate: (row: any) => row.protectiveEquipment?.startsWith('Yes') ? 'check' : 'close',
            color: (row: any) => row.protectiveEquipment?.startsWith('Yes') ? 'green' : 'red',
          }),
          new IconColumn({
            title: 'Training',
            field: 'hazardTraining',
            calculate: (row: any) => row.hazardTraining?.startsWith('Yes') ? 'check' : 'close',
            color: (row: any) => row.hazardTraining?.startsWith('Yes') ? 'green' : 'red',
          }),
        ];
      case 'notes':
        return [
          ...this.columnConfigService.sharedColumns,
          ...this.columnConfigService.notesColumns
        ];
      default:
        return [];
    }
  }

  protected override sanitizeRespondent(respondent: Respondent): RespondentFlat {
    return {
      ...super.sanitizeRespondent(respondent),
      protectiveEquipment: protectiveEquipmentOptions.find((o) => o.key === respondent.progress?.protectiveEquipment)?.value,
      hazardTraining: hazardTrainingOptions.find((o) => o.key === respondent.progress?.hazardTraining)?.value,
      busCode: respondent.employeeView ? zeroPad(respondent.employeeView.busCode, 4) : '',
      grade: respondent.employeeView ? zeroPad(respondent.employeeView.grade, 2) : '',
      step: respondent.employeeView ? zeroPad(respondent.employeeView.step, 2) : '',
      series: respondent.employeeView ? zeroPad(respondent.employeeView.series, 4) : '',
      startMonth: formatMonth(respondent.progress?.startMonth),
      endMonth: formatMonth(respondent.progress?.endMonth),
      startYear: formatYear(respondent.progress?.startYear),
      endYear: formatYear(respondent.progress?.endYear),
    }
  }
}
