import {Component} from '@angular/core';
import {TaxDetailComponent} from '../tax-detail.component';
import {TaxDetail} from '../../../../models/tax-detail.model';
import {ReportDataService} from '../../services/report-data.service';
import {Router, ActivatedRoute} from '@angular/router';
import {TableColumn, CalculateColumn, TextColumn, NumberColumn, CurrencyColumn} from 'vs-table';
import {ReportsComponent} from '../reports/reports.component';
import {CheckboxField} from 'dynamic-form';
import {QueryParams} from '@ngrx/data';

@Component({
  selector: 'app-all-payments-detail',
  templateUrl: './all-payments-detail.component.html',
  styleUrls: ['./all-payments-detail.component.scss']
})
export class AllPaymentsDetailComponent extends TaxDetailComponent<TaxDetail> {
  public override columns: TableColumn<TaxDetail>[] = [
    new CalculateColumn({
      title: 'SSN',
      field: 'ssn',
      calculate: (row) => row.ssn || ReportsComponent.ENCRYPTED_SSN,
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
    this.fields[0].push(new CheckboxField({
      key: 'sequence',
      label: 'Sequence',
      position: 'end',
      disabled: true,
    }));
  }
  protected override modelForm(formValue: any): any {
    return {
      ...super.modelForm(formValue),
      sequence: formValue.sequence,
    };
  }
  protected override modelParams(queryParams: QueryParams): any {
    return {
      ...super.modelParams(queryParams),
      sequence: queryParams['sequence'] === 'true',
    };
  }
}
