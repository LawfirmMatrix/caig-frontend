import {Component} from '@angular/core';
import {TaxDetailComponent} from '../tax-detail.component';
import {ReportDataService} from '../../services/report-data.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable, startWith} from 'rxjs';
import {TaxDetail} from '../../../../models/tax-detail.model';
import {switchMap, shareReplay} from 'rxjs/operators';
import {TableColumn, DateColumn, TextColumn, CurrencyColumn, NumberColumn} from 'vs-table';

@Component({
  selector: 'app-payments-by-date',
  templateUrl: './payments-by-date.component.html',
  styleUrls: ['./payments-by-date.component.scss']
})
export class PaymentsByDateComponent extends TaxDetailComponent {
  public override data$: Observable<TaxDetail[] | null> = this.model$
    .pipe(
      switchMap((model) =>
        this.dataService.paymentDetail(model.dates.start, model.dates.end, model.allSettlements, model.state)
          .pipe(startWith(null))
      ),
      shareReplay(),
    );
  public columns: TableColumn<TaxDetail>[] = [
    new DateColumn({
      title: 'Payroll Date',
      field: 'payrollDate',
    }),
    new TextColumn({
      title: 'Employee ID',
      field: 'employeeId',
    }),
    new TextColumn({
      title: 'Settlement',
      field: 'settlementCode',
    }),
    new TextColumn({
      title: 'First',
      field: 'firstName',
    }),
    new TextColumn({
      title: 'Middle',
      field: 'middleName',
    }),
    new TextColumn({
      title: 'Last',
      field: 'lastName',
    }),
    new TextColumn({
      title: 'State',
      field: 'state',
    }),
    new CurrencyColumn({
      title: 'Owed',
      field: 'totalOwed',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'SPOT BP',
      field: 'spotBp',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'CTOT BP',
      field: 'ctotBp',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'SPOT LD',
      field: 'spotLd',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'CTOT LD',
      field: 'ctotLd',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Cost Share',
      field: 'costShare',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Fed W/H',
      field: 'fedWh',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Fed+',
      field: 'fedAddlamt',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'ER SS',
      field: 'employerSs',
      sum: true,
      hide: true,
    }),
    new CurrencyColumn({
      title: 'EE SS',
      field: 'employeeSs',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'ER MC',
      field: 'employerMc',
      sum: true,
      hide: true,
    }),
    new CurrencyColumn({
      title: 'EE MC',
      field: 'employeeMc',
      sum: true,
    }),
    new NumberColumn({
      title: 'State Rate',
      field: 'stateRate',
    }) as TableColumn<any>,
    new CurrencyColumn({
      title: 'Adjustments',
      field: 'addlamt',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Donation',
      field: 'donation',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Paid',
      field: 'total',
      sum: true,
    }),
  ];
  constructor(
    protected override dataService: ReportDataService,
    protected override router: Router,
    protected override route: ActivatedRoute,
  ) {
    super(dataService, router, route);
  }
}
