import {Component, Input} from '@angular/core';
import {TableColumn, TextColumn, DateColumn} from 'vs-table';
import {Employee, EmployeeEvent} from '../../../../../models/employee.model';

@Component({
  selector: 'app-employee-contact',
  templateUrl: './employee-contact.component.html',
  styleUrls: ['./employee-contact.component.scss']
})
export class EmployeeContactComponent {
  @Input() public employee!: Employee;
  public columns: TableColumn<EmployeeEvent>[] = [
    new DateColumn({
      field: 'whenCreated',
      title: 'Date',
      format: 'medium',
    }),
    new TextColumn({
      field: 'description',
      title: 'Description',
    }),
    new TextColumn({
      field: 'user',
      title: 'User',
    }),
    new TextColumn({
      field: 'message',
      title: 'Message',
    })
  ];
}
