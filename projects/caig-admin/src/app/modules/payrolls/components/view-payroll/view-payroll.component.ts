import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Payroll, Payment} from '../../../../models/payroll.model';
import {map} from 'rxjs/operators';
import {TableColumn, TextColumn, CurrencyColumn} from 'vs-table';

@Component({
  selector: 'app-view-payroll',
  templateUrl: './view-payroll.component.html',
  styleUrls: ['./view-payroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewPayrollComponent {
  public payroll$: Observable<Payroll> = this.route.data.pipe(
    map((data) => data['payroll']),
  );
  public columns: TableColumn<Payment>[] = [
    new TextColumn({
      field: 'employeeId',
      title: 'ID',
    }),
    new TextColumn({
      field: 'settlementCode',
      title: 'Settlement',
    }),
    new TextColumn({
      field: 'employeeFirstName',
      title: 'First',
    }),
    new TextColumn({
      field: 'employeeMiddleName',
      title: 'Middle',
    }),
    new TextColumn({
      field: 'employeeLastName',
      title: 'Last',
    }),
    new CurrencyColumn({
      field: 'total',
      title: 'This Paycheck',
      sum: true,
    }),
  ];
  constructor(private route: ActivatedRoute) { }
}
