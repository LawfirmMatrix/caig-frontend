import {Component} from '@angular/core';
import {TableColumn, CalculateColumn, TextColumn, CurrencyColumn} from 'vs-table';
import {ReportDataService} from '../../services/report-data.service';
import {TaxDetail} from '../../../../models/tax-detail.model';
import {Router, ActivatedRoute} from '@angular/router';
import {ReportsComponent} from '../reports/reports.component';
import {TaxDetailComponent} from '../tax-detail.component';

@Component({
  selector: 'app-tax-info',
  templateUrl: './tax-info.component.html',
  styleUrls: ['./tax-info.component.scss']
})
export class TaxInfoComponent extends TaxDetailComponent<TaxDetailTableItem> {
  public override columns: TableColumn<TaxDetailTableItem>[] = [
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
    new CurrencyColumn({
      title: 'Damages (1099)',
      field: 'totalLd',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Wages (1)',
      field: 'totalBp',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Fed Tax (2)',
      field: 'fedTaxes',
      negateValue: true,
      sum: true,
    }),
    new CurrencyColumn({
      title: 'SS Wages (3)',
      field: 'ssWages',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'SS Withheld (4)',
      field: 'employeeSs',
      negateValue: true,
      sum: true,
    }),
    new CurrencyColumn({
      title: 'MC Wages (5)',
      field: 'mcWages',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'MC Withheld (6)',
      field: 'employeeMc',
      negateValue: true,
      sum: true,
    }),
    new TextColumn({
      title: 'State (15)',
      field: '_state',
      fxLayoutAlign: 'end center',
    }),
    new CurrencyColumn({
      title: 'State Wages (16)',
      field: '_totalBp',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'State Withheld (17)',
      field: 'stateTaxes',
      negateValue: true,
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Cost Share',
      field: 'costShare',
      negateValue: true,
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
}

interface TaxDetailTableItem extends TaxDetail {
  _state: string;
  _totalBp: number;
}
