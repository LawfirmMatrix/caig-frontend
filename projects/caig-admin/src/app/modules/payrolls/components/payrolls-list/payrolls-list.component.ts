import {Component, ChangeDetectionStrategy} from '@angular/core';
import {PayrollEntityService} from '../../services/payroll-entity.service';
import {TableColumn, TextColumn, DateColumn, NumberColumn, CurrencyColumn} from 'vs-table';
import {Payroll, PayrollStatus} from '../../../../models/payroll.model';
import {okColor, notOkColor} from '../add-to-payroll/add-to-payroll.component';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-payrolls-list',
  templateUrl: './payrolls-list.component.html',
  styleUrls: ['./payrolls-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollsListComponent {
  public payrolls$ = this.dataService.entities$;
  public columns: TableColumn<Payroll>[] = [
    new TextColumn({
      title: 'Status',
      field: 'status',
      backgroundColor: (row) => row.status === PayrollStatus.Processed ? okColor : notOkColor,
    }),
    new TextColumn({
      title: 'ID',
      field: 'id',
    }),
    new TextColumn({
      title: 'Memo',
      field: 'memo',
    }),
    new DateColumn({
      title: 'Date',
      field: 'date',
    }),
    new DateColumn({
      title: 'Created',
      field: 'created',
      format: 'medium',
    }),
    new DateColumn({
      title: 'Submitted',
      field: 'submitted',
      format: 'medium',
    }),
    new NumberColumn({
      title: 'Employees',
      field: 'paymentCount',
      format: '1.0-0',
    }),
    new CurrencyColumn({
      title: 'Total Net',
      field: 'totalNet',
    })
  ];
  constructor(
    private dataService: PayrollEntityService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  public viewPayroll(row: Payroll): void {
    this.router.navigate(['view', row.id], {relativeTo: this.route})
  }
}
