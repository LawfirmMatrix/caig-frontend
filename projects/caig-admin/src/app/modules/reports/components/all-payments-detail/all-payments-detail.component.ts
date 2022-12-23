import {Component} from '@angular/core';
import {TaxDetailComponent} from '../tax-detail.component';
import {TaxDetail} from '../../../../models/tax-detail.model';
import {ReportDataService} from '../../services/report-data.service';
import {Router, ActivatedRoute} from '@angular/router';
import {TableColumn, TextColumn, NumberColumn, CurrencyColumn} from 'vs-table';
import {ReportsComponent} from '../reports/reports.component';

@Component({
  selector: 'app-all-payments-detail',
  templateUrl: './all-payments-detail.component.html',
  styleUrls: ['./all-payments-detail.component.scss']
})
export class AllPaymentsDetailComponent extends TaxDetailComponent {
  public columns: TableColumn<TaxDetail>[] = [
    ReportsComponent.SSN_COL,
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
      title: 'Address',
      field: 'address',
    }),
    new TextColumn({
      title: 'City',
      field: 'city',
    }),
    new TextColumn({
      title: 'State',
      field: 'state',
    }),
    new TextColumn({
      title: 'Zip',
      field: 'zip',
    }),
    new NumberColumn({
      title: 'Payments',
      field: 'paymentCount',
      sum: true,
      format: '1.0-0',
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
      title: 'Fed Withholding',
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
    new CurrencyColumn({
      title: 'State Withholding',
      field: 'stateWh',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'State+',
      field: 'stateAddlamt',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Adjustment',
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
    })
  ];
  constructor(
    protected override dataService: ReportDataService,
    protected override router: Router,
    protected override route: ActivatedRoute,
  ) {
    super(dataService, router, route);
  }

  // public ngOnInit() {
  //   const settlementCode: TableColumn<TaxDetail> = new TextColumn({
  //     title: 'Settlement',
  //     field: 'settlementCode',
  //   });
  //   const names: TableColumn<TaxDetail>[] = [
  //     new TextColumn({
  //       title: 'First',
  //       field: 'firstName',
  //     }),
  //     new TextColumn({
  //       title: 'Middle',
  //       field: 'middleName',
  //     }),
  //     new TextColumn({
  //       title: 'Last',
  //       field: 'lastName',
  //     }),
  //   ];
  //   const state: TableColumn<TaxDetail> = new TextColumn({
  //     title: 'State',
  //     field: 'state',
  //   });
  //   const adjustments: TableColumn<TaxDetail> = new CurrencyColumn({
  //     title: 'Adjustment',
  //     field: 'addlamt',
  //     sum: true,
  //   });
  //   const paid: TableColumn<TaxDetail> = new CurrencyColumn({
  //     title: 'Paid',
  //     field: 'total',
  //     sum: true,
  //   });
  //   const addresses: TableColumn<TaxDetail>[] = [
  //     new TextColumn({
  //       title: 'Address',
  //       field: 'address',
  //     }),
  //     new TextColumn({
  //       title: 'City',
  //       field: 'city',
  //     }),
  //     state,
  //     new TextColumn({
  //       title: 'Zip',
  //       field: 'zip',
  //     }),
  //   ];
  //   const payrollDate: TableColumn<any> = new DateColumn({
  //     title: 'Payroll Date',
  //     field: 'payrollDate',
  //   });
  //   const employeeId: TableColumn<TaxDetail> = new TextColumn({
  //     title: 'Employee ID',
  //     field: 'employeeId',
  //   });
  //   const breakdowns: TableColumn<TaxDetail>[] = [
  //     new CurrencyColumn({
  //       title: 'SPOT BP',
  //       field: 'spotBp',
  //       sum: true,
  //     }),
  //     new CurrencyColumn({
  //       title: 'CTOT BP',
  //       field: 'ctotBp',
  //       sum: true,
  //     }),
  //     new CurrencyColumn({
  //       title: 'SPOT LD',
  //       field: 'spotLd',
  //       sum: true,
  //     }),
  //     new CurrencyColumn({
  //       title: 'CTOT LD',
  //       field: 'ctotLd',
  //       sum: true,
  //     }),
  //     new CurrencyColumn({
  //       title: 'Cost Share',
  //       field: 'costShare',
  //       sum: true,
  //     }),
  //     new CurrencyColumn({
  //       title: 'Fed Withholding',
  //       field: 'fedWh',
  //       sum: true,
  //     }),
  //     new CurrencyColumn({
  //       title: 'Fed+',
  //       field: 'fedAddlamt',
  //       sum: true,
  //     }),
  //     new CurrencyColumn({
  //       title: 'ER SS',
  //       field: 'employerSs',
  //       sum: true,
  //       hide: true,
  //     }),
  //     new CurrencyColumn({
  //       title: 'EE SS',
  //       field: 'employeeSs',
  //       sum: true,
  //     }),
  //     new CurrencyColumn({
  //       title: 'ER MC',
  //       field: 'employerMc',
  //       sum: true,
  //       hide: true,
  //     }),
  //     new CurrencyColumn({
  //       title: 'EE MC',
  //       field: 'employeeMc',
  //       sum: true,
  //     }),
  //   ];
  //   const stateTaxes: TableColumn<TaxDetail>[] = [
  //     new CurrencyColumn({
  //       title: 'State Withholding',
  //       field: 'stateWh',
  //       sum: true,
  //     }),
  //     new CurrencyColumn({
  //       title: 'State+',
  //       field: 'stateAddlamt',
  //       sum: true,
  //     }),
  //   ];
  //   const donation: TableColumn<TaxDetail> = new CurrencyColumn({
  //     title: 'Donation',
  //     field: 'donation',
  //     sum: true,
  //   });
  //
  //   this.summaryColumns = [
  //     payrollDate,
  //     employeeId,
  //     settlementCode,
  //     ...names,
  //     state,
  //     new CurrencyColumn({
  //       title: 'Owed',
  //       field: 'totalOwed',
  //       sum: true,
  //     }),
  //     paid,
  //     adjustments,
  //   ];
  //
  //   this.employeeColumns = [
  //     ReportsComponent.SSN_COL,
  //     settlementCode,
  //     ...names,
  //     ...addresses,
  //     new NumberColumn({
  //       title: 'Payments',
  //       field: 'paymentCount',
  //       sum: true,
  //       format: '1.0-0',
  //     }),
  //     ...breakdowns,
  //     ...stateTaxes,
  //     adjustments,
  //     donation,
  //     paid,
  //   ];
  //
  //   this.sequenceColumns = [
  //     payrollDate,
  //     employeeId,
  //     settlementCode,
  //     ...names,
  //     state,
  //     new CurrencyColumn({
  //       title: 'Est. Total',
  //       field: 'estTotal',
  //       sum: true,
  //     }) as TableColumn<any>,
  //     ...breakdowns,
  //     new NumberColumn({
  //       title: 'State Rate',
  //       field: 'stateRate',
  //     }) as TableColumn<any>,
  //     adjustments,
  //     donation,
  //     paid,
  //   ];
  // }
}
