import {Component, Input} from '@angular/core';
import {ChangesColumn, DateColumn, NumberColumn, RowMenuItem, TableColumn, TextColumn} from 'vs-table';
import {MatDialog} from '@angular/material/dialog';
import {filter, switchMap} from 'rxjs/operators';
import {Employee, EmployeeEvent} from '../../../../../models/employee.model';
import {AddEventComponent, AddEventData} from '../../../../../core/components/add-event/add-event.component';
import {ConfirmDialogComponent, ConfirmDialogData} from '../../../../../core/components/confirm-dialog.component';
import {EventService} from '../../../../../core/services/event.service';
import {EmployeeEntityService} from '../../../../employees/services/employee-entity.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  @Input() public employee!: Employee;
  public columns: TableColumn<EmployeeEvent>[] = [
    new NumberColumn({
      title: 'Code',
      field: 'code',
      format: '1.0-0',
    }),
    new TextColumn({
      title: 'Event',
      field: 'description',
    }),
    new TextColumn({
      title: 'Message',
      field: 'message',
    }),
    new DateColumn({
      title: 'Date',
      field: 'whenCreated',
      format: 'medium',
    }),
    new ChangesColumn({
      title: 'Changes',
      field: 'changes',
    }),
  ];
  public shortcuts: { name: string, code: number }[] = [
    {
      name: 'Call Made',
      code: 322,
    },
    {
      name: 'Email Sent',
      code: 301,
    },
  ];
  public options: RowMenuItem<EmployeeEvent>[] = [
    {
      name: () => 'Clone',
      callback: (row) => {
        const data: AddEventData = { employee: this.employee, model: row };
        this.dialog.open(AddEventComponent, { data })
          .afterClosed()
          .pipe(filter((res) => !!res))
          .subscribe(() => this.employeeService.getByKey(this.employee.id));
      },
    },
    {
      name: () => 'Edit',
      callback: () => {},
      disabled: () => true,
    },
    {
      name: () => 'Delete',
      callback: (row) => {
        const data: ConfirmDialogData = { title: 'Warning', text: 'Are you sure you want to delete this event?' };
        this.dialog.open(ConfirmDialogComponent, {data})
          .afterClosed()
          .pipe(
            filter((res) => !!res),
            switchMap(() => this.eventService.remove(row.id))
          ).subscribe(() => this.employeeService.getByKey(this.employee.id));
      },
    },
  ];
  constructor(
    private dialog: MatDialog,
    private eventService: EventService,
    private employeeService: EmployeeEntityService,
  ) { }
  public addEvent(bue: Employee, code?: number): void {
    const data: AddEventData = { employee: bue };
    if (code) {
      data.model = { code };
    }
    this.dialog.open(AddEventComponent, { data })
      .afterClosed()
      .pipe(
        filter((res) => !!res),
        switchMap(() => this.employeeService.getByKey(this.employee.id)),
      )
      .subscribe();
  }
}
