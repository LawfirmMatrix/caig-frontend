import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {TableColumn, TextColumn, CurrencyColumn, CalculateColumn} from 'vs-table';
import {Payment, Payroll} from '../../../../models/payroll.model';
import {Observable} from 'rxjs';
import {formatCurrency} from '@angular/common';

@Component({
  selector: 'app-add-to-payroll',
  templateUrl: './add-to-payroll.component.html',
  styleUrls: ['./add-to-payroll.component.scss']
})
export class AddToPayrollComponent {
  private preview$: Observable<Payroll> = this.route.data.pipe(map((data) => data['preview']));
  public payments$: Observable<Payment[]> = this.preview$.pipe(map((preview) => preview.payments));
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
      field: 'employeeTotal',
      title: 'Total',
    }),
    new CurrencyColumn({
      field: 'amountPaid',
      title: 'Paid',
    }),
    new CurrencyColumn({
      field: 'amountPending',
      title: 'Pending',
    }),
    new CurrencyColumn({
      field: 'total',
      title: 'This Paycheck',
    }),
    new CalculateColumn({
      field: 'employeePhone',
      title: '+/-',
      calculate: (row) => {
        const amount = row.employeeTotal - row.amountPaid - row.amountPending - row.total;
        return amount === 0 ? '--' : formatCurrency(amount, 'en-us', '$');
      },
      fxLayoutAlign: 'center center',
    }),
    new TextColumn({
      field: 'message',
      title: 'Good to go?',
      backgroundColor: (row) => row.okToPay ? 'rgba(37,171,14,0.5)' : 'rgba(219,18,21,0.5)',
    })
  ];
  constructor(
    private route: ActivatedRoute,
  ) { }
}
