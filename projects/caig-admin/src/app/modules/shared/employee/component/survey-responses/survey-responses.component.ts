import {Component, Input} from '@angular/core';
import {TableColumn, RowMenuItem, TextColumn, CalculateColumn, DateColumn, IconColumn} from 'vs-table';
import {filter, switchMap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {Employee, SurveyResponse} from '../../../../../models/employee.model';
import {AttachFilesComponent} from '../../../../../core/components/attach-files/attach-files.component';
import {ViewAttachedFilesComponent} from '../../../../../core/components/view-attached-files/view-attached-files.component';
import {EmployeeEntityService} from '../../../../employees/services/employee-entity.service';

@Component({
  selector: 'app-survey-responses',
  templateUrl: './survey-responses.component.html',
  styleUrls: ['./survey-responses.component.scss']
})
export class SurveyResponsesComponent {
  @Input() public employee!: Employee;
  public columns: TableColumn<SurveyResponse>[] = [
    new TextColumn({
      field: 'surveyName',
      title: 'Survey',
    }),
    new CalculateColumn({
      field: 'progressMeter',
      title: 'Progress',
      calculate: (row) => `${row.progressMeter.toFixed(2)}%`
    }),
    new DateColumn({
      field: 'latestProgress',
      title: 'Last Updated',
    }),
    new TextColumn({
      field: 'notes',
      title: 'Notes',
    }),
    new IconColumn({
      field: 'attachedFiles',
      title: 'Files',
      calculate: (row) => row.attachedFiles && row.attachedFiles.length > 0 ? 'file_present' : '',
      badge: { value: (row) => row.attachedFiles?.length },
    }),
  ];
  public options: RowMenuItem<SurveyResponse>[] = [
    {
      name: () => 'Attach File(s)',
      callback: (data) => this.dialog.open(AttachFilesComponent, {data}).afterClosed()
        .pipe(
          filter((res) => !!res),
          switchMap(() => this.dataService.getByKey(this.employee.id))
        )
        .subscribe(),
    },
    {
      name: (row) => `View ${row.attachedFiles?.length} Attached File${row.attachedFiles?.length === 1 ? '' : 's'}`,
      callback: (data) => this.dialog.open(ViewAttachedFilesComponent, {data}),
      hide: (row) => !row.attachedFiles?.length
    }
  ];
  constructor(private dialog: MatDialog, private dataService: EmployeeEntityService) { }
}
